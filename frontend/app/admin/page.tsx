"use client";

import { useState, useEffect, useMemo } from "react";
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
    AlertCircle,
    RefreshCw,
    Compass,
    Phone,
    MapPin,
    CalendarCheck,
    TrendingUp,
    Inbox,
    Eye,
    EyeOff,
    Trash2,
    Laptop,
    Smartphone,
    BarChart3,
    Repeat,
    Activity,
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
    ip?: string;
    country?: string;
    countryCode?: string;
    city?: string;
    region?: string;
    location?: string;
    timezone?: string;
    device?: string;
    browser?: string;
    os?: string;
    screen?: string;
    language?: string;
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
    linkedMessages?: Array<{
        _id?: string;
        subject: string;
        body: string;
        status: string;
        direction?: string;
        createdAt: string;
    }>;
}

interface AdminMessage {
    _id?: string;
    id?: string;
    direction?: "inbound" | "outbound";
    name?: string;
    email?: string;
    phone?: string;
    recipientEmail?: string;
    recipientName?: string;
    sentTo?: string;
    subject: string;
    body: string;
    status?: "unread" | "read" | "replied" | "sent";
    visitorId?: string;
    bookingId?: string;
    sentAt: string;
    createdAt?: string;
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
    const [inboxMessages, setInboxMessages] = useState<AdminMessage[]>([]);
    const [outboxMessages, setOutboxMessages] = useState<AdminMessage[]>([]);
    const [messageSubTab, setMessageSubTab] = useState<"inbox" | "outbox">("inbox");
    const [unreadCount, setUnreadCount] = useState(0);

