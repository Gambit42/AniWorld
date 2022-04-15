import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FiTrash } from "react-icons/fi";
import { db } from "../../config/firebase";
import { doc, updateDoc, FieldValue, arrayRemove } from "firebase/firestore";

interface Anime {
  mal_id: number;
  name: string;
  image: string;
}

interface Props {
  anime: Anime;
  user: any;
  handleGetCollections: (values: any) => void;
}
const DeleteModal = ({ handleGetCollections, anime, user }: Props) => {
  const collectionsRef = doc(db, "users", user.uid);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const data = await updateDoc(collectionsRef, {
      collections: arrayRemove({
        name: anime.name,
        image: anime.image,
        mal_id: anime.mal_id,
      }),
    });

    try {
      handleGetCollections(1);
      handleClose();
    } catch (error) {
      handleGetCollections(1);
      handleClose();
    }
  };
  return (
    <div className="w-full flex justify-center">
      <button
        className="transition ease-in-out my-1 cursor-pointer hover:bg-red-400 rounded px-2 w-4/5 flex flex-row items-center justify-center h-8 bg-red-500"
        onClick={handleClickOpen}
      >
        <FiTrash className="w-4 h-4 mr-2 text-white" />
        <h1 className="font-medium text-white">Remove</h1>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        className="font-poppins"
        fullWidth={true}
        maxWidth={"xs"}
      >
        <DialogContent className="flex flex-col py-10 h-50 relative w-full bg-gray-800">
          <div className="py-10">
            <h1 className="text-gray-300 text-center">
              Do you really wisht to remove{" "}
              <span className="font-bold">{anime.name}</span> from your
              collection?
            </h1>
          </div>
          <div className="pb-10 flex flex-row items-center justify-between">
            <button
              className="w-4/5 sm:w-3/5 bg-gray-700 flex flex-row items-center justify-center p-2 rounded mr-5"
              onClick={handleClose}
            >
              <h1 className="text-sm font-bold text-white cursor-pointer">
                No
              </h1>
            </button>
            <button
              className="w-4/5 sm:w-3/5 bg-red-500 flex flex-row items-center justify-center p-2 rounded"
              onClick={handleDelete}
            >
              <h1 className="text-sm font-bold text-white cursor-pointer">
                Yes
              </h1>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteModal;
