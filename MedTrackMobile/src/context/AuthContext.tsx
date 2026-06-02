import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    userToken: string | null;
    roleID: number | null;
    userID: number | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [roleID, setRoleID] = useState<number | null>(null);
    const [userID, setUserID] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Kiểm tra token khi app vừa khởi động
    const checkToken = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                const decoded: any = jwtDecode(token);
                setUserToken(token);
                setRoleID(decoded.roleID);
                setUserID(decoded.userID);
            }
        } catch (error) {
            console.log('Token check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    const login = async (token: string) => {
        setIsLoading(true);
        await SecureStore.setItemAsync('userToken', token);
        const decoded: any = jwtDecode(token);
        setUserToken(token);
        setRoleID(decoded.roleID);
        setUserID(decoded.userID);
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
        setRoleID(null);
        setUserID(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ userToken, roleID, userID, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};