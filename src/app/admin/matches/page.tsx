"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";
import { demoMatches, MatchProfile } from "@/data/demo/matches";
import { CheckCircle2, UserPlus } from "lucide-react";

export default function AdminMatchesPage() {
  const [matches] = useState<MatchProfile[]>(demoMatches);
  const [selectedMember, setSelectedMember] = useState("Daniel Okonkwo");
  const [introduced, setIntroduced] = useState<string[]>([]);

  const handleIntroduce = (matchId: string) => {
    if (!introduced.includes(matchId)) {
      setIntroduced((prev) => [...prev, matchId]);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Matchmaking Control &amp; Introductions</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Review compatibility scores, manage assisted introductions, and control match recommendations for members.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs font-bold text-gray-600 uppercase">Target Member:</span>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 font-sans text-xs font-bold text-[#7b1d2a] focus:outline-none"
            >
              <option value="Daniel Okonkwo">Daniel Okonkwo (Lagos, 32)</option>
              <option value="Amara Nwosu">Amara Nwosu (Lagos, 29)</option>
              <option value="Zainab Bello">Zainab Bello (Abuja, 28)</option>
            </select>
          </div>
          <span className="font-sans text-xs text-gray-400 font-medium">Assisted Matchmaking System Active</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m) => {
            const isDone = introduced.includes(m.id);

            return (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#7b1d2a] text-white font-sans text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {m.compatibility}% Compatibility
                  </span>
                  <span className="text-xs font-sans text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Candidate
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">{m.firstName}, {m.age}</h3>
                  <p className="font-sans text-xs text-gray-500">{m.profession} · {m.location}</p>
                </div>

                <p className="font-sans text-xs text-gray-600 leading-relaxed line-clamp-2">{m.about}</p>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  {isDone ? (
                    <span className="font-sans text-xs font-bold text-green-600 flex items-center gap-1">
                      ✓ Introduction Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => handleIntroduce(m.id)}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#7b1d2a] text-white font-sans text-xs font-bold py-2 rounded-xl hover:bg-[#5c1520] transition-colors"
                    >
                      <UserPlus size={14} /> Recommend &amp; Introduce
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
