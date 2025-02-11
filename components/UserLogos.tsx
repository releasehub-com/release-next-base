"use client";

import React from "react";
import Image from "next/image";

const logos = [
  {
    name: "DebtBook",
    logo: "/logos/debtbook.svg",
  },
  {
    name: "Drata",
    logo: "/logos/drata.svg",
  },
  {
    name: "Ethos",
    logo: "/logos/ethos.svg",
  },
  {
    name: "Cortex",
    logo: "/logos/cortex.svg",
  },
  {
    name: "Navan",
    logo: "/logos/navan.svg",
  },
  {
    name: "Chipper",
    logo: "/logos/chipper.svg",
  },
  {
    name: "Dispatch Health",
    logo: "/logos/dispatch-health.svg",
  },
  {
    name: "Simon",
    logo: "/logos/simon.svg",
  },
  {
    name: "Together",
    logo: "/logos/together.svg",
  },
  {
    name: "Datasaur",
    logo: "/logos/datasaur.svg",
  },
  {
    name: "LaunchDarkly",
    logo: "/logos/launch-darkly.svg",
  },
  {
    name: "Simply Insured",
    logo: "/logos/simply-insured.svg",
  },
  {
    name: "SoftLedger",
    logo: "/logos/softledger.svg",
  },
  {
    name: "Cross",
    logo: "/logos/cross.svg",
  },
  {
    name: "Noteable",
    logo: "/logos/noteable.svg",
  },
  {
    name: "Mosaic",
    logo: "/logos/mosaic.svg",
  },
];

interface UserLogosProps {
  headline?: string;
  title?: string;
  subtitle?: string;
  layout?: "grid" | "horizontal";
}

const UserLogos = ({
  headline = "Trusted By",
  title,
  subtitle,
  layout = "grid",
}: UserLogosProps) => {
  return (
    <section className="py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
          {headline}
        </h2>
        {title && (
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-6 text-white">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xl text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center"
              : "flex gap-8"
          }
        >
          {logos.map((logo) => (
            <div
              key={logo.name}
              className={`${layout === "grid" ? "w-full h-20" : "w-[200px] h-20 flex-shrink-0"} relative`}
            >
              <Image
                src={logo.logo}
                alt={`${logo.name} logo`}
                width={320}
                height={80}
                style={{ objectFit: "contain" }}
                className="filter brightness-0 invert"
                unoptimized={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserLogos;
