import React from "react";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router";

interface Props {
  user: any;
}
const WithNav = ({ user }: Props) => {
  return (
    <>
      <Navbar user={user} />
      <Outlet />
    </>
  );
};

export default WithNav;
