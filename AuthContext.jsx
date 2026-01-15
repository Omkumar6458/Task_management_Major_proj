import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
// LOAD TO SERVICE THAT TALK TO BACKEND 

const AuthContext = createContext(null); // USED TO SHARE SUTH DATA GLOBAL 

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // LIFE CYCLE OF USER 
    const [loading, setLoading] = useState(true); // CHECK ANY PREV ON PRESENT USER ?

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser({
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
        });
        return data;
    };
{/* 
    HERE WHEN LOGIN : CLASS TO BACKEND , 2 GET JWT 3. STORES TOKEN AND + USER LOCALSTORAGE 

    
    
    */}





    const register = async (userData) => {
        return await authService.register(userData);
    }; // AT REGIESTER TIME NO STATE IS GET CHANGE 

    const logout = () => {
        authService.logout();
        setUser(null);
    }; // CLEAR LOCALSTORAGE 

    const isAdmin = () => {
        return user?.role === 'ADMIN';
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;





{/* 
    
    AuthContext → talks to React components
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    */}