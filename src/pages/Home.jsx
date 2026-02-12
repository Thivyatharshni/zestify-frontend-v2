import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/RouteConstants';
import LocationModal from '../components/home/LocationModal';
import CategorySlider from '../components/home/CategorySlider';
import FoodLanes from '../components/home/FoodLanes';
import ExclusiveOffers from '../components/home/OfferCarousel';
import FilterBar from '../components/home/FilterBar';
import RestaurantGrid from '../components/home/RestaurantGrid';
import HeroVideoSection from '../components/home/HeroVideoSection';

const Home = () => {
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchText)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-0 overflow-x-hidden">
      <LocationModal />

      {/* Screen 1: Hero Section - Full Viewport */}
      <div className="h-screen min-h-[600px] max-h-screen overflow-hidden">
        <HeroVideoSection
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearch={handleSearch}
          handleKeyDown={handleKeyDown}
        />
      </div>

      {/* Screen 2: Categories + Offers - Combined Viewport */}
      <div className="min-h-screen flex flex-col lg:max-h-screen lg:overflow-hidden">
        {/* Categories Section - Compact */}
        <div className="relative z-20">
          <CategorySlider />
        </div>

        {/* Offers Section - Compact */}
        <div className="relative z-10">
          <ExclusiveOffers />
        </div>
      </div>

      {/* Screen 3: All Restaurants Section - Full Viewport on Desktop */}
      <div className="lg:h-screen lg:min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex-1 flex flex-col min-h-0 pt-4 pb-12">
          {/* Sticky Header inside the viewport container */}
          <div className="z-40 bg-white/90 backdrop-blur-md py-4 border-b border-gray-100 flex-none">
            <FilterBar activeFilters={activeFilters} onToggle={toggleFilter} />
          </div>

          {/* Scrollable Grid Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pt-6">
            <RestaurantGrid activeFilters={activeFilters} />
          </div>
        </section>
      </div>

      {/* Screen 4: Food Lanes / Promotional Banners */}
      <div className="relative z-10">
        <FoodLanes />
      </div>
    </div>
  );
};

export default Home;
