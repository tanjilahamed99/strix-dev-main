/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{ts,tsx,js,jsx}", // <- your main folder
    ],
    theme: {
        extend: {
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: "hsl(var(--card))",
                primary: "hsl(var(--primary))",
                secondary: "hsl(var(--secondary))",
            },
            borderRadius: {
                DEFAULT: "var(--radius)",
            },
        },
    },
    plugins: [],
};
