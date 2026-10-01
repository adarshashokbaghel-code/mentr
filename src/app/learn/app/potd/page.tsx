"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** POTD history lives on Progress. Old /learn/app/potd links land there. */
export default function LearnPotdRoute() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/learn/app/progress#potd");
  }, [router]);
  return null;
}
