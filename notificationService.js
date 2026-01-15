
// src/services/notificationService.js

const API_URL = "http://localhost:8080/notifications";

export const notificationService = {
    getMyNotifications: async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch notifications");
        }

        return response.json();
    }
};
