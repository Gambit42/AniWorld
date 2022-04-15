import React from "react";
import Google from "../../images/google.png";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, signInWithGoogle } from "../../config/firebase";

const GoogleSignIn = () => {
  const navigate = useNavigate();
  const handleContinueWithGoogle = async (e: any) => {
    e.preventDefault();
    try {
      const user = await signInWithGoogle();
      const userCollectionRef = doc(db, "users", user.user.uid);
      console.log(user);
      console.log(user.user);

      getDoc(userCollectionRef)
        .then((result) => {
          //If the result exist, the collection will stay as it is
          if (result.exists()) {
            console.log("wont be overwritten!");
          } // If it doesn't exist we put a collection with a document ID of the user
          else {
            updateProfile(user.user, {
              displayName: "Unnamed User",
            });
            setDoc(doc(db, "users", user.user.uid), {
              collections: [],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="max-w-sm mx-auto flex flex-row justify-center items-center p-2 rounded bg-white cursor-pointer hover:bg-gray-50"
      onClick={handleContinueWithGoogle}
    >
      <img src={Google} alt="google" className="h-6 mr-2" />
      <h1 className="font-md">Continue with Google</h1>
    </div>
  );
};

export default GoogleSignIn;
