import React from "react";
import restaurants from "../data/restaurants.json";
import "./ListView.css";

const normalizeName = (name) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s']/g, "_")
    .replace(/[’]/g, "_")
    .toLowerCase();
};

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <span key={`full-${index}`} className="star full">
            🌕
          </span>
        ))}
      {hasHalfStar && (
        <span key="half-star" className="star half">
          🌗
        </span>
      )}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <span key={`empty-${index}`} className="star empty">
            🌑
          </span>
        ))}
    </div>
  );
};

const ListView = ({ filter, filters }) => {
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      return (
        (!filter ||
          restaurant.name.toLowerCase().includes(filter.toLowerCase()) ||
          restaurant.city.toLowerCase().includes(filter.toLowerCase())) &&
        (!filters.city || restaurant.city === filters.city) &&
        (!filters.price_range ||
          restaurant.price_range === filters.price_range) &&
        (!filters.cuisines || restaurant.cuisines.includes(filters.cuisines))
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="list-grid">
      {filteredRestaurants.map((restaurant) => {
        const normalizedFileName = normalizeName(restaurant.name);

        return (
          <div className="list-card" key={restaurant.id}>
            <div
              className="list-image"
              style={{
                backgroundImage: `url(/images/${normalizedFileName}.jpg)`,
              }}
            ></div>
            <h3 className="list-title">{restaurant.name}</h3>
            <p className="list-city">{restaurant.city}</p>
            <div className="list-rating">
              {renderStars(restaurant.rating || 0)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListView;
