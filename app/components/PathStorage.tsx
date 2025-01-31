"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PathStorage() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      localStorage.setItem("landing_path", pathname);
    }
  }, [pathname]);

  return null;
}
