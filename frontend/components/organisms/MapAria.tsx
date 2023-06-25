// MapAria.tsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState, useRef } from "react";

type MapComponentProps = {
  latitude: number | null;
  longitude: number | null;
};

const ChangeView = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMapEvents({
    load: () => {
      map.invalidateSize();
      map.setView(center, zoom);
    },
  });

  useEffect(() => {
    map.invalidateSize();
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const MapAria: React.FC<MapComponentProps> = ({ latitude, longitude }) => {
  const [mapKey, setMapKey] = useState(Math.random());
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const mapContainer = mapContainerRef.current;
    if (mapContainer) {
      const resizeObserver = new ResizeObserver(() => {
        setMapKey(Math.random()); // change key to force remount
      });
      resizeObserver.observe(mapContainer);
      return () => resizeObserver.unobserve(mapContainer);
    }
  }, []);

  useEffect(() => {
    setMapKey(Math.random()); // change key to force remount
  }, [latitude, longitude]);

  if (latitude === null || longitude === null) {
    return null; // latitudeまたはlongitudeがnullの場合、何もレンダリングしない
  }
  const position: [number, number] = [latitude, longitude];
  const zoom = 13;

  return (
    <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }}>
      <MapContainer key={mapKey} style={{ height: "100%", width: "100%" }}>
        <ChangeView center={position} zoom={zoom} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapAria;
