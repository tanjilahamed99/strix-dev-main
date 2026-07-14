import { type RouteConfig, index, route ,} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("services", "routes/services.tsx"),
    route("work", "routes/work.tsx"),
    route("contact", "routes/contact.tsx"),
    route("privacy-policy", "routes/privacypolicy.tsx"),
    route("terms-of-service", "routes/termsofservice.tsx"),
    route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
