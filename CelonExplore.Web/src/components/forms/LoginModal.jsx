import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({
    isOpen,
    onClose,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const user = await login(
                email,
                password
            );

            onClose();

            switch (user.role) {
                case "Admin":
                    navigate("/admin/dashboard");
                    break;

                case "HotelOwner":
                    navigate("/hotel-owner/dashboard");
                    break;

                case "RestaurantOwner":
                    navigate(
                        "/restaurant-owner/dashboard"
                    );
                    break;

                case "Customer":
                    navigate("/");
                    break;

                default:
                    navigate("/");
            }
        } catch (err) {
            setError(
                err.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="relative w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl mx-4">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
                    Login
                </h2>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="example@gmail.com"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 rounded-xl disabled:opacity-50"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default LoginModal;