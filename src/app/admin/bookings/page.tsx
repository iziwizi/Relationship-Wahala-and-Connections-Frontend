"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import {
  Calendar,
  Search,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  User,
  Trash2,
  Edit3,
  Filter,
} from "lucide-react";

interface BookingRecord {
  id: string;
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod?: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  package: { name: string; price: number };
  createdAt: string;
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.bookings)) {
          setBookings(json.bookings);
        }
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionInProgress(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b))
        );
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this physical booking record?")) return;
    setActionInProgress(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search) ||
      b.bookingReference.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ? true : b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Physical Bookings Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">
              View and manage in-person matchmaking consultations and appointment schedules.
            </p>
          </div>
          <button
            onClick={loadBookings}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 rounded-xl font-sans text-xs font-semibold text-gray-600 hover:bg-gray-200"
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name, email, ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter size={14} className="text-gray-400 flex-shrink-0" />
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? "bg-[#7b1d2a] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 font-sans text-xs bg-white rounded-2xl border border-gray-200 flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin text-[#7b1d2a]" />
            Loading physical bookings from PostgreSQL...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-sans text-sm bg-white rounded-2xl border border-gray-200">
            {bookings.length === 0 ? "No physical bookings recorded yet." : "No bookings match your filter."}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Client &amp; Contact</th>
                    <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Package</th>
                    <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Date &amp; Time</th>
                    <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Amount</th>
                    <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-[#1a1a1a] text-sm">{b.customerName}</p>
                        <p className="text-gray-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Mail size={11} className="text-gray-400" />
                          <span>{b.customerEmail}</span>
                        </p>
                        <p className="text-gray-500 text-[11px] flex items-center gap-1">
                          <Phone size={11} className="text-gray-400" />
                          <span>{b.customerPhone}</span>
                        </p>
                        <span className="inline-block mt-1 font-mono text-[10px] text-[#7b1d2a] bg-[#fbf5ec] px-1.5 py-0.5 rounded border border-[#e8e0d4]">
                          {b.bookingReference}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-[#1a1a1a]">{b.package.name}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-gray-800 font-semibold">
                          <Calendar size={13} className="text-[#c9962c]" />
                          <span>{new Date(b.bookingDate).toDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-0.5">
                          <Clock size={13} className="text-gray-400" />
                          <span>{b.bookingTime}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-[#7b1d2a]">{formatNGN(b.amount)}</span>
                        <p className="text-[10px] text-green-700 font-bold uppercase">{b.paymentStatus}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : b.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : b.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {b.status !== "CONFIRMED" && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                              disabled={actionInProgress === b.id}
                              className="px-2.5 py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700 disabled:opacity-50"
                              title="Confirm Appointment"
                            >
                              Confirm
                            </button>
                          )}

                          {b.status !== "COMPLETED" && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                              disabled={actionInProgress === b.id}
                              className="px-2.5 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 disabled:opacity-50"
                              title="Mark Completed"
                            >
                              Complete
                            </button>
                          )}

                          {b.status !== "CANCELLED" && (
                            <button
                              onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                              disabled={actionInProgress === b.id}
                              className="px-2.5 py-1 bg-gray-200 text-gray-700 rounded text-[10px] font-bold hover:bg-gray-300 disabled:opacity-50"
                              title="Cancel Appointment"
                            >
                              Cancel
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            disabled={actionInProgress === b.id}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                            title="Delete Booking"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
