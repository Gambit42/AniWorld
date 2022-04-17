import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { db } from "../config/firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { Skeleton } from "@mui/material";

interface Genre {
  mal_id: number;
  name: string;
}

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
  genres: Genre[];
  status: string;
  year: number;
  season: string;
}

interface Props {
  user: any;
}
const AnimeInfo = ({ user }: Props) => {
  const [anime, setAnime] = useState<Anime | null>();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const handleAddToCollection = async () => {
    const collectionsRef = doc(db, "users", user.uid);
    const selectedAnime = await getDoc(collectionsRef);

    try {
      for (let collection of selectedAnime.data()?.collections) {
        if (anime?.mal_id === collection.mal_id) {
          return alert("Already exist");
        }
      }
      await updateDoc(collectionsRef, {
        collections: arrayUnion({
          name: anime?.title,
          image: anime?.images?.jpg.large_image_url,
          mal_id: anime?.mal_id,
        }),
      });
      try {
        alert("Sucessfully added");
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.jikan.moe/v4/anime/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setAnime(res.data.data);
        window.scrollTo(0, 0);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen max-w-screen bg-gray-800 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto pb-10 flex flex-col lg:flex-row">
        <div className="lg:w-full lg:max-w-3xl">
          <div className="sm:pl-4 mb-5 bg-gray-700 rounded-t py-1 px-2">
            <h1 className="text-xl sm:text- xl text-gray-300">Anime Info</h1>
          </div>
          {!loading ? (
            <div className="flex flex-col lg:flex-row">
              {anime ? (
                <div className="max-w-3xl flex-row items-start lg:flex pr-5">
                  <div className="lg:h-96 lg:w-3/5 lg:mr-5 flex-col items-center lg:flex lg:pt-1">
                    <img
                      className="mb-2 mx-auto xs:float-left w-4/5 xs:w-2/5 rounded cursor-pointer xs:mr-5 lg:float-none lg:h-full lg:w-full"
                      src={anime.images.jpg.large_image_url}
                      alt={"anime"}
                    />
                    {user && (
                      <button
                        className="hidden lg:mt-2 lg:block lg:w-4/5 w-3/5 mx-auto xs:w-auto xs:mx-0 mb-2 px-4 py-2 text-sm  text-white bg-violet-500 rounded hover:bg-violet-400 focus:outline-none focus:shadow-outline"
                        onClick={handleAddToCollection}
                      >
                        Add to collection
                      </button>
                    )}
                  </div>
                  <div className="w-full">
                    <div className="flex items-center py-2 xs:py-0">
                      {user && (
                        <button
                          className="lg:hidden w-3/5 mx-auto xs:w-auto xs:mx-0 mb-2 px-4 py-2 text-sm  text-white bg-violet-500 rounded hover:bg-violet-400 focus:outline-none focus:shadow-outline"
                          onClick={handleAddToCollection}
                        >
                          Add to collection
                        </button>
                      )}
                    </div>
                    <div className="mb-1">
                      {anime.title_english ? (
                        <h1 className="text-gray-300 text-sm">
                          <span className="text-violet-400 text-base">
                            Title:{" "}
                          </span>
                          {anime.title_english}
                        </h1>
                      ) : (
                        <h1 className="text-gray-300 text-sm">
                          <span className="text-violet-400 text-base">
                            Title:{" "}
                          </span>
                          {anime.title}
                        </h1>
                      )}
                    </div>
                    <div className="flex flex-row flex-wrap items-end mb-1">
                      <h1 className="text-violet-400 mr-2">Genre: </h1>
                      {anime.genres.map((genre) => (
                        <h1
                          className="text-gray-300 mr-1 text-sm"
                          key={genre.mal_id}
                        >
                          {`${genre.name}`}
                        </h1>
                      ))}
                    </div>
                    <div className="mb-1">
                      <p className="text-gray-300 text-sm">
                        <span className="text-violet-400 text-base">
                          Synopsis:{" "}
                        </span>
                        {anime.synopsis}
                      </p>
                    </div>
                    <div className="mb-1">
                      <p className="text-gray-300 text-sm">
                        <span className="text-violet-400 text-base">
                          Status:{" "}
                        </span>
                        {anime.status}
                      </p>
                    </div>
                    <div className="mb-1">
                      <p className="text-gray-300 text-sm">
                        <span className="text-violet-400 text-base">
                          Year:{" "}
                        </span>
                        {anime.year ? `${anime.year}` : "No Data  "}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full py-2 text-center text-gray-300">
                  No data to show
                </div>
              )}
            </div>
          ) : (
            <div>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="auto"
                height={400}
              />
            </div>
          )}
        </div>
        <div className="mt-5 lg:mt-0 lg:w-full lg:max-w-xs lg:pl-10">
          <div className="bg-gray-700 px-2 py-1 rounded-t mb-5">
            <h1 className="text-xl sm:text-xl text-gray-300">Upcoming Anime</h1>
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default AnimeInfo;
