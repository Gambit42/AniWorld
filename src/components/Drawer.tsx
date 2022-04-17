import { SwipeableDrawer } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { GiWorld } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: any;
}

const Drawer = ({ open, setOpen, user }: Props) => {
  const navigate = useNavigate();
  // const genres = GenreList.sort((a, b) => {
  //   if (a.name.toLowerCase() < b.name.toLowerCase()) {
  //     return -1;
  //   }

  //   return 0;
  // });

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <SwipeableDrawer
      sx={{
        display: { xs: "flex", md: "none" },
        height: "auto",
      }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <div className="h-auto w-72 bg-gray-800  flex flex-col">
        <div className="min-h-screen  w-full flex flex-col">
          <div className="flex flex-row items-center justify-between p-2 mt-1">
            <div className="flex flex-row items-center ml-4">
              <GiWorld className="w-6 h-6 text-blue-500 mr-1" />
              <h1 className="text-lg text-blue-500">Aniworld</h1>
            </div>
            <div className="">
              <CloseIcon
                className="text-red-500"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="h-full w-full px-6 pb-10 pt-1 mt-6 flex flex-col">
            {user ? (
              <div className="mb-5 px-2">
                <h1 className="text-gray-300">
                  {user.displayName !== null
                    ? `Welcome, ${user.displayName}`
                    : "Welcome, User"}
                </h1>
              </div>
            ) : (
              ""
            )}
            <div className="">
              <div className="cursor-pointer py-4 px-2 flex flex-col border-b border-gray-500">
                <h1
                  className="text-lg text-gray-300"
                  onClick={() => {
                    setOpen(false);
                    navigate("/");
                  }}
                >
                  Home
                </h1>
              </div>
              {user ? (
                <div className="cursor-pointer py-4 px-2 flex flex-col border-b border-gray-500">
                  <h1
                    className="text-lg text-gray-300"
                    onClick={() => {
                      setOpen(false);
                      navigate("/collections");
                    }}
                  >
                    My Collections
                  </h1>
                </div>
              ) : (
                ""
              )}
              {/* <div className="cursor-pointer py-4 px-2 flex flex-col border-b border-gray-500">
                  <h1 className="text-lg text-gray-300">Genres</h1>
                  <div className="pl-2 py-2 grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <div key={genre.id}>
                        <h1 className="text-sm text-gray-300">{genre.name}</h1>
                      </div>
                    ))}
                  </div>
                </div> */}
            </div>
            {user ? (
              <div className="mt-10 flex flex-col items-center justify-center">
                <button
                  className="w-3/5 rounded text-white py-2 bg-violet-500"
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                    navigate("/");
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mt-10 flex flex-col items-center justify-center">
                <button
                  className="w-3/5 rounded text-white py-2 bg-violet-500 hover:bg-violet-400"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                >
                  Sign in
                </button>
                <button
                  className="text-blue-500 text-sm mt-2"
                  onClick={() => {
                    setOpen(false);
                    navigate("/register");
                  }}
                >
                  No Account? Sign up here.
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SwipeableDrawer>
  );
};

export default Drawer;
