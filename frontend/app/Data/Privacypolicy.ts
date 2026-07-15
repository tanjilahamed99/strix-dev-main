import type { LegalDocumentData } from "~/types/legal";

export const privacyPolicyData: LegalDocumentData = {
    eyebrow: "Legal",
    title: "Privacy Policy",
    lastUpdated: "Last updated: January 2026",
    sections: [
        {
            number: "01",
            title: "Information We Collect",
            blocks: [
                {
                    type: "paragraph",
                    text: "We collect information you voluntarily provide when you contact us, request a quote, subscribe to updates, or use our services. This information may include your name, email address, phone number, company name, project details, billing information, and any other information you choose to share. We may also automatically collect limited technical information such as your IP address, browser type, device information, pages visited, and website usage analytics.",
                },
            ],
        },
        {
            number: "02",
            title: "How We Use Your Information",
            blocks: [
                {
                    type: "list",
                    intro: "We use your information to:",
                    items: [
                        "Respond to inquiries and project requests.",
                        "Deliver and manage our services.",
                        "Communicate project updates.",
                        "Improve our website and user experience.",
                        "Maintain website security.",
                        "Comply with legal obligations.",
                    ],
                    outro: "We never sell or rent your personal information to third parties.",
                },
            ],
        },
        {
            number: "03",
            title: "Cookies & Tracking Technologies",
            blocks: [
                {
                    type: "paragraph",
                    text: "Our website may use cookies and similar technologies to improve functionality, analyze website traffic, remember user preferences, and enhance the browsing experience. You can disable cookies through your browser settings, although some features of the website may not function correctly.",
                },
            ],
        },
        {
            number: "04",
            title: "Data Sharing & Third-Party Services",
            blocks: [
                {
                    type: "paragraph",
                    text: "We work with trusted third-party service providers that help us operate our business, such as website hosting, analytics, email communication, payment processing, and cloud infrastructure. These providers only receive the information necessary to perform their services and are expected to protect your information. We do not sell your personal information.",
                },
            ],
        },
        {
            number: "05",
            title: "Data Security",
            blocks: [
                {
                    type: "paragraph",
                    text: "We implement appropriate technical and organizational safeguards to protect your information against unauthorized access, alteration, disclosure, or destruction. While we strive to use commercially reasonable security measures, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
                },
            ],
        },
        {
            number: "06",
            title: "Data Retention",
            blocks: [
                {
                    type: "paragraph",
                    text: "We retain personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer required, we securely delete or anonymize it where appropriate.",
                },
            ],
        },
        {
            number: "07",
            title: "Your Privacy Rights",
            blocks: [
                {
                    type: "list",
                    intro: "Depending on your location, you may have the right to:",
                    items: [
                        "Request access to your personal information.",
                        "Request correction of inaccurate information.",
                        "Request deletion of your personal information.",
                        "Withdraw consent where applicable.",
                        "Object to certain processing activities.",
                    ],
                    outro: "To exercise these rights, please contact us using the details provided below.",
                },
            ],
        },
        {
            number: "08",
            title: "International Data Transfers",
            blocks: [
                {
                    type: "paragraph",
                    text: "As a remote-first agency serving clients worldwide, your information may be processed or stored in different countries depending on the services used to operate our business. We take reasonable measures to ensure your information remains protected regardless of where it is processed.",
                },
            ],
        },
        {
            number: "09",
            title: "Changes to This Privacy Policy",
            blocks: [
                {
                    type: "paragraph",
                    text: 'We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices. Any updates will be posted on this page with a revised "Last Updated" date.',
                },
            ],
        },
        {
            number: "10",
            title: "Contact Us",
            blocks: [
                {
                    type: "paragraph",
                    text: "If you have any questions about this Privacy Policy, please contact us at:",
                },
                {
                    type: "contact",
                    items: [
                        "Email: info@strixdevs.com",
                        "Location: Toronto, Canada",
                        "Serving clients worldwide.",
                    ],
                },
            ],
        },
    ],
};
