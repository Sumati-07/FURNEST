const API_BASE =
    import.meta.env.VITE_API_BASE ||
    "http://localhost:5000/api";


// ======================================================
// Get Admin Token
// ======================================================
function getAdminToken() {
    return localStorage.getItem("furnest_admin_token");
}


// ======================================================
// Generic Admin API Request
// ======================================================
async function request(
    path,
    {
        method = "GET",
        body
    } = {}
) {
    const headers = {
        "Content-Type": "application/json"
    };

    const token = getAdminToken();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE}${path}`,
        {
            method,
            headers,
            body: body
                ? JSON.stringify(body)
                : undefined
        }
    );

    const data = await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Admin request failed"
        );
    }

    return data;
}


// ======================================================
// Admin Login
// ======================================================
export async function adminLogin(
    identifier,
    password
) {
    const data = await request(
        "/admin/auth/login",
        {
            method: "POST",
            body: {
                identifier,
                password
            }
        }
    );

    // Store admin session separately
    localStorage.setItem(
        "furnest_admin_token",
        data.token
    );

    localStorage.setItem(
        "furnest_admin_user",
        JSON.stringify(data.user)
    );

    return data;
}


// ======================================================
// Get Admin Profile
// ======================================================
export async function getAdminProfile() {
    return request("/admin/auth/me");
}


// ======================================================
// Update Admin Profile
// ======================================================
export async function updateAdminProfile({
    name,
    newPassword,
    currentPassword
}) {
    return request(
        "/admin/auth/me",
        {
            method: "PATCH",
            body: {
                name,
                newPassword,
                currentPassword
            }
        }
    );
}


// ======================================================
// Admin Dashboard
// ======================================================
export async function getAdminDashboard() {
    return request(
        "/admin/dashboard"
    );
}


// ======================================================
// Admin Logout
// ======================================================
export function adminLogout() {
    localStorage.removeItem(
        "furnest_admin_token"
    );

    localStorage.removeItem(
        "furnest_admin_user"
    );
}


// ======================================================
// Check Admin Login
// ======================================================
export function isAdminLoggedIn() {
    return !!localStorage.getItem(
        "furnest_admin_token"
    );
}


// ======================================================
// Get Stored Admin User
// ======================================================
export function getStoredAdminUser() {
    const user =
        localStorage.getItem(
            "furnest_admin_user"
        );

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}