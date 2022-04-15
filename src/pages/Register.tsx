import React, { useState } from "react";
import { useNavigate } from "react-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { RiLock2Line, RiMailLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import GoogleSignIn from "../components/utils/GoogleSignIn";

interface RegisterUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  currentUser?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [input, setInput] = useState<RegisterUser>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetName = e.target.name;
    const targetValue = e.target.value;

    if (targetName === "name") {
      setInput({ ...input, name: targetValue });
    } else if (targetName === "password") {
      setInput({ ...input, password: targetValue });
    } else if (targetName === "confirmPassword") {
      setInput({ ...input, confirmPassword: targetValue });
    } else if (targetName === "email") {
      setInput({ ...input, email: targetValue });
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (
      !input.email ||
      !input.name ||
      !input.password ||
      !input.confirmPassword
    ) {
      setError("Please fill up all the fields.");
      return setTimeout(() => {
        setError("");
      }, 5000);
    }

    if (input.password !== input.confirmPassword) {
      setError("Password fields does not match.");
      return setTimeout(() => {
        setError("");
      }, 5000);
    }

    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password
      );
      updateProfile(user.user, {
        displayName: input.name,
      });
      setDoc(doc(db, "users", user.user.uid), {
        collections: [],
      });
      navigate("/");
    } catch (error: any) {
      switch (error.code) {
        case "auth/weak-password":
          setError("Password must have at least 6 characters.");
          setTimeout(() => {
            setError("");
          }, 5000);

          break;
        case "auth/email-already-in-use":
          setError("Email is already in use.");
          setTimeout(() => {
            setError("");
          }, 5000);
          break;
        default:
          setError("An error has occured. Please try again.");
          setTimeout(() => {
            setError("");
          }, 5000);
      }
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen max-w-screen">
      <div className="w-full sm:py-10 ">
        <div className="min-h-screen sm:max-w-md py-20 sm:py-10 px-6 mx-auto bg-gray-700 sm:rounded-lg sm:h-full sm:min-h-0">
          <div className="max-w-sm pb-10 mx-auto">
            <h1 className="text-2xl text-gray-200 font-bold">Sign Up</h1>
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
            onSubmit={handleRegister}
            className="flex flex-col pb-2 items-center max-w-sm mx-auto"
          >
            <div className="border-b-2 border-blue-300 border-b-violet-500 mb-4 w-full flex flex-row items-center py-1">
              <RiMailLine className="w-5 h-5 mx-2 text-gray-300" />
              <input
                onChange={handleInput}
                placeholder="Email"
                name="email"
                type="email"
                autoComplete="off"
                className=" placeholder:text-gray-400 w-full px-1 py-2 text-sm leading-tight text-gray-300 bg-transparent appearance-none focus:outline-none focus:shadow-outline bg-none"
                value={input.email}
              />
            </div>
            <div className="border-b-2 border-blue-300 border-b-violet-500 mb-4 w-full flex flex-row items-center py-1">
              <FaRegUser className="w-5 h-5 mx-2 text-gray-300" />
              <input
                onChange={handleInput}
                placeholder="Username"
                name="name"
                autoComplete="off"
                type="text"
                className=" placeholder:text-gray-400 w-full px-1 py-2 text-sm leading-tight text-gray-300 bg-transparent appearance-none focus:outline-none focus:shadow-outline bg-none"
                value={input.name}
              />
            </div>
            <div className="border-b-2 border-blue-300 border-b-violet-500 mb-4 w-full flex flex-row items-center py-1">
              <RiLock2Line className="w-5 h-5 mx-2 text-gray-300" />
              <input
                onChange={handleInput}
                placeholder="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                className=" placeholder:text-gray-400 w-full px-1 py-2 text-sm leading-tight text-gray-300 bg-transparent appearance-none focus:outline-none focus:shadow-outline bg-none"
                value={input.password}
              />
            </div>
            <div className="border-b-2 border-blue-300 border-b-violet-500 w-full flex flex-row items-center py-1">
              <RiLock2Line className="w-5 h-5 mx-2 text-gray-300" />
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                onChange={handleInput}
                placeholder="Confirm Password"
                value={input.confirmPassword}
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
                Sign Up
              </button>
            </div>
            <div className="mt-4 w-full flex flex-col items-center">
              <h1
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Have an account? Login here.
              </h1>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
