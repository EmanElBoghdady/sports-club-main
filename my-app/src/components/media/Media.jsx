"use client";
import React, { useState } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Image as ImageIcon,
  Video,
  FileText,
} from "lucide-react";

// Stats
const stats = [
  { title: "Total Posts", value: "145", icon: FileText, bg: "bg-blue-100", color: "text-blue-600" },
  { title: "Total Views", value: "1.2M", icon: Eye, bg: "bg-purple-100", color: "text-purple-600" },
  { title: "Engagement", value: "4.8K", icon: Heart, bg: "bg-red-100", color: "text-red-500" },
  { title: "Comments", value: "892", icon: MessageCircle, bg: "bg-green-100", color: "text-green-600" },
];

// Initial posts
const initialPosts = [
  { category: "Football", date: "10/28/2025", title: "Blue Stars FC Wins Championship Final 3-1", desc: "An incredible performance leads to victory in the final match.", views: "12,500", likes: "890", comments: "156", type: "Article" },
  { category: "Basketball", date: "10/26/2025", title: "New Basketball Training Facility Opens", desc: "State-of-the-art complex ready for the upcoming season.", views: "8,200", likes: "542", comments: "89", type: "Article" },
  { category: "Football", date: "10/25/2025", title: "Match Highlights: Blue Stars vs Eagles", desc: "Watch the best moments from the thrilling encounter.", views: "25,000", likes: "1650", comments: "234", type: "Video" },
  { category: "Football", date: "10/24/2025", title: "Player Interview: Marcus Silva", desc: "Our star forward talks about his journey and goals.", views: "15,600", likes: "1120", comments: "178", type: "Article" },
];

// Social platforms
const socialPlatforms = [
  { name: "Twitter", followers: "125K", engagement: "4.8%" },
  { name: "Instagram", followers: "230K", engagement: "6.2%" },
  { name: "Facebook", followers: "180K", engagement: "3.5%" },
];

export default function Media() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [posts, setPosts] = useState(initialPosts);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    desc: "",
    date: "",
    type: "Article",
    views: "0",
    likes: "0",
    comments: "0",
  });

  const openModal = (post = null, index = null) => {
    if (post) {
      setFormData(post);
      setEditingIndex(index);
    } else {
      setFormData({
        category: "",
        title: "",
        desc: "",
        date: "",
        type: "Article",
        views: "0",
        likes: "0",
        comments: "0",
      });
      setEditingIndex(null);
    }
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...posts];
      updated[editingIndex] = formData;
      setPosts(updated);
    } else {
      setPosts([...posts, formData]);
    }
    setModalOpen(false);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.desc.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || post.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-slate-950 min-h-screen p-6 overflow-y-auto w-full">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 fade-in">
          <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">
              Media & Communications
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
              News, articles, and media content
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            + Create Post
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-6 mb-10 shadow-2xl">
          <div className="relative w-full md:w-96 group">
            <i className="fi fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"></i>
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-14 pr-6 text-slate-200 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
            />
          </div>

          <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50 overflow-x-auto no-scrollbar w-full md:w-auto">
            {["All", "Articles", "Videos", "Social", "News"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${activeTab === tab
                    ? "bg-slate-100 text-slate-950 shadow-lg shadow-white/5"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.title}</p>
                  <h3 className="text-2xl font-black text-slate-100 tracking-tight">{s.value}</h3>
                </div>
                <div className={`p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-500 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all shadow-xl`}>
                  <s.icon size={22} />
                </div>
              </div>
              <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((p, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all overflow-hidden group">
              <div className="relative h-48 bg-slate-950 flex items-center justify-center text-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-600/20 group-hover:scale-110 transition-transform duration-700" />
                {p.type === "Video" ? (
                  <Video size={48} className="relative z-10 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <ImageIcon size={48} className="relative z-10 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}

                <span className={`absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md shadow-2xl relative z-10 ${p.type === "Video" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}>
                  {p.type}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest mb-4">
                  <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">{p.category}</span>
                  <span className="text-slate-600 tracking-tighter">{p.date}</span>
                </div>

                <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight group-hover:text-emerald-400 transition-colors mb-2 leading-snug">{p.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 mb-6">{p.desc}</p>

                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600 border-t border-slate-800/50 pt-4">
                  <span className="flex items-center gap-2 group-hover:text-slate-400 transition-colors"><Eye size={14} className="text-emerald-500" /> {p.views}</span>
                  <span className="flex items-center gap-2 text-rose-500"><Heart size={14} fill="currentColor" className="opacity-60" /> {p.likes}</span>
                  <span className="flex items-center gap-2 group-hover:text-slate-400 transition-colors"><MessageCircle size={14} className="text-emerald-500" /> {p.comments}</span>
                </div>

                <button onClick={() => openModal(p, i)} className="mt-6 w-full text-[10px] font-black uppercase tracking-[0.2em] py-3 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-white transition-all duration-300">
                  Edit Post
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Social Media Performance */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-800">
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Social Media Performance</h2>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">Engagement across platforms</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialPlatforms.map((platform, index) => (
              <div key={index} className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-emerald-500/50 transition-all group">
                <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest mb-6 group-hover:text-emerald-400 transition-colors">{platform.name}</h3>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span className="text-slate-500">Followers</span>
                  <span className="text-slate-200 tracking-tighter">{platform.followers}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest border-t border-slate-800/50 pt-3">
                  <span className="text-slate-500">Engagement</span>
                  <span className="text-emerald-400 tracking-tighter shadow-lg shadow-emerald-500/10">{platform.engagement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-950 rounded-2xl p-8 w-96 shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">✕</button>
            <h2 className="text-lg font-black text-slate-100 mb-4">{editingIndex !== null ? "Edit Post" : "Create New Post"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700" required />
              <textarea name="desc" value={formData.desc} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700" required />
              <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700" required />
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700" required />
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 rounded-lg bg-slate-900 text-slate-100 border border-slate-700" required>
                <option value="Article">Article</option>
                <option value="Video">Video</option>
              </select>
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all">
                {editingIndex !== null ? "Update Post" : "Save Post"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

