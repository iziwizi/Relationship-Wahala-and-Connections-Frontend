"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import {
  ArrowRight, ArrowLeft, Eye, EyeOff,
  CheckCircle2, Upload, Sparkles
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
  photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
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

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { login } = useAuth();
  const router = useRouter();

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
      if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login("demo@relationshipwahala.com", "Demo@123");
    router.push("/dashboard");
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
        <p className="font-sans text-xs text-gray-600 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#7b1d2a] hover:underline">
            Sign In
          </Link>
        </p>
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
                  onClick={() => { if (isDone) setCurrentStep(stepNum); }}
                  className={`flex flex-col items-center gap-1 group text-left ${isDone ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isCurrent
                        ? "bg-[#7b1d2a] text-white ring-4 ring-[#7b1d2a]/20"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isDone ? "✓" : stepNum}
                  </div>
                  <span className={`font-sans text-[10px] hidden md:block ${isCurrent ? "text-[#7b1d2a] font-bold" : "text-gray-400"}`}>
                    {s}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Form Content */}
        <form onSubmit={currentStep === steps.length ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {/* STEP 1: Account */}
          {currentStep === 1 && (
            <div className="space-y-5">
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
                  placeholder="daniel@example.com"
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
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className={inputClass("confirmPassword")}
                  />
                  {errors.confirmPassword && <p className="font-sans text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.termsAgreed}
                  onChange={(e) => updateField("termsAgreed", e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#7b1d2a] border-gray-300 rounded"
                />
                <label htmlFor="terms" className="font-sans text-xs text-gray-600 leading-relaxed">
                  I agree to the <Link href="/terms" className="text-[#7b1d2a] font-semibold underline">Terms of Use</Link> and <Link href="/privacy" className="text-[#7b1d2a] font-semibold underline">Privacy Policy</Link>. My data remains 100% confidential.
                </label>
              </div>
              {errors.termsAgreed && <p className="font-sans text-xs text-red-600 mt-1">{errors.termsAgreed}</p>}
            </div>
          )}

          {/* STEP 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Basic Information</h2>
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
                    <option value="">Select Status</option>
                    <option value="Single (Never Married)">Single (Never Married)</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
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
                  <label className={labelClass}>Current Country</label>
                  <input
                    type="text"
                    value={formData.currentCountry}
                    onChange={(e) => updateField("currentCountry", e.target.value)}
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label className={labelClass}>Current City / State *</label>
                  <input
                    type="text"
                    value={formData.currentStateCity}
                    onChange={(e) => updateField("currentStateCity", e.target.value)}
                    placeholder="e.g. Lekki, Lagos"
                    className={inputClass("currentStateCity")}
                  />
                  {errors.currentStateCity && <p className="font-sans text-xs text-red-600 mt-1">{errors.currentStateCity}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Background */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Education & Professional Background</h2>
              <div>
                <label className={labelClass}>Highest Level of Education *</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => updateField("educationLevel", e.target.value)}
                  className={inputClass("educationLevel")}
                >
                  <option value="">Select Education Level</option>
                  <option value="Secondary School">Secondary School</option>
                  <option value="Diploma / OND / HND">Diploma / OND / HND</option>
                  <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                  <option value="Master's Degree">Master&apos;s Degree</option>
                  <option value="Doctorate / PhD">Doctorate / PhD</option>
                  <option value="Professional Qualification">Professional Qualification</option>
                </select>
                {errors.educationLevel && <p className="font-sans text-xs text-red-600 mt-1">{errors.educationLevel}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Profession / Occupation *</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => updateField("profession", e.target.value)}
                    placeholder="e.g. Technology Consultant"
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
                    <option value="Full-Time Employed">Full-Time Employed</option>
                    <option value="Self-Employed / Business Owner">Self-Employed / Business Owner</option>
                    <option value="Contract / Freelance">Contract / Freelance</option>
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
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Lifestyle & Expectations</h2>
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

          {/* STEP 7: Photos */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Profile Photography</h2>
              <p className="font-sans text-xs text-gray-500">
                Please upload clear, recent photographs of yourself. Photos are shown only to verified matches.
              </p>

              <div className="border-2 border-dashed border-[#e8e0d4] rounded-2xl p-8 text-center bg-[#fbf5ec]/40 hover:bg-[#fbf5ec] transition-colors">
                <div className="w-16 h-16 bg-[#7b1d2a]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-[#7b1d2a]" />
                </div>
                <p className="font-serif font-bold text-[#1a1a1a] text-sm">Upload Profile Photo</p>
                <p className="font-sans text-xs text-gray-500 mt-1 mb-4">PNG, JPG or WEBP up to 5MB</p>
                <button
                  type="button"
                  className="bg-[#7b1d2a] text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#5c1520] transition-colors"
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Review & Submit */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">Review Your Profile</h2>
              <div className="bg-[#fbf5ec] border border-[#e8e0d4] rounded-xl p-5 space-y-4 text-sm font-sans text-gray-800">
                <div>
                  <span className="font-bold text-[#7b1d2a]">Name:</span> {formData.firstName} {formData.lastName}
                </div>
                <div>
                  <span className="font-bold text-[#7b1d2a]">Email / Phone:</span> {formData.email} · {formData.phone}
                </div>
                <div>
                  <span className="font-bold text-[#7b1d2a]">Location:</span> {formData.currentStateCity}, {formData.currentCountry}
                </div>
                <div>
                  <span className="font-bold text-[#7b1d2a]">Education &amp; Profession:</span> {formData.educationLevel} · {formData.profession}
                </div>
                <div>
                  <span className="font-bold text-[#7b1d2a]">Relationship Goal:</span> {formData.relationshipGoal}
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-xs font-sans">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span>Your profile information is verified and encrypted. Click &quot;Submit Profile&quot; to complete registration and enter your dashboard.</span>
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
              <Button type="submit" variant="gold" size="lg">
                Submit Profile &amp; Enter Portal <Sparkles size={16} />
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