    // Activity & Retention Chart States
    const [chartTimeframe, setChartTimeframe] = useState<"7d" | "14d" | "30d">("7d");
    const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);

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
    const [composeModal, setComposeModal] = useState<{
        open: boolean;
        to: string;
        name?: string;
        visitorId?: string;
        replyToMessageId?: string;
    }>({
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
            setInboxMessages(mData.inbox || []);
            setOutboxMessages(mData.outbox || []);
            if (mData.counts) {
                setUnreadCount(mData.counts.unreadInbox || 0);
            }
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

    // Mark Message Status (read / unread)
    const handleMarkMessageStatus = async (messageId: string, status: "read" | "unread") => {
        try {
            const res = await fetch("/api/admin/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messageId, status }),
            });
            if (res.ok) {
                await loadData();
            }
        } catch (err) {
            console.error("Failed to update message status:", err);
        }
    };

    // Delete Message
    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm("Are you sure you want to delete this message record?")) return;
        try {
            const res = await fetch(`/api/admin/messages?id=${messageId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setFeedback({ type: "success", text: "Message removed successfully." });
                await loadData();
            }
        } catch (err) {
            setFeedback({ type: "error", text: "Failed to delete message." });
        }
    };

    // Reply to Inbound Inquiry
    const handleReplyToInquiry = (msg: AdminMessage) => {
        const id = msg._id || msg.id;
        setComposeModal({
            open: true,
            to: msg.email || "",
            name: msg.name,
            visitorId: msg.visitorId,
            replyToMessageId: id,
        });
        setMsgSubject(`Re: ${msg.subject || "Your inquiry with Strix Devs"}`);
        setMsgBody(`Hi ${msg.name || "there"},\n\nThank you for reaching out to Strix Devs regarding "${msg.subject}".\n\n`);
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
                    replyToMessageId: composeModal.replyToMessageId,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send email");

            setFeedback({ type: "success", text: `Message sent to ${composeModal.to}!` });
            setComposeModal({ open: false, to: "", name: undefined, visitorId: undefined, replyToMessageId: undefined });
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

    // Activity & Customer Retention Analytics Calculations
    const chartDaysCount = chartTimeframe === "30d" ? 30 : chartTimeframe === "14d" ? 14 : 7;

    const chartData = useMemo(() => {
        const days = [];
        const now = new Date();
        now.setHours(23, 59, 59, 999);

        for (let i = chartDaysCount - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            const label = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            const shortLabel = i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "narrow", day: "numeric" });

            // Count new visitors on this day
            const newVisitors = visitors.filter((v) => {
                if (!v.firstSeen) return false;
                return new Date(v.firstSeen).toISOString().split("T")[0] === dateStr;
            }).length;

            // Count returning / repeat visitors on this day (visitCount > 1 and active on this day)
            const returningVisitors = visitors.filter((v) => {
                if ((v.visitCount || 1) <= 1) return false;
                const last = v.lastSeen ? new Date(v.lastSeen).toISOString().split("T")[0] : null;
                const first = v.firstSeen ? new Date(v.firstSeen).toISOString().split("T")[0] : null;
                return (last === dateStr && first !== dateStr) || (last === dateStr && (v.visitCount || 1) > 1);
            }).length;

            // Count page views on this day
            let pageViews = 0;
            visitors.forEach((v) => {
                if (v.pageViews && Array.isArray(v.pageViews)) {
                    v.pageViews.forEach((pv) => {
                        if (pv.viewedAt && new Date(pv.viewedAt).toISOString().split("T")[0] === dateStr) {
                            pageViews++;
                        }
                    });
                }
            });

            // Consultations on this day
            const consultations = bookings.filter((b) => {
                if (!b.createdAt) return false;
                return new Date(b.createdAt).toISOString().split("T")[0] === dateStr;
            }).length;

            // Inquiries on this day
            const inquiries = inboxMessages.filter((m) => {
                const dt = m.createdAt || m.sentAt;
                if (!dt) return false;
                return new Date(dt).toISOString().split("T")[0] === dateStr;
            }).length;

            days.push({
                date: dateStr,
                label,
                shortLabel,
                newVisitors,
                returningVisitors,
                pageViews,
                consultations,
                inquiries,
                totalActivity: pageViews + consultations + inquiries,
            });
        }
        return days;
    }, [visitors, bookings, inboxMessages, chartDaysCount]);

    const totalRepeatVisitors = useMemo(() => {
        return visitors.filter((v) => (v.visitCount || 1) > 1).length;
    }, [visitors]);

    const repeatRate = useMemo(() => {
        if (!visitors.length) return 0;
        return Math.round((totalRepeatVisitors / visitors.length) * 100);
    }, [totalRepeatVisitors, visitors.length]);

    const totalPeriodActivity = useMemo(() => {
        return chartData.reduce((acc, d) => acc + d.totalActivity, 0);
    }, [chartData]);

    const maxChartVal = useMemo(() => {
        const highest = Math.max(
            ...chartData.map((d) => Math.max(d.newVisitors + d.returningVisitors, d.totalActivity))
        );
        return Math.max(5, highest);
    }, [chartData]);

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-sm">
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Admin Dashboard
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Consultations, visitor intelligence & client messaging
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={loadData}
                            className="p-2 rounded-lg border border-border/60 hover:border-foreground/40 hover:bg-card text-muted-foreground hover:text-foreground transition-all"
                            title="Refresh Data"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-border/80 transition-all flex items-center justify-between">
                        <div>
                            <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
                                Pending
                            </span>
                            <div className="text-2xl font-bold text-amber-400 mt-0.5">
                                {stats.pendingCount}
                            </div>
                            <span className="text-[10px] text-muted-foreground/80 block mt-0.5">
                                Awaiting confirmation
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-border/80 transition-all flex items-center justify-between">
                        <div>
                            <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
                                Confirmed
                            </span>
                            <div className="text-2xl font-bold text-emerald-400 mt-0.5">
                                {bookings.filter(b => b.status === "confirmed").length}
                            </div>
                            <span className="text-[10px] text-muted-foreground/80 block mt-0.5">
                                Scheduled sessions
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CalendarCheck className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-border/80 transition-all flex items-center justify-between">
                        <div>
                            <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
                                Visitors
                            </span>
                            <div className="text-2xl font-bold text-foreground mt-0.5">
                                {stats.totalVisitors || visitors.length}
                            </div>
                            <span className="text-[10px] text-muted-foreground/80 block mt-0.5">
                                Tracked sessions
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-border/80 transition-all flex items-center justify-between">
                        <div>
                            <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
                                Inquiries
                            </span>
                            <div className="text-2xl font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                                <span>{inboxMessages.length}</span>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-black font-bold uppercase">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] text-muted-foreground/80 block mt-0.5">
                                Client messages
                            </span>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                            <Inbox className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Activity & Customer Retention Analytics Chart */}
                <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 shadow-sm space-y-4">
                    {/* Chart Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-emerald-400" />
                                <h2 className="text-sm font-bold text-foreground tracking-tight">
                                    User Activity & Customer Retention
                                </h2>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Daily interaction volume and repeated customer visits over time
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Retention Metrics Badges */}
                            <div className="hidden md:flex items-center gap-2 text-[11px]">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1 font-medium">
                                    <Repeat className="w-3 h-3" />
                                    <span>{repeatRate}% Repeat Rate</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium">
                                    {totalRepeatVisitors} Repeated Customers
                                </span>
                            </div>

                            {/* Timeframe Selector */}
                            <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border/60">
                                {(["7d", "14d", "30d"] as const).map((tf) => (
                                    <button
                                        key={tf}
                                        onClick={() => setChartTimeframe(tf)}
                                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all uppercase ${chartTimeframe === tf
                                            ? "bg-foreground text-background shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chart Summary Cards / Chips */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border/40">
                        <div className="p-2.5 rounded-lg bg-background/50 border border-border/40">
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                                Period Activity
                            </span>
                            <span className="text-base font-bold text-foreground">
                                {totalPeriodActivity}
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 block">
                                Page views & events
                            </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-background/50 border border-border/40">
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                                Repeated Customers
                            </span>
                            <span className="text-base font-bold text-emerald-400">
                                {totalRepeatVisitors}
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 block">
                                Visited 2+ times
                            </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-background/50 border border-border/40">
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                                Customer Repeat Rate
                            </span>
                            <span className="text-base font-bold text-blue-400">
                                {repeatRate}%
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 block">
                                Of all tracked visitors
                            </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-background/50 border border-border/40">
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                                Inquiries & Bookings
                            </span>
                            <span className="text-base font-bold text-purple-400">
                                {bookings.length + inboxMessages.length}
                            </span>
                            <span className="text-[10px] text-muted-foreground/80 block">
                                Total conversions
                            </span>
                        </div>
                    </div>

                    {/* Visual SVG Chart */}
                    <div className="relative pt-2">
                        {/* Tooltip info for hovered day */}
                        {hoveredDayIndex !== null && chartData[hoveredDayIndex] && (
                            <div className="p-2.5 rounded-xl bg-card border border-border shadow-xl text-xs flex flex-wrap items-center gap-3 animate-in fade-in duration-150 mb-2">
                                <span className="font-semibold text-foreground">
                                    📅 {chartData[hoveredDayIndex].label}:
                                </span>
                                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                                    <Repeat className="w-3 h-3" />
                                    <span>{chartData[hoveredDayIndex].returningVisitors} repeated</span>
                                </span>
                                <span className="text-purple-400 flex items-center gap-1 font-medium">
                                    <Users className="w-3 h-3" />
                                    <span>{chartData[hoveredDayIndex].newVisitors} new visitors</span>
                                </span>
                                <span className="text-blue-400 flex items-center gap-1 font-medium">
                                    <Activity className="w-3 h-3" />
                                    <span>{chartData[hoveredDayIndex].pageViews} views</span>
                                </span>
                                {(chartData[hoveredDayIndex].consultations > 0 || chartData[hoveredDayIndex].inquiries > 0) && (
                                    <span className="text-amber-400 font-medium">
                                        ⚡ {chartData[hoveredDayIndex].consultations + chartData[hoveredDayIndex].inquiries} leads
                                    </span>
                                )}
                            </div>
                        )}

                        {/* SVG Canvas */}
                        <div className="w-full overflow-x-auto">
                            <svg
                                viewBox={`0 0 800 200`}
                                className="w-full h-48 select-none"
                                style={{ minWidth: chartDaysCount > 14 ? "600px" : "100%" }}
                            >
                                <defs>
                                    <linearGradient id="repeatGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                                        <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
                                    </linearGradient>
                                    <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
                                    </linearGradient>
                                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#38bdf8" />
                                        <stop offset="100%" stopColor="#818cf8" />
                                    </linearGradient>
                                </defs>

                                {/* Horizontal Grid lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                                    const y = 170 - ratio * 140;
                                    const val = Math.round(ratio * maxChartVal);
                                    return (
                                        <g key={ratio}>
                                            <line
                                                x1="35"
                                                y1={y}
                                                x2="785"
                                                y2={y}
                                                stroke="currentColor"
                                                className="text-border/40"
                                                strokeDasharray="4 4"
                                                strokeWidth="1"
                                            />
                                            <text
                                                x="28"
                                                y={y + 3}
                                                textAnchor="end"
                                                className="fill-muted-foreground text-[9px] font-mono"
                                            >
                                                {val}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Columns for each day */}
                                {chartData.map((d, idx) => {
                                    const colWidth = 750 / chartDaysCount;
                                    const centerX = 35 + idx * colWidth + colWidth / 2;
                                    const barW = Math.max(8, Math.min(24, colWidth * 0.55));
                                    const isHovered = hoveredDayIndex === idx;

                                    const totalBarVal = d.newVisitors + d.returningVisitors;
                                    const totalBarH = Math.max(3, (totalBarVal / maxChartVal) * 140);
                                    const returnBarH = totalBarVal > 0 ? (d.returningVisitors / totalBarVal) * totalBarH : 0;
                                    const newBarH = totalBarH - returnBarH;
                                    const barY = 170 - totalBarH;

                                    return (
                                        <g
                                            key={d.date}
                                            className="cursor-pointer"
                                            onMouseEnter={() => setHoveredDayIndex(idx)}
                                            onMouseLeave={() => setHoveredDayIndex(null)}
                                        >
                                            {isHovered && (
                                                <rect
                                                    x={35 + idx * colWidth}
                                                    y="15"
                                                    width={colWidth}
                                                    height="160"
                                                    fill="currentColor"
                                                    className="text-foreground/5"
                                                    rx="6"
                                                />
                                            )}

                                            <rect
                                                x={centerX - barW / 2}
                                                y={170 - newBarH}
                                                width={barW}
                                                height={Math.max(2, newBarH)}
                                                fill="url(#newGrad)"
                                                rx="2"
                                                className="transition-all"
                                            />

                                            {returnBarH > 0 && (
                                                <rect
                                                    x={centerX - barW / 2}
                                                    y={barY}
                                                    width={barW}
                                                    height={returnBarH}
                                                    fill="url(#repeatGrad)"
                                                    rx="3"
                                                    className="transition-all"
                                                />
                                            )}

                                            <text
                                                x={centerX}
                                                y="188"
                                                textAnchor="middle"
                                                className={`text-[9px] font-mono transition-colors ${isHovered
                                                    ? "fill-foreground font-bold"
                                                    : "fill-muted-foreground"
                                                    }`}
                                            >
                                                {chartDaysCount > 14 ? (idx % 2 === 0 ? d.shortLabel : "") : d.shortLabel}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Activity Trend Line across all days */}
                                {chartData.length > 1 && (
                                    <polyline
                                        fill="none"
                                        stroke="url(#lineGrad)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points={chartData
                                            .map((d, idx) => {
                                                const colWidth = 750 / chartDaysCount;
                                                const cx = 35 + idx * colWidth + colWidth / 2;
                                                const cy = 170 - Math.max(3, (d.totalActivity / maxChartVal) * 140);
                                                return `${cx},${cy}`;
                                            })
                                            .join(" ")}
                                    />
                                )}

                                {/* Activity Points on the line */}
                                {chartData.map((d, idx) => {
                                    const colWidth = 750 / chartDaysCount;
                                    const cx = 35 + idx * colWidth + colWidth / 2;
                                    const cy = 170 - Math.max(3, (d.totalActivity / maxChartVal) * 140);
                                    const isHovered = hoveredDayIndex === idx;

                                    return (
                                        <circle
                                            key={`pt-${d.date}`}
                                            cx={cx}
                                            cy={cy}
                                            r={isHovered ? 5 : 3}
                                            className={`transition-all ${isHovered
                                                ? "fill-cyan-300 stroke-cyan-500 stroke-2"
                                                : "fill-cyan-400"
                                                }`}
                                        />
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                                    <strong className="text-foreground">Repeated Customers</strong> (Visit count &gt; 1)
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
                                    <span>New Visitors</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
                                    <span>Total Interactions & Views</span>
                                </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground/70 font-mono">
                                Hover over bars to inspect daily data
                            </span>
                        </div>
                    </div>
                </div>

                {/* Feedback Alert */}
                {feedback && (
                    <div
                        className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${feedback.type === "success"
                            ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                            : "bg-red-950/30 border-red-500/30 text-red-300"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {feedback.type === "success" ? (
                                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                            )}
                            <span>{feedback.text}</span>
                        </div>
                        <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1.5 border-b border-border/60 pb-2">
                    <button
                        onClick={() => setActiveTab("bookings")}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === "bookings"
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                            }`}
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Consultations</span>
                        {stats.pendingCount > 0 ? (
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "bookings"
                                    ? "bg-background text-foreground"
                                    : "bg-amber-500 text-black animate-pulse"
                                    }`}
                            >
                                {stats.pendingCount}
                            </span>
                        ) : (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-border/80 text-muted-foreground font-mono">
                                {bookings.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("visitors")}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === "visitors"
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                            }`}
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>Visitors & Leads</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-border/80 text-muted-foreground font-mono">
                            {visitors.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab("messages")}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === "messages"
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                            }`}
                    >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Messages</span>
                        {unreadCount > 0 ? (
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${activeTab === "messages"
                                    ? "bg-background text-foreground"
                                    : "bg-emerald-500 text-black animate-pulse"
                                    }`}
                            >
                                {unreadCount} new
                            </span>
                        ) : (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-border/80 text-muted-foreground font-mono">
                                {inboxMessages.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* TAB 1: BOOKINGS */}
                {activeTab === "bookings" && (
                    <div className="space-y-4">
                        {/* Filters & Search */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1 bg-card/60 p-1 rounded-xl border border-border/60">
                                {(["all", "pending", "confirmed", "rejected", "cancelled"] as StatusFilter[]).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${statusFilter === status
                                            ? "bg-foreground text-background font-semibold shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <div className="relative min-w-[260px]">
                                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Filter by client, email, topic..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-card/60 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                                />
                            </div>
                        </div>

                        {/* Bookings List */}
                        {filteredBookings.length === 0 ? (
                            <div className="p-12 text-center rounded-2xl bg-card/40 border border-border/50 text-muted-foreground">
                                <Calendar className="w-8 h-8 mx-auto mb-2.5 opacity-40" />
                                <p className="text-xs">No bookings found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {filteredBookings.map((b) => {
                                    const isPending = b.status === "pending";
                                    const isConfirmed = b.status === "confirmed";
                                    const isRejected = b.status === "rejected";
                                    const id = b.bookingId || b.id || (b._id as string);
                                    const initials = b.name
                                        ? b.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
                                        : "CL";

                                    return (
                                        <div
                                            key={id}
                                            className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                        >
                                            {/* Client and Booking Details */}
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-full bg-muted/80 border border-border/60 flex items-center justify-center font-bold text-xs text-foreground shrink-0 mt-0.5">
                                                    {initials}
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-semibold text-foreground text-sm">
                                                            {b.name}
                                                        </h3>
                                                        <span className="text-xs text-muted-foreground font-mono">
                                                            {b.email}
                                                        </span>

                                                        {b.phone && (
                                                            <a
                                                                href={`tel:${b.phone}`}
                                                                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                                                            >
                                                                <Phone className="w-3 h-3" />
                                                                {b.phone}
                                                            </a>
                                                        )}

                                                        <span
                                                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isPending
                                                                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                                                : isConfirmed
                                                                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                                                    : isRejected
                                                                        ? "bg-red-500/15 text-red-300 border border-red-500/30"
                                                                        : "bg-muted text-muted-foreground"
                                                                }`}
                                                        >
                                                            {b.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                        <span className="text-foreground font-medium">
                                                            {b.topic}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1 text-foreground/80">
                                                            <Calendar className="w-3 h-3 text-muted-foreground" />
                                                            {b.date} at {b.timeSlot}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {new Date(b.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    {b.message && (
                                                        <p className="text-xs text-muted-foreground/80 line-clamp-1 italic">
                                                            &ldquo;{b.message}&rdquo;
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0">
                                                {isPending && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAccept(id)}
                                                            disabled={actionLoading === id}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                                        >
                                                            <Check className="w-3.5 h-3.5" />
                                                            <span>{actionLoading === id ? "..." : "Accept"}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectModalBooking(b)}
                                                            disabled={actionLoading === id}
                                                            className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs transition-colors flex items-center gap-1"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            <span>Decline</span>
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
                                                                className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 flex items-center gap-1.5 transition-colors"
                                                            >
                                                                <Video className="w-3.5 h-3.5" />
                                                                <span>Meet</span>
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => handleCancel(id)}
                                                            disabled={actionLoading === id}
                                                            className="px-2.5 py-1.5 text-xs rounded-lg border border-border/60 text-muted-foreground hover:text-red-400 transition-colors"
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
                                                        className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
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
                                                    className="p-2 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                                                    title="Email Client"
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                    onClick={() => setSelectedBooking(b)}
                                                    className="px-2.5 py-1.5 text-xs rounded-lg border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    Details
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
                        <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-border/60 bg-background/40 text-muted-foreground uppercase text-[10px] font-semibold tracking-wider">
                                    <tr>
                                        <th className="p-3.5">Visitor / Lead</th>
                                        <th className="p-3.5">Contact</th>
                                        <th className="p-3.5">Location</th>
                                        <th className="p-3.5">Platform</th>
                                        <th className="p-3.5">Visits</th>
                                        <th className="p-3.5">Activity</th>
                                        <th className="p-3.5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {visitors.map((v) => {
                                        const isIdentified = Boolean(v.email || v.name);
                                        const views = v.pageViews || [];
                                        const messagesCount = v.linkedMessages?.length || 0;

                                        return (
                                            <tr key={v.visitorId} className="hover:bg-muted/20 transition-colors">
                                                <td className="p-3.5">
                                                    {isIdentified ? (
                                                        <div>
                                                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                                                                <span>{v.name || "Identified Lead"}</span>
                                                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                                                                    Lead
                                                                </span>
                                                            </div>
                                                            <div className="text-muted-foreground/70 font-mono text-[10px] mt-0.5">
                                                                {v.ip ? `IP: ${v.ip}` : v.visitorId.substring(0, 12)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className="font-mono text-muted-foreground">
                                                                Visitor ({v.visitorId.substring(0, 10)}...)
                                                            </span>
                                                            {v.ip && (
                                                                <div className="text-muted-foreground/60 font-mono text-[10px]">
                                                                    {v.ip}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-3.5">
                                                    {v.email && (
                                                        <div className="text-foreground">{v.email}</div>
                                                    )}
                                                    {v.phone && (
                                                        <div className="text-emerald-400 flex items-center gap-1 mt-0.5 font-mono">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{v.phone}</span>
                                                        </div>
                                                    )}
                                                    {!v.email && !v.phone && (
                                                        <span className="text-muted-foreground/60 italic">Anonymous</span>
                                                    )}
                                                </td>
                                                <td className="p-3.5">
                                                    {v.country || v.city ? (
                                                        <div className="flex items-center gap-1.5 text-foreground">
                                                            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                                                            <span>{[v.city, v.country].filter(Boolean).join(", ")}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground/60 italic">Global</span>
                                                    )}
                                                </td>
                                                <td className="p-3.5">
                                                    <div className="flex items-center gap-1.5 text-foreground">
                                                        {v.device === "mobile" ? (
                                                            <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                        ) : (
                                                            <Laptop className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                                        )}
                                                        <span className="capitalize">{v.device || "Desktop"}</span>
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground mt-0.5">
                                                        {[v.os, v.browser].filter(Boolean).join(" · ") || "Web"}
                                                    </div>
                                                </td>
                                                <td className="p-3.5 font-mono text-foreground font-semibold">
                                                    {v.visitCount}
                                                </td>
                                                <td className="p-3.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => setSelectedVisitorJourney(v)}
                                                            className="px-2 py-1 rounded bg-muted/60 hover:bg-muted border border-border/60 text-foreground text-[11px] font-medium flex items-center gap-1"
                                                        >
                                                            <Compass className="w-3 h-3 text-blue-400" />
                                                            <span>{views.length} views</span>
                                                        </button>
                                                        {messagesCount > 0 && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 font-medium">
                                                                {messagesCount} inq
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {v.phone && (
                                                            <a
                                                                href={`https://wa.me/${v.phone.replace(/[^0-9]/g, "")}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                                                title="WhatsApp"
                                                            >
                                                                <Phone className="w-3 h-3" />
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
                                                                className="p-1.5 rounded-lg border border-border/60 hover:border-foreground/40 text-foreground"
                                                                title="Message"
                                                            >
                                                                <Send className="w-3 h-3" />
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

                {/* TAB 3: MESSAGES (INBOX & OUTBOX) */}
                {activeTab === "messages" && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Subtabs for Inbox & Outbox */}
                            <div className="flex items-center gap-2 bg-card/60 p-1 rounded-xl border border-border/60 w-fit">
                                <button
                                    onClick={() => setMessageSubTab("inbox")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${messageSubTab === "inbox"
                                        ? "bg-foreground text-background shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Inbox className="w-3.5 h-3.5" />
                                    <span>Inbox</span>
                                    {unreadCount > 0 ? (
                                        <span
                                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${messageSubTab === "inbox"
                                                ? "bg-background text-foreground"
                                                : "bg-emerald-500 text-black animate-pulse"
                                                }`}
                                        >
                                            {unreadCount}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-border/80 text-muted-foreground font-mono">
                                            {inboxMessages.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setMessageSubTab("outbox")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${messageSubTab === "outbox"
                                        ? "bg-foreground text-background shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Outbox</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-border/80 text-muted-foreground font-mono">
                                        {outboxMessages.length}
                                    </span>
                                </button>
                            </div>

                            <button
                                onClick={() =>
                                    setComposeModal({
                                        open: true,
                                        to: "",
                                        name: undefined,
                                        visitorId: undefined,
                                        replyToMessageId: undefined,
                                    })
                                }
                                className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-sm"
                            >
                                <Send className="w-3.5 h-3.5" />
                                <span>Compose Email</span>
                            </button>
                        </div>

                        {/* SUBTAB: INBOX */}
                        {messageSubTab === "inbox" && (
                            <div>
                                {inboxMessages.length === 0 ? (
                                    <div className="p-12 text-center rounded-2xl bg-card/40 border border-border/50 text-muted-foreground">
                                        <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-xs">No inquiries received yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {inboxMessages.map((m) => {
                                            const id = m._id || m.id || "";
                                            const isUnread = m.status === "unread";
                                            const isReplied = m.status === "replied";

                                            return (
                                                <div
                                                    key={id}
                                                    className={`p-4 rounded-xl bg-card/60 backdrop-blur-sm border transition-all space-y-2.5 ${isUnread
                                                        ? "border-emerald-500/40 shadow-sm shadow-emerald-500/5 bg-emerald-950/10"
                                                        : "border-border/50"
                                                        }`}
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-semibold text-foreground text-xs">
                                                                {m.name || "Client"}
                                                            </span>
                                                            <span className="text-xs text-muted-foreground font-mono">
                                                                • {m.email}
                                                            </span>
                                                            {m.phone && (
                                                                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                                                                    <Phone className="w-3 h-3" />
                                                                    {m.phone}
                                                                </span>
                                                            )}
                                                            {isUnread && (
                                                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-black font-bold uppercase">
                                                                    New
                                                                </span>
                                                            )}
                                                            {isReplied && (
                                                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-semibold uppercase">
                                                                    Replied
                                                                </span>
                                                            )}
                                                        </div>

                                                        <span className="text-[11px] text-muted-foreground font-mono">
                                                            {new Date(m.createdAt || m.sentAt).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <div className="text-xs font-semibold text-foreground">
                                                        {m.subject}
                                                    </div>

                                                    <div className="p-3 rounded-lg bg-background/80 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed border border-border/40">
                                                        {m.body}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                onClick={() => handleReplyToInquiry(m)}
                                                                className="px-2.5 py-1 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 flex items-center gap-1 transition-opacity"
                                                            >
                                                                <Send className="w-3 h-3" />
                                                                <span>Reply</span>
                                                            </button>

                                                            <button
                                                                onClick={() => handleMarkMessageStatus(id, isUnread ? "read" : "unread")}
                                                                className="px-2 py-1 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition-colors"
                                                            >
                                                                {isUnread ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                                <span>{isUnread ? "Mark Read" : "Mark Unread"}</span>
                                                            </button>

                                                            {m.phone && (
                                                                <a
                                                                    href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-2 py-1 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs flex items-center gap-1 transition-colors"
                                                                >
                                                                    <Phone className="w-3 h-3" />
                                                                    <span>WhatsApp</span>
                                                                </a>
                                                            )}
                                                        </div>

                                                        <button
                                                            onClick={() => handleDeleteMessage(id)}
                                                            className="p-1 rounded-lg border border-border/60 text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-colors"
                                                            title="Delete Message"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SUBTAB: OUTBOX */}
                        {messageSubTab === "outbox" && (
                            <div>
                                {outboxMessages.length === 0 ? (
                                    <div className="p-12 text-center rounded-2xl bg-card/40 border border-border/50 text-muted-foreground">
                                        <Send className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-xs">No outbound emails recorded.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {outboxMessages.map((m) => {
                                            const id = m._id || m.id || "";
                                            return (
                                                <div key={id} className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-foreground text-xs">
                                                                To: {m.recipientName ? `${m.recipientName} (${m.sentTo || m.recipientEmail})` : (m.sentTo || m.recipientEmail)}
                                                            </span>
                                                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-bold uppercase">
                                                                Sent
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] text-muted-foreground font-mono">
                                                            {new Date(m.sentAt || m.createdAt || "").toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-semibold text-foreground">
                                                        {m.subject}
                                                    </div>
                                                    <div className="p-3 rounded-lg bg-background/80 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed border border-border/40">
                                                        {m.body}
                                                    </div>
                                                    <div className="flex justify-end pt-0.5">
                                                        <button
                                                            onClick={() => handleDeleteMessage(id)}
                                                            className="p-1 rounded-lg border border-border/60 text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-colors"
                                                            title="Delete Record"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
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

                                {/* Linked Contact Form Inquiries */}
                                {selectedVisitorJourney.linkedMessages && selectedVisitorJourney.linkedMessages.length > 0 && (
                                    <div className="space-y-2">
                                        <span className="uppercase text-[10px] font-semibold text-muted-foreground tracking-wider">
                                            Contact Form Inquiries ({selectedVisitorJourney.linkedMessages.length})
                                        </span>
                                        <div className="space-y-1.5">
                                            {selectedVisitorJourney.linkedMessages.map((m, idx) => (
                                                <div
                                                    key={m._id || idx}
                                                    className="p-3 rounded-lg bg-background border border-border space-y-1.5"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-foreground text-xs">
                                                            {m.subject}
                                                        </span>
                                                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                                                            {m.status || "inbound"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                                                        {m.body}
                                                    </p>
                                                    <div className="text-[10px] text-muted-foreground font-mono">
                                                        {new Date(m.createdAt).toLocaleString()}
                                                    </div>
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
