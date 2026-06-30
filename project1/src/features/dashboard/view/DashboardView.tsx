"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  Building2,
  ChevronDown,
  ClipboardList,
  Coffee,
  Hotel,
  ListFilter,
  LogOut,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Star,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import {
  getNoiseLevel,
  getNoiseLevelMeta,
  type NoiseLevel,
  type PlaceType,
  type SoundPlace,
} from "@/features/dashboard/model/dashboard.model";
import { useDashboardViewModel } from "@/features/dashboard/viewmodel/useDashboardViewModel";

const placeTypeIcons: Record<PlaceType | "All types", typeof ListFilter> = {
  "All types": ListFilter,
  Hotel,
  Cafe: Coffee,
  Apartment: Building2,
};

const pinClasses: Record<NoiseLevel, string> = {
  quiet: "bg-[#16A34A] shadow-[#16A34A]/30",
  moderate: "bg-[#F59E0B] shadow-[#F59E0B]/30",
  "super-noisy": "bg-[#EF4444] shadow-[#EF4444]/30",
};

function WaveBars({
  samples,
  decibel,
  tone = "auto",
}: {
  samples: number[];
  decibel: number;
  tone?: "auto" | "gray";
}) {
  const speed = Math.max(0.45, 1.65 - decibel / 100);
  const scale = Math.max(0.7, decibel / 48);
  const level = getNoiseLevel(decibel);
  const barColorClass =
    tone === "gray"
      ? "bg-[#B8C0CC]"
      : level === "moderate"
        ? "bg-[#F59E0B]"
        : level === "super-noisy"
          ? "bg-[#EF4444]"
          : "bg-[#16A34A]";

  return (
    <div className="flex h-8 items-end gap-1 mt-[20px]" aria-hidden="true">
      {samples.map((sample, index) => (
        <span
          key={`${sample}-${index}`}
          className={`w-2 rounded-full ${barColorClass}`}
          style={{
            height: `${Math.max(6, sample * 0.3)}px`,
            animation: `sound-wave ${speed}s ease-in-out ${index * 0.07}s infinite alternate`,
            transformOrigin: "bottom",
            ["--wave-scale" as string]: scale,
          }}
        />
      ))}
    </div>
  );
}

function PlaceImageTemplate({ type }: { type: PlaceType }) {
  const Icon = placeTypeIcons[type];

  return (
    <div className="relative flex h-24 w-22 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#DDE7E4]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#DDE7E4_0%,#F8FAFC_48%,#BFD8CC_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-[#0F172A]/10" />
      <Icon className="relative h-8 w-8 text-[#6A7282]" />
      <span className="absolute bottom-1 left-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-[#334155]">
        {type}
      </span>
    </div>
  );
}

function PlaceCard({
  place,
  isSelected,
  onSelect,
}: {
  place: SoundPlace;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const noiseMeta = getNoiseLevelMeta(place.decibel);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full gap-3 rounded-2xl border bg-white p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isSelected
          ? "border-[#16A34A] ring-2 ring-[#BBF7D0]"
          : "border-[#E2E8F0]"
      }`}
    >
      <PlaceImageTemplate type={place.type} />

      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold text-[#111827]">
              {place.name}
            </h3>
          </div>
          <span
            className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${noiseMeta.bgClass} ${noiseMeta.colorClass}`}
          >
            {place.decibel} dB
          </span>
        </div>
        <p className="mt-[-2px] flex items-center gap-1 truncate text-[11px] font-medium text-[#94A3B8]">
          <MapPin className="h-3 w-3 shrink-0" />
          {place.address}
        </p>
        <div className="mt-2 overflow-visible">
          <WaveBars
            samples={place.waveSamples}
            decibel={place.decibel}
            tone="gray"
          />
        </div>
      </div>
    </button>
  );
}

function ModalShell({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/45 px-4 py-6">
      <section className="max-h-full w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-[0_30px_80px_rgba(15,23,42,0.32)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E2E8F0] bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#111827]">{title}</h2>
            <p className="mt-1 text-sm font-medium text-[#64748B]">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B] transition hover:text-[#111827]"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </section>
    </div>
  );
}

