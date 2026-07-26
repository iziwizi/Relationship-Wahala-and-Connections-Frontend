"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { demoUser } from "@/data/demo/user";
import Image from "next/image";
import { CheckCircle2, PencilLine, Camera } from "lucide-react";

const sectionData = [
  {
    title: "Basic Information",
    fields: [
      { label: "Age", value: demoUser.basicInfo.age + " years" },
      { label: "Gender", value: demoUser.basicInfo.gender },
      { label: "Marital Status", value: demoUser.basicInfo.maritalStatus },
      { label: "Genotype", value: demoUser.basicInfo.genotype },
      { label: "Blood Group", value: demoUser.basicInfo.bloodGroup },
      { label: "Height", value: demoUser.basicInfo.height },
      { label: "Religion", value: demoUser.basicInfo.religion },
    ],
  },
  {
    title: "Location",
    fields: [
      { label: "City/Area", value: demoUser.location.city },
      { label: "State", value: demoUser.location.state },
      { label: "Country", value: demoUser.location.country },
      { label: "Relocation", value: demoUser.location.relocationPreference },
    ],
  },
  {
    title: "Education & Career",
    fields: [
      { label: "Education Level", value: demoUser.educationCareer.educationLevel },
      { label: "Field of Study", value: demoUser.educationCareer.fieldOfStudy },
      { label: "Occupation", value: demoUser.educationCareer.occupation },
      { label: "Company", value: demoUser.educationCareer.company },
      { label: "Employment", value: demoUser.educationCareer.employmentStatus },
    ],
  },
  {
    title: "Lifestyle",
    fields: [
      { label: "Diet", value: demoUser.lifestyle.diet },
      { label: "Smoking", value: demoUser.lifestyle.smoking },
      { label: "Drinking", value: demoUser.lifestyle.drinking },
      { label: "Hobbies", value: demoUser.lifestyle.hobbies.join(", ") },
    ],
  },
  {
    title: "Relationship Intentions",
    fields: [
      { label: "Goal", value: demoUser.intentions.relationshipGoal },
      { label: "Timeline", value: demoUser.intentions.timeframeToMarriage },
      { label: "Children", value: demoUser.intentions.childrenIntention },
      { label: "Key Values", value: demoUser.intentions.keyValues.join(", ") },
    ],
  },
];

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">My Profile</h1>
            <p className="font-sans text-sm text-gray-500 mt-1">
              Your private matchmaking profile — visible only to your matched candidates.
            </p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5c1520] transition-colors">
            <PencilLine size={15} />
            Edit Profile
          </button>
        </div>

        {/* Profile Hero Card */}
        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-[#7b1d2a] via-[#9b2535] to-[#5c1520]" />
          <div className="px-6 pb-6 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
                <Image
                  src={user?.avatar || demoUser.avatar}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
                <button
                  className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                  aria-label="Change profile photo"
                >
                  <Camera size={20} className="text-white" />
                </button>
              </div>
              <div className="pb-1 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <CheckCircle2 size={18} className="text-green-500" />
                </div>
                <p className="font-sans text-sm text-gray-500">
                  {demoUser.educationCareer.occupation} · {demoUser.location.city}
                </p>
                <div className="mt-2">
                  <div className="inline-flex items-center gap-1.5 bg-[#7b1d2a]/10 text-[#7b1d2a] font-sans text-xs font-semibold px-3 py-1 rounded-full">
                    <span>Profile {user?.profileCompletion}% Complete</span>
                  </div>
                </div>
              </div>
              <button className="sm:hidden inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5c1520] transition-colors self-start">
                <PencilLine size={15} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">About Me</h3>
            <button className="text-[#7b1d2a] hover:text-[#5c1520]"><PencilLine size={16} /></button>
          </div>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">{demoUser.aboutMe}</p>
        </div>

        {/* Profile Sections */}
        {sectionData.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-base font-bold text-[#1a1a1a]">{section.title}</h3>
              <button className="text-[#7b1d2a] hover:text-[#5c1520]"><PencilLine size={16} /></button>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {section.fields.map(({ label, value }) => (
                <div key={label} className="border-b border-[#f0e8dc] pb-3">
                  <p className="font-sans text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="font-sans text-sm text-[#1a1a1a] font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Photos */}
        <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Photos</h3>
            <button className="inline-flex items-center gap-1.5 text-[#7b1d2a] font-sans text-xs font-semibold hover:text-[#5c1520]">
              <Camera size={14} /> Add Photo
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {demoUser.photos.map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={photo}
                  alt={`Profile photo ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
