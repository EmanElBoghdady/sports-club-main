"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Send, Inbox, Mail, Archive, X } from "lucide-react";

export default function Messages() {
  // ======================
  // Initial Messages
  // ======================
  const initialMessages = [
    {
      id: 1,
      sender: "Sports Director",
      initials: "SD",
      title: "New Player Transfer Update",
      preview: "Please review the new player profiles sent by our scouts.",
      date: "10/30/2025",
      time: "10:30 AM",
      unread: true,
      content: "Please review the new player profiles sent by our scouts.",
    },
    {
      id: 2,
      sender: "Medical Team",
      initials: "MT",
      title: "Injury Report - Erik Hansen",
      preview: "Erik will need 2 weeks recovery. Full report attached.",
      date: "10/29/2025",
      time: "09:10 AM",
      unread: false,
      content: "Erik will need 2 weeks recovery. Full report attached.",
    },
    {
      id: 3,
      sender: "Analyst",
      initials: "A",
      title: "Performance Analysis",
      preview: "Monthly performance report is ready.",
      date: "10/28/2025",
      time: "02:15 PM",
      unread: false,
      content: "Monthly performance report is ready.",
    },
  ];

  // ======================
  // State
  // ======================
  const [messagesData, setMessagesData] = useState(initialMessages);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(messagesData[0]);
  const [reply, setReply] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({ sender: "", title: "", content: "" });

  // ======================
  // Search Filter
  // ======================
  const filteredMessages = useMemo(() => {
    return messagesData.filter((msg) => {
      const text =
        msg.sender + " " + msg.title + " " + msg.preview + " " + msg.content;
      return text.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, messagesData]);

  useEffect(() => {
    if (filteredMessages.length > 0) setSelectedMessage(filteredMessages[0]);
  }, [search, filteredMessages]);

  const unreadCount = messagesData.filter((m) => m.unread).length;
  const readCount = messagesData.length - unreadCount;

  // ======================
  // Handlers
  // ======================
  const handleSendNewMessage = () => {
    if (!newMessage.sender || !newMessage.title || !newMessage.content) return;

    const now = new Date();
    const newMsg = {
      id: messagesData.length + 1,
      sender: newMessage.sender,
      initials: newMessage.sender
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      title: newMessage.title,
      preview: newMessage.content.slice(0, 50),
      date: `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unread: true,
      content: newMessage.content,
    };

    setMessagesData([newMsg, ...messagesData]);
    setNewMessage({ sender: "", title: "", content: "" });
    setShowNewMessage(false);
    setSelectedMessage(newMsg);
  };

  return (
    <div className="bg-slate-950 min-h-screen p-6 space-y-10 overflow-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 fade-in">
        <div>
          <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2">
            Messages
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">
            {unreadCount} unread message
          </p>
        </div>

        <button
          onClick={() => setShowNewMessage(true)}
          className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
        >
          <Plus size={16} />
          New Message
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Message List */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-6">
          {/* Search */}
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-emerald-500 transition-colors"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 outline-none text-[10px] font-black uppercase tracking-widest text-slate-100 placeholder:text-slate-600 transition-all focus:border-emerald-500/50"
            />
          </div>

          {/* Messages */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredMessages.length === 0 && (
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 text-center py-10 opacity-50">
                No messages found
              </p>
            )}

            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 transform border relative overflow-hidden group
                ${
                  selectedMessage?.id === msg.id
                    ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
                    : "border-slate-800/50 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-900/50"
                }`}
              >
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700" />

                <div className="flex justify-between items-start relative z-10">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black shadow-xl border tracking-tighter transition-transform group-hover:scale-105
                      ${
                        selectedMessage?.id === msg.id
                          ? "bg-emerald-500 text-white border-emerald-400/50"
                          : "bg-slate-900 text-emerald-500 border-slate-800 opacity-80"
                      }`}
                    >
                      {msg.initials}
                    </div>

                    <div>
                      <p
                        className={`font-black uppercase tracking-tight text-sm transition-colors ${
                          selectedMessage?.id === msg.id
                            ? "text-emerald-400"
                            : "text-slate-200 group-hover:text-emerald-400"
                        }`}
                      >
                        {msg.sender}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 line-clamp-1">
                        {msg.title}
                      </p>
                      <p className="text-[10px] text-slate-600 uppercase tracking-wide mt-2 line-clamp-1 opacity-70">
                        {msg.preview}
                      </p>
                      <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] mt-3">
                        {msg.date}
                      </p>
                    </div>
                  </div>

                  {msg.unread && (
                    <span className="text-[8px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/30 animate-pulse">
                      NEW
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Message Details */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />

          {selectedMessage && (
            <div className="relative z-10 space-y-10 fade-in">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xl shadow-2xl tracking-tighter">
                    {selectedMessage.initials}
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight mb-2">
                      {selectedMessage.title}
                    </h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      From:{" "}
                      <span className="text-emerald-500">
                        {selectedMessage.sender}
                      </span>{" "}
                      <span className="mx-2 text-slate-800">•</span>{" "}
                      {selectedMessage.date}, {selectedMessage.time}
                    </p>
                  </div>
                </div>

                {selectedMessage.unread && (
                  <span className="text-[9px] font-black bg-emerald-500 text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                    New Message
                  </span>
                )}
              </div>

              <div className="h-px bg-slate-800/50 w-full" />

              {/* Content */}
              <div className="bg-slate-950/30 p-8 rounded-3xl border border-slate-800/50 min-h-[200px]">
                <p className="text-slate-300 leading-loose text-sm font-medium uppercase tracking-wide opacity-90">
                  {selectedMessage.content}
                </p>
              </div>

              <div className="h-px bg-slate-800/50 w-full" />

              {/* Reply */}
              <div className="space-y-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Reply to message
                </p>

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full h-48 bg-slate-950 border border-slate-800 rounded-3xl p-6 outline-none text-slate-200 text-sm font-medium transition-all focus:border-emerald-500/50 resize-none placeholder:text-slate-800"
                />

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setReply("")}
                    className="px-6 py-3 border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 rounded-xl hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-slate-400 transition-all active:scale-95"
                  >
                    Cancel
                  </button>

                  <button className="flex items-center gap-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 px-8 py-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95">
                    <Send size={16} />
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
        {[
          { title: "Inbox", value: messagesData.length, icon: Inbox },
          { title: "Unread", value: unreadCount, icon: Mail },
          { title: "Read", value: readCount, icon: Archive },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 group hover:border-emerald-500/30 transition-all flex justify-between items-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-700" />

            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                {stat.title}
              </p>
              <h3 className="text-3xl font-black text-slate-100 tracking-tighter">
                {stat.value}
              </h3>
            </div>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/10 transition-all shadow-xl">
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-slate-900 p-8 rounded-2xl w-96 space-y-6 relative">
            <button
              onClick={() => setShowNewMessage(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-emerald-500 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
              New Message
            </h2>

            <input
              value={newMessage.sender}
              onChange={(e) =>
                setNewMessage({ ...newMessage, sender: e.target.value })
              }
              placeholder="Sender Name"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm font-black uppercase tracking-widest outline-none focus:border-emerald-500/50"
            />
            <input
              value={newMessage.title}
              onChange={(e) =>
                setNewMessage({ ...newMessage, title: e.target.value })
              }
              placeholder="Message Title"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm font-black uppercase tracking-widest outline-none focus:border-emerald-500/50"
            />
            <textarea
              value={newMessage.content}
              onChange={(e) =>
                setNewMessage({ ...newMessage, content: e.target.value })
              }
              placeholder="Message Content"
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 text-sm font-black uppercase tracking-widest outline-none focus:border-emerald-500/50 resize-none"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowNewMessage(false)}
                className="px-6 py-3 border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-600 rounded-xl hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-slate-400 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNewMessage}
                className="px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

