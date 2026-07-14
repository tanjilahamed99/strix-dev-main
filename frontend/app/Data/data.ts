import {
    MonitorCog,
    Layers3,
    BarChart3,
    Server,
    Bot,
    Cloud,
    ShieldCheck,
    Mail,
    MessageCircle,
    Linkedin,
    MapPin,
} from "lucide-react";

export const services = [
    {
        id: "custom-web-applications",
        icon: MonitorCog,
        title: "Custom Web Applications",
        description:
            "We design and develop scalable, secure, and high-performance web applications tailored to your business requirements.",
        features: [
            "Admin Dashboards",
            "Management Systems",
            "Customer Portals",
            "Multi-role Authentication",
        ],
        number: "01",
    },
    {
        id: "saas-development",
        icon: Layers3,
        title: "SaaS Development",
        description:
            "From MVPs to enterprise SaaS platforms, we build secure, scalable software solutions that grow with your business.",
        features: [
            "Multi-tenant Architecture",
            "Subscription & Billing",
            "Role & Permission Management",
            "Analytics Dashboard",
        ],
        number: "02",
    },
    {
        id: "business-dashboards",
        icon: BarChart3,
        title: "Business Dashboards",
        description:
            "Interactive dashboards that transform business data into actionable insights for smarter decision-making.",
        features: [
            "KPI Tracking",
            "Reports & Analytics",
            "Real-time Data",
            "Export Features",
        ],
        number: "03",
    },
    {
        id: "api-development",
        icon: Server,
        title: "API Development & Integration",
        description:
            "Secure and scalable REST APIs with seamless third-party integrations for modern applications.",
        features: [
            "REST API Development",
            "Payment Gateway Integration",
            "Authentication Systems",
            "API Documentation",
        ],
        number: "04",
    },
    {
        id: "ai-automation",
        icon: Bot,
        title: "AI Automation Solutions",
        description:
            "Automate repetitive workflows using AI agents, chatbots, RAG systems, and intelligent business automation.",
        features: [
            "AI Chatbots & Agents",
            "RAG Systems",
            "Workflow Automation",
            "CRM & Business Integrations",
        ],
        number: "05",
    },
    {
        id: "cloud-devops",
        icon: Cloud,
        title: "Cloud Deployment & DevOps",
        description:
            "Reliable cloud infrastructure, automated deployments, and DevOps practices for fast and secure software delivery.",
        features: [
            "Docker Containerization",
            "CI/CD Pipelines",
            "VPS & Cloud Deployment",
            "SSL & Performance Optimization",
        ],
        number: "06",
    },
    {
        id: "maintenance-support",
        icon: ShieldCheck,
        title: "Maintenance & Support",
        description:
            "We keep your applications secure, optimized, and running smoothly after launch with proactive maintenance.",
        features: [
            "Bug Fixes",
            "Security Updates",
            "Performance Monitoring",
            "30 Days Free Support",
        ],
        number: "07",
    },
];

