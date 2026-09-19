export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== "string") return false;
    const trimmed = email.trim();
    if (trimmed.length > 254) return false;
    // Standard RFC 5322 regex approximation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(trimmed);
}

export function sanitizeText(input?: string, maxLength = 5000): string {
    if (!input || typeof input !== "string") return "";
    return input.slice(0, maxLength).trim().replace(/[<>]/g, "");
}
