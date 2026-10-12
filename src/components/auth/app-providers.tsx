"use client";

import { AuthProvider } from "@/components/auth/auth-provider";
import { FacultyLoginModal } from "@/components/auth/faculty-login-modal";
import { ParentProfileNudge } from "@/components/auth/parent-profile-nudge";
import { RoleChooserModal } from "@/components/auth/role-chooser-modal";
import { AttributionCapture } from "@/components/marketing/page-marketing";
import { ToastProvider } from "@/components/ui/toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <AttributionCapture />
        <ParentProfileNudge />
        {children}
        <FacultyLoginModal />
        <RoleChooserModal />
      </AuthProvider>
    </ToastProvider>
  );
}
