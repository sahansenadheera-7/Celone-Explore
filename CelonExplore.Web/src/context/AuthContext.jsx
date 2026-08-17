import React, {
    createContext,
    useContext,
    useState,
} from "react";

import {
    login as loginApi,
    logout as logoutApi,
    getUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getUser());

    const login = async (email, password) => {
        const result = await loginApi(email, password);

        if (!result.success) {
            throw new Error(
                result.message || "Login failed."
            );
        }

        const userData = {
            email: result.email,
            role: result.role,
        };

        localStorage.setItem(
            "token",
            result.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);

        return userData;
    };

    const logout = () => {
        logoutApi();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}