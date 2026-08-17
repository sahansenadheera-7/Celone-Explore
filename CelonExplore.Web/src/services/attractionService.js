import { apiRequest } from "./api";

export async function getAttractions({
    search = "",
    category = "All",
    sortBy = "name",
    sortOrder = "asc",
    page = 1,
    pageSize = 10,
}) {
    const params = new URLSearchParams();

    if (search.trim()) {
        params.append("search", search.trim());
    }

    if (category && category !== "All") {
        params.append("category", category);
    }

    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    params.append("page", page);
    params.append("pageSize", pageSize);

    return apiRequest(
        `/Attractions?${params.toString()}`
    );
}


export async function getAttraction(id) {
    return apiRequest(`/Attractions/${id}`);
}


export async function createAttraction(data) {
    return apiRequest("/Attractions", {
        method: "POST",
        body: JSON.stringify(data),
    });
}


export async function updateAttraction(id, data) {
    return apiRequest(`/Attractions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}


export async function deleteAttraction(id) {
    return apiRequest(`/Attractions/${id}`, {
        method: "DELETE",
    });
}