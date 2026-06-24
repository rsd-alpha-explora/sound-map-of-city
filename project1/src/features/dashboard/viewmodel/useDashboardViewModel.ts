"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  filterPlaces,
  noiseLevels,
  placeTypes,
  soundPlaces,
  type SoundPlace,
  type NoiseLevel,
  type PlaceType,
} from "@/features/dashboard/model/dashboard.model";

const ONBOARDING_STORAGE_KEY = "soundMapOnboardingProfile";
const DEFAULT_PROFILE_NAME = "Profile Name";
const DEFAULT_PROFILE_LOCATION = "Davao City";

function getStoredProfileName() {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE_NAME;
  }

  const storedProfile = localStorage.getItem(ONBOARDING_STORAGE_KEY);

  if (!storedProfile) {
    return DEFAULT_PROFILE_NAME;
  }

  try {
    const parsedProfile = JSON.parse(storedProfile) as { displayName?: string };
    return parsedProfile.displayName?.trim() || DEFAULT_PROFILE_NAME;
  } catch {
    return DEFAULT_PROFILE_NAME;
  }
}

function subscribeToProfileStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
  };
}

function getStoredProfileLocation() {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE_LOCATION;
  }

  const storedProfile = localStorage.getItem(ONBOARDING_STORAGE_KEY);

  if (!storedProfile) {
    return DEFAULT_PROFILE_LOCATION;
  }

  try {
    const parsedProfile = JSON.parse(storedProfile) as { location?: string };
    return parsedProfile.location?.trim() || DEFAULT_PROFILE_LOCATION;
  } catch {
    return DEFAULT_PROFILE_LOCATION;
  }
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function createWaveSamples(decibel: number) {
  const base = clampNumber(decibel, 8, 110);

  return Array.from({ length: 14 }, (_, index) => {
    const lift = index % 2 === 0 ? 8 : 22;
    const variation = (index * 7) % 18;
    return clampNumber(Math.round(base * 0.72 + lift + variation), 8, 110);
  });
}

function createLocationId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${slug || "location"}-${Date.now()}`;
}

export function useDashboardViewModel() {
  const router = useRouter();
  const [places, setPlaces] = useState<SoundPlace[]>(soundPlaces);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<PlaceType | "All types">("All types");
  const [activeNoiseLevel, setActiveNoiseLevel] = useState<NoiseLevel | "all">("all");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const profileName = useSyncExternalStore(
    subscribeToProfileStorage,
    getStoredProfileName,
    () => DEFAULT_PROFILE_NAME,
  );
  const profileLocation = useSyncExternalStore(
    subscribeToProfileStorage,
    getStoredProfileLocation,
    () => DEFAULT_PROFILE_LOCATION,
  );

  const filteredPlaces = useMemo(
    () => filterPlaces(places, activeType, activeNoiseLevel, searchQuery),
    [places, activeType, activeNoiseLevel, searchQuery],
  );

  const selectedPlace = places.find((place) => place.id === selectedPlaceId);

  const handleSelectPlace = (placeId: string) => {
    setSelectedPlaceId(placeId);
  };

  const handleCloseDetails = () => {
    setSelectedPlaceId("");
  };

  const handleToggleProfileMenu = () => {
    setIsProfileMenuOpen((isOpen) => !isOpen);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    router.push("/login");
  };

  const handleOpenLocationForm = () => {
    setIsLocationFormOpen(true);
  };

  const handleCloseLocationForm = () => {
    setIsLocationFormOpen(false);
  };

  const handleOpenReportForm = () => {
    setIsReportFormOpen(true);
  };

  const handleCloseReportForm = () => {
    setIsReportFormOpen(false);
  };

  const handleSubmitLocationForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const type = String(formData.get("type") ?? "Cafe") as PlaceType;
    const address = String(formData.get("address") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const decibel = clampNumber(Number(formData.get("decibel") ?? 0), 0, 120);
    const x = clampNumber(Number(formData.get("x") ?? 50), 0, 100);
    const y = clampNumber(Number(formData.get("y") ?? 50), 0, 100);

    const newPlace: SoundPlace = {
      id: createLocationId(name),
      name,
      type,
      address,
      decibel,
      description,
      coordinates: { x, y },
      waveSamples: createWaveSamples(decibel),
    };

    setPlaces((currentPlaces) => [newPlace, ...currentPlaces]);
    setActiveType("All types");
    setActiveNoiseLevel("all");
    setSearchQuery("");
    setSelectedPlaceId(newPlace.id);
    setIsLocationFormOpen(false);
  };

  const handleSubmitReportForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsReportFormOpen(false);
  };

  return {
    searchQuery,
    activeType,
    activeNoiseLevel,
    places,
    filteredPlaces,
    selectedPlace,
    profileName,
    isProfileMenuOpen,
    isLocationFormOpen,
    isReportFormOpen,
    placeTypes,
    noiseLevels,
    setSearchQuery,
    setActiveType,
    setActiveNoiseLevel,
    handleSelectPlace,
    handleCloseDetails,
    handleToggleProfileMenu,
    handleLogout,
    handleOpenLocationForm,
    handleCloseLocationForm,
    handleOpenReportForm,
    handleCloseReportForm,
    handleSubmitLocationForm,
    handleSubmitReportForm,
    profileLocation,
  };
}
