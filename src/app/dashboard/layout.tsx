"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { NavBar } from "@/components/NavBar";
import { SideNav } from "@/components/SideNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>(null);
    const [sidebarWidth, setSidebarWidth] = useState('16rem'); // Default to w-64

    useEffect(() => {
        const authData = localStorage.getItem('authUser');
        if (authData) {
            try {
                const parsedData = JSON.parse(authData);
                setUser(parsedData.user || parsedData);
            } catch (error) {
                console.error('Failed to parse auth data:', error);
            }
        }

        // Listen for sidebar collapse state changes
        const handleSidebarChange = () => {
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            setSidebarWidth(isCollapsed ? '5rem' : '16rem');
        };

        window.addEventListener('sidebarChange', handleSidebarChange);
        handleSidebarChange(); // Initial check

        return () => {
            window.removeEventListener('sidebarChange', handleSidebarChange);
        };
    }, []);

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50">
                <NavBar user={user} />
                <div className="flex">
                    <SideNav />
                    <main 
                        className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out"
                        style={{ 
                            marginLeft: sidebarWidth,
                            marginTop: '4rem', // Account for fixed NavBar height
                            minHeight: 'calc(100vh - 4rem)' // Full height minus NavBar
                        }}
                    >
                        <div className="p-4 lg:p-6 xl:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
