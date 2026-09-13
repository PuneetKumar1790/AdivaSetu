import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { INITIAL_APPLICANTS, DEMO_OFFICER } from '../data/initialApplicants';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAsApplicant: (customApplicant?: User) => void;
  loginAsOfficer: () => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storageService.getCurrentUser());

  useEffect(() => {
    storageService.setCurrentUser(user);
  }, [user]);

  const loginAsApplicant = (customApplicant?: User) => {
    const target = customApplicant || INITIAL_APPLICANTS[0];
    setUser(target);
  };

  const loginAsOfficer = () => {
    setUser(DEMO_OFFICER);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'officer') {
      setUser(DEMO_OFFICER);
    } else {
      setUser(INITIAL_APPLICANTS[0]);
    }
  };

  const logout = () => {
    setUser(null);
    storageService.setCurrentUser(null);
  };

  const role: UserRole = user?.role || 'applicant';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loginAsApplicant,
        loginAsOfficer,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
