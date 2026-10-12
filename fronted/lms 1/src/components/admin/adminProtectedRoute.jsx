import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../services/api";

function AdminProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await api.get("/admin/profile");

                if (response.data.admin?.role === "admin") {
                    setAuthenticated(true);
                } else {
                    setAuthenticated(false);
                }
            } catch (error) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, []);

    if (loading) {
        return <h2>Checking authentication...</h2>;
    }

    if (!authenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminProtectedRoute;