import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ShieldCheck,
    Lock,
    User,
    Eye,
    EyeOff
} from "lucide-react";

import {
    adminLogin
} from "../services/adminApi.js";


export default function AdminLogin() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!identifier || !password) {
            setError(
                "Please enter your username/email and password."
            );

            return;
        }

        try {
            setLoading(true);

            await adminLogin(
                identifier,
                password
            );

            navigate(
                "/admin/dashboard",
                {
                    replace: true
                }
            );

        } catch (error) {
            setError(
                error.message ||
                "Admin login failed."
            );
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-meadow flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo / Header */}
                <div className="text-center mb-8">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pine text-white shadow-lg">
                        <ShieldCheck
                            size={32}
                        />
                    </div>

                    <h1 className="mt-5 font-display text-3xl font-semibold text-bark">
                        FURNEST Admin
                    </h1>

                    <p className="mt-2 text-sm text-bark/60">
                        Administration Panel
                    </p>

                </div>


                {/* Login Card */}
                <div className="rounded-3xl border border-sand bg-white p-7 shadow-lg">

                    <div className="mb-6">

                        <h2 className="font-display text-xl font-semibold text-bark">
                            Admin Login
                        </h2>

                        <p className="mt-1 text-sm text-bark/50">
                            Sign in to manage the FURNEST platform.
                        </p>

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-2xl border border-rosewood/20 bg-rosewood/10 px-4 py-3 text-sm text-rosewood">
                            {error}
                        </div>
                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Identifier */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-bark">
                                Username or Email
                            </label>

                            <div className="relative">

                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-bark/40"
                                />

                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(event) =>
                                        setIdentifier(
                                            event.target.value
                                        )
                                    }
                                    placeholder="admin"
                                    autoComplete="username"
                                    className="w-full rounded-2xl border border-sand bg-white py-3 pl-11 pr-4 text-sm text-bark outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/10"
                                />

                            </div>

                        </div>


                        {/* Password */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-bark">
                                Password
                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-bark/40"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter admin password"
                                    autoComplete="current-password"
                                    className="w-full rounded-2xl border border-sand bg-white py-3 pl-11 pr-12 text-sm text-bark outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/10"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) =>
                                                !value
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-bark/40 hover:text-bark"
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={18}
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                        />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-pine px-4 py-3 text-sm font-semibold text-white transition hover:bg-pineDark disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in as Admin"}
                        </button>

                    </form>


                    {/* Security note */}
                    <div className="mt-6 rounded-2xl bg-meadow p-4">

                        <div className="flex gap-3">

                            <ShieldCheck
                                size={18}
                                className="mt-0.5 shrink-0 text-pine"
                            />

                            <p className="text-xs leading-5 text-bark/60">
                                This area is restricted to
                                authorized FURNEST administrators.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}