function FormField({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-[#64748B]">
        {label}
      </span>
      {children}
      {helper ? (
        <span className="mt-1.5 block text-[11px] font-bold leading-4 text-[#94A3B8]">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

const inputClassName =
  "h-11 w-full rounded-xl border border-[#DDE7E4] bg-[#F8FAFC] px-4 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:bg-white";

function SubmitLocationModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [decibelValue, setDecibelValue] = useState(41);
  const [placement, setPlacement] = useState({ x: 50, y: 50 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedType, setSelectedType] = useState<PlaceType>("Cafe");
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [shouldPlaceMarker, setShouldPlaceMarker] = useState(true);
  const dragOriginRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const noiseMeta = getNoiseLevelMeta(decibelValue);

  const handleMapPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOriginRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: panOffset.x,
      offsetY: panOffset.y,
    };
    setIsDraggingMap(true);
    setShouldPlaceMarker(true);
  };

  const handleMapPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingMap) return;

    const deltaX = event.clientX - dragOriginRef.current.x;
    const deltaY = event.clientY - dragOriginRef.current.y;

    setPanOffset({
      x: dragOriginRef.current.offsetX + deltaX,
      y: dragOriginRef.current.offsetY + deltaY,
    });

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      setShouldPlaceMarker(false);
    }
  };

  const handleMapPointerUp = () => {
    setIsDraggingMap(false);
  };

  const handleMapPick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!shouldPlaceMarker) {
      setShouldPlaceMarker(true);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const nextX =
      ((event.clientX - rect.left - panOffset.x) / rect.width) * 100;
    const nextY =
      ((event.clientY - rect.top - panOffset.y) / rect.height) * 100;

    setPlacement({
      x: Math.min(100, Math.max(0, nextX)),
      y: Math.min(100, Math.max(0, nextY)),
    });
  };

  return (
    <ModalShell
      title="Submit a Location"
      description="Fill in the place details and noise information for the map preview."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Location name">
            <input
              name="name"
              className={inputClassName}
              placeholder="Poblacion Heritage Cafe"
              required
            />
          </FormField>
          <FormField label="Place type">
            <select
              name="type"
              className={inputClassName}
              value={selectedType}
              onChange={(event) =>
                setSelectedType(event.target.value as PlaceType)
              }
            >
              <option value="Cafe">Cafe</option>
              <option value="Hotel">Hotel</option>
              <option value="Apartment">Apartment</option>
            </select>
          </FormField>
        </div>

        <FormField label="Address">
          <input
            name="address"
            className={inputClassName}
            placeholder="F. B. Harrison St, Davao City"
            required
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="Average decibel"
            helper="Allowed range: 0 dB minimum to 120 dB maximum. 0-45 quiet, 46-62 moderate, 63+ super noisy."
          >
            <input
              name="decibel"
              className={inputClassName}
              type="number"
              min="0"
              max="120"
              value={decibelValue}
              onChange={(event) => setDecibelValue(Number(event.target.value))}
              required
            />
          </FormField>
          <FormField
            label="Noise level"
            helper="Automatically chosen from the average decibel value."
          >
            <div
              className={`flex h-11 items-center rounded-xl border px-4 text-sm font-extrabold ${noiseMeta.bgClass} ${noiseMeta.borderClass} ${noiseMeta.colorClass}`}
            >
              {noiseMeta.label}
            </div>
          </FormField>
        </div>

        <FormField label="Short description">
          <textarea
            name="description"
            className="min-h-28 w-full resize-none rounded-xl border border-[#DDE7E4] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:bg-white"
            placeholder="Describe the space, best quiet hours, and nearby sources of noise."
            required
          />
        </FormField>

        <FormField
          label="Map position"
          helper="Drag to pan the map, then click to place the location visually."
        >
          <div className="space-y-3">
            <div
              onPointerDown={handleMapPointerDown}
              onPointerMove={handleMapPointerMove}
              onPointerUp={handleMapPointerUp}
              onPointerLeave={handleMapPointerUp}
              onClick={handleMapPick}
              className="relative h-56 overflow-hidden rounded-2xl border border-[#DDE7E4] bg-[#F8FAFC] shadow-inner"
              style={{
                touchAction: "none",
                cursor: isDraggingMap ? "grabbing" : "grab",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                }}
              >
                <Image
                  src="/Map.svg"
                  alt="Map preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 cursor-crosshair" />
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${placement.x}%`, top: `${placement.y}%` }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16A34A] text-white shadow-[0_0_0_8px_rgba(22,163,74,0.18)]">
                  {(() => {
                    const MarkerIcon = placeTypeIcons[selectedType] ?? MapPin;
                    return <MarkerIcon className="h-4 w-4" />;
                  })()}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#DDE7E4] bg-white px-3 py-2 text-xs font-semibold text-[#64748B]">
              <span>Selected position</span>
              <span className="font-extrabold text-[#111827]">
                {Math.round(placement.x)}% × {Math.round(placement.y)}%
              </span>
            </div>
          </div>
          <input type="hidden" name="x" value={placement.x} />
          <input type="hidden" name="y" value={placement.y} />
        </FormField>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-[#DDE7E4] px-5 text-sm font-extrabold text-[#64748B] transition hover:bg-[#F8FAFC]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex h-11 items-center gap-2 rounded-xl bg-[#16A34A] px-5 text-sm font-extrabold text-white transition hover:bg-[#15803D]"
          >
            <Send className="h-4 w-4" />
            Submit Location
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function QuietReportModal({
  place,
  onClose,
  onSubmit,
}: {
  place?: SoundPlace;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <ModalShell
      title="Custom Quiet Space Report"
      description="Share a quick review about the noise experience at this place."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField label="Location">
          <input
            className={inputClassName}
            defaultValue={place?.name ?? ""}
            placeholder="Select or type a location"
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Your rating">
            <select className={inputClassName} defaultValue="4">
              <option value="5">5 - Very quiet</option>
              <option value="4">4 - Good for focus</option>
              <option value="3">3 - Manageable</option>
              <option value="2">2 - Distracting</option>
              <option value="1">1 - Too noisy</option>
            </select>
          </FormField>
          <FormField label="Observed decibel">
            <input
              className={inputClassName}
              type="number"
              min="0"
              max="120"
              defaultValue={place?.decibel}
              placeholder="41"
            />
          </FormField>
        </div>

        <FormField label="Best time to visit">
          <input
            className={inputClassName}
            placeholder="Weekday mornings, around 9 AM"
          />
        </FormField>

        <FormField label="Report details">
          <textarea
            className="min-h-32 w-full resize-none rounded-xl border border-[#DDE7E4] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#94A3B8] focus:border-[#16A34A] focus:bg-white"
            placeholder="Tell others what you heard, where you sat, and whether the space was good for calls, reading, or focused work."
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-[#DDE7E4] px-5 text-sm font-extrabold text-[#64748B] transition hover:bg-[#F8FAFC]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex h-11 items-center gap-2 rounded-xl bg-[#16A34A] px-5 text-sm font-extrabold text-white transition hover:bg-[#15803D]"
          >
            <Star className="h-4 w-4" />
            Submit Report
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function DetailsPanel({
  place,
  onClose,
  onOpenReportForm,
}: {
  place: SoundPlace;
  onClose: () => void;
  onOpenReportForm: () => void;
}) {
  const noiseMeta = getNoiseLevelMeta(place.decibel);

  return (
    <aside className="absolute right-4 top-4 z-20 hidden w-80 overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.24)] lg:block">
      <div className="relative h-40 bg-[#DDE7E4]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#F8FAFC_0%,#DDE7E4_40%,#A7C9B9_100%)]" />
        <div className="absolute inset-0 bg-[#0F172A]/15" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-extrabold text-[#334155]">
          {place.type}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#64748B] shadow-sm transition hover:text-[#111827]"
          aria-label="Close place details"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-lg font-extrabold leading-tight text-white">
            {place.name}
          </h2>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-white/85">
            <MapPin className="h-3 w-3" />
            {place.address}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <p className="text-sm font-medium leading-6 text-[#64748B]">
          {place.description}
        </p>

        <div
          className={`rounded-2xl border p-4 ${noiseMeta.bgClass} ${noiseMeta.borderClass}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#16A34A]">
                <Volume2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#166D45]">
                  Noise Information
                </p>
                <p className="text-[11px] font-bold text-[#64748B]">
                  {noiseMeta.label}
                </p>
              </div>
            </div>
            <p className={`text-2xl font-extrabold ${noiseMeta.colorClass}`}>
              {place.decibel} dB
            </p>
          </div>
          <div className="mt-4">
            <WaveBars samples={place.waveSamples} decibel={place.decibel} />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-[#64748B]">
            <span>Ambient level</span>
            <span className={noiseMeta.colorClass}>{place.decibel} dB avg</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
            <div
              className={`h-full rounded-full ${
                getNoiseLevel(place.decibel) === "quiet"
                  ? "bg-[#16A34A]"
                  : getNoiseLevel(place.decibel) === "moderate"
                    ? "bg-[#F59E0B]"
                    : "bg-[#EF4444]"
              }`}
              style={{ width: `${Math.min(100, place.decibel)}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-bold text-[#CBD5E1]">
            <span>0 dB</span>
            <span>45</span>
            <span>62</span>
            <span>90 dB</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenReportForm}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-[#16A34A] text-sm font-extrabold text-white transition hover:bg-[#15803D]"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Custom Quiet Space Report
        </button>
      </div>
    </aside>
  );
}

export default function DashboardView() {
  const {
    searchQuery,
    activeType,
    activeNoiseLevel,
    filteredPlaces,
    selectedPlace,
    profileName,
    profileLocation,
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
  } = useDashboardViewModel();

  return (
    <main className="h-screen overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <style jsx global>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.55) transparent;
        }

        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.55);
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 116, 139, 0.75);
        }

        @keyframes sound-wave {
          from {
            transform: scaleY(0.55);
          }
          to {
            transform: scaleY(var(--wave-scale));
          }
        }
      `}</style>

      <header className="flex h-14 items-center gap-4 bg-[#075B31] px-4 text-white">
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 md:h-10 md:w-10 bg-[#2B684B] rounded-full">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={20}
              height={20}
              className="w-4 h-4 md:w-5 md:h-5"
            />
          </div>
          <span className="text-sm font-extrabold">SoundMap</span>
        </div>

        <div className="flex h-9 max-w-md flex-1 items-center gap-2 rounded-full bg-white px-4 text-[#64748B]">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={`Search ${profileLocation}...`}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[#94A3B8]"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenLocationForm}
          className="ml-auto hidden h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-extrabold text-[#16A34A] shadow-[0_10px_24px_rgba(22,163,74,0.35)] ring-1 ring-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(22,163,74,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86EFAC] md:flex"
        >
          <Plus className="h-4 w-4" />
          Submit a Location
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={handleToggleProfileMenu}
            className="flex items-center gap-2 rounded-xl px-1 py-1 transition hover:bg-white/10"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#64748B]">
              <UserRound className="h-5 w-5" />
            </div>
            <span className="hidden max-w-36 truncate text-sm font-bold md:inline">
              {profileName}
            </span>
            <ChevronDown className="hidden h-4 w-4 md:block" />
          </button>

          {isProfileMenuOpen ? (
            <div className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-xl bg-white py-2 text-[#111827] shadow-[0_18px_45px_rgba(15,23,42,0.2)]">
              <div className="border-b border-[#E2E8F0] px-4 py-3">
                <p className="text-xs font-bold text-[#94A3B8]">Signed in as</p>
                <p className="truncate text-sm font-extrabold">{profileName}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-extrabold text-[#EF4444] transition hover:bg-[#FFF1F2]"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className=" grid h-[calc(100vh-56px)] grid-cols-1 lg:grid-cols-[180px_380px_minmax(0,1fr)]">
        <aside className="overflow-y-auto border-r border-[#E2E8F0] bg-white p-4 lg:block">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#A1AAB8]">
              Filters
            </p>
            <SlidersHorizontal className="h-4 w-4 text-[#94A3B8]" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-[#64748B]">
              <span>Place Type</span>
            </div>
            <div className="space-y-2">
              {placeTypes.map((type) => {
                const Icon = placeTypeIcons[type];
                const isActive = activeType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveType(type)}
                    className={`flex h-9 w-full items-center gap-2 rounded-lg px-3 text-xs font-extrabold transition ${
                      isActive
                        ? "bg-[#EAFBF1] text-[#16A34A]"
                        : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-[#64748B]">
              <span>Noise Level</span>
            </div>
            <div className="space-y-3">
              {noiseLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() =>
                    setActiveNoiseLevel(
                      activeNoiseLevel === level.id ? "all" : level.id,
                    )
                  }
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    activeNoiseLevel === level.id
                      ? `${level.bgClass} ${level.borderClass}`
                      : "border-transparent bg-[#F8FAFC] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <p className={`text-xs font-extrabold ${level.colorClass}`}>
                    {level.label}
                  </p>
                  <p className="mt-1 text-[10px] font-bold leading-4 text-[#94A3B8]">
                    {level.helper}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className=" overflow-y-auto border-r border-[#E2E8F0] bg-[#F8FAFC] p-4 lg:block">
          <h1 className="text-2xl font-extrabold text-[#111827]">
            Places in {profileLocation}
          </h1>
          <p className="mb-4 text-sm font-bold text-[#94A3B8]">
            {filteredPlaces.length} places found
          </p>
          <div className="space-y-3 ">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSelected={selectedPlace?.id === place.id}
                onSelect={() => handleSelectPlace(place.id)}
              />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden">
          <Image
            src="/Map.svg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) calc(100vw - 500px), 100vw"
            className="object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-white/10" />

          {filteredPlaces.map((place) => {
            const level = getNoiseLevel(place.decibel);

            return (
              <button
                key={place.id}
                type="button"
                onClick={() => handleSelectPlace(place.id)}
                className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_0_0_10px] transition hover:scale-110 ${pinClasses[level]}`}
                style={{
                  left: `${place.coordinates.x}%`,
                  top: `${place.coordinates.y}%`,
                }}
                aria-label={`Show details for ${place.name}`}
              >
                {(() => {
                  const MarkerIcon = placeTypeIcons[place.type] ?? MapPin;
                  return <MarkerIcon className="h-4 w-4" />;
                })()}
              </button>
            );
          })}

          {selectedPlace ? (
            <>
              <DetailsPanel
                place={selectedPlace}
                onClose={handleCloseDetails}
                onOpenReportForm={handleOpenReportForm}
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.24)] lg:hidden">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold text-[#16A34A]">
                      {selectedPlace.type}
                    </p>
                    <h2 className="text-lg font-extrabold">
                      {selectedPlace.name}
                    </h2>
                    <p className="mt-1 text-xs font-bold text-[#64748B]">
                      {selectedPlace.address}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseDetails}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B]"
                    aria-label="Close place details"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#EAFBF1] p-3">
                  <div>
                    <p className="text-xs font-extrabold text-[#166D45]">
                      Noise Information
                    </p>
                    <p className="text-[11px] font-bold text-[#64748B]">
                      {getNoiseLevelMeta(selectedPlace.decibel).label}
                    </p>
                  </div>
                  <p
                    className={`text-xl font-extrabold ${getNoiseLevelMeta(selectedPlace.decibel).colorClass}`}
                  >
                    {selectedPlace.decibel} dB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenReportForm}
                  className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] text-sm font-extrabold text-white"
                >
                  <ClipboardList className="h-4 w-4" />
                  Custom Quiet Space Report
                </button>
              </div>
            </>
          ) : null}
        </section>
      </div>

      {isLocationFormOpen ? (
        <SubmitLocationModal
          onClose={handleCloseLocationForm}
          onSubmit={handleSubmitLocationForm}
        />
      ) : null}

      {isReportFormOpen ? (
        <QuietReportModal
          place={selectedPlace}
          onClose={handleCloseReportForm}
          onSubmit={handleSubmitReportForm}
        />
      ) : null}
    </main>
  );
}
