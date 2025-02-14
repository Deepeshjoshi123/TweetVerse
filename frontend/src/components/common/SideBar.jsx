import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const Sidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to logout");
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully Logged out");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login"); // Ensure navigate is called here
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const { data: AuthData } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="w-64 h-screen border-r border-gray-200 sticky top-1 p-4 flex flex-col ">
      {/* Logo */}
      <div className="flex justify-center lg:justify-start mb-8">
        <svg
          viewBox="0 0 24 24"
          className="h-12 w-12 text-blue-500"
          fill="currentColor"
        >
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-lg font-semibold">Home</span>
        </Link>
        <Link
          to="/notification"
          className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="text-lg font-semibold">Notifications</span>
        </Link>
        <Link
          to={`/profile/${AuthData?.username}`}
          className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg
            className="h-6 w-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-lg font-semibold">Profile</span>
        </Link>
      </nav>

      {/* Profile and Log Out Section */}
      {AuthData && (
        <div className="mt-auto">
          <Link
            to={`/profile/${AuthData.username}`}
            className="btn btn-ghost justify-start w-full"
          >
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <img
                  src={AuthData?.profileImg || "/avatar-placeholder.png"}
                  alt="Profile"
                  className="w-full h-full rounded-full"
                />
              </div>
            </div>
            <div className="hidden md:block ml-4">
              <p className="font-semibold text-sm truncate">
                {AuthData?.fullName}
              </p>
              <p className="text-sm text-gray-500">@{AuthData?.username}</p>
            </div>
          </Link>

          {/* Log Out Button */}
          <button
            className="btn btn-ghost justify-start w-full mt-2"
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="ml-4 text-lg font-semibold">Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
