import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export const SignUp = () => {
  const [formData, setformData] = useState({
    email: "",
    username: "",
    password: "",
    fullname: "",
  });

  const queryClient = useQueryClient();

  const { isError, isPending, error, mutate } = useMutation({
    mutationFn: async ({ username, password, email, fullname }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, email, fullname }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created Successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setformData({ email: "", username: "", password: "", fullname: "" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex max-w-screen-xl mx-auto h-screen px-10">
      {/* Left Section (Image) */}
      <div className="justify-center lg:flex hidden items-center flex-1">
        <img
          className="lg:w-2/3"
          src="https://ideogram.ai/assets/image/lossless/response/Ym9LYBOESXGHboLuT7bWRg"
          alt="logo"
        />
      </div>

      {/* Right Section (Sign-Up Form) */}
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full max-w-md">
          {/* Twitter Logo */}
          <div className="flex justify-center mb-8">
            <svg
              viewBox="0 0 24 24"
              className="h-12 w-12 text-blue-500"
              fill="currentColor"
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold mb-8 text-center">
            Join Tweetverse Today
          </h1>

          {/* Sign-Up Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="fullname"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="username"
              onChange={handleInputChange}
            />
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="email"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="password"
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
            >
              {isPending ? "Loading..." : "Sign up"}
            </button>
            {isError && <p className="text-red-500 text-l">{error.message}</p>}
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
