"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { demoEvents, DemoEvent } from "@/data/demo/cms";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<DemoEvent[]>(demoEvents);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Events &amp; Workshops Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">Manage physical masterclasses and virtual matchmaking mixers.</p>
          </div>
          <Button href="/admin/events/new" variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Create New Event
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full font-sans text-xs text-gray-900 focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Date &amp; Time</th>
                  <th className="p-4">Type / Location</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-[#1a1a1a] max-w-xs truncate">{ev.title}</td>
                    <td className="p-4 text-gray-600">
                      <div>{ev.eventDate}</div>
                      <div className="text-[10px] text-gray-400">{ev.eventTime}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ev.isOnline ? "bg-blue-100 text-blue-800" : "bg-[#7b1d2a]/10 text-[#7b1d2a]"
                      }`}>
                        {ev.isOnline ? "Virtual" : "Physical"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/events/${ev.id}/edit`}
                        className="p-1.5 text-blue-600 hover:text-blue-800 inline-block"
                        title="Edit Event"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        className="p-1.5 text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
