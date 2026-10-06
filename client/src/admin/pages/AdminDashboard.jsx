import {
    useEffect,
    useState
} from "react";

import {
    Users,
    UserCheck,
    UserX,
    PawPrint,
    Heart,
    Clock,
    FileText,
    CalendarCheck,
    CheckCircle2,
    Star,
    Flag,
    RefreshCw
} from "lucide-react";

import {
    getAdminDashboard,
    getStoredAdminUser
} from "../services/adminApi.js";


export default function AdminDashboard() {

    const [stats, setStats] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    async function loadDashboard() {

        try {

            setLoading(true);
            setError("");

            const data =
                await getAdminDashboard();

            setStats(data);

        } catch (error) {

            setError(
                error.message ||
                "Failed to load dashboard."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {
        loadDashboard();
    }, []);


    const admin =
        getStoredAdminUser();


    const cards = stats
        ? [
            {
                title: "Total Users",
                value: stats.userCount,
                icon: Users,
                description: "Registered users"
            },
            {
                title: "Active Users",
                value: stats.activeUserCount,
                icon: UserCheck,
                description: "Currently active"
            },
            {
                title: "Suspended Users",
                value: stats.suspendedUserCount,
                icon: UserX,
                description: "Suspended accounts"
            },
            {
                title: "Pets",
                value: stats.petCount,
                icon: PawPrint,
                description: "Active pet profiles"
            },
            {
                title: "Adoption Posts",
                value: stats.adoptionPostCount,
                icon: Heart,
                description: "Active adoption listings"
            },
            {
                title: "Temporary Care",
                value: stats.temporaryPostCount,
                icon: Clock,
                description: "Care listings"
            },
            {
                title: "Applications",
                value: stats.applicationCount,
                icon: FileText,
                description: "Caretaker applications"
            },
            {
                title: "Active Bookings",
                value: stats.activeBookingCount,
                icon: CalendarCheck,
                description: "Currently active"
            },
            {
                title: "Completed Bookings",
                value: stats.completedBookingCount,
                icon: CheckCircle2,
                description: "Completed care"
            },
            {
                title: "Reviews",
                value: stats.reviewCount,
                icon: Star,
                description: "Visible reviews"
            },
            {
                title: "Open Reports",
                value: stats.openReportCount,
                icon: Flag,
                description: "Need attention"
            }
        ]
        : [];


    return (
        <div className="min-h-screen bg-meadow">

            {/* Header */}
            <header className="border-b border-sand bg-white">

                <div className="flex items-center justify-between px-6 py-5">

                    <div>

                        <p className="text-xs font-medium uppercase tracking-widest text-pine/60">
                            FURNEST Administration
                        </p>

                        <h1 className="mt-1 font-display text-2xl font-semibold text-bark">
                            Admin Dashboard
                        </h1>

                    </div>


                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">

                            <p className="text-sm font-semibold text-bark">
                                {admin?.name ||
                                    admin?.username ||
                                    "Administrator"}
                            </p>

                            <p className="text-xs text-bark/50">
                                Administrator
                            </p>

                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pine text-sm font-semibold text-white">
                            {(admin?.username ||
                                "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                    </div>

                </div>

            </header>


            {/* Main */}
            <main className="px-6 py-8">

                <div className="mx-auto max-w-7xl">


                    {/* Welcome */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>

                            <h2 className="font-display text-3xl font-semibold text-bark">
                                Welcome back,{" "}
                                {admin?.name ||
                                    admin?.username ||
                                    "Admin"}
                            </h2>

                            <p className="mt-2 text-sm text-bark/60">
                                Here's an overview of what's happening across FURNEST.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={loadDashboard}
                            disabled={loading}
                            className="inline-flex w-fit items-center gap-2 rounded-full border border-sand bg-white px-4 py-2.5 text-sm font-medium text-bark transition hover:border-pine hover:text-pine disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh
                        </button>

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-2xl border border-rosewood/20 bg-rosewood/10 p-4 text-sm text-rosewood">
                            {error}
                        </div>
                    )}


                    {/* Loading */}
                    {loading && !stats && (
                        <div className="rounded-3xl border border-sand bg-white p-10 text-center">

                            <RefreshCw
                                size={28}
                                className="mx-auto animate-spin text-pine"
                            />

                            <p className="mt-4 text-sm text-bark/60">
                                Loading dashboard...
                            </p>

                        </div>
                    )}


                    {/* Statistics */}
                    {stats && (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {cards.map((card) => {

                                const Icon =
                                    card.icon;

                                return (
                                    <div
                                        key={card.title}
                                        className="rounded-3xl border border-sand bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >

                                        <div className="flex items-start justify-between">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pine/10 text-pine">
                                                <Icon
                                                    size={21}
                                                />
                                            </div>

                                        </div>


                                        <p className="mt-5 text-sm font-medium text-bark/60">
                                            {card.title}
                                        </p>

                                        <p className="mt-1 font-display text-3xl font-semibold text-bark">
                                            {card.value}
                                        </p>

                                        <p className="mt-1 text-xs text-bark/40">
                                            {card.description}
                                        </p>

                                    </div>
                                );

                            })}

                        </div>
                    )}


                    {/* Admin status */}
                    {stats && (
                        <div className="mt-8 rounded-3xl border border-pine/20 bg-pine/5 p-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pine text-white">
                                    <CheckCircle2
                                        size={21}
                                    />
                                </div>

                                <div>

                                    <h3 className="font-display text-lg font-semibold text-bark">
                                        Admin system connected
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-bark/60">
                                        Your Admin frontend is successfully communicating with the FURNEST Admin API.
                                    </p>

                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}