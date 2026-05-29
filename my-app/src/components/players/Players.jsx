"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/src/lib/api";
import PlayerCard from "./PlayerCard";
import PlayerFilter from "./PlayerFilter";
import Modal from "./Modal";
import { FiUser, FiSearch } from "react-icons/fi";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FcSportsMode } from "react-icons/fc";
import { MdOutlineAssessment } from "react-icons/md";
import Card from "./Card";
import Header from "../Header";
import {
  FilterTabs,
  FormModal,
  Toast,
  EmptyState,
  StatusBadge,
} from "@/src/components/shared/SharedComponents";

// Mirrors backend Position enum. Football and Handball share visual names
// (LEFT_WING, LEFT_BACK, GOALKEEPER, …) — Handball is HB_ prefixed.
const SPORT_MAP = {
  football: [
    "GOALKEEPER", "RIGHT_BACK", "LEFT_BACK", "CENTER_BACK",
    "DEFENSIVE_MID", "CENTRAL_MID", "ATTACKING_MID",
    "RIGHT_WING", "LEFT_WING", "STRIKER",
  ],
  basketball: [
    "POINT_GUARD", "SHOOTING_GUARD", "SMALL_FORWARD", "POWER_FORWARD", "CENTER",
  ],
  handball: [
    "HB_GOALKEEPER", "HB_LEFT_WING", "HB_RIGHT_WING",
    "HB_LEFT_BACK", "HB_RIGHT_BACK", "HB_CENTRE_BACK", "HB_PIVOT",
  ],
  volleyball: [
    "SETTER", "OUTSIDE_HITTER", "OPPOSITE_HITTER", "MIDDLE_BLOCKER",
    "LIBERO", "DEFENSIVE_SPECIALIST",
  ],
  tennis: ["SINGLES_PLAYER", "DOUBLES_PLAYER"],
  swimming: [
    "FREESTYLE_SWIMMER", "BACKSTROKE_SWIMMER", "BREASTSTROKE_SWIMMER",
    "BUTTERFLY_SWIMMER", "MEDLEY_SWIMMER",
  ],
};

// Normalise any sport string (FOOTBALL, "Bàsquet", "Handbol", …) to one of
// our canonical keys.
const normaliseSport = (raw) => {
  const s = String(raw || "").toLowerCase().trim();
  if (!s) return "";
  if (s.includes("foot") || s.includes("soccer")) return "football";
  if (s.includes("basket") || s.includes("basquet") || s.includes("bàsquet")) return "basketball";
  if (s.includes("hand")) return "handball";
  if (s.includes("volley") || s.includes("voleibol")) return "volleyball";
  if (s.includes("tennis") || s.includes("tenis")) return "tennis";
  if (s.includes("swim") || s.includes("natac")) return "swimming";
  return "";
};

// Detect a player's sport. Prefers an explicit sport field on the response
// if available; falls back to position-based detection. The HB_ prefix on
// handball positions is treated as the source of truth — that is what
// prevents the Football filter from leaking Handball players whose
// non-prefixed positions (LEFT_WING, LEFT_BACK, GOALKEEPER, …) would
// otherwise collide with the Football list.
const getSportFromPlayer = (player) => {
  if (!player) return "";

  // 1. Prefer an explicit sport field on the player payload.
  const explicit =
    player.sportName ||
    player.teamSport ||
    player.team?.sportName ||
    player.team?.sport?.name ||
    player.sport?.name ||
    (typeof player.sport === "string" ? player.sport : "");
  const fromExplicit = normaliseSport(explicit);
  if (fromExplicit) return fromExplicit;

  // 2. Fall back to position-based detection.
  const posRaw = player.preferredPosition || player.position;
  if (!posRaw) return "";
  const posStr = typeof posRaw === "object"
    ? (posRaw.name || posRaw.value || "")
    : posRaw;
  const p = String(posStr).toUpperCase().trim();

  // Handball is unambiguous via the HB_ prefix.
  if (p.startsWith("HB_")) return "handball";
  // Swimming positions all end with _SWIMMER.
  if (p.endsWith("_SWIMMER")) return "swimming";

  if (SPORT_MAP.basketball.includes(p)) return "basketball";
  if (SPORT_MAP.volleyball.includes(p)) return "volleyball";
  if (SPORT_MAP.tennis.includes(p)) return "tennis";
  // Football last so it doesn't claim shared names belonging to other
  // sports detected above.
  if (SPORT_MAP.football.includes(p)) return "football";

  return "";
};

