import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAuthenticatedAdmin } from "~/lib/auth";

export const metadata = {
    title: "Admin Portal | Strix Devs",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Note: /admin/login is rendered inside here or as a child page
    return (
        <div className="min-h-screen bg-background text-foreground">
            {children}
        </div>
    );
}
