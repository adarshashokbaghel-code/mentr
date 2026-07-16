"use client";

import { AuthProvider } from "@/components/auth/auth-provider";
import { FacultyLoginModal } from "@/components/auth/faculty-login-modal";
import { RoleChooserModal } from "@/components/auth/role-chooser-modal";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <FacultyLoginModal />
      <RoleChooserModal />
    </AuthProvider>
  );
}
