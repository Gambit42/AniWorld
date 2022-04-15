import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import { IconButton, Box, Tooltip, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Drawer from "./Drawer";
import { GiWorld } from "react-icons/gi";
import ColoredAvatar from "./utils/ColoredAvatar";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

interface Props {
  user: any;
}
const Navbar = ({ user }: Props) => {
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.reload();
  };
  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSubmit_search = (e: any) => {
    if (e.key === "Enter") {
      navigate(`/search/anime?q=${input.toLowerCase()}&page=1`);
      setInput("");
    }
  };

  return (
    <div className="bg-gray-800 shadow-md font-poppins py-1 min-w-screen border-b border-gray-600">
      <div className="lg:max-w-6xl mx-auto">
        <Toolbar className="w-full flex flex-row justify-between">
          <IconButton
            onClick={() => {
              setOpen(!open);
            }}
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon
              className="text-gray-300"
              sx={{
                display: { xs: "flex", md: "none" },
              }}
            />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              flexDirection: "row",
              alignItems: "end",
              cursor: "pointer",
            }}
          >
            <div className="flex flex-row items-center">
              <GiWorld className="w-6 h-6 text-blue-500 mr-2" />
              <h1 className="text-2xl text-blue-500">Aniworld</h1>
            </div>
            <div className="flex flex-row items-center h-full ml-10">
              <div onClick={() => navigate("/")}>
                <h1 className="text-gray-300 text-xl mr-4">Home</h1>
              </div>
              {user && (
                <div onClick={() => navigate("/collections")}>
                  <h1 className="text-gray-300 text-xl mr-4">My Collections</h1>
                </div>
              )}
              <div>
                <h1 className="text-gray-300 text-xl mr-4">Genres</h1>
              </div>
            </div>
          </Box>
          <div className="flex flex-row">
            <div className="flex flex-row items-center bg-gray-700 rounded p-1">
              <SearchIcon
                className="w-6 h-6 mr-1 text-gray-300 cursor-pointer"
                onClick={() => {
                  if (input !== "") {
                    navigate(`/search/anime?q=${input.toLowerCase()}&page=1`);
                    setInput("");
                  }
                }}
              />
              <input
                className="bg-transparent outline-none w-28 placeholder:text-gray-300 text-gray-200"
                placeholder="Search"
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                value={input}
                onKeyUp={handleSubmit_search}
              />
            </div>
            {user ? (
              <div className="flex flex-row items-center">
                <Tooltip title="Open settings" className="hidden sm:flex">
                  <button onClick={handleOpenUserMenu} className="ml-4">
                    <ColoredAvatar user={user} />
                  </button>
                </Tooltip>
              </div>
            ) : (
              <button
                className="hidden sm:flex ml-4 w-full px-4 py-2 text-sm  text-white bg-violet-500 rounded hover:bg-violet-400 focus:outline-none focus:shadow-outline"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {user ? (
                <MenuItem sx={{ mb: 2 }}>
                  <h1>
                    {user.displayName !== null
                      ? `Hi, ${user.displayName}`
                      : "Welcome, User"}
                  </h1>
                </MenuItem>
              ) : (
                ""
              )}
              <MenuItem
                sx={{ width: 100, margin: "auto" }}
                onClick={() => {
                  handleCloseUserMenu();
                  handleSignOut();
                }}
              >
                <h1 className="text-center">Sign Out</h1>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
        <Drawer open={open} setOpen={setOpen} user={user} />
      </div>
    </div>
  );
};

export default Navbar;
