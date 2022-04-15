import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import Pagination from "./Pagination";

interface Manga {
  mal_id: number;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  title_english: string;
  title: string;
}
const AnimeList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mangas, setMangas] = useState<Manga[] | null>([]);
  const [totalPage, setTotalPage] = useState(5);
  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = (page: number) => {
    setLoading(true);
    axios
      .get(`https://api.jikan.moe/v4/top/anime?page=${page}`)
      .then((res) => {
        setMangas(res.data.data);
        console.log(res.data);
        setTotalPage(res.data.pagination.last_visible_page);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="sm:pl-4 bg-gray-700 rounded-t py-1 px-2 mb-5">
        <h1 className="text-xl sm:text- xl text-gray-300">Popular Anime</h1>
      </div>
      <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {!loading
          ? mangas &&
            mangas.map((manga) => (
              <div
                key={manga.mal_id}
                className="flex flex-col items-center text-center text-gray-300 text-sm"
                onClick={() => {
                  navigate(`/anime/${manga.mal_id}`);
                }}
              >
                <img
                  className="w-auto h-52 xs:w-44 xs:h-60 mb-2 rounded cursor-pointer"
                  src={manga.images.jpg.large_image_url}
                  alt={manga.title_english}
                />
                {manga.title_english ? (
                  <h1>{manga.title_english}</h1>
                ) : (
                  <h1>{manga.title}</h1>
                )}
              </div>
            ))
          : Array(25)
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
      <Pagination totalPage={totalPage} fetchData={fetchData} />
    </div>
  );
};

export default AnimeList;
