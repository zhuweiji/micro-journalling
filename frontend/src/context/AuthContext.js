import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Create an axios instance
export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        // Set the default authorization header if token exists
        if (storedToken) {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        
        return {
            token: storedToken,
            user: storedUser ? JSON.parse(storedUser) : null,
            isAuthenticated: !!storedToken
        };
    });

    const login = async (username, password) => {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/token`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log(data)
            const newAuth = {
                token: data.access_token,
                isAuthenticated: true,
                user: { username }
            };

            // Set the authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
            
            setAuth(newAuth);
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify({ username }));
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        // Remove the authorization header
        delete api.defaults.headers.common['Authorization'];
        
        setAuth({
            token: null,
            user: null,
            isAuthenticated: false
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
