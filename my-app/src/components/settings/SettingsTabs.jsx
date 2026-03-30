"use client";

import { useState } from "react";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";
import PreferencesTab from "./PreferencesTab";
import NotificationsTab from "./NotificationsTab";


export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("Profile");

  const tabs = ["Profile", "Notifications", "Security", "Preferences"];

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 fade-in">
        <div>
          <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
            Manage your account settings and preferences
          </p>
        </div>
      </div>


      {/* Tabs */}
      <div className="inline-flex bg-slate-900/50 backdrop-blur-sm rounded-xl p-1 border border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300
              ${activeTab === tab
                ? "bg-slate-100 text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === "Profile" && <ProfileTab />}
        {activeTab === "Notifications" && <NotificationsTab />}
        {activeTab === "Security" && <SecurityTab />}
        {activeTab === "Preferences" && <PreferencesTab />}
      </div>
    </div>
  );
}

