import React, { useState } from "react";
import { useNavigate } from "react-router";
import { RiSpyFill, RiLock2Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import GoogleSignIn from "../components/utils/GoogleSignIn";

interface User {
  name: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState<string>("");
  const [input, setInput] = useState<User>({
    name: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === "name") {
      setInput({ ...input, name: targetValue });
    } else if (targetName === "password") {
      setInput({ ...input, password: targetValue });
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        input.name,
        input.password
      );
      navigate("/");
      console.log(user);
    } catch (error: any) {
      console.log(error.code);
      switch (error.code) {
        case "auth/user-not-found":
          setError("User not found.");
          setInput({ name: "", password: "" });
          setTimeout(() => {
            setError("");
          }, 5000);
          break;
        case "auth/wrong-password":
          setError("Invalid credentials.");
          setInput({ ...input, password: "" });
          setTimeout(() => {
            setError("");
          }, 5000);
          break;
        default:
          setError("An error has occured. Please try again.");
          setInput({ name: "", password: "" });
          setTimeout(() => {
            setError("");
          }, 5000);
      }
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen max-w-screen">
      <div className="h-full sm:pt-10">
        <div className="h-screen w-full sm:max-w-md py-20 sm:py-10 px-4 mx-auto bg-gray-700 rounded-lg sm:h-full">
          <div className="max-w-sm pb-10 mx-auto">
            <h1 className="text-2xl text-gray-200 font-bold">Sign In</h1>
          </div>
          <div>
            <GoogleSignIn />
          </div>
          <div className="max-w-sm mx-auto py-5 flex flex-row justify-evenly items-center">
            <div className="border w-full bg-gray-300"></div>
            <h1 className="text-gray-300 text-center px-3 text-lg">Or</h1>
            <div className="border w-full bg-gray-300"></div>
          </div>
          <form
            method="post"
            onSubmit={handleLogin}
            className="flex flex-col pt-5 pb-2 items-center max-w-sm mx-auto"
          >
            <div className="border-b-2 border-blue-300 border-b-violet-500 mb-4 w-full flex flex-row items-center py-1">
              <FaRegUser className="w-5 h-5 mx-2 text-gray-300" />
              <input
                onChange={handleInput}
                placeholder="Username"
                name="name"
                className=" placeholder:text-gray-400 w-full px-1 py-2 text-sm leading-tight text-gray-300 bg-transparent appearance-none focus:outline-none focus:shadow-outline bg-none"
                value={input.name}
              />
            </div>
            <div className="border-b-2 border-blue-300 border-b-violet-500 w-full flex flex-row items-center py-1">
              <RiLock2Line className="w-5 h-5 mx-2 text-gray-300" />
              <input
                name="password"
                type="password"
                onChange={handleInput}
                placeholder="Password"
                value={input.password}
                className=" placeholder:text-gray-400 w-full px-1 py-2 text-sm leading-tight text-gray-300 bg-transparent appearance-none focus:outline-none focus:shadow-outline bg-none"
              />
            </div>
            {error !== "" ? (
              <p className="flex flex-col justify-center rounded mt-3 text-left text-sm text-red-500 w-full pl-6 py-2 bg-gray-800">
                {error}
              </p>
            ) : (
              ""
            )}
            <div className="mt-6 w-full flex flex-col items-center">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-bold text-white bg-violet-500 rounded hover:bg-violet-400 focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
            <div className="mt-4 w-full flex flex-col items-center">
              <h1
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => {
                  navigate("/register");
                }}
              >
                No account? Sign up here.
              </h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
