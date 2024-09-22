import { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet.geodesic";

interface ForecastTrackLayerProps {}

const ForecastTrackLayer: React.FC<ForecastTrackLayerProps> = () => {
  const [forecastTrackData, setForecastTrackData] = useState<any>(null);
  const map = useMap();

  const shiftCoordinates = useCallback((data: any, offset: number) => {
    if (!data || !data.features) return data;

    const shiftedData = JSON.parse(JSON.stringify(data));

    shiftedData.features = shiftedData.features.map((feature: any) => {
      if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates = feature.geometry.coordinates.map((coord: any) => {
          return [coord[0] + offset, coord[1]];
        });
      }
      return feature;
    });

    return shiftedData;
  }, []);

  const bindPopup = useCallback((feature: any, polyline: L.Polyline) => {
    const popupContent = `
      <strong>${feature.properties.STORMNAME}</strong><br/>
      Storm Type: ${feature.properties.STORMTYPE || "Unknown"}
    `;
    polyline.bindPopup(popupContent);
  }, []);

  const addGeodesicPolylines = useCallback((features: any[], map: L.Map) => {
    features.forEach((feature: any) => {
      const coordinates = feature.geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
      const geodesicPolyline = L.geodesic(coordinates, {
        weight: 2,
        color: "red",
        dashArray: "5, 5",
        wrap: false,
      }).addTo(map);
      bindPopup(feature, geodesicPolyline);
    });
  }, [bindPopup]);

  useEffect(() => {
    const fetchForecastTrackData = async () => {
      try {
        const response = await axios.get(
          "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/2/query?outFields=*&where=1%3D1&f=geojson"
        );
        const originalData = response.data;
        const shiftedDataMinus360 = shiftCoordinates(originalData, -360);
        const shiftedDataPlus360 = shiftCoordinates(originalData, 360);

        setForecastTrackData({
          original: originalData,
          minus360: shiftedDataMinus360,
          plus360: shiftedDataPlus360,
        });
      } catch (error) {
        console.error("Error fetching forecast track data:", error);
      }
    };

    fetchForecastTrackData();
  }, [shiftCoordinates]);

  useEffect(() => {
    if (!forecastTrackData || !map) return;

    addGeodesicPolylines(forecastTrackData.original.features, map);
    addGeodesicPolylines(forecastTrackData.minus360.features, map);
    addGeodesicPolylines(forecastTrackData.plus360.features, map);
  }, [forecastTrackData, map, addGeodesicPolylines]);

  return null;
};

export default ForecastTrackLayer;
