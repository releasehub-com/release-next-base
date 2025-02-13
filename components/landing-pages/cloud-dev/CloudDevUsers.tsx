"use client";

import React from "react";
import Image from "next/image";

const logos = [
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/65e7478b28c49416c60a3e84_Brand-DebtBook-320x80.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c066c487c5eeace1b89_Brand-Ethos.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0620464b59da2d3fc6_Brand-Navan.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c069d028b16c1837425_Brand-Chipper.svg",
  // ... (add more logos as needed)
];

export default function CloudDevUsersComponent() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-white">
          Join these amazing companies using Cloud Development Environments
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div key={index} className="w-full h-20 relative">
              <Image
                src={logo || "/placeholder.svg"}
                alt={`Company logo ${index + 1}`}
                fill
                style={{ objectFit: "contain" }}
                className="filter brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
