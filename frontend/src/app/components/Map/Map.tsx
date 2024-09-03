"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LatLngTuple, LatLngBounds, icon } from "leaflet";
import { Polyline } from "react-leaflet";
import { useRouteContext } from "~/app/context/RouteContext";
import "leaflet/dist/leaflet.css";

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

const Map = () => {
  const { globalRouteData } = useRouteContext();
  const [routeCoordinates, setRouteCoordinates] = useState<LatLngTuple[]>([]);

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
    console.log("Global Route Data:", globalRouteData);
    if (globalRouteData && globalRouteData.length > 0) {
      const coordinates: LatLngTuple[] = [];

      globalRouteData.forEach((point, index) => {
        const lat = parseFloat(point.latitude);
        const lon = parseFloat(point.longitude);

        if (index > 0) {
          const prevLatLng = coordinates[coordinates.length - 1];
          const adjustedEnd = handleDateLineCrossing(prevLatLng, [lat, lon]);
          coordinates.push(adjustedEnd);
        } else {
          coordinates.push([lat, lon]);
        }
      });

      setRouteCoordinates(coordinates);
      console.log("Route Coordinates:", coordinates);
    }
  }, [globalRouteData]);

  const handleDateLineCrossing = (
    start: LatLngTuple,
    end: LatLngTuple
  ): LatLngTuple => {
    const startLon = start[1];
    const endLon = end[1];
    const lonDifference = Math.abs(endLon - startLon);

    if (lonDifference > 180) {
      const adjustedLon = endLon > startLon ? endLon - 360 : endLon + 360;
      return [end[0], adjustedLon] as LatLngTuple;
    }
    return end;
  };

  const maxBounds = new LatLngBounds([180, -360], [-180, 360]);

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
      {routeCoordinates.map((position, index) => {
        if (index > 0 && index < routeCoordinates.length - 1) {
          return (
            <Marker key={index} position={position} icon={MiddleIcon}>
              <Popup>
                Point: {index + 1} <br />
                Latitude: {position[0]}, Longitude: {position[1]}
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
      {routeCoordinates.length > 1 && (
        <Marker
          key={"last-point"}
          position={routeCoordinates[routeCoordinates.length - 1]}
          icon={LastIcon}
        >
          <Popup>
            Point: {routeCoordinates.length} <br />
            Latitude: {routeCoordinates[routeCoordinates.length - 1][0]},
            Longitude: {routeCoordinates[routeCoordinates.length - 1][1]}
          </Popup>
        </Marker>
      )}
      {routeCoordinates.length > 0 && (
        <Marker key={"first-point"} position={routeCoordinates[0]} icon={FirstIcon}>
          <Popup>
            Point: 1 <br />
            Latitude: {routeCoordinates[0][0]}, Longitude: {routeCoordinates[0][1]}
          </Popup>
        </Marker>
      )}

      {routeCoordinates.length > 1 && (
        <Polyline positions={routeCoordinates} color="blue" />
      )}
    </MapContainer>
  );
};

export default Map;
