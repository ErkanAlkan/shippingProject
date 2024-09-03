"use client";

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

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

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
        //steps: 8
      }).addTo(map);

      return () => {
        map.removeLayer(geodesicPolyline);
      };
    }
  }, [positions, map]);

  return null;
};

const Map: React.FC = () => {
  const { globalRouteData } = useRouteContext();
  const [adjustedCoordinates, setAdjustedCoordinates] = useState<LatLngTuple[]>([]);

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

      globalRouteData.forEach((point, index) => {
        const lat = parseFloat(point.latitude);
        let lon = parseFloat(point.longitude);

        rawCoordinates.push([lat, lon]);

        const adjustedCoords = handleDateLineCrossing(
          adjustedCoordinates[adjustedCoordinates.length - 1],
          [lat, lon]
        );

        adjustedCoordinates.push(adjustedCoords);
      });

      setAdjustedCoordinates(adjustedCoordinates);
      console.log("Adjusted Coordinates:", adjustedCoordinates);
    }
  }, [globalRouteData]);

  const handleDateLineCrossing = (
    prev: LatLngTuple | undefined,
    current: LatLngTuple
  ): LatLngTuple => {
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

  const maxBounds: LatLngBounds = new LatLngBounds([180, -360], [-180, 360]);

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
      {adjustedCoordinates.map((position, index) => (
        <Marker
          key={index}
          position={position}
          icon={
            index === 0
              ? FirstIcon
              : index === adjustedCoordinates.length - 1
              ? LastIcon
              : MiddleIcon
          }
        >
          <Popup>
            Point: {index + 1} <br />
            Latitude: {position[0]}, Longitude: {position[1]}
          </Popup>
        </Marker>
      ))}
      {adjustedCoordinates.length > 1 && (
        <GeodesicPolyline positions={adjustedCoordinates} />
      )}
    </MapContainer>
  );
};

export default Map;
