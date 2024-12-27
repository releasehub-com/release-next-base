'use client'

import React from 'react'
import Image from 'next/image'

const logos = [
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/65e7478b28c49416c60a3e84_Brand-DebtBook-320x80.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c066c487c5eeace1b89_Brand-Ethos.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0620464b59da2d3fc6_Brand-Navan.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c069d028b16c1837425_Brand-Chipper.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c04d4b1a7b780ee98e1_Brand-dispatch_health.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0485d1049635456984_Brand-Simon.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c03b7222b7bd919a8ae_Brand-Together.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c03f440994e9112f8ef_Brand-Datasaur-ai.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b779083a0497ec7c5ba7_Brand-uoss-280x70.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b779e05890f7fcf8f0c3_Brand-launch-darkly-280x70.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b7792d114d3891ae393e_Brand-moment-house-280x70.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b77931ea2bc3a4c2df13_Brand-simplyInsured-280x70.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b95fe9d8e065267d4556_Brand-ReMatter-280x70-png.webp",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c00455f57d0b226d6da_Brand-softledger.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0065b24affb15aaf4f_Brand-Brave_Care.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/6408b89c90ee1fad85e705cb_Brand-brevy-280x70-png.webp",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/65415c419ce5e4e8883ad42a_logo-cross.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c009d028b16c1836b83_Brand-Monad.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c0065310461ef8198b0_Brand-Noteable.svg",
  "https://cdn.prod.website-files.com/603dd147c5b0a480611bd348/653c1c00d4b1a7b780ee87d8_Brand-Mosaic.svg"
]

export default function EphemeralUsers() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-white">
          Join these amazing companies who all use Ephemeral Environments to delight users and developers
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
          {logos.map((logo, index) => (
            <div key={index} className="w-full h-20 relative">
              <Image
                src={logo}
                alt={`Company logo ${index + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                className="filter brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
