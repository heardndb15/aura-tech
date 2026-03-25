import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Demo user data for MVP (Firebase integration ready)
const DEMO_USERS = {
    'demo@aura.app': {
        uid: 'demo-user-001',
        email: 'demo@aura.app',
        displayName: 'Alex Green',
        photoURL: null,
        password: 'demo123',
    },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('aura-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Demo mode login
        const demoUser = DEMO_USERS[email];
        if (demoUser && demoUser.password === password) {
            const userData = { uid: demoUser.uid, email: demoUser.email, displayName: demoUser.displayName };
            setUser(userData);
            localStorage.setItem('aura-user', JSON.stringify(userData));
            return userData;
        }
        throw new Error('Invalid credentials. Try demo@aura.app / demo123');
    };

    const register = async (email, password, displayName) => {
        const userData = {
            uid: 'user-' + Date.now(),
            email,
            displayName: displayName || email.split('@')[0],
        };
        setUser(userData);
        localStorage.setItem('aura-user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('aura-user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
