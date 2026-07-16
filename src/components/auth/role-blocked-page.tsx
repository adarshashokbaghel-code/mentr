"use client";

import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  FACULTY_ROLE_TOAST,
  PARENT_ROLE_TOAST,
} from "@/hooks/use-role-action";
import { GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function RoleBlockedPage({
  toastMessage,
  title,
  description,
  icon: Icon,
  actionHref,
  actionLabel,
}: {
  toastMessage: string;
  title: string;
  description: string;
  icon: typeof Users;
  actionHref: string;
  actionLabel: string;
}) {
  const { toast } = useToast();

  useEffect(() => {
    toast(toastMessage);
  }, [toast, toastMessage]);

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-cream px-4 py-12">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-butter">
            <Icon className="h-6 w-6 text-ink" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
          <Link href={actionHref} className="mt-6 inline-block">
            <Button>{actionLabel}</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function SearchFacultyBlocked() {
  return (
    <RoleBlockedPage
      toastMessage={PARENT_ROLE_TOAST}
      title="Parent accounts search for tutors"
      description="You're signed in as a tutor. Log in as a parent to browse mentors, send connect requests, and post requirements."
      icon={Users}
      actionHref="/dashboard"
      actionLabel="Go to tutor dashboard"
    />
  );
}

export function BoardParentBlocked() {
  return (
    <RoleBlockedPage
      toastMessage={FACULTY_ROLE_TOAST}
      title="Tutors pitch on the requirements board"
      description="You're signed in as a parent. Log in as a tutor to browse open requirements and send pitches."
      icon={GraduationCap}
      actionHref="/parent/dashboard"
      actionLabel="Go to parent dashboard"
    />
  );
}