export const projects = [
    {
        title: "Empori Anxo Medicare (EAML)",
        category: "Corporate Web Platform",
        description:
            "Full-stack corporate website and product catalogue for a medical equipment distribution company in Bangladesh, featuring dynamic product specs, category/brand filtering, a news & blog system, and quote requests — all powered by a custom Filament admin panel.",
        techStack: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Laravel",
            "Filament",
            "MySQL",
            "GitHub Actions",
        ],
        image: "/images/projects/emporianxomedicare.jpg",
        year: "2026",
        link: "https://emporianxomedicare.com/",
    },
    {
        title: "CallBell",
        category: "SaaS",
        description:
            "QR-based real-time voice and video calling platform enabling instant, secure communication with enterprise-grade encryption, global connectivity, and usage-based plans.",
        techStack: [
            "React.js",
            "TypeScript",
            "Redux",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Socket.io",
            "Live Kit",
            "paygic",
            "Razorpay",
        ],
        image: "/images/projects/callbell.jpg",
        year: "2026",
        link: "https://callbell.in/",
    },
    {
        title: "Sewamahe",
        category: "SaaS",
        description:
            "Real-time expert consultation platform enabling users to connect with verified professionals through secure HD video calls, instant matching, and transparent, usage-based pricing.",
        techStack: [
            "React.js",
            "TypeScript",
            "Redux",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Socket.io",
            "Live Kit",
            "paygic",
            "Razorpay",
        ],
        image: "/images/projects/sewamahe.jpg",
        year: "2026",
        link: "https://sewamahe.in/",
    },
    {
        title: "Pulse Pixel",
        category: "Subscription Platform",
        description:
            "Pulse Pixel is a digital subscription platform that provides affordable access to premium learning tools like Udemy, Coursera, Codecademy, and more through custom education plans, all managed from one place.",
        techStack: [
            "React.js",
            "TypeScript",
            "Node.js",
            "Express.js",
            "MongoDB",
            "Socket.io",
        ],
        image: "/images/projects/pulsepixel.jpg",
        year: "2025",
        client: "LearnPath Education",
        link: "https://thepulsepixel.com/",
    },
    {
        title: "Akatsuki",
        category: "E-Commerce",
        description:
            "AKATSUKI is an anime streaming and manga e-commerce platform where users can watch anime, buy manga, read blogs, and manage subscriptions through a secure dashboard with multiple payment options.",
        techStack: [
            "Next.js",
            "TypeScript",
            "MongoDB",
            "Stripe",
            "Paypal",
            "SSLCommerz",
        ],
        image: "https://i.ibb.co.com/YFb7DpQp/akatsuki.png",
        year: "2025",
        link: "https://akatsuki-ivory.vercel.app/",
    },
    {
        title: "PrimePix",
        category: "E-Commerce",
        description:
            "Modern e-commerce platform offering refurbished and new gadgets, electronics, and accessories with seamless shopping, secure checkout, and category-based product discovery.",
        techStack: ["Next.js", "TypeScript", "Sanity CMS", "Stripe"],
        image: "https://i.ibb.co.com/rGBphptb/Prime-Pix.png",
        year: "2025",
        link: "https://prime-pix-omega.vercel.app/",
    },
];

export const team = [
    {
        name: "Shamim Hossain",
        role: "CEO & Founder",
        image: "https://i.ibb.co/Gfqj4gXZ/Shamim.jpg",
        bio: "Vision-driven founder leading Strix Devs with a focus on long-term product quality, strong client relationships, and building technology that actually solves real business problems.",
    },
    {
        name: "Shajim Ahmed",
        role: "Lead Engineer",
        image: "https://i.ibb.co/F4yQhhb3/Shajim.png",
        bio: "Leads architecture and backend systems with a strong focus on scalability, performance, and clean engineering practices. Turns complex ideas into reliable production software.",
    },
    {
        name: "Tanjil Ahmed",
        role: "Full-Stack Developer",
        image: "https://i.ibb.co.com/PvMGv84j/tanjil.jpg",
        bio: "Builds seamless end-to-end web experiences, from polished UI to powerful APIs. Passionate about shipping fast without sacrificing code quality.",
    },
    {
        name: "Mirajul Islam Fahim",
        role: "Frontend Developer",
        image: "https://i.ibb.co.com/tTB7RnrR/Whats-App-Image-2026-04-18-at-11-31-56-PM.jpg",
        bio: "Crafts modern, responsive interfaces that feel smooth and intuitive. Focused on performance, accessibility, and pixel-perfect execution.",
    },
    {
        name: "Ovi Saha",
        role: "BackEnd Developer",
        image: "https://i.ibb.co.com/pvV4TqPF/team-1.png",
        bio: "Supports product delivery across the stack, contributing to new features, optimizations, and continuous improvement of our development workflow.",
    },
];

export const contactInfo = [
    {
        icon: Mail,
        label: "Email",
        value: "info@strixdevs.com",
        href: "mailto:info@strixdevs.com",
    },
    {
        icon: MessageCircle,
        label: "WhatsApp",
        value: "+880 1518933208",
        href: "https://wa.me/+8801518933208",
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        value: "Strix Devs",
        href: "https://www.linkedin.com/company/strixdevs",
    },
    {
        icon: MapPin,
        label: "Office",
        value: "Toronto, Canada",
        href: "#",
    },
];

