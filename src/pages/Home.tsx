import React from "react";
import AnimeList from "../components/AnimeList";

const Home = () => {
  return (
    <>
      <h1
        onClick={() => {
          window.open(
            "https://www.facebook.com",
            "_blank",
            "width=500,height=500"
          );
        }}>
        hELLO WORLD
      </h1>
      <div className="min-h-screen max-w-screen bg-gray-800 py-5 px-4">
        <AnimeList />
      </div>
    </>
  );
};

export default Home;
