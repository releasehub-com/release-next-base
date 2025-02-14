"use client";

import React, { useEffect } from "react";
import CloudDevLanding from "./CloudDevLanding";
import { useVersion } from "@/lib/version/VersionContext";

export default function CloudDevContent() {
  const { setVersion } = useVersion();

  useEffect(() => {
    setVersion("cloud-dev");
  }, [setVersion]);

  return <CloudDevLanding />;
}
