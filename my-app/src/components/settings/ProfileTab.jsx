"use client";

import { useState } from "react";
// import toast from "react-hot-toast";

export default function ProfileTab() {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };



  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10">
        <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
          Profile Information
        </h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Update your personal details</p>

        {/* Avatar Section */}
        <div className="flex items-center gap-8 mt-10">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl flex-shrink-0 relative group">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700 text-[10px] font-black uppercase tracking-widest">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div>
            <label className="inline-block cursor-pointer bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/5 active:scale-95">
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-3">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="John Morrison"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-slate-100 text-sm font-medium focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Email
            </label>
            <input
              type="email"
              defaultValue="president@club.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-slate-100 text-sm font-medium focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Role
            </label>
            <input
              type="text"
              defaultValue="President"
              disabled
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-5 py-3 text-slate-500 text-sm font-black uppercase tracking-widest cursor-not-allowed opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Phone
            </label>
            <input
              type="text"
              defaultValue="+1 (555) 123-4567"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-3 text-slate-100 text-sm font-medium focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-800"
            />
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Bio</label>
          <textarea
            rows="4"
            placeholder="Tell us about yourself..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 text-sm font-medium focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none placeholder:text-slate-800"
          />
        </div>

        {/* Save Button */}
        <div className="mt-10">
          <button
            className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 px-10 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}




