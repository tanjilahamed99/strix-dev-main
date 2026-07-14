import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Strix Devs || 404 Not Found" },
        { name: "description", content: "Welcome to Strix Devs" },
    ];
}
export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="mt-4 text-xl">
                Oops! The page you’re looking for doesn’t exist.
            </p>
        </div>
    );
}
