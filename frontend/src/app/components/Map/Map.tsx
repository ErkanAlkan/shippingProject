import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LatLngTuple, LatLngBounds, icon } from "leaflet";
import { useMap } from "react-leaflet";
import { useRouteContext } from "~/app/context/RouteContext";
import "leaflet/dist/leaflet.css";
import "leaflet.geodesic";

import greenDot from "/public/leaflet/green-dot.png";
import redDot from "/public/leaflet/red-dot.png";
import blueDot from "/public/leaflet/blue-dot.png";

import ForecastConeLayer from "../CycloneLayer/ForecastCone";
import ObservedTrackLayer from "../CycloneLayer/ObservedTrack";
import ForecastTrackLayer from "../CycloneLayer/ForecastTrack";

import { checkIntersectionBetweenLineAndPolygon } from "~/utils/CheckIntersectionBetweenLineAndPolygon";
import { checkIntersectionBetweenLines } from "~/utils/CheckInterSectionBetweenLines";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import("react-leaflet").then((mod) => mod.Tooltip), { ssr: false });

interface GeodesicPolylineProps {
  positions: LatLngTuple[];
}

const GeodesicPolyline: React.FC<GeodesicPolylineProps> = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 1) {
      const L = require("leaflet") as typeof import("leaflet");

      const geodesicPolyline = L.geodesic(positions, {
        weight: 2,
        color: "blue",
        wrap: false,
      }).addTo(map);

      return () => {
        map.removeLayer(geodesicPolyline);
      };
    }
  }, [positions, map]);

  return null;
};

const SetViewOnRouteData: React.FC<{ center: LatLngTuple | null }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, 3);
    } else {
      console.warn("Invalid or missing center coordinates:", center);
    }
  }, [center, map]);

  return null;
};

