import { apiRequest } from "./api";

export async function login(email, password) {
    return await apiRequest("/Auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}