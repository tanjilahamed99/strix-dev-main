"use client";

/**
 * Lightweight custom event dispatcher to trigger the consultation modal from anywhere
 * without importing the heavy modal component bundle.
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
