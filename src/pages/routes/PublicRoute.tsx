import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  isLogged: boolean;
}
const PublicRoute = ({ isLogged }: Props) => {
  return isLogged ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
