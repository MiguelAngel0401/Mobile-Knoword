import React from "react";
import { useAuthStore } from "@shared/store/authStore";
import ProfileScreen from "../../mobile-app/app/profile/me/Profile";

export default function ProfileIndex() {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        // si quieres, redirige a login aquí
        // router.replace("/auth/login");
        return null;
    }

    return <ProfileScreen />;
    // return <ProfileScreen userId={userId} />; // si quieres pasar userId
}