const trainingAssessmentFields = [
  {
    key: "trainingSessionId",
    label: "Session ID",
    type: "number",
    required: true,
  },
  { key: "playerId", label: "Player ID", type: "number", required: true },
  {
    key: "assessedByCoachId",
    label: "Coach ID",
    type: "number",
    required: true,
  },
  {
    key: "condition",
    label: "Condition",
    type: "select",
    options: ["EXCELLENT", "GOOD", "FAIR", "POOR", "INJURED"],
  },
  { key: "performanceRating", label: "Performance (1-10)", type: "number" },
  { key: "effortRating", label: "Effort (1-10)", type: "number" },
  { key: "attitudeRating", label: "Attitude (1-10)", type: "number" },
  { key: "strengths", label: "Strengths", full: true },
  { key: "areasForImprovement", label: "Areas for Improvement", full: true },
  { key: "coachComments", label: "Coach Comments", full: true },
];

const matchStatsFields = [
  { key: "matchId", label: "Match ID", type: "number", required: true },
  { key: "playerId", label: "Player ID", type: "number", required: true },
  {
    key: "sportType",
    label: "Sport Type",
    type: "select",
    options: ["FOOTBALL", "BASKETBALL", "HANDBALL", "VOLLEYBALL", "TENNIS"],
  },
  { key: "minutesPlayed", label: "Minutes Played", type: "number" },
  { key: "performanceRating", label: "Rating (1-10)", type: "number" },
  { key: "goals", label: "Goals (Football)", type: "number" },
  { key: "assists", label: "Assists", type: "number" },
  { key: "yellowCards", label: "Yellow Cards", type: "number" },
  { key: "redCards", label: "Red Cards", type: "number" },
  { key: "points", label: "Points (Basketball)", type: "number" },
  { key: "rebounds", label: "Rebounds", type: "number" },
  { key: "goalsHandball", label: "Goals (Handball)", type: "number" },
  { key: "saves", label: "Saves (Goalkeeper)", type: "number" },
];

