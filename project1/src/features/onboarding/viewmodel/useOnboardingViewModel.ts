"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  hasRequiredValue,
  type OnboardingProfile,
  type OnboardingStep,
} from "@/features/onboarding/model/onboarding.model";

const ONBOARDING_STORAGE_KEY = "soundMapOnboardingProfile";

export function useOnboardingViewModel() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("location");
  const [location, setLocation] = useState("");
  const [displayName, setDisplayName] = useState("");

  const isLocationStep = step === "location";
  const currentValue = isLocationStep ? location : displayName;
  const canContinue = hasRequiredValue(currentValue);

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canContinue) {
      return;
    }

    if (isLocationStep) {
      const profile: OnboardingProfile = {
        location: location.trim(),
        displayName: "",
      };

      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
      setStep("name");
      return;
    }

    const profile: OnboardingProfile = {
      location: location.trim(),
      displayName: displayName.trim(),
    };

    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(profile));
    router.push("/dashboard");
  };

  return {
    step,
    location,
    displayName,
    isLocationStep,
    canContinue,
    handleLocationChange,
    handleDisplayNameChange,
    handleSubmit,
  };
}
