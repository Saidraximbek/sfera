import { useContext } from "react";
import { AuthContext } from "../context/GlobalContext";

export const useGlobalContext = () => useContext(AuthContext);
