import { useState } from "react";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useGlobalContext } from "./useGlobalContext";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";

export const useLogin = () => {
  const { dispatch } = useGlobalContext();
  const [isPending, setIsPending] = useState(false);

  const login = async (email, password) => {
    try {
      setIsPending(true);
      const req = await signInWithEmailAndPassword(auth, email, password);
      const user = req.user;

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        online: true
      });

      toast.success(`Qaytganing bilan, ${user.displayName || "foydalanuvchi"}`);
      dispatch({ type: "LOGIN", payload: user });
      console.log(user);
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, login };
};
