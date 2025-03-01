import { useState } from "react";
import ListView from "./components/ListView";
import { MapView } from "./components/MapView";
import restaurants from "./data/restaurants.json";
import "./App.css";

function App() {
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    price_range: "",
    cuisines: "",
  });

  const getUniqueValues = (field) => {
    return [...new Set(restaurants.map((restaurant) => restaurant[field]))]
      .filter(Boolean)
      .sort();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>KelResto</h1>
          <input
            type="text"
            placeholder="Rechercher un restaurant ou une ville..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
          <nav>
            <button onClick={() => setView("list")}>Vue Liste</button>
            <button onClick={() => setView("map")}>Vue Carte</button>
          </nav>
        </div>
        <div className="filter-container">
          <select
            className="filter-dropdown"
            onChange={(e) => handleFilterChange("city", e.target.value)}
            value={filters.city}
          >
            <option value="">Toutes les villes</option>
            {getUniqueValues("city").map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            className="filter-dropdown"
            onChange={(e) => handleFilterChange("price_range", e.target.value)}
            value={filters.price_range}
          >
            <option value="">Tous les prix</option>
            {getUniqueValues("price_range").map((price) => (
              <option key={price} value={price}>
                {price}
              </option>
            ))}
          </select>
          <select
            className="filter-dropdown"
            onChange={(e) => handleFilterChange("cuisines", e.target.value)}
            value={filters.cuisines}
          >
            <option value="">Toutes les cuisines</option>
            {getUniqueValues("cuisines")
              .flatMap((cuisine) =>
                Array.isArray(cuisine) ? cuisine : cuisine.split(", ")
              )
              .filter((value, index, self) => self.indexOf(value) === index)
              .sort()
              .map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
          </select>
        </div>
      </header>
      <main>
        {view === "list" ? (
          <ListView filter={filter} filters={filters} />
        ) : (
          <MapView />
        )}
      </main>
    </div>
  );
}

export default App;