const playerFields = [
  { key: "firstName", label: "First Name", required: true },
  { key: "lastName", label: "Last Name", required: true },
  { key: "nationality", label: "Nationality" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  {
    key: "preferredPosition",
    label: "Position",
    type: "select",
    options: [
      "GOALKEEPER",
      "DEFENDER",
      "MIDFIELDER",
      "FORWARD",
      "POINT_GUARD",
      "SHOOTING_GUARD",
      "SMALL_FORWARD",
      "POWER_FORWARD",
      "CENTER",
      "LEFT_WING",
      "RIGHT_WING",
      "LEFT_BACK",
      "RIGHT_BACK",
      "CENTRE_BACK",
      "PIVOT",
    ],
  },
  { key: "height", label: "Height (cm)", type: "number" },
  { key: "weight", label: "Weight (kg)", type: "number" },
  {
    key: "foot",
    label: "Preferred Foot",
    type: "select",
    options: ["LEFT", "RIGHT", "BOTH"],
  },
  { key: "kitNumber", label: "Kit Number", type: "number" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: ["AVAILABLE", "INJURED", "ABSENT", "SUSPENDED"],
  },
];

function Players() {
  const [tab, setTab] = useState("directory");
  const [userRole, setUserRole] = useState("");

  const sports = ["All Sports", "Football", "Basketball", "Handball"];
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [search, setSearch] = useState("");

  const [openPlayerModal, setOpenPlayerModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState(null);

  const [data, setData] = useState({
    directory: [],
    stats: [],
    assessments: [],
  });
  const [loading, setLoading] = useState(true);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (tab === "directory") res = await api.getPlayers();
      else if (tab === "stats") res = await api.getPlayerMatchStatistics();
      else if (tab === "assessments")
        res = await api.getPlayerTrainingAssessments();

      const actualData = Array.isArray(res)
        ? res
        : res?.content || res?.data || [];
      setData((prev) => ({ ...prev, [tab]: actualData }));
    } catch (err) {
      console.error(`Fetch Error [${tab}]:`, err);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    const savedRole = localStorage.getItem("user_role");
    setUserRole(savedRole ? savedRole.toLowerCase() : "fan");
    loadData();
  }, [loadData]);

  const isAdmin = userRole === "admin";

  const filteredPlayers = (data.directory || []).filter((p) => {
    const playerName = (p.name || p.firstName || "").toLowerCase();
    const searchTerm = search.toLowerCase();
    const playerSport = getSportFromPlayer(p);
    const searchMatch = playerName.includes(searchTerm);
    const sportMatch =
      selectedSport === "All Sports" ||
      playerSport === selectedSport.toLowerCase();
    return sportMatch && searchMatch;
  });

  const handleSaveGeneric = async (form) => {
    try {
      let payload = { ...form };

      // Cast numbers
      const numberKeys = [
        "height",
        "weight",
        "kitNumber",
        "trainingSessionId",
        "playerId",
        "assessedByCoachId",
        "performanceRating",
        "effortRating",
        "attitudeRating",
        "matchId",
        "minutesPlayed",
        "goals",
        "assists",
        "yellowCards",
        "redCards",
        "points",
        "rebounds",
        "goalsHandball",
        "saves",
      ];
      numberKeys.forEach((k) => {
        if (
          payload[k] !== undefined &&
          payload[k] !== "" &&
          payload[k] !== null
        ) {
          payload[k] = Number(payload[k]);
        } else if (payload[k] === "" || payload[k] === null) {
          delete payload[k];
        }
      });

      let response;
      if (tab === "directory") {
        if (editItem) {
          response = await api.updateOuterPlayer(editItem.id, payload);
        }
      } else if (tab === "stats") {
        response = editItem
          ? await api.updatePlayerMatchStatistic(editItem.id, payload)
          : await api.createPlayerMatchStatistic(payload);
      } else if (tab === "assessments") {
        response = editItem
          ? await api.updatePlayerTrainingAssessment(editItem.id, payload)
          : await api.createPlayerTrainingAssessment(payload);
      }

      showToast(editItem ? "Updated successfully" : "Added successfully");
      setOpenFormModal(false);
      setEditItem(null);
      loadData();
    } catch (err) {
      console.error("Save Error:", err);
      showToast(err.message || "Failed to save data", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      if (tab === "stats") await api.deletePlayerMatchStatistic(id);
      else if (tab === "assessments")
        await api.deletePlayerTrainingAssessment(id);

      showToast("Deleted successfully");
      loadData();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const tabsConfig = [
    ["directory", "👥 Directory"],
    [
      "stats",
      <span className="inline-flex items-center gap-1.5">
        <FcSportsMode size={14} /> Match Stats
      </span>,
    ],
    [
      "assessments",
      <span className="inline-flex items-center gap-1.5">
        <MdOutlineAssessment size={14} /> Training Assessments
      </span>,
    ],
  ];

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
      <Header
        title={"Player Hub"}
        desc={"View detailed player profiles and match statistics"}
        // إخفاء زر الإضافة لو كان المستخدم Fan
        buttonTitle={
          isAdmin
            ? tab === "directory"
              ? "Add Player"
              : `Add ${tab === "stats" ? "Stat" : "Assessment"}`
            : null
        }
        icon={<FiUser className="text-white" strokeWidth={2.4} />}
        onClick={() => {
          if (!isAdmin) return; // حماية إضافية
          if (tab === "directory") setOpenPlayerModal(true);
          else {
            setEditItem(null);
            setOpenFormModal(true);
          }
        }}
      />

      <FilterTabs tabs={tabsConfig} active={tab} onSelect={setTab} />

      {/* Modal الإضافة مش هيفتح أصلاً للـ Fan لأن الزرار مخفي، لكن للزيادة: */}
      {isAdmin && (
        <Modal
          open={openPlayerModal}
          onClose={() => setOpenPlayerModal(false)}
          onAddPlayer={loadData}
        />
      )}

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-black italic mt-8 animate-pulse">
          LOADING DATA...
        </div>
      ) : (
        <div className="mt-6">
          {tab === "directory" && (
            <>
              {/* ... كود البحث والـ Filter (يظهر للكل عادي) ... */}
              <div className="bg-slate-900/50 backdrop-blur-sm px-6 py-4 rounded-2xl flex flex-col lg:flex-row justify-between items-center gap-6 border border-slate-800">
                <div className="flex items-center rounded-xl px-4 py-3 w-full lg:w-1/3 bg-slate-950 border border-slate-800">
                  <FiSearch className="text-slate-500 mr-3" strokeWidth={2.2} />
                  <input
                    type="search"
                    placeholder="Search stars..."
                    className="bg-transparent outline-none w-full text-xs text-slate-100"
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

              {/* الـ Cards الإحصائية (تظهر للكل) */}
              {/* الإحصائيات العلوية - تظهر للجميع */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
                {/* إجمالي اللاعبين */}
                <Card
                  title={isAdmin ? "Total Players" : "Club Stars"}
                  num={data.directory.length.toString()}
                  icon={<FiUser className="text-emerald-500" strokeWidth={2.4} />}
                />

                {/* لاعبي كرة القدم */}
                <Card
                  title="Football Squad"
                  num={data.directory
                    .filter((p) => getSportFromPlayer(p) === "football")
                    .length.toString()}
                  icon="⚽"
                />

                {/* لاعبي كرة السلة */}
                <Card
                  title="Basketball Team"
                  num={data.directory
                    .filter((p) => getSportFromPlayer(p) === "basketball")
                    .length.toString()}
                  icon="🏀"
                />

                {/* لاعبي كرة اليد */}
                <Card
                  title="Handball Giants"
                  num={data.directory
                    .filter((p) => getSportFromPlayer(p) === "handball")
                    .length.toString()}
                  icon="🤾"
                />
              </div>

              {filteredPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                  {filteredPlayers.map((player) => (
                    <PlayerCard
                      key={player.id}
                      player={player}
                      // تمرير isAdmin للـ PlayerCard عشان تخفي زر التعديل جواها
                      isAdmin={isAdmin}
                      onEdit={(p) => {
                        if (isAdmin) {
                          setEditItem(p);
                          setOpenFormModal(true);
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState icon="👥" title="No players found" />
              )}
            </>
          )}

          {/* جداول الـ Stats و الـ Assessments */}
          {(tab === "stats" || tab === "assessments") && (
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800">
                    {/* إخفاء عمود Actions للـ Fan */}
                    {[
                      "ID",
                      "Player",
                      tab === "stats" ? "Sport" : "Coach",
                      "Rating",
                      "Performance",
                      isAdmin ? "Actions" : null,
                    ]
                      .filter(Boolean)
                      .map((h) => (
                        <th
                          key={h}
                          className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest"
                        >
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {(tab === "stats" ? data.stats : data.assessments).map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-900 hover:bg-white/[0.02] transition-all"
                      >
                        <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                          #{item.matchId || item.trainingSessionId}
                        </td>
                        <td className="px-6 py-4 text-slate-100 font-mono text-sm">
                          #{item.playerId}
                        </td>
                        <td className="px-6 py-4">
                          {tab === "stats" ? (
                            <StatusBadge status={item.sportType} />
                          ) : (
                            <span className="text-slate-400 font-mono">
                              #{item.assessedByCoachId}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-400 font-black text-lg">
                            {item.performanceRating || 0}
                          </span>
                          <span className="text-[10px] text-slate-600 font-bold ml-1">
                            / 10
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs italic">
                          {tab === "stats"
                            ? `${item.goals ? `⚽ ${item.goals} ` : ""} ${item.points ? `🏀 ${item.points}` : ""}`
                            : `Effort: ${item.effortRating}/10`}
                        </td>

                        {/* إخفاء أزرار التعديل والحذف نهائياً للـ Fan */}
                        {isAdmin && (
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setEditItem(item);
                                  setOpenFormModal(true);
                                }}
                                className="text-slate-500 hover:text-emerald-500 transition-colors"
                              >
                                <AiFillEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-slate-500 hover:text-rose-500 transition-colors"
                              >
                                <RiDeleteBin6Line size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* منع ظهور فورم الإدخال تماماً للـ Fan حتى لو حاول يخمن الرابط */}
      {openFormModal && isAdmin && (
        <FormModal
          title={editItem ? "Update Records" : "New Entry"}
          fields={
            tab === "directory"
              ? playerFields
              : tab === "stats"
                ? matchStatsFields
                : trainingAssessmentFields
          }
          onSubmit={handleSaveGeneric}
          onClose={() => {
            setOpenFormModal(false);
            setEditItem(null);
          }}
          initialData={editItem || {}}
        />
      )}

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Players;
