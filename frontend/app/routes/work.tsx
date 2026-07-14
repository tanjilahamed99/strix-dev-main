import type { Route } from "./+types/home";
import HeroSection from "~/components/work/HeroSection";
import Projects from "~/components/work/Projects";
import WorkStats from "~/components/work/WorkStats";
import WorkCTA from "~/components/work/WorkCTA";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Strix Devs | Work " },
        { name: "description", content: "Work History of Strix Devs" },
    ];
}


export default function Work() {
    return (
        <main className="pt-24">
            <HeroSection />
            <Projects />
            {/* <WorkStats /> */}
            <WorkCTA />
        </main>
    );
}
