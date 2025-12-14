import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData: Omit<UserProfile, 'id' | 'email' | 'created_at' | 'updated_at' | 'is_admin'>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setProfile(userData);
    }
    setLoading(false);
  }, []);

  const signUp = async (
    email: string,
    password: string,
    profileData: Omit<UserProfile, 'id' | 'email' | 'created_at' | 'updated_at' | 'is_admin'>
  ) => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find((u: any) => u.email === email);
    if (userExists) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: UserProfile = {
      id: Date.now().toString(),
      email,
      ...profileData,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store user credentials
    const userCredentials = { email, password };
    localStorage.setItem('userCredentials', JSON.stringify([...JSON.parse(localStorage.getItem('userCredentials') || '[]'), userCredentials]));

    // Store user profile
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Set current user
    setUser(newUser);
    setProfile(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  const signIn = async (email: string, password: string) => {
    // Check credentials
    const credentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
    const userCredential = credentials.find((c: any) => c.email === email && c.password === password);
    if (!userCredential) {
      throw new Error('Invalid email or password');
    }

    // Get user profile
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userProfile = users.find((u: any) => u.email === email);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Set current user
    setUser(userProfile);
    setProfile(userProfile);
    localStorage.setItem('currentUser', JSON.stringify(userProfile));
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);

    if (userIndex === -1) throw new Error('User not found');

    users[userIndex] = { ...users[userIndex], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem('users', JSON.stringify(users));

    const updatedUser = users[userIndex];
    setUser(updatedUser);
    setProfile(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}