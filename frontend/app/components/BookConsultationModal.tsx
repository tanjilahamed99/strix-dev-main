"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Calendar,
    Clock,
    Video,
    Check,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Shield,
    CalendarPlus,
} from "lucide-react";

export interface BookConsultationModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const CONSULTATION_TOPICS = [
    { id: "saas", label: "SaaS Platform & MVP", desc: "Multi-tenant architecture, billing & subscriptions" },
    { id: "web-app", label: "Custom Web Application", desc: "Next.js / React full-stack business apps" },
    { id: "ai-automation", label: "AI & Workflow Automation", desc: "RAG systems, AI agents, n8n pipelines" },
    { id: "cloud-devops", label: "Cloud, APIs & DevOps", desc: "Docker, AWS/GCP, microservices & REST APIs" },
    { id: "architecture-audit", label: "Architecture / Code Audit", desc: "Scale, performance, security review" },
];

const TIME_SLOTS = [
    "09:00 AM",
    "10:30 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
    "05:30 PM",
    "08:00 PM",
];

// Helper to get formatted next 10 business days
function getAvailableDates() {
    const dates = [];
    const today = new Date();
    let count = 0;
    let offset = 1;

    while (count < 8) {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        // Skip Sundays
        if (d.getDay() !== 0) {
            dates.push({
                iso: d.toISOString().split("T")[0],
                dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
                monthDay: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            });
            count++;
        }
        offset++;
    }
    return dates;
}

