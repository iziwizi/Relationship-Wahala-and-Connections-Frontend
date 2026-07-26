"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Save, X, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { demoFAQs, DemoFAQ } from "@/data/demo/cms";

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<DemoFAQ[]>(demoFAQs);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<DemoFAQ | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [sortOrder, setSortOrder] = useState(1);

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewModal = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setSortOrder(faqs.length + 1);
    setModalOpen(true);
  };

  const openEditModal = (faq: DemoFAQ) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setSortOrder(faq.sortOrder);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      setFaqs(
        faqs.map((f) =>
          f.id === editingFaq.id ? { ...f, question, answer, category, sortOrder } : f
        )
      );
    } else {
      const newFaq: DemoFAQ = {
        id: `faq-${Date.now()}`,
        question,
        answer,
        category,
        sortOrder,
      };
      setFaqs([...faqs, newFaq]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter((f) => f.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">FAQ Manager</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">Manage public frequently asked questions and category ordering.</p>
          </div>
          <Button onClick={openNewModal} variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Add New FAQ
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
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
                  <th className="p-4">Sort</th>
                  <th className="p-4">Question</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-gray-400 font-bold">{faq.sortOrder}</td>
                    <td className="p-4 font-bold text-[#1a1a1a] max-w-md">{faq.question}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 font-semibold px-2.5 py-0.5 rounded-full text-[10px]">
                        {faq.category}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="p-1.5 text-blue-600 hover:text-blue-800"
                        title="Edit FAQ"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-1.5 text-red-500 hover:text-red-700"
                        title="Delete FAQ"
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

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">
                  {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Question</label>
                  <input
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                    >
                      <option>General</option>
                      <option>Matchmaking</option>
                      <option>EPMS</option>
                      <option>Payments</option>
                      <option>Privacy</option>
                      <option>Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Sort Order</label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">Answer</label>
                  <textarea
                    rows={4}
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" size="sm">
                    <Save size={14} /> Save FAQ
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
