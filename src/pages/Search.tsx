import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "@mui/material";
import SearchPagination from "../components/SearchPagination";

interface Anime {
  mal_id: number;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  title_english: string;
  title: string;
}

const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [animes, setAnimes] = useState<Anime[] | null>(null);
  const [totalPage, setTotalPage] = useState(1);
  const query = new URLSearchParams(window.location.search).get("q");
  const queryPage = new URLSearchParams(window.location.search).get("page");

  useEffect(() => {
    fetchData(queryPage);
  }, [query, queryPage]);

  const fetchData = (page: number | string | null) => {
    setLoading(true);
    axios
      .get(
        `https://api.jikan.moe/v4/anime?q=${query}&page=${
          queryPage ? page : "1"
        }&order_by=popularity`
      )
      .then((res) => {
        console.log(res.data);
        setAnimes(res.data.data);
        setTotalPage(res.data.pagination.last_visible_page);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen max-w-screen bg-gray-800 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="sm:pl-4 bg-gray-700 rounded-t py-1 px-2">
          <h1 className="text-xl sm:text- xl text-gray-300">Search Results</h1>
        </div>
        <div className="sm:pl-4 rounded-t py-1 px-2 my-5">
          <h1 className="text-xl sm:text- xl text-gray-300">
            You searched for{" "}
            <span className="italic text-violet-400">{`"${query}"`}</span>
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {!loading
            ? animes &&
              animes.map((anime) => (
                <div
                  key={anime.mal_id}
                  className="flex flex-col items-center text-center text-gray-300 text-sm"
                  onClick={() => {
                    navigate(`/anime/${anime.mal_id}`);
                  }}
                >
                  <img
                    className="w-auto h-52 xs:w-44 xs:h-60 mb-2 rounded cursor-pointer"
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title_english}
                  />
                  {anime.title_english ? (
                    <h1>{anime.title_english}</h1>
                  ) : (
                    <h1>{anime.title}</h1>
                  )}
                </div>
              ))
            : Array(15)
                .fill("")
                .map((element, index) => (
                  <div key={index} className="">
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="auto"
                      height={220}
                    />
                    <Skeleton
                      animation="wave"
                      width="auto"
                      height={20}
                      sx={{ mt: 1 }}
                    />
                  </div>
                ))}
        </div>
        <SearchPagination totalPage={totalPage} fetchData={fetchData} />
      </div>
    </div>
  );
};

export default Search;
