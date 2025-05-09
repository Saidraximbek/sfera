import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useGlobalContext } from "./useGlobalContext";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";

export const useLogin = () => {
  const { dispatch } = useGlobalContext();
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setIsPending(true);

      // Firebase orqali tizimga kirish
      const req = await signInWithEmailAndPassword(auth, email, password);
      const user = req.user;

      console.log("Kirishdan so'ng foydalanuvchi:", user);

      // Firestore hujjatga online statusni yozish
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { online: true }, { merge: true });

      // Contextga yuborish va toast bilan xabar berish
      dispatch({ type: "LOGIN", payload: user });
      toast.success(`Qaytganing bilan, ${user.displayName || "foydalanuvchi"}`);

      // Home sahifaga yo‘naltirish
      navigate("/home");

    } catch (error) {
      toast.error(error.message);
      console.error("Login xatosi:", error.message);
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, login };
};
