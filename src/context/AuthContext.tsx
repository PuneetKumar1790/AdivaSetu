import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { browserDb } from '../services/db/browserDb';
import {
  INITIAL_APPLICANTS,
  DEMO_OFFICER,
  DEMO_INSTITUTE_VERIFIER,
  DEMO_SCRUTINY_OFFICER,
  DEMO_SCREENING_OFFICER,
  DEMO_APPROVING_AUTHORITY,
} from '../data/initialApplicants';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAsApplicant: (customApplicant?: User) => void;
  loginAsOfficer: () => void;
  loginAsRole: (targetRole: UserRole) => void;
  registerApplicant: (details: {
    name: string;
    email: string;
    mobile: string;
    state?: string;
    tribeCommunity?: string;
    aadhaarNumber?: string;
  }) => User;
  resetPassword: (email: string) => boolean;
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

  const loginAsRole = (targetRole: UserRole) => {
    switch (targetRole) {
      case 'institute_verifier':
        setUser(DEMO_INSTITUTE_VERIFIER);
        break;
      case 'scrutiny_officer':
        setUser(DEMO_SCRUTINY_OFFICER);
        break;
      case 'screening_officer':
        setUser(DEMO_SCREENING_OFFICER);
        break;
      case 'approving_authority':
        setUser(DEMO_APPROVING_AUTHORITY);
        break;
      case 'officer':
        setUser(DEMO_OFFICER);
        break;
      case 'applicant':
      default:
        setUser(INITIAL_APPLICANTS[0]);
        break;
    }
  };

  const registerApplicant = (details: {
    name: string;
    email: string;
    mobile: string;
    state?: string;
    tribeCommunity?: string;
    aadhaarNumber?: string;
  }): User => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newUser: User = {
      id: `app-reg-${Date.now()}-${randomSuffix}`,
      name: details.name,
      email: details.email,
      mobile: details.mobile,
      role: 'applicant',
      department: details.tribeCommunity ? `${details.tribeCommunity} Tribe, ${details.state || 'India'}` : undefined,
      avatar: `https://images.unsplash.com/photo-${1530000000000 + randomSuffix}?w=150&auto=format&fit=crop&q=80`,
    };

    browserDb.registerUser(newUser);
    setUser(newUser);
    return newUser;
  };

  const resetPassword = (email: string): boolean => {
    // Simulated e-Pramaan / Aadhaar OTP password recovery
    return !!email;
  };

  const switchRole = (newRole: UserRole) => {
    loginAsRole(newRole);
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
        loginAsRole,
        registerApplicant,
        resetPassword,
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