export const steps = [
    {
        number: "01",
        phase: "Discovery",
        title: "Understand Your Business",
        desc: "We begin by understanding your business goals, challenges, users, and workflows. This helps us recommend the right technology and build solutions that create measurable value.",
        deliverable: "Requirements analysis + project roadmap",
    },
    {
        number: "02",
        phase: "Strategy & Architecture",
        title: "Plan for Scale",
        desc: "Before writing code, we design the application architecture, database, APIs, security model, and cloud infrastructure to ensure scalability and long-term reliability.",
        deliverable:
            "System architecture + database design + technical specification",
    },
    {
        number: "03",
        phase: "Design",
        title: "Craft a Modern Experience",
        desc: "We create intuitive, responsive, and user-focused interfaces that simplify complex workflows while maintaining a clean and professional experience.",
        deliverable: "Wireframes + UI/UX designs + interactive prototype",
    },
    {
        number: "04",
        phase: "Development",
        title: "Build with Modern Technologies",
        desc: "Our engineers develop scalable web applications, SaaS platforms, APIs, AI automation systems, and cloud solutions using agile development with continuous client feedback.",
        deliverable: "Sprint releases + demo sessions + progress reports",
    },
    {
        number: "05",
        phase: "Testing & Deployment",
        title: "Launch with Confidence",
        desc: "Every solution undergoes comprehensive testing, security reviews, performance optimization, and cloud deployment to ensure a reliable production release.",
        deliverable:
            "Production deployment + documentation + knowledge transfer",
    },
    {
        number: "06",
        phase: "Support & Growth",
        title: "Long-Term Technology Partner",
        desc: "After launch, we provide maintenance, monitoring, feature enhancements, AI workflow optimization, and technical support to help your business continue growing.",
        deliverable:
            "30 days complimentary support + ongoing maintenance options",
    },
];

export const faqs = [
    {
        q: "What services does Strix Devs provide?",
        a: "We build custom software solutions for businesses, including web applications, SaaS platforms, business dashboards, API integrations, AI automation systems, cloud deployment, and ongoing maintenance. From planning to launch, we handle the entire development lifecycle.",
    },
    {
        q: "Can you build our product from idea to launch?",
        a: "Absolutely. Whether you have a rough idea or detailed requirements, we guide you through discovery, planning, design, development, testing, deployment, and post-launch support to bring your vision to life.",
    },
    {
        q: "Can you improve or modernize an existing application?",
        a: "Yes. We work with existing systems to improve performance, security, user experience, scalability, and maintainability. We can also add new features, integrate third-party services, or migrate legacy applications to modern technologies.",
    },
    {
        q: "Do you develop AI-powered solutions?",
        a: "Yes. We build AI chatbots, AI agents, business workflow automation, document processing systems, knowledge assistants, customer support automation, and custom AI solutions tailored to your business processes.",
    },
    {
        q: "How do you choose the right technology?",
        a: "Every project is different. We select technologies based on your business goals, scalability requirements, budget, and long-term growth plans to ensure your solution remains reliable, secure, and easy to maintain.",
    },
    {
        q: "How long does a typical project take?",
        a: "Project timelines depend on complexity. Smaller applications usually take 2–4 weeks, MVPs typically require 4–8 weeks, while larger business platforms or enterprise systems may take several months. We provide a clear timeline before development begins.",
    },
    {
        q: "Do you work with international clients?",
        a: "Yes. We collaborate remotely with startups, small businesses, and enterprises worldwide. We maintain transparent communication throughout the project with regular progress updates and review meetings.",
    },
    {
        q: "Who owns the source code after the project?",
        a: "You do. Once the project is completed and the final payment is made, you receive full ownership of the source code, documentation, repositories, and deployment credentials.",
    },
    {
        q: "Do you handle deployment and hosting?",
        a: "Yes. We deploy applications to secure cloud infrastructure, configure servers, domains, SSL certificates, CI/CD pipelines, and monitoring to ensure your application is production-ready from day one.",
    },
    {
        q: "What happens after the project is launched?",
        a: "Every project includes 30 days of complimentary post-launch maintenance covering bug fixes, deployment assistance, and stability monitoring. We also offer flexible monthly maintenance plans for feature enhancements, performance optimization, and long-term support.",
    },
    {
        q: "How does your pricing work?",
        a: "Pricing depends on the project's scope, complexity, and timeline. We provide a detailed proposal after understanding your requirements, with milestone-based payments to ensure complete transparency throughout the project.",
    },
    {
        q: "Why choose Strix Devs?",
        a: "We're more than a development team—we're your long-term technology partner. We build scalable software, automate business processes with AI, and deliver secure, high-quality solutions backed by transparent communication, modern development practices, and dependable post-launch support.",
    },
];