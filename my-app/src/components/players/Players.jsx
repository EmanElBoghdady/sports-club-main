"use client";
import React, { useState, useEffect } from "react";
import Button from "../Button";
import PlayerCard from "./PlayerCard";
import PlayerFilter from "./PlayerFilter";
import Modal from "./Modal";
import { FaUser } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { playersData } from '../../data/playersData'
import Card from "./Card";
import Header from "../Header";
import { AddButton, PageHeader } from "../shared/SharedComponents";

function Players() {
  const sports = ["All Sports", "Football", "Basketball", "Handball"];
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [players, setPlayers] = useState(playersData);




  const filteredPlayers = players.filter((p) => {
    const sportMatch = selectedSport === "All Sports" || p.sport === selectedSport;
    const searchMatch = p.name.toLowerCase().includes(search.toLowerCase());
    return sportMatch && searchMatch;
  });

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto">

      <div className="max-w-7xl m-3">

        <Header
          title={"Players"}
          desc={"Manage and view all players across sports"}
          buttonTitle={"Add Player"}
          icon={<FaUser className="text-white" />}
          onClick={() => setOpenModal(true)} />




      </div>


      <Modal open={openModal}
        onClose={() => setOpenModal(false)} className="z-100" />



      <div className="bg-slate-900/50 backdrop-blur-sm w-full px-6 py-4 rounded-2xl shadow-xl mb-10 flex flex-col lg:flex-row justify-between items-center gap-6 border border-slate-800">
        <div className="flex items-center rounded-xl px-4 py-3 w-full lg:w-1/3 bg-slate-950 border border-slate-800 focus-within:border-emerald-500/50 transition-all group">
          <FaMagnifyingGlass className="text-slate-500 mr-3 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="search"
            placeholder="Search players..."
            className="bg-transparent outline-none w-full text-[10px] font-black uppercase tracking-widest text-slate-100 placeholder:text-slate-600"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        <PlayerFilter
          sports={sports}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card
          title="Total Players"
          num="5"
          icon={<i className="fi fi-rs-user text-xl"></i>} />
        <Card
          title="Fit"
          num="3"
          icon={<span className="material-symbols-outlined text-xl">vital_signs</span>} />

        <Card
          title="Injured"
          num="1"
          icon={<span className="material-symbols-outlined text-xl">vital_signs</span>}
        />
        <Card
          title="Avg Rating"
          num="8.0"
          icon={<span className="material-symbols-outlined text-xl">license</span>} />
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

    </div>

  );
}

export default Players;
