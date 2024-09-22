import { useEffect, useState, useCallback } from "react";
import { GeoJSON } from "react-leaflet";
import axios from "axios";
import { Feature, FeatureCollection, GeoJsonObject } from "geojson";

interface CycloneLoadData {
  original: CycloneData | null;
  minus360: CycloneData | null;
  plus360: CycloneData | null;
}

interface ForecastConeProps {
  onDataLoad?: (data: CycloneLoadData) => void;
}

type CycloneData = FeatureCollection;

const ForecastCone: React.FC<ForecastConeProps> = ({ onDataLoad }) => {
  const [cycloneData, setCycloneData] = useState<{
    original: CycloneData;
    minus360: CycloneData;
    plus360: CycloneData;
  } | null>(null);

  const shiftCycloneCoordinates = useCallback((data: CycloneData, offset: number): CycloneData => {
    if (!data || !data.features) return data;

    const shiftedData = JSON.parse(JSON.stringify(data)) as CycloneData;

    shiftedData.features = shiftedData.features.map((feature) => {
      const geometryType = feature.geometry.type;

      if (geometryType === "Polygon" || geometryType === "MultiPolygon") {
        feature.geometry.coordinates = feature.geometry.coordinates.map((polygonOrRing: any) => {
          if (geometryType === "MultiPolygon") {
            return polygonOrRing.map((ring: any) => {
              return ring.map((coord: any) => {
                const lat = coord[1];
                const lon = coord[0] + offset;
                return [lon, lat];
              });
            });
          } else {
            return polygonOrRing.map((coord: any) => {
              const lat = coord[1];
              const lon = coord[0] + offset;
              return [lon, lat];
            });
          }
        });
      }

      return feature;
    });

    return shiftedData;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchCycloneData = async () => {
      try {
        const accumulatedData: CycloneData = {
          type: "FeatureCollection",
          features: [],
        };

        const response = await axios.get(
          "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/4/query?outFields=*&where=1%3D1&f=geojson"
        );

        accumulatedData.features.push(...response.data.features);

        const shiftedDataMinus360 = shiftCycloneCoordinates(accumulatedData, -360);
        const shiftedDataPlus360 = shiftCycloneCoordinates(accumulatedData, 360);

        if (isMounted) {
          setCycloneData({
            original: accumulatedData,
            minus360: shiftedDataMinus360,
            plus360: shiftedDataPlus360,
          });

          if (onDataLoad) {
            onDataLoad({
              original: accumulatedData || null,
              minus360: shiftedDataMinus360 || null,
              plus360: shiftedDataPlus360 || null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching cyclone data:", error);
      }
    };

    fetchCycloneData();

    return () => {
      isMounted = false;
    };
  }, [shiftCycloneCoordinates, onDataLoad]);

  const bindPopup = (feature: Feature, layer: any) => {
    if (feature.properties) {
      const {
        STORMNAME,
        STORMTYPE,
        MAX_WIND,
        MAX_GUST,
        MAX_LABEL,
        BASIN,
        FCSTPRD,
        Shape__Area,
        Shape__Length,
        STORMNUM,
        ADVISNUM,
      } = feature.properties;

      let popupContent = `<strong>Storm Name:</strong><strong> ${STORMNAME}</strong><br/>`;

      if (STORMTYPE && STORMTYPE.trim()) {
        popupContent += `<strong>Type:</strong> ${STORMTYPE}<br/>`;
      }
      if (BASIN && BASIN.trim()) {
        popupContent += `<strong>Basin:</strong> ${BASIN}<br/>`;
      }
      if (FCSTPRD) {
        popupContent += `<strong>Forecast Period:</strong> ${FCSTPRD} hours<br/>`;
      }
      if (MAX_WIND) {
        popupContent += `<strong>Max Wind:</strong> ${MAX_WIND} km/h<br/>`;
      }
      if (MAX_GUST) {
        popupContent += `<strong>Max Gust:</strong> ${MAX_GUST} km/h<br/>`;
      }
      if (MAX_LABEL && MAX_LABEL.trim()) {
        popupContent += `<strong>Advisory Time:</strong> ${MAX_LABEL}<br/>`;
      }
      if (STORMNUM) {
        popupContent += `<strong>Storm Number:</strong> ${STORMNUM}<br/>`;
      }
      if (ADVISNUM && ADVISNUM.trim()) {
        popupContent += `<strong>Advisory Number:</strong> ${ADVISNUM}<br/>`;
      }
      if (Shape__Area) {
        popupContent += `<strong>Shape Area:</strong> ${Shape__Area.toFixed(2)} km²<br/>`;
      }
      if (Shape__Length) {
        popupContent += `<strong>Shape Length:</strong> ${Shape__Length.toFixed(2)} km<br/>`;
      }

      layer.bindPopup(popupContent);
    }
  };

  if (!cycloneData) return null;

  return (
    <>
      <GeoJSON
        data={cycloneData.original as GeoJsonObject}
        style={() => ({
          color: "red",
          weight: 2,
          opacity: 0.5,
        })}
        onEachFeature={bindPopup}
      />
      <GeoJSON
        data={cycloneData.minus360 as GeoJsonObject}
        style={() => ({
          color: "red",
          weight: 2,
          opacity: 0.5,
        })}
        onEachFeature={bindPopup}
      />
      <GeoJSON
        data={cycloneData.plus360 as GeoJsonObject}
        style={() => ({
          color: "red",
          weight: 2,
          opacity: 0.5,
        })}
        onEachFeature={bindPopup}
      />
    </>
  );
};

export default ForecastCone;
