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
import Teachers from "./pages/Teachers";
import Lessons from "./pages/Lessons";
import Students from "./pages/Students";
import Confirm from "./pages/Confirm";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Stil faylini ham qo‘shish zarur
import StudentPage from "./pages/StudentPage";

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
        <ProtectedRoutest>
          <MainLayout />
        </ProtectedRoutest>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="home" />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "/teachers",
          element: <Teachers />,
        },
        {
          path: "/lessons",
          element: <Lessons />,
        },
        {
          path: "/students",
          element: <Students />,
        },
        {
          path: "/confirm",
          element: <Confirm />,
        },
        {
          path: "/student/:id",
          element: <StudentPage />,
        },
      ],
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
