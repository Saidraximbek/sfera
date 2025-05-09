import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoutest from "./components/ProtectedRoutes";

import MainLayout from "./layout/MainLayout";

import { useGlobalContext } from "./hooks/useGlobalContext";
import { useEffect } from "react";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";

import Login from "./pages/Login";
function App() {
  const { user, dispatch, isAuthReady } = useGlobalContext();

  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutest user={user}>
          <MainLayout />
        </ProtectedRoutest>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
      }
      dispatch({ type: "AUTH_READY" });
    });

    return () => unsubscribe();
  }, []);

  return <>{isAuthReady && <RouterProvider router={routes} />}</>;
}

export default App;
