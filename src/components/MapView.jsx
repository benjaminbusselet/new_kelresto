import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import L from "leaflet";
import restaurants from "../data/restaurants.json";
import "./MapView.css";
import { useState } from "react";

// Fonction pour normaliser les noms
const normalizeName = (name) => {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s']/g, "_")
    .replace(/[’]/g, "_")
    .toLowerCase();
  console.log(`Nom normalisé : ${name} -> ${normalized}`); // Log du nom original et normalisé
  return normalized;
};

const RestaurantMarker = ({ restaurant }) => {
  const map = useMap();

  const handleMarkerClick = () => {
    const latLng = [restaurant.latitude, restaurant.longitude];
    console.log(`Zoom sur : ${restaurant.name}, Position : ${latLng}`); // Log lors du clic sur un marqueur
    map.setView(latLng, 20); // Définit un zoom de niveau 20
  };

  const imagePath = `/images/${normalizeName(restaurant.name)}.jpg`;
  console.log(`Chemin d'image pour ${restaurant.name} : ${imagePath}`); // Log du chemin de l'image

  return (
    <Marker
      position={[restaurant.latitude, restaurant.longitude]}
      eventHandlers={{
        click: handleMarkerClick, // Gestionnaire de clic pour le marqueur
      }}
    >
      <Popup>
        <strong>{restaurant.name}</strong>
        <br />
        <img
          src={imagePath} // Utilisation du chemin généré
          alt={restaurant.name}
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <br />
        {restaurant.cuisine}
        <br />
        {restaurant.address}
      </Popup>
    </Marker>
  );
};

const MapView = ({ onMapReady }) => {
  const [tileLayer, setTileLayer] = useState("standard");

  const handleLayerSwitch = (layer) => {
    setTileLayer(layer);
  };

  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 20 });

    map.on("locationfound", (e) => {
      const { lat, lng } = e.latlng;
      console.log(`Position trouvée : ${lat}, ${lng}`); // Log de la position
      L.marker([lat, lng]).addTo(map).bindPopup("Vous êtes ici").openPopup();
    });

    map.on("locationerror", (error) => {
      console.error("Erreur de localisation :", error); // Log de l'erreur
      alert("Impossible de trouver votre position.");
    });
  };

  return (
    <div className="map-container-wrapper">
      <div className="map-controls">
        <button onClick={() => handleLayerSwitch("standard")}>
          Carte Standard
        </button>
        <button onClick={() => handleLayerSwitch("satellite")}>
          Carte Satellite
        </button>
        <button
          onClick={handleLocate}
          className="geolocate-button"
          aria-label="Trouver ma position"
        >
          Trouver ma position
        </button>
      </div>
      <MapContainer
        center={[43.65, 7.15]}
        zoom={10}
        className="map-container"
        whenCreated={onMapReady}
      >
        {tileLayer === "standard" && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}
        {tileLayer === "satellite" && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>, NASA, USGS'
          />
        )}

        {restaurants
          .filter((restaurant) => restaurant.latitude && restaurant.longitude)
          .map((restaurant) => (
            <RestaurantMarker key={restaurant.id} restaurant={restaurant} />
          ))}

        <LocateUser />
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  onMapReady: PropTypes.func,
};

export { MapView };
