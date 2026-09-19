/**
 * Client-side helper that posts to the internal Next.js Nodemailer API route.
 */
export const SendEmail = async (formData: { name: string; email: string; message: string }) => {
    const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: "inquiry",
            ...formData,
        }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send email");
    }

    return await res.json();
};