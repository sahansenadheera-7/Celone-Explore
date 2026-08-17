import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-red-600">
                    403
                </h1>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                    Unauthorized
                </h2>

                <p className="mt-2 text-slate-600">
                    You do not have permission to access this page.
                </p>

                <Link
                    to="/"
                    className="inline-block mt-6 bg-teal-700 text-white px-6 py-3 rounded-lg"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;