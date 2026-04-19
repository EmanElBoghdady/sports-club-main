"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/src/lib/api";
import PlayerCard from "./PlayerCard";
import PlayerFilter from "./PlayerFilter";
import Modal from "./Modal";
import { FaUser } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Card from "./Card";
import Header from "../Header";

// دالة مساعدة لتحديد الرياضة بناءً على المركز (عشان الفلتر يشتغل)
const SPORT_MAP = {
  football: ["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"],
  basketball: ["POINT_GUARD", "SHOOTING_GUARD", "SMALL_FORWARD", "POWER_FORWARD", "CENTER"],
  handball: ["LEFT_WING", "RIGHT_WING", "LEFT_BACK", "RIGHT_BACK", "CENTRE_BACK", "PIVOT"]
};

const getSportFromPosition = (pos) => {
  if (!pos) return "";
  const p = pos.toUpperCase().trim();

  if (SPORT_MAP.football.includes(p)) return "football";
  if (SPORT_MAP.basketball.includes(p)) return "basketball";
  if (SPORT_MAP.handball.includes(p)) return "handball";
  return "";
};

function Players() {
  const sports = ["All Sports", "Football", "Basketball", "Handball"];
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getOuterPlayers();
      const actualData = Array.isArray(res) ? res : (res.content || res.data || []);
      setPlayers(actualData);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load players");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const filteredPlayers = (players || []).filter((p) => {
    const playerName = (p.name || p.firstName || "").toLowerCase();
    const searchTerm = search.toLowerCase();

    // بنجيب الرياضة بناءً على المركز اللي جاي من السيرفر
    const playerSport = getSportFromPosition(p.preferredPosition || p.position);

    const searchMatch = playerName.includes(searchTerm);

    // لو مختارة All Sports عدي الكل، غير كدة قارني باللي راجع من القاموس
    const sportMatch =
      selectedSport === "All Sports" ||
      playerSport === selectedSport.toLowerCase();

    return sportMatch && searchMatch;
  });

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">
      <Header
        title={"Players"}
        desc={"Manage and view all players across sports"}
        buttonTitle={"Add Player"}
        icon={<FaUser className="text-white" />}
        onClick={() => setOpenModal(true)}
      />

      <Modal open={openModal} onClose={() => setOpenModal(false)} onAddPlayer={fetchPlayers} />

      <div className="mt-8 bg-slate-900/50 backdrop-blur-sm px-6 py-4 rounded-2xl flex flex-col lg:flex-row justify-between items-center gap-6 border border-slate-800">
        <div className="flex items-center rounded-xl px-4 py-3 w-full lg:w-1/3 bg-slate-950 border border-slate-800">
          <FaMagnifyingGlass className="text-slate-500 mr-3" />
          <input
            type="search"
            placeholder="Search players..."
            className="bg-transparent outline-none w-full text-xs text-slate-100"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <PlayerFilter sports={sports} selectedSport={selectedSport} setSelectedSport={setSelectedSport} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
        <Card title="Total Players" num={players.length.toString()} icon="👥" />
        <Card title="Football" num={players.filter(p => getSportFromPosition(p.preferredPosition) === "football").length.toString()} icon="⚽" />
        <Card title="Basketball" num={players.filter(p => getSportFromPosition(p.preferredPosition) === "basketball").length.toString()} icon="🏀" />
        <Card title="Handball" num={players.filter(p => getSportFromPosition(p.preferredPosition) === "handball").length.toString()} icon="🤾" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

export default Players;