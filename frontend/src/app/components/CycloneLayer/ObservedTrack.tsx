import { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet.geodesic";

interface ObservedTrackLayerProps {
  onDataLoad?: (data: any) => void;
}

const ObservedTrackLayer: React.FC<ObservedTrackLayerProps> = ({ onDataLoad }) => {
  const [observedTrackData, setObservedTrackData] = useState<any>(null);
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

  useEffect(() => {
    const fetchObservedTrackData = async () => {
      try {
        const response = await axios.get(
          "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/3/query?outFields=*&where=1%3D1&f=geojson"
        );
        const originalData = response.data;
        const shiftedDataMinus360 = shiftCoordinates(originalData, -360);
        const shiftedDataPlus360 = shiftCoordinates(originalData, 360);

        setObservedTrackData({
          original: originalData,
          minus360: shiftedDataMinus360,
          plus360: shiftedDataPlus360,
        });

        if (onDataLoad) {
          onDataLoad({
            original: originalData,
            minus360: shiftedDataMinus360,
            plus360: shiftedDataPlus360,
          });
        }
      } catch (error) {
        console.error("Error fetching observed track data:", error);
      }
    };

    fetchObservedTrackData();
  }, [shiftCoordinates, onDataLoad]);

  useEffect(() => {
    if (!observedTrackData || !map) return;

    observedTrackData.original.features.forEach((feature: any) => {
      const coordinates = feature.geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
      const geodesicPolyline = L.geodesic(coordinates, {
        weight: 4,
        color: "red",
        wrap: false,
      }).addTo(map);
      geodesicPolyline.bindPopup(
        `<strong>${feature.properties.STORMNAME}</strong><br/>Storm Type: ${feature.properties.STORMTYPE}`
      );
    });

    observedTrackData.minus360.features.forEach((feature: any) => {
      const coordinates = feature.geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
      const geodesicPolyline = L.geodesic(coordinates, {
        weight: 4,
        color: "red",
        wrap: false,
      }).addTo(map);
      geodesicPolyline.bindPopup(
        `<strong>${feature.properties.STORMNAME}</strong><br/>Storm Type: ${feature.properties.STORMTYPE}`
      );
    });

    observedTrackData.plus360.features.forEach((feature: any) => {
      const coordinates = feature.geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
      const geodesicPolyline = L.geodesic(coordinates, {
        weight: 4,
        color: "red",
        wrap: false,
      }).addTo(map);
      geodesicPolyline.bindPopup(
        `<strong>${feature.properties.STORMNAME}</strong><br/>Storm Type: ${feature.properties.STORMTYPE}`
      );
    });
  }, [observedTrackData, map]);

  return null;
};

export default ObservedTrackLayer;
