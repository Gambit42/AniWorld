import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  isLogged: boolean;
}

const PrivateRoute = ({ isLogged }: Props) => {
  return isLogged ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
