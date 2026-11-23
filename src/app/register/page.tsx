"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  ArrowRight, ArrowLeft, Eye, EyeOff,
  CheckCircle2, Upload, Sparkles, AlertCircle, Loader2, X, RefreshCw, Camera
} from "lucide-react";

interface RegisterFormData {
  // Step 1: Account
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAgreed: boolean;

  // Step 2: Basic Info
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  stateOfOrigin: string;
  currentCountry: string;
  currentStateCity: string;

  // Step 3: Background
  educationLevel: string;
  profession: string;
  employmentStatus: string;
  religion: string;

  // Step 4: Lifestyle
  smoking: string;
  drinking: string;
  hasChildren: string;
  wantsChildren: string;
  lifestyleDescription: string;

  // Step 5: About You
  aboutMe: string;
  myValues: string;
  interestsHobbies: string;
  whatImLookingFor: string;
  relationshipGoal: string;

  // Step 6: Preferences
  prefAgeMin: string;
  prefAgeMax: string;
  prefLocation: string;
  prefEducation: string;
  prefGoal: string;
  prefRelocation: string;

  // Step 7: Photos
  photoUrl: string;
}

const initialFormData: RegisterFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  termsAgreed: false,
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  nationality: "Nigerian",
  stateOfOrigin: "",
  currentCountry: "Nigeria",
  currentStateCity: "",
  educationLevel: "",
  profession: "",
  employmentStatus: "",
  religion: "Christian",
  smoking: "Never",
  drinking: "Socially",
  hasChildren: "No",
  wantsChildren: "Yes (2-3 children)",
  lifestyleDescription: "",
  aboutMe: "",
  myValues: "Honesty, Faith, Communication, Mutual Respect",
  interestsHobbies: "Reading, Travel, Fitness, Music",
  whatImLookingFor: "An intentional, family-oriented partner with shared values.",
  relationshipGoal: "Marriage within 1-2 years",
  prefAgeMin: "25",
  prefAgeMax: "38",
  prefLocation: "Lagos",
  prefEducation: "Bachelor's Degree",
  prefGoal: "Marriage within 1-2 years",
  prefRelocation: "Open to relocation",
  photoUrl: "",
};

const steps = [
  "Account",
  "Basic Info",
  "Background",
  "Lifestyle",
  "About You",
  "Preferences",
  "Photos",
  "Review & Submit",
];

