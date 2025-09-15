import React from "react";
import "./Home.css";
import hero_banner from "../../assets/hero_banner.jpg";
import hero_title from "../../assets/hero_title.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const Home = ({ searchQuery, toggleFavorite, favorites }) => {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <img src={hero_banner} alt="Hero Banner" className="banner-img" />
        <div className="hero-caption">
          <img src={hero_title} alt="Hero Title" className="caption-img" />
          <p className="detail-text">
            Discovering his ties to a secret ancient order, a young man is thrust
            into a dangerous world of hidden powers, betrayal, and destiny —
            where every choice could alter the fate of humanity.
          </p>
        </div>
      </div>

      {/* First row of movies */}
      <div className="main">
        <TitleCards
          category="now_playing"
          title="Now Playing"
          toggleFavorite={toggleFavorite}
          favorites={favorites}
          searchQuery={searchQuery}
        />
      </div>

      {/* More categories */}
      <div className="more-cards">
        <TitleCards
          category="top_rated"
          title="Blockbuster Movies"
          toggleFavorite={toggleFavorite}
          favorites={favorites}
          searchQuery={searchQuery}
        />
        <TitleCards
          category="popular"
          title="Only on Netflix"
          toggleFavorite={toggleFavorite}
          favorites={favorites}
          searchQuery={searchQuery}
        />
        <TitleCards
          category="upcoming"
          title="Upcoming"
          toggleFavorite={toggleFavorite}
          favorites={favorites}
          searchQuery={searchQuery}
        />
        <TitleCards
          category="now_playing"
          title="Top Picks for You"
          toggleFavorite={toggleFavorite}
          favorites={favorites}
          searchQuery={searchQuery}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
