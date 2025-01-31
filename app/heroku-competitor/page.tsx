"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HerokuRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/platform-as-a-service");
  }, [router]);

  return null;
}
