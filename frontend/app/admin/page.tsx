"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Users,
    Mail,
    LogOut,
    Check,
    X,
    Clock,
    Video,
    Send,
    ExternalLink,
    Search,
    ChevronRight,
    AlertCircle,
    RefreshCw,
    Compass,
    Phone,
    MapPin,
    CalendarCheck,
    TrendingUp,
} from "lucide-react";

interface AdminBooking {
    _id?: string;
    id?: string;
    bookingId: string;
    visitorId?: string;
    name: string;
    email: string;
    phone?: string;
    topic: string;
    date: string;
    timeSlot: string;
    timezone?: string;
    message?: string;
    status: "pending" | "confirmed" | "rejected" | "cancelled";
    meetLink?: string;
    calendarEventId?: string;
    calendarHtmlLink?: string;
    declineReason?: string;
    createdAt: string;
    pageViewsCount?: number;
}

interface AdminVisitor {
    _id?: string;
    visitorId: string;
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    userAgent?: string;
    firstSeen: string;
    lastSeen: string;
    visitCount: number;
    consentedAt?: string;
    pageViews?: Array<{ _id?: string; path: string; viewedAt: string }>;
    linkedBookings?: Array<{
        bookingId: string;
        topic: string;
        date: string;
        timeSlot: string;
        status: string;
    }>;
}

interface AdminMessage {
    _id?: string;
    id?: string;
    recipientEmail: string;
    sentTo: string;
    subject: string;
    body: string;
    visitorId?: string;
    sentAt: string;
}

