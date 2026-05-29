"use client";
import React, { useState } from "react";
import { api } from "@/src/lib/api";
import { FiStar, FiSearch, FiAlertTriangle, FiUser } from "react-icons/fi";
import Header from "@/src/components/Header";

// FC Barcelona squad — names match exactly the rows in
// sportify-main/Evaluate Players/Football_Players_Data.csv so the ML
// service finds them. If you add more players to the CSV, add their
// names here too.
const KNOWN_PLAYERS = [
  "Marc-André ter Stegen",
  "Iñaki Peña",
  "Robert Lewandowski",
  "Raphinha",
  "Lamine Yamal",
  "Ferran Torres",
  "Pedri",
  "Gavi",
  "Frenkie de Jong",
  "Ilkay Gündogan",
  "Fermín López",
  "Marc Casadó",
  "Pau Cubarsí",
  "Ronald Araújo",
  "Iñigo Martínez",
  "Andreas Christensen",
  "Jules Koundé",
  "Alejandro Balde",
  "João Cancelo",
  "Héctor Fort",
];

export default function PlayerRating() {
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const name = playerName.trim();
    if (!name) {
      setError("Player name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.ml.ratePlayer(name);
      setResult(res);
    } catch (err) {
      // FastAPI 404 returns { detail: "Player 'X' not found." }
      const isNotFound = err.message?.includes("404") || /not found/i.test(err.message || "");
      const msg = isNotFound
        ? `Player "${name}" not found. Try one of the suggested names (Robert Lewandowski, Pedri, Gavi, ...).`
        : (err.message || "Rating request failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Response shape is unknown beyond what /docs shows; pick the most likely
  // headline number and treat any nested object as the breakdown.
  const ratingRaw =
    result?.rating ?? result?.overall_rating ?? result?.predicted_rating ??
    result?.score  ?? result?.overall ?? null;

  const ratingNum = ratingRaw != null ? Number(ratingRaw) : null;
  const ratingPct = ratingNum != null && !isNaN(ratingNum)
    ? Math.max(0, Math.min(100, ratingNum > 10 ? ratingNum : ratingNum * 10))
    : 0;

  // Anything that's an object inside the response is treated as attribute breakdown.
  const breakdown = result && typeof result === "object"
    ? Object.entries(result).find(([_, v]) => v && typeof v === "object" && !Array.isArray(v))?.[1]
    : null;

  const displayName = result?.player_name || result?.name || playerName;

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
      <Header
        title="Player Rating"
        desc="AI Evaluation Engine"
        icon={<FiStar strokeWidth={2.5} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 card space-y-5">
          <h3 className="text-[11px] font-extrabold uppercase text-emerald-400 tracking-[0.24em]">
            Player Lookup
          </h3>

          <div className="form-group">
            <label>Player Name</label>
            <input
              type="text"
              placeholder="Start typing... e.g. Messi"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              autoFocus
              list="ml-known-players"
            />
            <datalist id="ml-known-players">
              {KNOWN_PLAYERS.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            <p className="text-[10px] text-slate-500 mt-1 tracking-wide">
              Use the exact name from the FIFA training dataset. Suggestions appear as you type.
            </p>
          </div>

          {/* Quick-pick chips */}
          <div className="flex flex-wrap gap-2 -mt-2">
            {["Robert Lewandowski", "Pedri", "Gavi", "Lamine Yamal", "Ronald Araújo", "Marc-André ter Stegen"].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setPlayerName(name)}
                className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-400 transition-all"
              >
                {name}
              </button>
            ))}
          </div>

          {error && (
            <div className="alert-banner alert-danger text-sm">
              <FiAlertTriangle /> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            <FiSearch strokeWidth={2.5} />
            {loading ? "Evaluating..." : "Evaluate Player"}
          </button>
        </form>

        {/* Result panel */}
        <div className="lg:col-span-3 card min-h-[300px]">
          <h3 className="text-[11px] font-extrabold uppercase text-emerald-400 tracking-[0.24em] mb-5">
            Evaluation Result
          </h3>

          {!result && !loading && (
            <div className="empty-state">
              <FiUser className="empty-icon mx-auto" />
              <p className="empty-title">Awaiting Input</p>
              <p className="text-sm">Enter a player name and press <em>Evaluate Player</em>.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-emerald-400 animate-pulse">
                Scoring player...
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Headline rating */}
              {ratingNum != null && !isNaN(ratingNum) ? (
                <div className="text-center py-5 px-3 bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 rounded-xl border border-emerald-500/25">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-emerald-400/80 mb-1">
                    {displayName}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500 mb-3">
                    Overall Rating
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <FiStar className="text-amber-400 text-3xl" strokeWidth={2.4} />
                    <span className="text-5xl font-extrabold text-white tracking-tight tabular">
                      {ratingNum.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-4 max-w-sm mx-auto">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${ratingPct}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-slate-400 py-4 border border-slate-800 rounded-xl">
                  Response received — see raw data below.
                </div>
              )}

              {/* Breakdown (if response has a nested attribute object) */}
              {breakdown && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-[0.24em]">
                    Attribute Breakdown
                  </h4>
                  {Object.entries(breakdown).map(([key, val]) => {
                    const num = Number(val);
                    const pct = isNaN(num) ? 0 : Math.max(0, Math.min(100, num > 10 ? num : num * 10));
                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-300 tabular tracking-wider">
                            {isNaN(num) ? String(val) : num.toFixed(1)}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Raw response */}
              <details className="text-xs" open={!ratingNum}>
                <summary className="cursor-pointer text-slate-500 hover:text-emerald-300 uppercase tracking-[0.2em] font-bold">
                  Raw response
                </summary>
                <pre className="mt-3 p-4 bg-slate-950/70 border border-slate-800 rounded-lg text-slate-300 overflow-x-auto text-[12px] leading-relaxed">
{JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
