"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaasRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/heroku");
  }, [router]);

  return null;
}
