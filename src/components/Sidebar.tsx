import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@mui/material";

interface Anime {
  mal_id: number;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  title_english: string;
  title: string;
  synopsis: string;
  status: string;
  year: number;
  season: string;
}
const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const [animes, setAnimes] = useState<Anime[] | null>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.jikan.moe/v4/seasons/upcoming`)
      .then((res) => {
        setAnimes(res.data.data.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 gap-2">
      {!loading
        ? animes &&
          animes.map((anime) => (
            <div
              key={anime.mal_id}
              className="flex flex-col justify-start items-center text-gray-300"
            >
              <img
                className="w-auto h-auto xs:w-44 xs:h-60 mb-2 rounded cursor-pointer lg:w-4/5 lg:h-max-66"
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
              />
              <h1 className="text-center">{anime.title}</h1>
            </div>
          ))
        : Array(5)
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
  );
};

export default Sidebar;
