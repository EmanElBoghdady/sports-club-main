"use client";
import React, { useCallback, useState, useEffect } from "react";
import { BadgeDollarSign, Calendar, CheckCircle2 } from "lucide-react";
import { api } from "../../lib/api";

const typeColors = {
  KIT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  DIGITAL: "bg-sky-50 text-sky-700 border-sky-200",
  STADIUM: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function SponsorOffers() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Offers");
  const [offers, setOffers] = useState([]);

  const loadOffers = useCallback(async () => {
    try {
      const data = await api.getSponsorOffers();

      const mapped = data.map((o) => ({
        id: o.id,
        sponsorName: o.sponsorName,
        offerTitle: o.title,
        contractValue: o.contractValue,
        status: o.status,
        type: o.type,
        startDate: o.startDate,
        endDate: o.endDate,
      }));

      setOffers(mapped);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const acceptOffer = async (id) => {
    try {
      const offer = offers.find((o) => o.id === id);

      await api.updateSponsorOffer(id, {
        ...offer,
        status: "ACCEPTED",
      });

      await loadOffers(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.sponsorName.toLowerCase().includes(search.toLowerCase()) ||
      offer.offerTitle.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "All Offers" || offer.status === activeTab.toUpperCase();
    return matchesSearch && matchesTab;
  });

  const pendingCount = offers.filter((o) => o.status === "PENDING").length;
  const acceptedCount = offers.filter((o) => o.status === "ACCEPTED").length;
  const totalValue = offers
    .filter((o) => o.status === "ACCEPTED")
    .reduce((s, o) => s + o.contractValue, 0);

  const darkTypeColors = {
    KIT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    DIGITAL: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    STADIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this offer?",
    );
    if (!confirmDelete) return;

    try {
      await deleteSponsorOffer(id);
      setOffers((prev) => prev.filter((offer) => offer.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 fade-in">
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">
              Sponsor Offers
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
              Manage sponsorship contracts and commercial partnerships
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/50 rounded-2xl px-5 py-4 border border-slate-800 shadow-xl min-w-[120px]">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                Total offers
              </p>
              <p className="text-xl font-black text-slate-100 tracking-tight">
                {offers.length}
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-2xl px-5 py-4 border border-slate-800 shadow-xl min-w-[120px]">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                Pending
              </p>
              <p className="text-xl font-black text-amber-500 tracking-tight">
                {pendingCount}
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-2xl px-5 py-4 border border-slate-800 shadow-xl min-w-[120px]">
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                Active value
              </p>
              <p className="text-xl font-black text-emerald-500 tracking-tight">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 mb-10 shadow-2xl">
          <div className="relative w-full md:w-96 group">
            <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
            <input
              type="text"
              placeholder="Search offers or sponsors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-slate-200 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
            />
          </div>

          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50 overflow-x-auto no-scrollbar w-full md:w-auto">
            {["All Offers", "Pending", "Accepted", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${
                    activeTab === tab
                      ? "bg-slate-100 text-slate-950 shadow-lg shadow-white/5"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-all relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">
                    {offer.sponsorName}
                  </p>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                    {offer.offerTitle}
                  </h3>
                </div>
                <div
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-lg ${
                    darkTypeColors[offer.type] ||
                    "bg-slate-500/10 text-slate-400 border-slate-500/20"
                  }`}
                >
                  {offer.type}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 relative z-10 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <Calendar size={14} className="text-emerald-500" />
                  <span>
                    {offer.startDate}{" "}
                    <span className="mx-1 text-slate-800">→</span>{" "}
                    {offer.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest">
                  <BadgeDollarSign size={16} className="text-emerald-500" />
                  <span className="text-emerald-400">
                    ${offer.contractValue.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto relative z-10">
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-inner ${
                    offer.status === "ACCEPTED"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : offer.status === "PENDING"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-slate-800 text-slate-500 border-slate-700"
                  }`}
                >
                  {offer.status}
                </span>

                {offer.status === "PENDING" && (
                  <button
                    onClick={() => acceptOffer(offer.id)}
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                  >
                    <CheckCircle2 size={14} /> Accept Offer
                  </button>
                )}
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
