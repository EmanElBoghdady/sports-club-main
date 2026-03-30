"use client";

import { useState } from "react";
import { formations } from "../data/formations";
import { players } from "../data/players";
import { motion } from "framer-motion";

export default function FormationBoard(match) {
  const [formation, setFormation] = useState("4-3-3");
  const positions = formations[formation];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      {/* اختيار الخطة */}
      <select
        value={formation}
        onChange={(e) => setFormation(e.target.value)}
        className="bg-slate-950 border border-slate-800 text-slate-100 px-4 py-2.5 rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold text-sm uppercase tracking-widest cursor-pointer shadow-lg shadow-emerald-950/20"
      >
        <option value="4-3-3">Formation 4-3-3</option>
        <option value="4-4-2">Formation 4-4-2</option>
        <option value="3-5-2">Formation 3-5-2</option>
      </select>

      {/* الملعب */}
      <div
        className="
          relative
          w-full
          max-w-[420px]
          h-[650px]
          mx-auto
          rounded-xl
          overflow-hidden
          border border-slate-600
          bg-cover bg-center
        "
        style={{ backgroundImage: "url('/pitch.png')" }}
      >

        {positions.map((pos, index) => (
          <motion.div
            key={players[index].id}
            drag
            dragMomentum={false}
            layout
            initial={{ scale: 0 }}
            animate={{ scale: 1, top: pos.top, left: pos.left }}
            transition={{ duration: 0.5 }}
            style={{ position: "absolute" }}
            className="
              w-[55px]
              h-[65px]
              rounded-lg
             
              flex flex-col items-center justify-center
              cursor-grab
              -translate-x-1/2 -translate-y-1/2
              hover:scale-110
              transition
            "
          >
            <img
              src={players[index].image}
              alt={players[index].name}
              className="w-14 rounded-full border border-gray-300  shadow-lg"
            />

            <p className="text-[10px] text-white font-black text-center leading-tight bg-slate-950/80 px-2 py-1 rounded border border-slate-800 backdrop-blur-sm mt-1">
              {players[index].name}
            </p>

            <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest mt-0.5 bg-slate-950/80 px-1 rounded">
              {players[index].position}
            </span>
          </motion.div>
        ))}

      </div>
    </div>
  );
}