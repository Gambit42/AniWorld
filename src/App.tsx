import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import "./styles/tailwind.css";
import WithoutNav from "./pages/utils/WithoutNav";
import WithNav from "./pages/utils/WithNav";
import Loading from "./pages/utils/Loading";
import PublicRoute from "./pages/routes/PublicRoute";
import PrivateRoute from "./pages/routes/PrivateRoute";
import { ToastContainer } from "react-toastify";

const Home = lazy(() => import("./pages/Home"));
const Anime = lazy(() => import("./pages/AnimeInfo"));
const Collections = lazy(() => import("./pages/Collections"));
const Search = lazy(() => import("./pages/Search"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Error = lazy(() => import("./pages/Error"));

const App: React.FC = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  onAuthStateChanged(auth, (currentUser: any) => {
    if (currentUser) {
      setUser(currentUser);
      setIsLogged(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<WithNav user={user} />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/anime/:id"
            element={
              <Suspense fallback={<Loading />}>
                <Anime user={user} />
              </Suspense>
            }
          />
          <Route
            path="/search/:query"
            element={
              <Suspense fallback={<Loading />}>
                <Search />
              </Suspense>
            }
          />
          <Route element={<PrivateRoute isLogged={isLogged} />}>
            <Route
              path="/collections"
              element={
                <Suspense fallback={<Loading />}>
                  <Collections user={user} />
                </Suspense>
              }
            />
          </Route>

          <Route element={<PublicRoute isLogged={isLogged} />}>
            <Route
              path="/login"
              element={
                <Suspense fallback={<Loading />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/register"
              element={
                <Suspense fallback={<Loading />}>
                  <Register />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <Suspense fallback={<Loading />}>
                <Error />
              </Suspense>
            }
          />
        </Route>
        <Route element={<WithoutNav />}></Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
};

export default App;
