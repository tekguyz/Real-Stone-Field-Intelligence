"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../entities/user/store";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to login
    router.replace("/login");
  }, [router]);

  return <div className="min-h-screen bg-background" />;
}
