import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BASE_API_URL } from "@/constants/config";

interface AuthState {
    user: any | null;
    token: string | null;
    isLoading: boolean;
    register: (username: string, email: string, password: string) => Promise<void | boolean | any>;
    login: (email: string, password: string) => Promise<void | boolean | any>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {
        set({ isLoading: true })
        try {
            const response = await fetch(`${BASE_API_URL}/auth/register`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    username,
                    email,
                    password
                }),
            })
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Something went wrong")
            
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)

            set({ token: data.token, user: data.user, isLoading: false })

            return { success: true }
        } catch (error: any) {
            set({ isLoading: false })
            return { success: false, error: error.message }
        }
    },

    login: async (email, password) => {
        set({ isLoading: true })
        try {
            const response = await fetch(`${BASE_API_URL}/auth/login`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    email,
                    password
                }),
            })
            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Something went wrong")
            
            await AsyncStorage.setItem("user", JSON.stringify(data.user))
            await AsyncStorage.setItem("token", data.token)

            set({ token: data.token, user: data.user, isLoading: false })

            return { success: true }
        } catch (error: any) {
            set({ isLoading: false })
            return { success: false, error: error.message }
        }
    },

    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const userJson = await AsyncStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;

            set({ token, user })
        } catch (error) {
            console.error("Check auth failed")
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem("token")
            await AsyncStorage.removeItem("user");
            set({ token: null, user: null })
        } catch (error) {
            console.error("Logout failed")
        }
    }
}))