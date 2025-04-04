import Image from "next/image";

interface InvestorLogosProps {
  title?: string;
  className?: string;
}

export default function InvestorLogos({
  title = "Our Investors",
  className = "",
}: InvestorLogosProps) {
  return (
    <div className={`py-12 border-t border-gray-800 ${className}`}>
      <h2 className="text-2xl font-bold text-white text-center mb-8">
        {title}
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
        <div className="w-[180px] h-[80px] relative flex items-center justify-center">
          <Image
            src="/investors/sequoia.svg"
            alt="Sequoia Capital logo"
            width={160}
            height={40}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            className=""
            unoptimized={true}
          />
        </div>
        <div className="w-[180px] h-[80px] relative flex items-center justify-center">
          <Image
            src="/investors/yc.svg"
            alt="Y Combinator logo"
            width={160}
            height={40}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            className="filter brightness-0 invert"
            unoptimized={true}
          />
        </div>
        <div className="w-[180px] h-[80px] relative flex items-center justify-center">
          <Image
            src="/investors/crv.svg"
            alt="CRV logo"
            width={160}
            height={40}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            className="filter brightness-0 invert"
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  );
}
