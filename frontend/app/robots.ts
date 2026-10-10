import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://strixdevs.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/admin/", "/admin"],
            },
            {
                userAgent: [
                    "GPTBot",
                    "ChatGPT-User",
                    "ClaudeBot",
                    "PerplexityBot",
                    "Google-Extended",
                    "Applebot-Extended",
                    "cohere-ai",
                    "CCBot",
                    "Meta-ExternalAgent",
                    "Bytespider",
                    "Amazonbot",
                    "Diffbot",
                ],
                allow: ["/", "/llms.txt", "/llms-full.txt"],
                disallow: ["/api/", "/admin/", "/admin"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