type TabType = "bookings" | "visitors" | "messages";
type StatusFilter = "all" | "pending" | "confirmed" | "rejected" | "cancelled";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("bookings");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Data States
    const [bookings, setBookings] = useState<AdminBooking[]>([]);
    const [visitors, setVisitors] = useState<AdminVisitor[]>([]);
    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [stats, setStats] = useState({
        pendingCount: 0,
        bookingsThisWeek: 0,
        totalVisitors: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Modals
    const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
    const [rejectModalBooking, setRejectModalBooking] = useState<AdminBooking | null>(null);
    const [declineReason, setDeclineReason] = useState("");
    const [selectedVisitorJourney, setSelectedVisitorJourney] = useState<AdminVisitor | null>(null);

    // Message Compose Modal
    const [composeModal, setComposeModal] = useState<{ open: boolean; to: string; name?: string; visitorId?: string }>({
        open: false,
        to: "",
    });
    const [msgSubject, setMsgSubject] = useState("");
    const [msgBody, setMsgBody] = useState("");
    const [isSendingMsg, setIsSendingMsg] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [bRes, vRes, mRes] = await Promise.all([
                fetch("/api/admin/bookings"),
                fetch("/api/admin/visitors"),
                fetch("/api/admin/messages"),
            ]);

            if (bRes.status === 401 || vRes.status === 401) {
                router.push("/admin/login");
                return;
            }

            const bData = await bRes.json();
            const vData = await vRes.json();
            const mData = await mRes.json();

            setBookings(bData.bookings || []);
            if (bData.stats) setStats(bData.stats);
            setVisitors(vData.visitors || []);
            setMessages(mData.messages || []);
        } catch (err) {
            console.error("Dashboard data load error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
    };

    // Decision: Accept
    const handleAccept = async (bookingId: string) => {
        setActionLoading(bookingId);
        setFeedback(null);
        try {
            const res = await fetch(`/api/admin/bookings/${bookingId}/decision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "accept" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to accept booking");

            setFeedback({ type: "success", text: "Consultation accepted! Google Meet scheduled and confirmation emails sent." });
            await loadData();
        } catch (err) {
            setFeedback({ type: "error", text: err instanceof Error ? err.message : "Accept failed" });
        } finally {
            setActionLoading(null);
        }
    };

    // Decision: Reject
    const handleConfirmReject = async () => {
        if (!rejectModalBooking) return;
        setActionLoading(rejectModalBooking.bookingId);
        setFeedback(null);
        try {
            const res = await fetch(`/api/admin/bookings/${rejectModalBooking.bookingId}/decision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "reject",
                    declineReason: declineReason || "Scheduling conflict",
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to reject booking");

            setFeedback({ type: "success", text: "Booking declined and notification email sent to client." });
            setRejectModalBooking(null);
            setDeclineReason("");
            await loadData();
        } catch (err) {
            setFeedback({ type: "error", text: err instanceof Error ? err.message : "Reject failed" });
        } finally {
            setActionLoading(null);
        }
    };

    // Decision: Cancel
    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this confirmed consultation?")) return;
        setActionLoading(bookingId);
        try {
            const res = await fetch(`/api/admin/bookings/${bookingId}/decision`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "cancel" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to cancel");

            setFeedback({ type: "success", text: "Booking marked as cancelled." });
            await loadData();
        } catch (err) {
            setFeedback({ type: "error", text: err instanceof Error ? err.message : "Cancel failed" });
        } finally {
            setActionLoading(null);
        }
    };

    // Send Direct Message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSendingMsg(true);
        try {
            const res = await fetch("/api/admin/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientEmail: composeModal.to,
                    recipientName: composeModal.name,
                    subject: msgSubject,
                    body: msgBody,
                    visitorId: composeModal.visitorId,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send email");

            setFeedback({ type: "success", text: `Direct message sent to ${composeModal.to}!` });
            setComposeModal({ open: false, to: "" });
            setMsgSubject("");
            setMsgBody("");
            await loadData();
        } catch (err) {
            setFeedback({ type: "error", text: err instanceof Error ? err.message : "Failed to send message" });
        } finally {
            setIsSendingMsg(false);
        }
    };

    // Filtered bookings
    const filteredBookings = bookings.filter((b) => {
        if (statusFilter !== "all" && b.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                b.name.toLowerCase().includes(q) ||
                b.email.toLowerCase().includes(q) ||
                b.topic.toLowerCase().includes(q) ||
                (b.phone && b.phone.includes(q))
            );
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-card border border-border">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Admin Command Center
                            </h1>
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                MongoDB Live
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Approval-gated bookings, visitor analytics, direct messaging, and lead intelligence.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadData}
                            className="p-2.5 rounded-lg border border-border hover:border-foreground/40 hover:bg-card text-muted-foreground hover:text-foreground transition-all"
                            title="Refresh Data"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-2 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>

                {/* Phase 6: Summary Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-card border border-border flex items-center justify-between">
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                                Pending Approvals
                            </span>
                            <div className="text-2xl font-bold text-amber-400 mt-1">
                                {stats.pendingCount}
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-0.5 block">
                                Auto-expires if untouched after 48h
                            </span>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-card border border-border flex items-center justify-between">
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                                Bookings (Last 7 Days)
                            </span>
                            <div className="text-2xl font-bold text-emerald-400 mt-1">
                                {stats.bookingsThisWeek}
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-0.5 block">
                                Inbound consultations
                            </span>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-5 rounded-xl bg-card border border-border flex items-center justify-between">
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                                Tracked Visitors
                            </span>
                            <div className="text-2xl font-bold text-foreground mt-1">
                                {stats.totalVisitors}
                            </div>
                            <span className="text-[11px] text-muted-foreground mt-0.5 block">
                                Privacy-consented sessions
                            </span>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Feedback Alert */}
                {feedback && (
                    <div
                        className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
                            feedback.type === "success"
                                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                                : "bg-red-950/40 border-red-500/40 text-red-300"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {feedback.type === "success" ? (
                                <Check className="w-4 h-4 shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 shrink-0" />
                            )}
                            <span>{feedback.text}</span>
                        </div>
                        <button onClick={() => setFeedback(null)} className="p-1">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-border pb-2">
                    <button
                        onClick={() => setActiveTab("bookings")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === "bookings"
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground hover:bg-card"
                        }`}
                    >
                        <Calendar className="w-4 h-4" />
                        <span>Bookings</span>
                        {stats.pendingCount > 0 && (
                            <span
                                className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                                    activeTab === "bookings"
                                        ? "bg-background text-foreground"
                                        : "bg-amber-500 text-black animate-pulse"
                                }`}
                            >
                                {stats.pendingCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("visitors")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === "visitors"
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground hover:bg-card"
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Visitors & Leads</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-border text-muted-foreground font-mono">
                            {visitors.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab("messages")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                            activeTab === "messages"
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground hover:bg-card"
                        }`}
                    >
                        <Mail className="w-4 h-4" />
                        <span>Messages & Outbox</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-border text-muted-foreground font-mono">
                            {messages.length}
                        </span>
                    </button>
                </div>

                {/* TAB 1: BOOKINGS */}
                {activeTab === "bookings" && (
                    <div className="space-y-4">
                        {/* Filters & Search */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1.5 bg-card p-1.5 rounded-xl border border-border">
                                {(["all", "pending", "confirmed", "rejected", "cancelled"] as StatusFilter[]).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                                            statusFilter === status
                                                ? "bg-foreground text-background font-semibold"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <div className="relative min-w-[260px]">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search by client, email, phone, or topic..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                                />
                            </div>
                        </div>

                        {/* Bookings List */}
                        {filteredBookings.length === 0 ? (
                            <div className="p-12 text-center rounded-2xl bg-card border border-border text-muted-foreground">
                                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p className="text-sm">No bookings found matching your filter.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {filteredBookings.map((b) => {
                                    const isPending = b.status === "pending";
                                    const isConfirmed = b.status === "confirmed";
                                    const isRejected = b.status === "rejected";
                                    const id = b.bookingId || b.id || (b._id as string);

                                    return (
                                        <div
                                            key={id}
                                            className="p-5 rounded-xl bg-card border border-border hover:border-foreground/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                        >
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <h3 className="font-semibold text-foreground text-sm">
                                                        {b.name}
                                                    </h3>
                                                    <span className="text-xs text-muted-foreground">
                                                        • {b.email}
                                                    </span>

                                                    {b.phone && (
                                                        <a
                                                            href={`tel:${b.phone}`}
                                                            className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                                                        >
                                                            <Phone className="w-3 h-3" />
                                                            {b.phone}
                                                        </a>
                                                    )}

                                                    {/* Status Badge */}
                                                    <span
                                                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                                            isPending
                                                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                                                : isConfirmed
                                                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                                                : isRejected
                                                                ? "bg-red-500/15 text-red-300 border border-red-500/30"
                                                                : "bg-muted text-muted-foreground border border-border"
                                                        }`}
                                                    >
                                                        {b.status}
                                                    </span>

                                                    {b.pageViewsCount && b.pageViewsCount > 0 ? (
                                                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                                                            <Compass className="w-3 h-3" />
                                                            {b.pageViewsCount} pages viewed
                                                        </span>
                                                    ) : null}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                    <span className="text-foreground font-medium">
                                                        Topic: {b.topic}
                                                    </span>
                                                    <span>
                                                        📅 Slot: <strong className="text-foreground">{b.date} at {b.timeSlot}</strong>
                                                    </span>
                                                    <span>
                                                        Submitted: {new Date(b.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {b.message && (
                                                    <p className="text-xs text-muted-foreground/80 line-clamp-1 italic">
                                                        &ldquo;{b.message}&rdquo;
                                                    </p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedBooking(b)}
                                                    className="px-3 py-1.5 text-xs rounded-lg border border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"
                                                >
                                                    Details
                                                </button>

                                                {isPending && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAccept(id)}
                                                            disabled={actionLoading === id}
                                                            className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 disabled:opacity-50"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            <span>{actionLoading === id ? "Accepting..." : "Accept"}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectModalBooking(b)}
                                                            disabled={actionLoading === id}
                                                            className="px-3 py-1.5 text-xs rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center gap-1.5"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            <span>Reject</span>
                                                        </button>
                                                    </>
                                                )}

                                                {isConfirmed && (
                                                    <>
                                                        {b.meetLink && (
                                                            <a
                                                                href={b.meetLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-1.5 text-xs rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1.5"
                                                            >
                                                                <Video className="w-3.5 h-3.5" />
                                                                <span>Join Meet</span>
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => handleCancel(id)}
                                                            disabled={actionLoading === id}
                                                            className="px-2.5 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-red-400"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}

                                                {b.phone && (
                                                    <a
                                                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                        title="WhatsApp Lead"
                                                    >
                                                        <Phone className="w-3.5 h-3.5" />
                                                    </a>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        setComposeModal({
                                                            open: true,
                                                            to: b.email,
                                                            name: b.name,
                                                            visitorId: b.visitorId,
                                                        })
                                                    }
                                                    className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                                                    title="Email Client"
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: VISITORS */}
                {activeTab === "visitors" && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-card border border-border text-xs text-muted-foreground flex items-center justify-between">
                            <span>
                                👥 Tracked profiles in MongoDB. Opaque cookie only — identity & location collected server-side.
                            </span>
                            <span className="font-mono text-foreground font-semibold">
                                Total Visitors: {visitors.length}
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-border bg-card">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-border bg-background/50 text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-4">Visitor / Lead</th>
                                        <th className="p-4">Contact Info</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4">Visits</th>
                                        <th className="p-4">Activity Timeline</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {visitors.map((v) => {
                                        const isIdentified = Boolean(v.email || v.name);
                                        const views = v.pageViews || [];

                                        return (
                                            <tr key={v.visitorId} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    {isIdentified ? (
                                                        <div>
                                                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                                                                <span>{v.name || "Identified Lead"}</span>
                                                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                                                                    Lead
                                                                </span>
                                                            </div>
                                                            <div className="text-muted-foreground mt-0.5 font-mono text-[11px]">
                                                                {v.visitorId.substring(0, 14)}...
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="font-mono text-muted-foreground">
                                                            <span>Anonymous ({v.visitorId.substring(0, 14)}...)</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {v.email && (
                                                        <div className="text-foreground">{v.email}</div>
                                                    )}
                                                    {v.phone && (
                                                        <div className="text-emerald-400 flex items-center gap-1 mt-0.5">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{v.phone}</span>
                                                        </div>
                                                    )}
                                                    {!v.email && !v.phone && (
                                                        <span className="text-muted-foreground italic">Pending submission</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {v.location ? (
                                                        <span className="text-foreground flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                                                            <span>{v.location}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">Global</span>
                                                    )}
                                                </td>
                                                <td className="p-4 font-mono font-semibold text-foreground">
                                                    {v.visitCount}
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => setSelectedVisitorJourney(v)}
                                                        className="px-2.5 py-1 rounded bg-muted/60 hover:bg-muted border border-border text-foreground text-[11px] font-medium flex items-center gap-1.5"
                                                    >
                                                        <Compass className="w-3 h-3 text-blue-400" />
                                                        <span>{views.length} page views</span>
                                                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                                    </button>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {v.phone && (
                                                            <a
                                                                href={`https://wa.me/${v.phone.replace(/[^0-9]/g, "")}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                                title="WhatsApp Lead"
                                                            >
                                                                <Phone className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                        {v.email && (
                                                            <button
                                                                onClick={() =>
                                                                    setComposeModal({
                                                                        open: true,
                                                                        to: v.email || "",
                                                                        name: v.name,
                                                                        visitorId: v.visitorId,
                                                                    })
                                                                }
                                                                className="px-3 py-1.5 text-xs rounded-lg border border-border hover:border-foreground/40 text-foreground flex items-center gap-1.5"
                                                            >
                                                                <Send className="w-3 h-3" />
                                                                <span>Message</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: MESSAGES & CONTACT */}
                {activeTab === "messages" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Outbound Communications Log
                            </h2>
                            <button
                                onClick={() => setComposeModal({ open: true, to: "" })}
                                className="btn-primary text-xs py-2 px-4 flex items-center gap-2"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Compose New Email</span>
                            </button>
                        </div>

                        {messages.length === 0 ? (
                            <div className="p-12 text-center rounded-2xl bg-card border border-border text-muted-foreground">
                                <Mail className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p className="text-sm">No messages sent from the dashboard yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {messages.map((m) => {
                                    const id = m.id || (m._id as string);
                                    return (
                                        <div key={id} className="p-4 rounded-xl bg-card border border-border space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-foreground text-sm">
                                                        To: {m.sentTo || m.recipientEmail}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(m.sentAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-xs font-medium text-foreground">
                                                Subject: {m.subject}
                                            </div>
                                            <div className="p-3 rounded-lg bg-background text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed border border-border">
                                                {m.body}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL: Reject Reason */}
            <AnimatePresence>
                {rejectModalBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-foreground text-base">
                                    Decline Consultation Request
                                </h3>
                                <button onClick={() => setRejectModalBooking(null)} className="p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                A polite decline notification will be emailed to <strong className="text-foreground">{rejectModalBooking.email}</strong> offering them an alternate time.
                            </p>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                                    Decline Reason / Note to Client (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    placeholder="e.g. Out of office during this slot, or project scope requires full proposal discussion..."
                                    className="w-full p-3 rounded-lg bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setRejectModalBooking(null)}
                                    className="px-4 py-2 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmReject}
                                    className="px-4 py-2 text-xs rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                                >
                                    Confirm Decline
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: Booking Details Drawer */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg p-6 rounded-2xl bg-card border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <div>
                                    <h3 className="font-bold text-foreground text-base">
                                        Booking Request Details
                                    </h3>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        ID: {selectedBooking.bookingId}
                                    </span>
                                </div>
                                <button onClick={() => setSelectedBooking(null)} className="p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-background border border-border">
                                    <div>
                                        <span className="text-muted-foreground block uppercase text-[10px]">Client</span>
                                        <strong className="text-foreground text-sm">{selectedBooking.name}</strong>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block uppercase text-[10px]">Email</span>
                                        <strong className="text-foreground">{selectedBooking.email}</strong>
                                    </div>
                                    {selectedBooking.phone && (
                                        <div className="mt-2">
                                            <span className="text-muted-foreground block uppercase text-[10px]">Phone</span>
                                            <span className="text-emerald-400 font-semibold">{selectedBooking.phone}</span>
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <span className="text-muted-foreground block uppercase text-[10px]">Requested Date</span>
                                        <span className="text-emerald-400 font-semibold">{selectedBooking.date} at {selectedBooking.timeSlot}</span>
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-muted-foreground block uppercase text-[10px]">Status</span>
                                        <span className="uppercase font-bold text-foreground">{selectedBooking.status}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-muted-foreground block uppercase text-[10px] mb-1">Focus Topic</span>
                                    <div className="p-2.5 rounded bg-background border border-border text-foreground font-medium">
                                        {selectedBooking.topic}
                                    </div>
                                </div>

                                {selectedBooking.message && (
                                    <div>
                                        <span className="text-muted-foreground block uppercase text-[10px] mb-1">Client Project Brief</span>
                                        <div className="p-3 rounded bg-background border border-border text-foreground whitespace-pre-wrap leading-relaxed">
                                            {selectedBooking.message}
                                        </div>
                                    </div>
                                )}

                                {selectedBooking.meetLink && (
                                    <div>
                                        <span className="text-muted-foreground block uppercase text-[10px] mb-1">Google Meet Room</span>
                                        <a
                                            href={selectedBooking.meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between"
                                        >
                                            <span className="truncate">{selectedBooking.meetLink}</span>
                                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="btn-primary text-xs py-2 px-5"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: Visitor Journey & Linked Bookings Drawer */}
            <AnimatePresence>
                {selectedVisitorJourney && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg p-6 rounded-2xl bg-card border border-border shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
                        >
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <div>
                                    <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                                        <Compass className="w-4 h-4 text-blue-400" />
                                        <span>Visitor Activity & Timeline</span>
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                        {selectedVisitorJourney.name || selectedVisitorJourney.email || selectedVisitorJourney.visitorId}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedVisitorJourney(null)} className="p-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                                {/* Linked Bookings */}
                                {selectedVisitorJourney.linkedBookings && selectedVisitorJourney.linkedBookings.length > 0 && (
                                    <div className="space-y-2">
                                        <span className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider">
                                            Linked Consultations ({selectedVisitorJourney.linkedBookings.length})
                                        </span>
                                        <div className="space-y-1.5">
                                            {selectedVisitorJourney.linkedBookings.map((b) => (
                                                <div
                                                    key={b.bookingId}
                                                    className="p-3 rounded-lg bg-background border border-border flex items-center justify-between"
                                                >
                                                    <div>
                                                        <div className="font-semibold text-foreground">
                                                            {b.topic}
                                                        </div>
                                                        <div className="text-[11px] text-muted-foreground">
                                                            {b.date} at {b.timeSlot}
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                                                        {b.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pageviews Timeline */}
                                <div className="space-y-2">
                                    <span className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider">
                                        Page View Journey ({selectedVisitorJourney.pageViews?.length || 0})
                                    </span>
                                    {(!selectedVisitorJourney.pageViews || selectedVisitorJourney.pageViews.length === 0) ? (
                                        <p className="text-muted-foreground text-center py-4">
                                            No page view events recorded yet.
                                        </p>
                                    ) : (
                                        selectedVisitorJourney.pageViews.map((pv, idx) => (
                                            <div
                                                key={pv._id || idx}
                                                className="p-3 rounded-lg bg-background border border-border flex items-center justify-between gap-3"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-mono text-muted-foreground font-bold">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <span className="font-semibold text-foreground">
                                                            {pv.path}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                                                    {new Date(pv.viewedAt).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={() => setSelectedVisitorJourney(null)}
                                    className="btn-primary text-xs py-2 px-5"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* MODAL: Direct Message Compose */}
            <AnimatePresence>
                {composeModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-lg p-6 rounded-2xl bg-card border border-border shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-emerald-400" />
                                    <span>Send Message to Client</span>
                                </h3>
                                <button
                                    onClick={() => setComposeModal({ open: false, to: "" })}
                                    className="p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSendMessage} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="block uppercase text-[10px] tracking-wider text-muted-foreground mb-1">
                                        Recipient Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={composeModal.to}
                                        onChange={(e) =>
                                            setComposeModal({ ...composeModal, to: e.target.value })
                                        }
                                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:border-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block uppercase text-[10px] tracking-wider text-muted-foreground mb-1">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={msgSubject}
                                        onChange={(e) => setMsgSubject(e.target.value)}
                                        placeholder="Regarding your consultation inquiry with Strix Devs..."
                                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:border-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block uppercase text-[10px] tracking-wider text-muted-foreground mb-1">
                                        Message Body *
                                    </label>
                                    <textarea
                                        rows={6}
                                        required
                                        value={msgBody}
                                        onChange={(e) => setMsgBody(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full p-3 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:border-foreground resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="pt-2 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setComposeModal({ open: false, to: "" })}
                                        className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSendingMsg}
                                        className="btn-primary py-2 px-5 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>{isSendingMsg ? "Sending..." : "Send Message"}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
