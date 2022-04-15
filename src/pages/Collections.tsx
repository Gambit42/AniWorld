import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { Skeleton } from "@mui/material";
import Pagination from "../components/Pagination";
import { IoIosSettings } from "react-icons/io";
import { FiXCircle } from "react-icons/fi";
import DeleteModal from "../components/utils/DeleteModal";

interface Props {
  user: any;
}

interface Anime {
  mal_id: number;
  name: string;
  image: string;
}
const Collections = ({ user }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [animes, setAnimes] = useState<Anime[] | null>(null);
  const collectionsRef = doc(db, "users", user.uid);
  const [totalPage, setTotalPage] = useState(1);
  const perPage = 15;

  const handleGetCollections = (page: number) => {
    //Pagination calculation
    const offSet = page * perPage - perPage;

    setLoading(true);
    getDoc(collectionsRef)
      .then((res) => {
        /// Get the specific part of the collection using offset
        setAnimes(res.data()?.collections.slice(offSet, perPage * page));
        console.log(res.data()?.collections);
        window.scrollTo(0, 0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        window.scrollTo(0, 0);
        setLoading(false);
      });
  };

  useEffect(() => {
    getDoc(collectionsRef)
      .then((res) => {
        setTotalPage(Math.ceil(res.data()?.collections.length) / perPage);
      })
      .catch((err) => {});
    handleGetCollections(1);
  }, []);

  return (
    <div className="min-h-screen max-w-screen bg-gray-800 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="sm:pl-4 bg-gray-700 rounded-t py-1 px-2">
          <h1 className="text-xl sm:text- xl text-gray-300">My Collections</h1>
        </div>
        <div className="py-1 px-2 my-5 flex justify-end">
          {!open ? (
            <button
              className="bg-violet-500 p-2 rounded flex flex-row items-center hover:bg-violet-400 transition ease-in-out"
              onClick={() => setOpen(true)}
            >
              <IoIosSettings className="w-5 h-5 mr-2 text-white" />
              <h1 className="cursor-pointer text-white">Manage collection</h1>
            </button>
          ) : (
            <button
              className="bg-violet-500 p-2 rounded flex flex-row items-center hover:bg-violet-400 transition ease-in-out"
              onClick={() => setOpen(false)}
            >
              <FiXCircle className="w-5 h-5 mr-2 text-white" />
              <h1 className="cursor-pointer text-white">Exit manage</h1>
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {!loading
            ? animes &&
              animes.map((anime) => (
                <div
                  key={anime.mal_id}
                  className="flex flex-col items-center text-center text-gray-300 text-sm"
                >
                  <img
                    onClick={() => {
                      navigate(`/anime/${anime.mal_id}`);
                    }}
                    className="w-auto h-52 xs:w-44 xs:h-60 mb-2 rounded cursor-pointer"
                    src={anime.image}
                    alt={anime.name}
                  />
                  {open ? (
                    <DeleteModal
                      handleGetCollections={handleGetCollections}
                      user={user}
                      anime={anime}
                    />
                  ) : (
                    <h1>{anime.name}</h1>
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
        <Pagination totalPage={totalPage} fetchData={handleGetCollections} />
      </div>
    </div>
  );
};

export default Collections;
