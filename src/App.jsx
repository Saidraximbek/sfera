import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase/config";
import { useGlobalContext } from "./hooks/useGlobalContext";

import ProtectedRoutest from "./components/ProtectedRoutes";
import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const { user, dispatch, isAuthReady } = useGlobalContext();

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
    dispatch({ type: "AUTH_READY" });
  });

  return () => unsubscribe();
}, [dispatch]);


  if (!isAuthReady) return <div>Loading...</div>;

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
          path: "/home",
          element: <Home />,
        },
      ],
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