const Map: React.FC = () => {
  const { globalRouteData } = useRouteContext();
  const [adjustedCoordinates, setAdjustedCoordinates] = useState<LatLngTuple[]>([]);
  const [center, setCenter] = useState<LatLngTuple | null>(null);
  const [isOriginPopupOpen, setIsOriginPopupOpen] = useState(false);
  const [isDestinationPopupOpen, setIsDestinationPopupOpen] = useState(false);
  const [forecastConeData, setForecastConeData] = useState<any>(null);
  const [observedTrackData, setObservedTrackData] = useState<any>(null); // New state for observed track

  const FirstIcon = icon({
    iconUrl: greenDot.src,
    iconSize: [25, 25],
  });

  const LastIcon = icon({
    iconUrl: redDot.src,
    iconSize: [25, 25],
  });

  const MiddleIcon = icon({
    iconUrl: blueDot.src,
    iconSize: [10, 10],
  });

  useEffect(() => {
    if (globalRouteData && globalRouteData.length > 0) {
      const rawCoordinates: LatLngTuple[] = [];
      const adjustedCoordinates: LatLngTuple[] = [];

      globalRouteData.forEach((point) => {
        const lat = parseFloat(point.latitude);
        const lon = parseFloat(point.longitude);
        rawCoordinates.push([lat, lon]);
        const adjustedCoords = handleDateLineCrossing(adjustedCoordinates[adjustedCoordinates.length - 1], [lat, lon]);
        adjustedCoordinates.push(adjustedCoords);
      });

      setAdjustedCoordinates(adjustedCoordinates);
      setCenter(calculateMeanLatLon(adjustedCoordinates));
      console.log("useEffect ~ adjustedCoordinates:", adjustedCoordinates);

      // Forecast Cone Intersection Check
      if (forecastConeData) {
        const originalPolygon = forecastConeData?.original?.features[0]?.geometry?.coordinates;
        const minus360Polygon = forecastConeData?.minus360?.features[0]?.geometry?.coordinates;
        const plus360Polygon = forecastConeData?.plus360?.features[0]?.geometry?.coordinates;

        const checkOriginal = checkIntersectionBetweenLineAndPolygon(adjustedCoordinates, originalPolygon);
        const checkMinus360 = checkIntersectionBetweenLineAndPolygon(adjustedCoordinates, minus360Polygon);
        const checkPlus360 = checkIntersectionBetweenLineAndPolygon(adjustedCoordinates, plus360Polygon);

        if (checkOriginal || checkMinus360 || checkPlus360) {
          alert("Your route intersects with the forecasted cone!");
        } else {
          console.log("No intersection found with the forecasted cone!");
        }
      }

      // Observed Track Intersection Check
      if (observedTrackData) {
        const checkIntersectionForTrackGroup = (trackData: any) => {
          return trackData.features.some((feature: any) => {
            const trackCoordinates = feature.geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
            return checkIntersectionBetweenLines(adjustedCoordinates, trackCoordinates);
          });
        };

        const checkOriginalTrack = checkIntersectionForTrackGroup(observedTrackData.original);
        const checkMinus360Track = checkIntersectionForTrackGroup(observedTrackData.minus360);
        const checkPlus360Track = checkIntersectionForTrackGroup(observedTrackData.plus360);

        if (checkOriginalTrack || checkMinus360Track || checkPlus360Track) {
          alert("Your route intersects with the observed track!");
        } else {
          console.log("No intersection with the observed track!");
        }
      }
    }
  }, [globalRouteData, forecastConeData, observedTrackData]);

  const handleDateLineCrossing = (prev: LatLngTuple | undefined, current: LatLngTuple): LatLngTuple => {
    if (!prev) return current;

    const prevLon = prev[1];
    const currLon = current[1];
    const lonDifference = Math.abs(currLon - prevLon);

    if (lonDifference > 180) {
      const adjustedLon = currLon > prevLon ? currLon - 360 : currLon + 360;
      return [current[0], adjustedLon];
    }
    return current;
  };

  const calculateMeanLatLon = (coordinates: LatLngTuple[]): LatLngTuple => {
    const totalPoints = coordinates.length;
    const sumLat = coordinates.reduce((sum, coord) => sum + coord[0], 0);
    const sumLon = coordinates.reduce((sum, coord) => sum + coord[1], 0);

    return [sumLat / totalPoints, sumLon / totalPoints];
  };

  const maxBounds: LatLngBounds = new LatLngBounds([180, -360], [-180, 540]);

  const handlePopupOpen = (index: number) => {
    if (index === 0) {
      setIsOriginPopupOpen(true);
    } else if (index === adjustedCoordinates.length - 1) {
      setIsDestinationPopupOpen(true);
    }
  };

  const handlePopupClose = (index: number) => {
    if (index === 0) {
      setIsOriginPopupOpen(false);
    } else if (index === adjustedCoordinates.length - 1) {
      setIsDestinationPopupOpen(false);
    }
  };

  return (
    <MapContainer
      center={[44, 12]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
      className="h-screen w-full"
      maxBounds={maxBounds}
      maxBoundsViscosity={1.0}
      minZoom={2}
      maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ForecastConeLayer
        onDataLoad={(data: any) => {
          if (JSON.stringify(forecastConeData) !== JSON.stringify(data)) {
            console.log("Forecast Cone Data Loaded:", data);
            setForecastConeData(data);
          }
        }}
      />
      <ObservedTrackLayer
        onDataLoad={(data: any) => {
          if (JSON.stringify(observedTrackData) !== JSON.stringify(data)) {
            console.log("Observed Track Data Loaded:", data);
            setObservedTrackData(data);
          }
        }}
      />
      <ForecastTrackLayer />
      {adjustedCoordinates.map((position, index) => (
        <Marker
          key={index}
          position={position}
          icon={index === 0 ? FirstIcon : index === adjustedCoordinates.length - 1 ? LastIcon : MiddleIcon}
          eventHandlers={{
            popupopen: () => handlePopupOpen(index),
            popupclose: () => handlePopupClose(index),
          }}
        >
          {index === 0 && !isOriginPopupOpen && <Tooltip permanent>{globalRouteData[0].origin}</Tooltip>}
          {index === adjustedCoordinates.length - 1 && !isDestinationPopupOpen && (
            <Tooltip permanent>{globalRouteData[globalRouteData.length - 1].destination}</Tooltip>
          )}

          <Popup>
            <div>
              Point: {index + 1} <br />
              Latitude: {position[0]}, Longitude: {position[1]} <br />
              {index === 0 && (
                <>
                  Origin Port: {globalRouteData[0].origin} <br />
                </>
              )}
              {index === adjustedCoordinates.length - 1 && (
                <>
                  Destination Port: {globalRouteData[globalRouteData.length - 1].destination} <br />
                </>
              )}
              Cumulative Distance:{" "}
              {globalRouteData[index]?.cumulative_dist !== null && globalRouteData[index]?.cumulative_dist !== undefined
                ? globalRouteData[index].cumulative_dist.toString()
                : "N/A"}{" "}
              km
            </div>
          </Popup>
        </Marker>
      ))}
      {adjustedCoordinates.length > 1 && <GeodesicPolyline positions={adjustedCoordinates} />}
      {center && <SetViewOnRouteData center={center} />}
    </MapContainer>
  );
};

export default Map;
