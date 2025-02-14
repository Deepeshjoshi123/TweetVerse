import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import React from "react";
import { SignUp } from "./pages/auth/signup/SignUp";
import { LogIn } from "./pages/auth/login/LogIn";
import { HomePage } from "./pages/home/HomePage";
import { Sidebar } from "./components/common/SideBar";
import RightPanel from "./components/common/RigntPannel";
import NotificationPage from "./pages/notification/NotificationPages";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const location = useLocation();
  const { isLoading, data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        console.log(data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  // Check if the current route is an auth route (login or signup)
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex max-w-6xl mx-10">
      {authUser && !isAuthRoute && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LogIn /> : <Navigate to="/" />}
        />
        <Route
          path="/notification"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
      {authUser && !isAuthRoute && <RightPanel />}
    </div>
  );
}

export default App;