export default function BookConsultationModal({
    isOpen: controlledOpen,
    onClose: controlledOnClose,
}: BookConsultationModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const availableDates = getAvailableDates();

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [selectedTopic, setSelectedTopic] = useState(CONSULTATION_TOPICS[0].label);
    const [selectedDate, setSelectedDate] = useState(availableDates[0]?.iso || "");
    const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [calendarUrl, setCalendarUrl] = useState("");
    const [googleMeetUrl, setGoogleMeetUrl] = useState("");

    // Auto-fill known visitor details (server-side fetched, no PII in cookie)
    useEffect(() => {
        if (isOpen) {
            fetch("/api/visitor/me")
                .then((r) => r.json())
                .then((data) => {
                    if (data?.found) {
                        if (!name && data.name) setName(data.name);
                        if (!email && data.email) setEmail(data.email);
                        if (!phone && data.phone) setPhone(data.phone);
                    }
                })
                .catch(() => {});
        }
    }, [isOpen]);

    // Listen for custom global event so any button can open modal
    useEffect(() => {
        const handleOpen = (e: Event) => {
            const customEvent = e as CustomEvent<{ topic?: string }>;
            if (customEvent.detail?.topic) {
                setSelectedTopic(customEvent.detail.topic);
            }
            setInternalOpen(true);
        };
        window.addEventListener("open-consultation-modal", handleOpen);
        return () => window.removeEventListener("open-consultation-modal", handleOpen);
    }, []);

    // Body overflow lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleClose = () => {
        if (controlledOnClose) {
            controlledOnClose();
        } else {
            setInternalOpen(false);
        }
        setTimeout(() => {
            setStep(1);
            setSubmitError("");
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError("");

        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            let visitorId: string | undefined;
            if (typeof document !== "undefined") {
                const match = document.cookie.match(/(^|;)\s*strix_vid\s*=\s*([^;]+)/);
                if (match) visitorId = match[2];
            }

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "consultation",
                    name,
                    email,
                    phone,
                    topic: selectedTopic,
                    date: selectedDate,
                    timeSlot: selectedTime,
                    timezone,
                    message,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to submit consultation request");
            }

            setStep(4);
        } catch (err) {
            console.error("Booking error:", err);
            setSubmitError(
                err instanceof Error ? err.message : "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-background/85 backdrop-blur-md"
                    />

                    {/* Modal Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-10 my-8"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border bg-background/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        Book Free Consultation
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            Google Meet
                                        </span>
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        30-minute dedicated technical & strategy session • 100% Free
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Progress Indicator */}
                        {step !== 4 && (
                            <div className="px-6 pt-4 pb-2 border-b border-border/40 bg-card/50">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                    <span className={step >= 1 ? "text-foreground font-medium" : ""}>
                                        1. Topic
                                    </span>
                                    <span className={step >= 2 ? "text-foreground font-medium" : ""}>
                                        2. Date & Time
                                    </span>
                                    <span className={step >= 3 ? "text-foreground font-medium" : ""}>
                                        3. Your Details
                                    </span>
                                </div>
                                <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                                    <motion.div
                                        className="bg-foreground h-full"
                                        initial={{ width: "33%" }}
                                        animate={{
                                            width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Step 1: Select Topic */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-foreground uppercase tracking-wider text-muted-foreground mb-3">
                                        What would you like to discuss?
                                    </h4>
                                    <div className="space-y-2.5">
                                        {CONSULTATION_TOPICS.map((topic) => (
                                            <button
                                                key={topic.id}
                                                type="button"
                                                onClick={() => setSelectedTopic(topic.label)}
                                                className={`w-full text-left p-4 rounded-lg border transition-all flex items-start justify-between ${selectedTopic === topic.label
                                                    ? "border-foreground bg-foreground/5 glow-border"
                                                    : "border-border hover:border-foreground/40 hover:bg-card"
                                                    }`}
                                            >
                                                <div>
                                                    <div className="text-sm font-semibold text-foreground">
                                                        {topic.label}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {topic.desc}
                                                    </div>
                                                </div>
                                                {selectedTopic === topic.label && (
                                                    <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 mt-0.5">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="btn-primary inline-flex items-center gap-2"
                                        >
                                            <span>Continue to Date & Time</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Date & Time Picker */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    {/* Date Selection */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Select Meeting Date
                                            </h4>
                                            <span className="text-xs text-muted-foreground">
                                                Next available days
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {availableDates.map((item) => (
                                                <button
                                                    key={item.iso}
                                                    type="button"
                                                    onClick={() => setSelectedDate(item.iso)}
                                                    className={`p-3 rounded-lg border text-center transition-all ${selectedDate === item.iso
                                                        ? "border-foreground bg-foreground text-background font-semibold"
                                                        : "border-border hover:border-foreground/50 text-muted-foreground hover:text-foreground"
                                                        }`}
                                                >
                                                    <div className="text-[11px] uppercase tracking-wider">
                                                        {item.dayName}
                                                    </div>
                                                    <div className="text-sm font-bold mt-0.5">
                                                        {item.monthDay}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Slot Selection */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Choose 30-Min Time Slot
                                            </h4>
                                            <span className="text-xs text-muted-foreground">
                                                Your local timezone
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {TIME_SLOTS.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => setSelectedTime(slot)}
                                                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all ${selectedTime === slot
                                                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold"
                                                        : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <div className="pt-2 flex items-center justify-between border-t border-border">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                                        >
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            className="btn-primary inline-flex items-center gap-2"
                                        >
                                            <span>Continue to Details</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Contact Details & Submit */}
                            {step === 3 && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="p-3.5 rounded-lg bg-card border border-border flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 text-foreground font-medium">
                                            <Video className="w-4 h-4 text-emerald-400" />
                                            <span>
                                                {selectedDate} at {selectedTime}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground truncate max-w-[200px]">
                                            {selectedTopic}
                                        </span>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                                                Your Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Alex Morgan"
                                                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                                                Work Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="alex@company.com"
                                                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                                            Phone / WhatsApp (Optional)
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                                            Project Brief or Website URL (Optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Tell us what you're building, key challenges, or existing repo/website link..."
                                            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground resize-none"
                                        />
                                    </div>

                                    {/* Guarantees */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                                        <span className="flex items-center gap-1 text-emerald-400">
                                            <Shield className="w-3.5 h-3.5" /> 100% Free & No Obligation
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Instant Google Meet Link
                                        </span>
                                    </div>

                                    {submitError && (
                                        <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded border border-red-800/50">
                                            {submitError}
                                        </p>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="pt-3 flex items-center justify-between border-t border-border">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                                        >
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <span>
                                                {isSubmitting ? "Confirming Appointment..." : "Confirm Google Meet Appointment"}
                                            </span>
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Step 4: Pending Confirmation View */}
                            {step === 4 && (
                                <div className="text-center py-6 space-y-6">
                                    <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                                        <Clock className="w-8 h-8" />
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-bold text-foreground">
                                            Request Received!
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                                            Your 30-minute consultation request is pending review by our engineering team:
                                        </p>
                                        <div className="mt-4 p-4 rounded-lg bg-card border border-border inline-block text-left text-sm min-w-[280px]">
                                            <div className="font-semibold text-amber-400">
                                                📅 {selectedDate} at {selectedTime}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Topic: {selectedTopic}
                                            </div>
                                            <div className="text-xs font-semibold text-amber-300 mt-2 flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                                Status: Pending Review
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-background border border-border text-xs text-muted-foreground max-w-md mx-auto text-left leading-relaxed">
                                        <p>
                                            We sent a receipt to <strong className="text-foreground">{email}</strong>. Once our lead engineer verifies availability, you will receive an official confirmation email with your <strong>Google Meet link</strong> and calendar invitation (.ics).
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="btn-primary px-8 py-2.5 text-xs font-semibold inline-flex items-center gap-2"
                                        >
                                            <Check className="w-4 h-4" />
                                            <span>Got it, Thanks!</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

/**
 * Utility helper to trigger consultation modal from anywhere
 */
export function openConsultationModal(topic?: string) {
    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent("open-consultation-modal", {
                detail: { topic },
            })
        );
    }
}
