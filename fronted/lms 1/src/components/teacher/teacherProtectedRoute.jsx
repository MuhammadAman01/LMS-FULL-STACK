import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../services/api";

function TeacherProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkTeacher = async () => {
            try {
                const response = await api.get("/teacher/profile");

                if (response.data.teacher?.role === "teacher") {
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

        checkTeacher();
    }, []);

    if (loading) {
        return <h2>Checking authentication...</h2>;
    }

    if (!authenticated) {
        return <Navigate to="/teacher/login" replace />;
    }

    return children;
}

export default TeacherProtectedRoute;