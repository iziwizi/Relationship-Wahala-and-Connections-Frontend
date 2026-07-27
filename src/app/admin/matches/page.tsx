"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, UserPlus, Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface MemberOption {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  profession: string;
  gender: string;
  compatibility?: number;
}

interface IntroductionRecord {
  id: string;
  requesterId: string;
  targetId: string;
  status: string;
  compatibilityScore: number;
  createdAt: string;
  requester?: { profile?: { firstName: string; lastName: string } };
  target?: { profile?: { firstName: string; lastName: string } };
}

export default function AdminMatchesPage() {
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [candidates, setCandidates] = useState<MemberOption[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [interactions, setInteractions] = useState<IntroductionRecord[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [introducing, setIntroducing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Load all members for the dropdown
  useEffect(() => {
    fetch("/api/admin/matches/members")
      .then((r) => r.json())
      .then((data) => {
        if (data?.members) {
          setMembers(data.members);
          if (data.members.length > 0) setSelectedMemberId(data.members[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingMembers(false));
  }, []);

  // Load candidate matches for selected member
  const loadCandidates = useCallback(() => {
    if (!selectedMemberId) return;
    setLoadingCandidates(true);
    fetch(`/api/admin/matches/candidates?memberId=${selectedMemberId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.candidates) setCandidates(data.candidates);
        if (data?.interactions) setInteractions(data.interactions);
      })
      .catch(() => {})
      .finally(() => setLoadingCandidates(false));
  }, [selectedMemberId]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleIntroduce = async (targetId: string) => {
    if (!selectedMemberId) return;
    setIntroducing(targetId);
    try {
      const res = await fetch("/api/admin/matches/introduce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId: selectedMemberId, targetId }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", data.message || "Introduction created successfully.");
        loadCandidates();
      } else {
        showToast("error", data.error || "Failed to create introduction.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setIntroducing(null);
    }
  };

  const isAlreadyIntroduced = (targetId: string) =>
    interactions.some(
      (i) =>
        (i.requesterId === selectedMemberId && i.targetId === targetId) ||
        (i.targetId === selectedMemberId && i.requesterId === targetId)
    );

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg font-sans text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {toast.msg}
          </div>
        )}

        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Matchmaking Control &amp; Introductions</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Review verified members, manage admin-assisted introductions, and connect compatible profiles.
          </p>
        </div>

        {/* Member Selector */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs font-bold text-gray-600 uppercase">Target Member:</span>
            {loadingMembers ? (
              <Loader2 size={16} className="animate-spin text-[#7b1d2a]" />
            ) : (
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 font-sans text-xs font-bold text-[#7b1d2a] focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.location}, {m.age})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-gray-400 font-medium">Assisted Matchmaking System Active</span>
            <button onClick={loadCandidates} className="p-1.5 text-gray-400 hover:text-[#7b1d2a] transition-colors" title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Interaction Summary */}
        {interactions.length > 0 && (
          <div className="bg-[#fbf5ec] border border-[#c9962c]/30 rounded-xl p-4">
            <p className="font-sans text-xs font-bold text-[#7b1d2a] mb-2">
              Recent Introductions for {selectedMember?.firstName}:
            </p>
            <div className="space-y-1">
              {interactions.slice(0, 5).map((i) => (
                <div key={i.id} className="flex items-center gap-2 text-xs font-sans text-gray-700">
                  <CheckCircle2 size={12} className="text-green-600" />
                  <span>
                    {i.requester?.profile?.firstName || "Member"} ↔{" "}
                    {i.target?.profile?.firstName || "Member"} — {i.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Candidates Grid */}
        {loadingCandidates ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 size={28} className="animate-spin text-[#7b1d2a]" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="font-sans text-sm text-gray-500">No verified opposite-gender members found for introductions.</p>
            <p className="font-sans text-xs text-gray-400 mt-1">Members must be verified before they appear as candidates.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {candidates.map((m) => {
              const isDone = isAlreadyIntroduced(m.id);
              const isLoading = introducing === m.id;

              return (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#7b1d2a] text-white font-sans text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {m.compatibility ?? 85}% Compatibility
                    </span>
                    <span className="text-xs font-sans text-green-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">{m.firstName} {m.lastName}, {m.age}</h3>
                    <p className="font-sans text-xs text-gray-500">{m.profession} · {m.location}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    {isDone ? (
                      <span className="font-sans text-xs font-bold text-green-600 flex items-center gap-1">
                        ✓ Introduction Already Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => handleIntroduce(m.id)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#7b1d2a] text-white font-sans text-xs font-bold py-2 rounded-xl hover:bg-[#5c1520] transition-colors disabled:opacity-60"
                      >
                        {isLoading ? (
                          <><Loader2 size={14} className="animate-spin" /> Sending...</>
                        ) : (
                          <><UserPlus size={14} /> Recommend &amp; Introduce</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
