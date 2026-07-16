"use client";

import { AuthProvider } from "@/components/auth/auth-provider";
import { FacultyLoginModal } from "@/components/auth/faculty-login-modal";
import { RoleChooserModal } from "@/components/auth/role-chooser-modal";
import { ToastProvider } from "@/components/ui/toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        {children}
        <FacultyLoginModal />
        <RoleChooserModal />
      </AuthProvider>
    </ToastProvider>
  );
}
