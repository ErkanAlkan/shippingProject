import { useEffect, useState, useCallback } from "react";
import { GeoJSON } from "react-leaflet";
import axios from "axios";
import { Feature, FeatureCollection, GeoJsonObject } from "geojson";

interface ForecastConeProps {
  onDataLoad?: (data: any) => void;
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
    const fetchCycloneData = async () => {
      try {
        const accumulatedData: CycloneData = {
          type: "FeatureCollection",
          features: []
        };

        const response = await axios.get(
          "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Active_Hurricanes_v1/FeatureServer/4/query?outFields=*&where=1%3D1&f=geojson"
        );
        console.log("fetchCycloneData ~ response:", response);

        accumulatedData.features.push(...response.data.features);

        const shiftedDataMinus360 = shiftCycloneCoordinates(accumulatedData, -360);
        const shiftedDataPlus360 = shiftCycloneCoordinates(accumulatedData, 360);

        setCycloneData({
          original: accumulatedData,
          minus360: shiftedDataMinus360,
          plus360: shiftedDataPlus360,
        });

        if (onDataLoad) {
          onDataLoad({
            original: accumulatedData,
            minus360: shiftedDataMinus360,
            plus360: shiftedDataPlus360,
          });
        }
      } catch (error) {
        console.error("Error fetching cyclone data:", error);
      }
    };

    fetchCycloneData();
  }, [shiftCycloneCoordinates, onDataLoad]);

  if (!cycloneData) return null;

  return (
    <>
      <GeoJSON
        data={cycloneData.original as GeoJsonObject}
        style={() => ({
          color: "red",
          weight: 2,
          opacity: 0.8,
        })}
        onEachFeature={(feature: Feature, layer) => {
          if (feature.properties && feature.properties.STORMNAME) {
            layer.bindPopup(
              `<strong>${feature.properties.STORMNAME}</strong><br/>Max Wind: ${feature.properties.MAX_WIND} km/h`
            );
          }
        }}
      />

      <GeoJSON
        data={cycloneData.minus360 as GeoJsonObject}
        style={() => ({
          color: "red",
          weight: 2,
          opacity: 0.5,
        })}
        onEachFeature={(feature: Feature, layer) => {
          if (feature.properties && feature.properties.STORMNAME) {
            layer.bindPopup(
              `<strong>${feature.properties.STORMNAME}</strong><br/>Max Wind: ${feature.properties.MAX_WIND} km/h`
            );
          }
        }}
      />

      <GeoJSON
        data={cycloneData.plus360 as GeoJsonObject}
        style={() => ({
          color: "red",
          weight: 2,
          opacity: 0.5,
        })}
        onEachFeature={(feature: Feature, layer) => {
          if (feature.properties && feature.properties.STORMNAME) {
            layer.bindPopup(
              `<strong>${feature.properties.STORMNAME}</strong><br/>Max Wind: ${feature.properties.MAX_WIND} km/h`
            );
          }
        }}
      />
    </>
  );
};

export default ForecastCone;
