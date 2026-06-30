"use client";

import {
  ArrowRight,
  AudioWaveform,
  Check,
  MapPin,
  Search,
  UserRound,
} from "lucide-react";
import { useOnboardingViewModel } from "@/features/onboarding/viewmodel/useOnboardingViewModel";
import Image from "next/image";
export default function OnboardingView() {
  const {
    step,
    location,
    displayName,
    isLocationStep,
    canContinue,
    handleLocationChange,
    handleDisplayNameChange,
    handleSubmit,
  } = useOnboardingViewModel();

  const title = isLocationStep
    ? "Where are you from?"
    : "What should I call you?";
  const description = isLocationStep
    ? "Help us curate sounds, artists, and local music that truly resonates with you."
    : "Choose the name SoundMap should use around your dashboard.";
  const placeholder = isLocationStep
    ? "Search your city..."
    : "Enter your name...";
  const inputValue = isLocationStep ? location : displayName;
  const StepIcon = isLocationStep ? Search : UserRound;
  const stepNumber = isLocationStep ? "1" : "2";

  return (
    <main className="min-h-screen w-full bg-[#F3FBF8] px-4 py-5 text-[#111827]">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-3xl flex-col items-center">
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <div className="flex items-center gap-1 text-[#16A34A]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B7F3D2]">
              <Check className="h-2.5 w-2.5" />
            </span>
            <span>Account</span>
          </div>
          <div className="h-px w-5 bg-[#D7E4DF]" />
          <div className="flex items-center gap-1 text-[#16A34A]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A] text-[9px] text-white">
              2
            </span>
            <span>Location</span>
          </div>
          <div className="h-px w-5 bg-[#D7E4DF]" />
          <div
            className={`flex items-center gap-1 ${
              step === "name" ? "text-[#16A34A]" : "text-[#C4CBD5]"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                step === "name" ? "bg-[#16A34A] text-white" : "bg-[#E5E7EB]"
              }`}
            >
              3
            </span>
            <span>Preference</span>
          </div>
        </div>

        <section className="flex w-full flex-1 flex-col items-center justify-center pb-16">
          <div className="mb-12 flex items-center gap-2">
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
              <span className="text-sm md:text-base font-bold text-[#2B684B]">
                Sound
                <span className="text-sm md:text-base font-bold text-[#2B684B]">
                  {" "}
                  Map
                </span>
              </span>
            </div>
          </div>

          <div className="mb-5 flex items-center gap-3 text-[10px] font-extrabold tracking-wide text-[#22C55E]">
            <div className="h-px w-8 bg-[#86EFAC]" />
            <span>STEP {stepNumber} OF 2</span>
            <div className="h-px w-8 bg-[#86EFAC]" />
          </div>

          {/* Conditional Rendering based on the text  */}
          {/* Note: Not optimized for now  */}
          {title === "What should I call you?" && (
            <h1 className="text-center text-3xl font-extrabold leading-tight md:text-[52px]">
              {title}
            </h1>
          )}

          {title === "Where are you from?" && (
            <h1 className="text-center text-3xl font-extrabold leading-tight md:text-[55px]">
              {title}
            </h1>
          )}
          <p className="mt-5 max-w-md text-center text-sm font-medium leading-6 text-[#8A94A6] md:text-base">
            {description}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 flex w-full max-w-xl flex-col items-center gap-7"
          >
            <label
              htmlFor={isLocationStep ? "location" : "displayName"}
              className="sr-only"
            >
              {title}
            </label>
            <div className="flex w-full items-center gap-3 rounded-2xl border border-[#DDE7E4] bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <StepIcon className="h-5 w-5 text-[#AAB4C3]" />
              <input
                id={isLocationStep ? "location" : "displayName"}
                type="text"
                value={inputValue}
                onChange={(event) =>
                  isLocationStep
                    ? handleLocationChange(event.target.value)
                    : handleDisplayNameChange(event.target.value)
                }
                placeholder={placeholder}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:text-[#AAB4C3]"
              />
              {isLocationStep ? (
                <MapPin className="h-5 w-5 text-[#CBD5E1]" />
              ) : (
                <UserRound className="h-5 w-5 text-[#CBD5E1]" />
              )}
            </div>

            <button
              type="submit"
              disabled={!canContinue}
              className="flex h-14 min-w-40 items-center justify-center gap-2 rounded-2xl bg-[#8FDDBB] px-8 text-sm font-extrabold text-white transition-colors hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:bg-[#BFEBD9]"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-10 flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full ${
                isLocationStep ? "bg-[#C7F3DF]" : "bg-[#16A34A]"
              }`}
            />
            <span
              className={`h-2 rounded-full ${
                isLocationStep ? "w-9 bg-[#16A34A]" : "w-2 bg-[#C7F3DF]"
              }`}
            />
            <span
              className={`h-2 w-2 rounded-full ${
                isLocationStep ? "bg-[#DDE7E4]" : "bg-[#16A34A]"
              }`}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
