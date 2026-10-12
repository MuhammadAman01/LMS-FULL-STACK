import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "..//../services/api";

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get("/student/profile");
                setAuthenticated(true);
            } catch (error) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <h2>Checking authentication...</h2>;
    }

    if (!authenticated) {
        return <Navigate to="/student/login" replace />;
    }

    return children;
}

export default ProtectedRoute;