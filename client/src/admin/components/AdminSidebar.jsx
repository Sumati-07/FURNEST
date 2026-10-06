import {
    LayoutDashboard,
    Users,
    PawPrint,
    FileText,
    ClipboardList,
    CalendarCheck,
    Star,
    Flag,
    BarChart3,
    Brain,
    Settings,
    LogOut
} from "lucide-react";

import {
    NavLink,
    useNavigate
} from "react-router-dom";

import {
    adminLogout
} from "../services/adminApi.js";


export default function AdminSidebar() {

    const navigate = useNavigate();


    function handleLogout() {

        adminLogout();

        navigate(
            "/admin/login",
            {
                replace: true
            }
        );
    }


    const links = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: Users
        },
        {
            label: "Pets",
            path: "/admin/pets",
            icon: PawPrint
        },
        {
            label: "Posts",
            path: "/admin/posts",
            icon: FileText
        },
        {
            label: "Applications",
            path: "/admin/applications",
            icon: ClipboardList
        },
        {
            label: "Bookings",
            path: "/admin/bookings",
            icon: CalendarCheck
        },
        {
            label: "Reviews",
            path: "/admin/reviews",
            icon: Star
        },
        {
            label: "Reports",
            path: "/admin/reports",
            icon: Flag
        },
        {
            label: "Analytics",
            path: "/admin/analytics",
            icon: BarChart3
        },
        {
            label: "AI Insights",
            path: "/admin/ai-insights",
            icon: Brain
        },
        {
            label: "Settings",
            path: "/admin/settings",
            icon: Settings
        }
    ];


    return (
        <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-pine text-white">

            {/* Logo */}
            <div className="border-b border-white/10 px-6 py-6">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <PawPrint size={21} />
                    </div>

                    <div>

                        <p className="font-display text-xl font-semibold">
                            FURNEST
                        </p>

                        <p className="text-xs text-white/50">
                            Admin Panel
                        </p>

                    </div>

                </div>

            </div>


            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-5">

                {links.map((link) => {

                    const Icon = link.icon;

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                    isActive
                                        ? "bg-white text-pine font-semibold"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                }`
                            }
                        >

                            <Icon size={18} />

                            {link.label}

                        </NavLink>
                    );

                })}

            </nav>


            {/* Logout */}
            <div className="border-t border-white/10 p-3">

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </aside>
    );
}