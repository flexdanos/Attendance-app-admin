"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { getDecryptedToken } from "@/utils/tokenStorage";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const authData = localStorage.getItem("authUser");
                const access = getDecryptedToken("access");
                const refresh = getDecryptedToken("refresh");

                if (!authData || !access || !refresh) {
                    router.replace("/login");
                    return;
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Auth check failed:", error);
                router.replace("/login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <FaSpinner className="text-4xl text-burgundy-700 animate-spin" />
                    <p className="text-gray-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
