"use client";
import { useState, useEffect } from "react";
import { CALLUP_STATUS } from "@/src/data/mockData";
import { api } from "@/src/lib/api";
import {
  FormModal,
  StatusBadge,
  PageHeader,
  AddButton,
  FilterTabs,
  Toast,
  EmptyState,
} from "@/src/components/shared/SharedComponents";

// Backend Position enum (covers football, basketball, handball, volleyball,
// tennis, swimming). Kept here so the dropdown options stay aligned with
// the player-management-service.
const POSITION_OPTIONS = [
  "GOALKEEPER", "RIGHT_BACK", "LEFT_BACK", "CENTER_BACK",
  "DEFENSIVE_MID", "CENTRAL_MID", "ATTACKING_MID",
  "RIGHT_WING", "LEFT_WING", "STRIKER",
  "POINT_GUARD", "SHOOTING_GUARD", "SMALL_FORWARD", "POWER_FORWARD", "CENTER",
  "SINGLES_PLAYER", "DOUBLES_PLAYER",
  "SETTER", "OUTSIDE_HITTER", "OPPOSITE_HITTER",
  "MIDDLE_BLOCKER", "LIBERO", "DEFENSIVE_SPECIALIST",
  "HB_GOALKEEPER", "HB_LEFT_WING", "HB_RIGHT_WING",
  "HB_LEFT_BACK", "HB_RIGHT_BACK", "HB_CENTRE_BACK", "HB_PIVOT",
];

// Form schemas — every field key matches the JSON the back-end actually
// accepts on POST. Earlier versions had keys (name / age / league) that
// don't exist on the entities, so the modal silently created malformed
// rows that the UI then couldn't render.
const callupFields = [
  { key: "playerKeycloakId",       label: "Player Keycloak ID", placeholder: "uuid..." },
  { key: "nationalTeamKeycloakId", label: "National Team ID",   placeholder: "uuid..." },
  { key: "requestDate",            label: "Request Date",       type: "date" },
  { key: "status",                 label: "Status",             type: "select", options: CALLUP_STATUS },
];

const outerPlayerFields = [
  { key: "outerTeamId",        label: "Outer Team ID", type: "number", placeholder: "1 = Real Madrid CF, …" },
  { key: "dateOfBirth",        label: "Date of Birth", type: "date" },
  { key: "nationality",        label: "Nationality",   placeholder: "Spanish" },
  { key: "preferredPosition",  label: "Position",      type: "select", options: POSITION_OPTIONS },
  { key: "marketValue",        label: "Market Value (€)", type: "number" },
  { key: "kitNumber",          label: "Kit Number",    type: "number" },
];

const outerTeamFields = [
  { key: "name",    label: "Team Name", placeholder: "FC Rival" },
  { key: "email",   label: "Contact Email", placeholder: "info@rival.com" },
  { key: "country", label: "Country", placeholder: "Spain" },
];

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return String(iso);
  }
};

const shortId = (uuid) => (uuid ? `${String(uuid).slice(0, 8)}…` : "—");

export default function ScoutingOps() {
  const [tab, setTab] = useState("callups");
  const [data, setData] = useState({ callups: [], players: [], teams: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (tab === "callups") res = await api.getCallups();
      else if (tab === "outer-players") res = await api.getOuterPlayers();
      else res = await api.getOuterTeams();

      const finalData = Array.isArray(res) ? res : (res?.content || res?.data || []);
      setData((prev) => ({
        ...prev,
        [tab === "callups" ? "callups" : tab === "outer-players" ? "players" : "teams"]: finalData,
      }));
    } catch (err) {
      console.error("Scouting fetch failed:", err);
      setToast({ msg: "Server connection failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [tab]);

  const handleSave = async (form) => {
    try {
      let payload = { ...form };

      // Cast numeric fields so Spring doesn't reject strings.
      ["outerTeamId", "marketValue", "kitNumber"].forEach((k) => {
        if (payload[k] !== undefined && payload[k] !== "" && payload[k] !== null) {
          payload[k] = Number(payload[k]);
        } else {
          delete payload[k];
        }
      });

      if (tab === "callups") {
        await api.createCallup(payload);
      } else if (tab === "outer-players") {
        // Server expects an OuterTeam relation, not an outerTeamId column —
        // package it as a nested object so JPA picks the right FK row.
        if (payload.outerTeamId) {
          payload.outerTeam = { id: payload.outerTeamId };
          delete payload.outerTeamId;
        }
        await api.createOuterPlayer(payload);
      } else {
        await api.createOuterTeam(payload);
      }

      setToast({ msg: "Record added to scouting radar" });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error("Scouting save failed:", err);
      setToast({ msg: err.message || "Failed to save record", type: "error" });
    }
  };

  const isEmpty =
    (tab === "callups" && data.callups.length === 0) ||
    (tab === "outer-players" && data.players.length === 0) ||
    (tab === "outer-teams" && data.teams.length === 0);

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto fade-in">
      <PageHeader
        title="Scouting Operations"
        subtitle="National call-ups and talent tracking"
        action={<AddButton label="+ Add Record" onClick={() => setShowModal(true)} />}
      />
      <FilterTabs
        tabs={[
          ["callups",        "🌍 Call-Ups"],
          ["outer-players",  "🔍 Tracked Players"],
          ["outer-teams",    "🏟️ Opponent Teams"],
        ]}
        active={tab}
        onSelect={setTab}
      />

      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 text-center text-slate-500 font-bold animate-pulse">
            Scanning Radar...
          </div>
        ) : isEmpty ? (
          <EmptyState icon="🔭" title="Radar is empty" />
        ) : (
          <div className="overflow-x-auto">
            {/* ── Call-Ups ── */}
            {tab === "callups" && (
              <table className="w-full">
                <thead className="bg-slate-900/20 border-b border-slate-800">
                  <tr>
                    {["Player", "National Team", "Request Date", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.callups.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-300">
                        {shortId(c.playerKeycloakId)}
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-400">
                        {shortId(c.nationalTeamKeycloakId)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                        {formatDate(c.requestDate)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ── Tracked Players ── */}
            {tab === "outer-players" && (
              <table className="w-full">
                <thead className="bg-slate-900/20 border-b border-slate-800">
                  <tr>
                    {["Outer Team", "Position", "Nationality", "DOB", "Market Value", "Kit"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.players.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-200 font-bold">
                        {p.outerTeam?.name || `Team #${p.outerTeam?.id ?? "—"}`}
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-black text-xs uppercase tracking-widest">
                        {p.preferredPosition || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{p.nationality || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{formatDate(p.dateOfBirth)}</td>
                      <td className="px-6 py-4 text-sm text-slate-300 font-mono">
                        {p.marketValue
                          ? `€${Number(p.marketValue).toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                          #{p.kitNumber ?? "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ── Opponent Teams ── */}
            {tab === "outer-teams" && (
              <table className="w-full">
                <thead className="bg-slate-900/20 border-b border-slate-800">
                  <tr>
                    {["Team", "Country", "Contact", "Players Tracked"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.teams.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-slate-900 hover:bg-emerald-500/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-200 font-bold">{t.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{t.country || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono text-xs">
                        {t.email || "—"}
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-black">
                        {Array.isArray(t.outerPlayers) ? t.outerPlayers.length : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <FormModal
          title={`Add New ${tab.replace("-", " ")}`}
          fields={
            tab === "callups"
              ? callupFields
              : tab === "outer-players"
              ? outerPlayerFields
              : outerTeamFields
          }
          onSubmit={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
