"use client";

import Link from "next/link";
import { useLoginViewModel } from "@/features/login/viewmodel/useLoginViewModel";
import Image from "next/image";
import { CircleUserRound, LockKeyhole, Mail, Search } from "lucide-react";

export default function LoginView() {
  const {
    email,
    password,
    rememberMe,
    error,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleRememberMeChange,
    handleSubmit,
  } = useLoginViewModel();

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      {/* Left side */}
      <div className="hidden lg:flex relative w-full bg-linear-to-l from-[#064E2B] to-[#22C55E] overflow-hidden">
        {/* Decoration animation */}
        <div className="absolute -top-50 -right-50 h-150 w-150 rounded-full bg-[radial-gradient(circle,#17A64C,transparent_50%)] animate-pulse" />
        <div className="absolute -bottom-60 -left-80 h-150 w-150 rounded-full bg-[radial-gradient(circle,#52F28E,transparent_50%)] animate-pulse" />

        {/* Contents here */}
        <div className="relative flex flex-col w-full h-full items-center justify-between px-4 py-6">
          <div className="flex w-full p-2 h-auto flex-row items-center gap-2">
            {/* Logo Component */}
            <div className="flex flex-row items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 bg-[#2B684B] rounded-full">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="w-4 h-4 md:w-5 md:h-5"
                />
              </div>
              <span className="text-sm md:text-base font-bold text-white">
                Sound
                <span className="text-sm md:text-base font-bold text-[#7CFFB4]">
                  {" "}
                  Map
                </span>
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col items-center justify-center h-full gap-8 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
            <div>
              {/* Logo Component */}
              <div className="flex flex-col items-center justify-center rounded-full">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={250}
                  height={250}
                  className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64"
                />

                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
                  Sound
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#7CFFB4]">
                    {" "}
                    Map
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 px-4">
              <span className="text-lg md:text-2xl lg:text-3xl font-bold text-white text-center">
                Your world, <span className="text-[#7CFFB4]">mapped by</span>{" "}
                sound.
              </span>

              {/* <span className="text-sm md:text-base lg:text-lg text-white text-center">
                Discover the world through music, one city at a time.
              </span> */}
            </div>
          </div>
        </div>
      </div>
      {/* Right Side  */}
      <div className="w-full h-full lg:h-full flex items-center justify-center bg-white px-4 py-8 md:px-6 lg:px-8">
        {/* container for form */}
        <div className="flex flex-col w-full max-w-sm gap-5">
          <div className="flex flex-col">
            <span className="text-xs md:text-sm text-[#16A34A] font-medium">
              WELCOME BACK
            </span>
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
              Account Login
            </span>
            <span className="text-xs md:text-xs text-[#6A7282] mt-2">
              Don&apos;t have an account?
              <Link
                href="/signup"
                className="text-xs md:text-xs text-[#16A34A] italic underline hover:no-underline ml-1"
              >
                Create account here
              </Link>
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Email input */}
            <div className="flex flex-col gap-2">
              {/* <label htmlFor="email" className="text-sm md:text-sm font-medium">
                Email address
              </label> */}
              <div className="flex flex-row gap-2 bg-[#F1F5F9] p-3 rounded-md">
                <Mail className="w-5 h-5 text-[#6A7282]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Email Address"
                  className="flex-1 text-sm md:text-sm bg-transparent outline-none w-full"
                  disabled={isLoading}
                />
              </div>
            </div>
            {/* Password input */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-row gap-2 bg-[#F1F5F9] p-3 rounded-md">
                <LockKeyhole className="w-5 h-5 text-[#6A7282]" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Password"
                  className="flex-1 text-sm md:text-base bg-transparent outline-none w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-row  w-full">
                {/* <label
                  htmlFor="password"
                  className="text-sm md:text-sm font-medium"
                >
                  Password
                </label> */}
                <Link
                  href="/forgot-password"
                  className="text-xs md:text-xs text-[#16A34A] hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>

          {/* checkbox */}
          <div className=" flex-row gap-2 flex items-center ">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => handleRememberMeChange(e.target.checked)}
              disabled={isLoading}
              className="w-3 h-3 cursor-pointer flex item-center justify-center"
            />
            <label
              htmlFor="remember"
              className="text-xs md:text-sm text-[#4A5565] cursor-pointer"
            >
              Keep me signed in 30 days
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-xs md:text-sm">
              {error}
            </div>
          )}

          {/* Button component */}
          <form onSubmit={handleSubmit} className="w-full my-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md p-3 bg-linear-to-l from-[#16A34A] to-[#059669] text-white text-sm md:text-base font-medium hover:from-[#15803D] hover:to-[#047857] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            {/* Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-300 z-0" />
            <span className="text-xs md:text-sm text-[#6A7282] bg-white z-10 px-2">
              or sign in with
            </span>
          </div>

          <div className="flex flex-col md:flex-row w-full gap-2">
            {/* Google button */}
            <button
              type="button"
              disabled={isLoading}
              className="flex flex-row items-center justify-center gap-2 border border-gray-300 p-2 w-full rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5 text-[#6A7282]" />
              <span className="text-sm md:text-sm">Google</span>
            </button>

            {/* Facebook button */}
            <button
              type="button"
              disabled={isLoading}
              className="flex flex-row items-center justify-center gap-2 border border-gray-300 p-2 w-full rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CircleUserRound className="w-5 h-5 text-[#6A7282]" />
              <span className="text-sm md:text-sm">Facebook</span>
            </button>
          </div>
          <span className="text-xs md:text-sm text-center text-[#6A7282]">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-xs md:text-sm text-[#16A34A] hover:underline"
            >
              Terms &
            </Link>{" "}
            &{" "}
            <Link
              href="/privacy"
              className="text-xs md:text-sm text-[#16A34A] hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