const STORAGE_KEY = "rwc_registration_draft_v2";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [isHydrated, setIsHydrated] = useState(false);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Photo upload states
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  // 1. Hydrate saved registration progress from storage on initial mount
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        let restoredData: Partial<RegisterFormData> | null = null;
        if (parsed.formData && typeof parsed.formData === "object") {
          restoredData = parsed.formData;
          setFormData((prev) => ({ ...prev, ...parsed.formData }));
          if (parsed.formData.photoUrl) {
            setPreviewPhotoUrl(parsed.formData.photoUrl);
          }
        }
        // Read URL query parameter step first (?step=X), otherwise fall back to saved step
        const urlParams = new URLSearchParams(window.location.search);
        const stepParam = urlParams.get("step");
        const parsedStep = stepParam ? parseInt(stepParam, 10) : parsed.currentStep;

        // Safety guard: if Step 1 required info is missing, do not jump ahead to Step 8 or later
        const hasStep1Data = Boolean(restoredData?.firstName?.trim() && restoredData?.email?.trim());
        if (parsedStep && parsedStep > 1 && !hasStep1Data) {
          setCurrentStep(1);
          const url = new URL(window.location.href);
          url.searchParams.set("step", "1");
          window.history.replaceState({ step: 1 }, "", url.toString());
        } else if (parsedStep && parsedStep >= 1 && parsedStep <= steps.length) {
          setCurrentStep(parsedStep);
        }
      } else {
        // No saved draft: always start at Step 1
        setCurrentStep(1);
        const urlParams = new URLSearchParams(window.location.search);
        const stepParam = urlParams.get("step");
        if (stepParam && stepParam !== "1") {
          const url = new URL(window.location.href);
          url.searchParams.set("step", "1");
          window.history.replaceState({ step: 1 }, "", url.toString());
        }
      }
    } catch (e) {
      console.warn("Could not restore registration progress:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist state on change to prevent data loss on refresh or navigation
  // CRITICAL: Must not write to storage before initial hydration has completed!
  useEffect(() => {
    if (!isHydrated) return;

    try {
      // Ensure photoUrl in storage is never an oversized base64 string that exceeds quota
      const dataToSave = { ...formData };
      if (dataToSave.photoUrl && dataToSave.photoUrl.startsWith("data:") && dataToSave.photoUrl.length > 200000) {
        dataToSave.photoUrl = "";
      }
      const payload = JSON.stringify({ formData: dataToSave, currentStep });
      sessionStorage.setItem(STORAGE_KEY, payload);
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (e) {
      console.warn("Could not save registration draft:", e);
    }
  }, [formData, currentStep, isHydrated]);

  // 3. Handle Browser Back Button / History navigation
  // Ensures hardware/browser Back moves backwards through steps 8 -> 7 -> 6 ... -> 1
  // rather than unmounting the page and losing filled progress
  useEffect(() => {
    if (!isHydrated) return;

    // Push current step into history state if not already there
    const url = new URL(window.location.href);
    url.searchParams.set("step", currentStep.toString());
    window.history.replaceState({ step: currentStep }, "", url.toString());

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.step === "number") {
        setCurrentStep(event.state.step);
      } else {
        // Fallback: decrement if > 1
        setCurrentStep((prev) => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep, isHydrated]);

  const updateField = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) errs.firstName = "First name is required";
      if (!formData.lastName.trim()) errs.lastName = "Last name is required";
      if (!formData.email.trim()) errs.email = "Email address is required";
      if (!formData.phone.trim()) errs.phone = "Phone number is required";
      if (!formData.password) errs.password = "Password is required";
      else if (formData.password.length < 8) errs.password = "Password must be at least 8 characters";
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
      if (!formData.termsAgreed) errs.termsAgreed = "You must agree to the Terms of Use and Privacy Policy";
    }

    if (step === 2) {
      if (!formData.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
      if (!formData.gender) errs.gender = "Gender selection is required";
      if (!formData.maritalStatus) errs.maritalStatus = "Marital status is required";
      if (!formData.currentStateCity.trim()) errs.currentStateCity = "Current City/State is required";
    }

    if (step === 3) {
      if (!formData.educationLevel) errs.educationLevel = "Education level is required";
      if (!formData.profession.trim()) errs.profession = "Profession is required";
    }

    if (step === 5) {
      if (!formData.aboutMe.trim()) errs.aboutMe = "Please write a brief summary about yourself";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToStep = (nextStep: number) => {
    const target = Math.min(Math.max(nextStep, 1), steps.length);
    const url = new URL(window.location.href);
    url.searchParams.set("step", target.toString());
    window.history.pushState({ step: target }, "", url.toString());
    setCurrentStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleResetForm = () => {
    if (confirm("Are you sure you want to clear your filled information and start over?")) {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      setFormData(initialFormData);
      setPreviewPhotoUrl("");
      setCurrentStep(1);
      setErrors({});
      setSubmitError(null);
      const url = new URL(window.location.href);
      url.searchParams.delete("step");
      window.history.replaceState({ step: 1 }, "", url.toString());
    }
  };

  // 4. File picker & Upload Logic
  const handleFileProcess = useCallback(async (file: File) => {
    setPhotoUploadError(null);

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setPhotoUploadError("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoUploadError("Image size must be less than 5MB.");
      return;
    }

    // Immediate local object URL for preview without blowing localStorage quota
    const localBlobUrl = URL.createObjectURL(file);
    setPreviewPhotoUrl(localBlobUrl);
    setUploadingPhoto(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("bucket", "profile-photos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        updateField("photoUrl", data.url);
        setPreviewPhotoUrl(data.url);
      } else {
        setPhotoUploadError(data.error || "Failed to upload photo to storage. Please try again.");
      }
    } catch (err) {
      console.error("Upload request failed:", err);
      setPhotoUploadError("Network connection error while uploading photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // Reset input so selecting the same file again triggers onChange
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  // 5. Submit Registration to Database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Final validation
    if (!validateStep(1)) {
      goToStep(1);
      return;
    }
    if (!validateStep(2)) {
      goToStep(2);
      return;
    }
    if (!validateStep(3)) {
      goToStep(3);
      return;
    }
    if (!validateStep(5)) {
      goToStep(5);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Clear saved registration draft upon successful submission
        sessionStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY);

        // Redirect to member dashboard
        window.location.assign("/dashboard");
      } else {
        setSubmitError(data.error || "Registration failed. Please check your information and try again.");
        if (data.error?.toLowerCase().includes("email")) {
          goToStep(1);
        }
      }
    } catch {
      setSubmitError("Network connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field?: keyof RegisterFormData) =>
    `block w-full px-3.5 py-3 border rounded-xl font-sans text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#7b1d2a] focus:border-transparent ${
      field && errors[field] ? "border-red-500 bg-red-50/20" : "border-gray-300"
    }`;

  const labelClass = "block font-sans text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-[#fbf5ec] py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Logo */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12">
            <Image src="/images/logo.jpeg" alt="Logo" fill className="object-contain rounded-sm" priority />
          </div>
          <div className="text-left">
            <p className="font-serif font-bold text-[#7b1d2a] text-sm leading-tight">RELATIONSHIP WAHALA</p>
            <p className="font-serif font-bold text-[#7b1d2a] text-sm leading-tight">&amp; CONNECTIONS</p>
            <p className="font-sans text-[9px] text-[#c9962c] tracking-widest uppercase font-semibold">Where Love Meets Wisdom</p>
          </div>
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Join Our Intentional Community</h1>
        <p className="font-sans text-xs sm:text-sm text-gray-600 mt-1">Start your guided journey to a meaningful marriage.</p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <p className="font-sans text-xs text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#7b1d2a] hover:underline">
              Sign In
            </Link>
          </p>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleResetForm}
            className="font-sans text-xs text-gray-500 hover:text-red-600 inline-flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={11} /> Clear Draft
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto bg-white border border-[#e8e0d4] rounded-2xl shadow-xl p-6 sm:p-10">
        {/* Progress Bar & Steps Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-sans font-semibold text-[#7b1d2a] uppercase tracking-wider mb-2">
            <span>Step {currentStep} of {steps.length}: {steps[currentStep - 1]}</span>
            <span>{Math.round((currentStep / steps.length) * 100)}% Completed</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#7b1d2a] to-[#c9962c] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>

          {/* Desktop Steps Dots */}
          <div className="hidden sm:flex justify-between items-center mt-4">
            {steps.map((s, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => { if (isDone) goToStep(stepNum); }}
                  className={`flex flex-col items-center gap-1 group text-left ${isDone ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-[#7b1d2a] text-white ring-4 ring-[#7b1d2a]/20"
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : stepNum}
                  </div>
                  <span
                    className={`text-[10px] font-sans font-medium hidden md:block max-w-[65px] text-center truncate ${
                      isCurrent ? "text-[#7b1d2a] font-bold" : "text-gray-500"
                    }`}
                  >
                    {s}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs sm:text-sm font-sans">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Registration Alert</p>
              <p>{submitError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Account */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Account Credentials</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="e.g. Daniel"
                    className={inputClass("firstName")}
                  />
                  {errors.firstName && <p className="font-sans text-xs text-red-600 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="e.g. Okonkwo"
                    className={inputClass("lastName")}
                  />
                  {errors.lastName && <p className="font-sans text-xs text-red-600 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="name@example.com"
                  className={inputClass("email")}
                />
                {errors.email && <p className="font-sans text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="08066689080"
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="font-sans text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="••••••••"
                      className={inputClass("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="font-sans text-xs text-red-600 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className={labelClass}>Confirm Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className={inputClass("confirmPassword")}
                  />
                  {errors.confirmPassword && <p className="font-sans text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <label className="flex items-start gap-2 pt-2 cursor-pointer font-sans text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={formData.termsAgreed}
                  onChange={(e) => updateField("termsAgreed", e.target.checked)}
                  className="mt-0.5 rounded text-[#7b1d2a] focus:ring-[#7b1d2a]"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="text-[#7b1d2a] underline font-medium">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" target="_blank" className="text-[#7b1d2a] underline font-medium">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.termsAgreed && <p className="font-sans text-xs text-red-600">{errors.termsAgreed}</p>}
            </div>
          )}

          {/* STEP 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Personal Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className={inputClass("dateOfBirth")}
                  />
                  {errors.dateOfBirth && <p className="font-sans text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className={labelClass}>Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    className={inputClass("gender")}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && <p className="font-sans text-xs text-red-600 mt-1">{errors.gender}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Marital Status *</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => updateField("maritalStatus", e.target.value)}
                    className={inputClass("maritalStatus")}
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single (Never Married)">Single (Never Married)</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Annulled">Annulled</option>
                  </select>
                  {errors.maritalStatus && <p className="font-sans text-xs text-red-600 mt-1">{errors.maritalStatus}</p>}
                </div>
                <div>
                  <label className={labelClass}>Nationality</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => updateField("nationality", e.target.value)}
                    className={inputClass()}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Current City / State *</label>
                  <input
                    type="text"
                    placeholder="e.g. Ikeja, Lagos"
                    value={formData.currentStateCity}
                    onChange={(e) => updateField("currentStateCity", e.target.value)}
                    className={inputClass("currentStateCity")}
                  />
                  {errors.currentStateCity && <p className="font-sans text-xs text-red-600 mt-1">{errors.currentStateCity}</p>}
                </div>
                <div>
                  <label className={labelClass}>Current Country</label>
                  <input
                    type="text"
                    value={formData.currentCountry}
                    onChange={(e) => updateField("currentCountry", e.target.value)}
                    className={inputClass()}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>State of Origin (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Anambra State"
                  value={formData.stateOfOrigin}
                  onChange={(e) => updateField("stateOfOrigin", e.target.value)}
                  className={inputClass()}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Background */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Educational & Career Background</h2>
              <div>
                <label className={labelClass}>Education Level *</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => updateField("educationLevel", e.target.value)}
                  className={inputClass("educationLevel")}
                >
                  <option value="">Select Highest Level</option>
                  <option value="High School / Secondary">High School / Secondary</option>
                  <option value="Diploma / OND / HND">Diploma / OND / HND</option>
                  <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                  <option value="Master's Degree">Master&apos;s Degree</option>
                  <option value="Doctorate (PhD / DBA)">Doctorate (PhD / DBA)</option>
                  <option value="Professional Certification">Professional Certification</option>
                </select>
                {errors.educationLevel && <p className="font-sans text-xs text-red-600 mt-1">{errors.educationLevel}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Profession / Career *</label>
                  <input
                    type="text"
                    placeholder="e.g. Financial Analyst, Medical Doctor"
                    value={formData.profession}
                    onChange={(e) => updateField("profession", e.target.value)}
                    className={inputClass("profession")}
                  />
                  {errors.profession && <p className="font-sans text-xs text-red-600 mt-1">{errors.profession}</p>}
                </div>
                <div>
                  <label className={labelClass}>Employment Status</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => updateField("employmentStatus", e.target.value)}
                    className={inputClass()}
                  >
                    <option value="">Select Status</option>
                    <option value="Employed Full-time">Employed Full-time</option>
                    <option value="Self-Employed / Business Owner">Self-Employed / Business Owner</option>
                    <option value="Executive / Partner">Executive / Partner</option>
                    <option value="Consultant / Freelancer">Consultant / Freelancer</option>
                    <option value="Civil Servant">Civil Servant</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Religion (Optional Compatibility Field)</label>
                <select
                  value={formData.religion}
                  onChange={(e) => updateField("religion", e.target.value)}
                  className={inputClass()}
                >
                  <option value="Christian">Christian</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Lifestyle */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Lifestyle &amp; Expectations</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Do you smoke?</label>
                  <select value={formData.smoking} onChange={(e) => updateField("smoking", e.target.value)} className={inputClass()}>
                    <option value="Never">Never</option>
                    <option value="Socially">Socially</option>
                    <option value="Regularly">Regularly</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Do you drink alcohol?</label>
                  <select value={formData.drinking} onChange={(e) => updateField("drinking", e.target.value)} className={inputClass()}>
                    <option value="Never">Never</option>
                    <option value="Socially">Socially</option>
                    <option value="Regularly">Regularly</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Do you have children?</label>
                  <select value={formData.hasChildren} onChange={(e) => updateField("hasChildren", e.target.value)} className={inputClass()}>
                    <option value="No">No</option>
                    <option value="Yes (living with me)">Yes (living with me)</option>
                    <option value="Yes (not living with me)">Yes (not living with me)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Do you want children in marriage?</label>
                  <select value={formData.wantsChildren} onChange={(e) => updateField("wantsChildren", e.target.value)} className={inputClass()}>
                    <option value="Yes (2-3 children)">Yes (2-3 children)</option>
                    <option value="Yes (1-2 children)">Yes (1-2 children)</option>
                    <option value="Yes (4+ children)">Yes (4+ children)</option>
                    <option value="Open / Undecided">Open / Undecided</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Brief Lifestyle Description</label>
                <textarea
                  rows={3}
                  value={formData.lifestyleDescription}
                  onChange={(e) => updateField("lifestyleDescription", e.target.value)}
                  placeholder="Describe your hobbies, daily routines, weekend habits..."
                  className={inputClass()}
                />
              </div>
            </div>
          )}

          {/* STEP 5: About You */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">About You &amp; Your Vision</h2>
              <div>
                <label className={labelClass}>About Me *</label>
                <textarea
                  rows={4}
                  value={formData.aboutMe}
                  onChange={(e) => updateField("aboutMe", e.target.value)}
                  placeholder="Share a brief overview of your personality, background, and character..."
                  className={inputClass("aboutMe")}
                />
                {errors.aboutMe && <p className="font-sans text-xs text-red-600 mt-1">{errors.aboutMe}</p>}
              </div>

              <div>
                <label className={labelClass}>My Key Core Values</label>
                <input
                  type="text"
                  value={formData.myValues}
                  onChange={(e) => updateField("myValues", e.target.value)}
                  placeholder="e.g. Faith, Honesty, Mutual Respect, Family"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className={labelClass}>Interests &amp; Hobbies</label>
                <input
                  type="text"
                  value={formData.interestsHobbies}
                  onChange={(e) => updateField("interestsHobbies", e.target.value)}
                  placeholder="e.g. Travel, Reading, Fine Dining, Sports"
                  className={inputClass()}
                />
              </div>

              <div>
                <label className={labelClass}>What I Am Looking For in a Partner</label>
                <textarea
                  rows={3}
                  value={formData.whatImLookingFor}
                  onChange={(e) => updateField("whatImLookingFor", e.target.value)}
                  placeholder="Describe your ideal spouse's qualities, character, and vision..."
                  className={inputClass()}
                />
              </div>
            </div>
          )}

          {/* STEP 6: Preferences */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Ideal Partner Match Preferences</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preferred Minimum Age</label>
                  <input
                    type="number"
                    value={formData.prefAgeMin}
                    onChange={(e) => updateField("prefAgeMin", e.target.value)}
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label className={labelClass}>Preferred Maximum Age</label>
                  <input
                    type="number"
                    value={formData.prefAgeMax}
                    onChange={(e) => updateField("prefAgeMax", e.target.value)}
                    className={inputClass()}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preferred Location</label>
                  <input
                    type="text"
                    value={formData.prefLocation}
                    onChange={(e) => updateField("prefLocation", e.target.value)}
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label className={labelClass}>Relocation Preference</label>
                  <select value={formData.prefRelocation} onChange={(e) => updateField("prefRelocation", e.target.value)} className={inputClass()}>
                    <option value="Open to relocation">Open to relocation</option>
                    <option value="Must reside in Nigeria">Must reside in Nigeria</option>
                    <option value="Diaspora / Global welcome">Diaspora / Global welcome</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Photos — Fully Functional File Picker & Upload */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Profile Photography</h2>
                <p className="font-sans text-xs text-gray-500 mt-1">
                  Please upload clear, recent photographs of yourself. Photos are shown only to verified matches.
                </p>
              </div>

              {photoUploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-sans">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{photoUploadError}</span>
                </div>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {(previewPhotoUrl || formData.photoUrl) ? (
                /* Uploaded Photo Preview Card */
                <div className="border border-green-200 bg-green-50/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-gray-100">
                    <img
                      src={previewPhotoUrl || formData.photoUrl}
                      alt="Uploaded profile photo"
                      className="w-full h-full object-cover object-top"
                    />
                    {uploadingPhoto ? (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs gap-1">
                        <Loader2 size={20} className="animate-spin text-white" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1 shadow">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="font-sans text-xs font-bold text-green-800 uppercase tracking-wider">
                        {uploadingPhoto ? "Uploading Photo..." : "Photo Ready for Profile"}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-gray-600">
                      {uploadingPhoto
                        ? "Uploading securely to cloud storage..."
                        : "Your photo has been attached and will be displayed on your verified matchmaking profile."}
                    </p>
                    <div className="flex items-center gap-3 pt-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#7b1d2a] text-white rounded-lg text-xs font-bold hover:bg-[#5c1520] transition-colors"
                      >
                        <Camera size={14} /> Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateField("photoUrl", "");
                          setPreviewPhotoUrl("");
                        }}
                        disabled={uploadingPhoto}
                        className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors"
                      >
                        <X size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Clickable File Picker Dropzone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                    isDragOver
                      ? "border-[#7b1d2a] bg-[#7b1d2a]/5 scale-[1.01]"
                      : "border-[#e8e0d4] bg-[#fbf5ec]/40 hover:bg-[#fbf5ec] hover:border-[#7b1d2a]/50"
                  }`}
                >
                  <div className="w-16 h-16 bg-[#7b1d2a]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#7b1d2a]">
                    {uploadingPhoto ? <Loader2 size={28} className="animate-spin" /> : <Upload size={28} />}
                  </div>

                  <p className="font-serif font-bold text-[#1a1a1a] text-base mb-1">
                    {uploadingPhoto ? "Processing Photo..." : "Choose or Drag Your Profile Photo"}
                  </p>

                  <p className="font-sans text-xs text-gray-500 mb-5">
                    Click anywhere here to pick from your camera roll or files · PNG, JPG or WEBP up to 5MB
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    disabled={uploadingPhoto}
                    className="bg-[#7b1d2a] text-white font-sans text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#5c1520] transition-colors shadow-sm inline-flex items-center gap-2"
                  >
                    {uploadingPhoto ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Camera size={14} />
                        <span>Browse Files &amp; Photos</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 8: Review & Submit */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Review Your Profile</h2>

              <div className="bg-[#fbf5ec] border border-[#e8e0d4] rounded-2xl p-6 space-y-4 text-sm font-sans text-gray-800">
                {(previewPhotoUrl || formData.photoUrl) && (
                  <div className="flex items-center gap-4 pb-4 border-b border-[#e8e0d4]">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 border border-white shadow-sm flex-shrink-0">
                      <img src={previewPhotoUrl || formData.photoUrl} alt="Review profile" className="w-full h-full object-cover object-top" />
                    </div>
                    <div>
                      <p className="font-bold text-[#1a1a1a]">Profile Photo Attached</p>
                      <p className="text-xs text-gray-500">Framed and ready for confidential matchmaking review.</p>
                    </div>
                  </div>
                )}

                {!formData.firstName.trim() ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800 text-xs">
                    <div>
                      <p className="font-bold">Required account details are missing.</p>
                      <p className="text-amber-700">Please start from Step 1 so your name, email, and password can be properly saved.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="px-3.5 py-2 bg-[#7b1d2a] text-white rounded-lg font-bold hover:bg-[#5c1520] transition-colors whitespace-nowrap self-start sm:self-auto"
                    >
                      Return to Step 1
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-[#7b1d2a] block">Full Name:</span>
                      <span>{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#7b1d2a] block">Email / Phone:</span>
                      <span>{formData.email} {formData.phone ? `· ${formData.phone}` : ""}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#7b1d2a] block">Location:</span>
                      <span>{formData.currentStateCity ? `${formData.currentStateCity}, ${formData.currentCountry}` : formData.currentCountry}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#7b1d2a] block">Education &amp; Profession:</span>
                      <span>{formData.educationLevel || "Not specified"} · {formData.profession || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#7b1d2a] block">Relationship Goal:</span>
                      <span>{formData.relationshipGoal}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#7b1d2a] block">Marital Status &amp; Gender:</span>
                      <span>{formData.maritalStatus || "Not specified"} · {formData.gender || "Not specified"}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-xs font-sans">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span>Your profile data is encrypted and saved. Click &quot;Submit Profile &amp; Enter Portal&quot; to finalize your registration and access your member dashboard.</span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-[#e8e0d4] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-sans text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNext} variant="primary" size="md">
                Next Step <ArrowRight size={16} />
              </Button>
            ) : (
              <Button type="submit" variant="gold" size="lg" disabled={submitting}>
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Submitting...
                  </span>
                ) : (
                  <>
                    Submit Profile &amp; Enter Portal <Sparkles size={16} />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="font-sans text-xs text-gray-600">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-[#7b1d2a] hover:underline">
              Sign in to your member account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
