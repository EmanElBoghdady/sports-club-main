"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Send,
  Inbox,
  Mail,
  Archive,
  X,
  Trash2,
  User,
} from "lucide-react";
import { api } from "../../lib/api";

export default function Messages() {
  // ======================
  // State
  // ======================
  const [messagesData, setMessagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({
    sender: "",
    title: "",
    content: "",
  });
  const [tab, setTab] = useState("inbox"); // inbox | sent | all

  // Mapping function to convert API message format to UI-friendly format

  const mapMessage = (msg) => ({
    id: msg.id,
    sender: msg.senderUserKeycloakId || "Unknown",
    initials: (msg.senderUserKeycloakId || "??").slice(0, 2).toUpperCase(),
    title: msg.subject || "No Subject",
    content: msg.content || "",
    preview: msg.content?.slice(0, 60) || "",
    date: msg.sentAt ? msg.sentAt.split("T")[0] : "Pending",
    time: msg.sentAt ? msg.sentAt.split("T")[1]?.slice(0, 5) : "--:--",
    unread: msg.readAt == null,
  });

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const keycloakId = localStorage.getItem("keycloakId");

        let data = [];

        if (tab === "inbox") {
          data = await api.getMessagesByRecipient(keycloakId).catch(() => []);
        } else if (tab === "sent") {
          data = await api.getMessagesBySender(keycloakId).catch(() => []);
        } else if (tab === "all") {
          data = await api.getAllMessages().catch(() => []);
        }

        // Fallback: Filter all messages if specialized fetch is empty
        if (data.length === 0 && (tab === "inbox" || tab === "sent")) {
          const all = await api.getAllMessages().catch(() => []);
          data = all.filter(m =>
            tab === "inbox" ? m.recipientUserKeycloakId === keycloakId : m.senderUserKeycloakId === keycloakId
          );
        }

        const mapped = data.map(mapMessage);
        setMessagesData(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [tab]);

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
    if (filteredMessages.length > 0) {
      setSelectedMessage(filteredMessages[0]);
    } else {
      setSelectedMessage(null);
    }
  }, [filteredMessages]);

  const unreadCount = useMemo(
    () => messagesData.filter((m) => m.unread).length,
    [messagesData],
  );

  const readCount = messagesData.length - unreadCount;

  // ======================
  // Handlers
  // ======================
  const refreshMessages = async () => {
    setLoading(true);

    const keycloakId = localStorage.getItem("keycloakId");

    let data = [];
    try {
      if (tab === "inbox") {
        data = await api.getMessagesByRecipient(keycloakId).catch(() => []);
      } else if (tab === "sent") {
        data = await api.getMessagesBySender(keycloakId).catch(() => []);
      } else {
        data = await api.getAllMessages().catch(() => []);
      }

      if (data.length === 0 && (tab === "inbox" || tab === "sent")) {
        const all = await api.getAllMessages().catch(() => []);
        data = all.filter(m =>
          tab === "inbox" ? m.recipientUserKeycloakId === keycloakId : m.senderUserKeycloakId === keycloakId
        );
      }
      setMessagesData(data.map(mapMessage));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewMessage = async () => {
    if (!newMessage.sender || !newMessage.title || !newMessage.content) return;

    try {
      const keycloakId = localStorage.getItem("keycloakId");

      const payload = {
        senderUserKeycloakId: keycloakId,
        recipientUserKeycloakId: newMessage.sender,
        subject: newMessage.title,
        content: newMessage.content,
        status: "SENT",
        parentMessageId: null
      };

      const created = await api.createMessage(payload);

      const mappedMessage = mapMessage(created); // 🔥 المهم

      setMessagesData((prev) => [mappedMessage, ...prev]);
      setSelectedMessage({
        ...mappedMessage,
        unread: true,
      });
      setShowNewMessage(false);
      setNewMessage({ sender: "", title: "", content: "" });

      await refreshMessages();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedMessage) return;

    try {
      const keycloakId = localStorage.getItem("keycloakId");

      const payload = {
        senderUserKeycloakId: keycloakId,
        recipientUserKeycloakId: selectedMessage.sender,
        subject: `Re: ${selectedMessage.title}`,
        content: reply,
        status: "SENT",
        parentMessageId: selectedMessage.id
      };

      await api.createMessage(payload);
      setReply("");
      setTab("sent");
      await refreshMessages();
    } catch (err) {
      console.error("Error sending reply", err);
    }
  };

  const handleSelectMessage = async (msg) => {
    // 1. Set immediately for instant UI response
    setSelectedMessage(msg);

    try {
      // 2. Fetch full details in background (if needed)
      const fullMessage = await api.getMessageById(msg.id).catch(() => null);
      if (fullMessage) {
        const mapped = mapMessage(fullMessage);
        setSelectedMessage(mapped);

        // 3. Update read status in background
        if (!fullMessage.readAt) {
          await api.updateMessage(msg.id, {
            ...fullMessage,
            readAt: new Date().toISOString(),
          }).catch(err => console.warn("Could not update read status", err));

          // Refresh list to clear "New" badge
          await refreshMessages();
        }
      }
    } catch (err) {
      console.error("Selection error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteMessage(id);

      setMessagesData((prev) => prev.filter((m) => m.id !== id));

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }

      await refreshMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-300">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen w-full overflow-x-hidden
px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8
space-y-6 sm:space-y-8 lg:space-y-10">      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-8">        <div>
        <h1 className="text-4xl font-black text-slate-100 tracking-tight mb-2 flex items-center gap-3">
          <Mail className="text-emerald-500" size={32} />
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-full overflow-hidden pb-20">
        <div className="
bg-slate-900/60
backdrop-blur-xl
rounded-3xl
p-2 sm:p-6
border border-slate-800
shadow-2xl
space-y-3
overflow-hidden
sticky top-5">
          {/* Search Area */}
          <div className="relative group w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-slate-950/80 border border-slate-800/50 rounded-2xl pl-12 pr-4 py-3.5 outline-none text-[11px] font-bold tracking-wider text-slate-100 placeholder:text-slate-600 transition-all focus:border-emerald-500/30 focus:bg-slate-950 focus:shadow-[0_0_20px_rgba(16,185,129,0.05)]"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-950/50 p-1 rounded-2xl border border-slate-800/30 gap-1">
            {["inbox", "sent", "all"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === t
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                  }`}
              >
                {t === "inbox" && <Inbox size={12} />}
                {t === "sent" && <Send size={12} />}
                {t === "all" && <Mail size={12} />}
                <span className="hidden sm:inline">{t}</span>
              </button>
            ))}
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
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border relative overflow-hidden group
                ${selectedMessage?.id === msg.id
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-xl shadow-emerald-950/20"
                    : "border-slate-800/40 bg-slate-950/30 hover:border-slate-700/50 hover:bg-slate-900/50"
                  }`}
              >
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-[10px] font-black shadow-lg border transition-all ${selectedMessage?.id === msg.id ? "bg-emerald-500 text-white" : "bg-slate-900 text-slate-400 border-slate-800"
                      }`}>
                      {msg.initials === "??" ? <User size={16} /> : msg.initials}
                    </div>
                    {msg.unread && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className={`text-xs font-black uppercase tracking-tight truncate ${selectedMessage?.id === msg.id ? "text-emerald-400" : "text-slate-200"
                        }`}>
                        {msg.sender}
                      </p>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tabular-nums">
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 truncate leading-tight">
                      {msg.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                  className="absolute bottom-3 right-3 text-slate-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Message Details */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px]" />

          {selectedMessage ? (
            <div className="relative z-10 space-y-10 fade-in">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xl shadow-2xl tracking-tighter">
                    {selectedMessage.initials === "??" ? <Mail size={24} /> : selectedMessage.initials}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">👋 Hello</span>
                      <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                        {selectedMessage.title}
                      </h2>
                    </div>
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

                  <button
                    onClick={handleSendReply}
                    className="flex items-center gap-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 px-8 py-3 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-95"
                  >
                    <Send size={16} />
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-40 py-20">
              <div className="w-24 h-24 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center animate-bounce duration-[3000ms]">
                <Mail size={40} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] mb-2">No Message Selected</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select a message from the list to view its content</p>
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
