interface PartnerCTAProps {
  partner?: string;
}

export default function PartnerCTA({ partner }: PartnerCTAProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-8 mt-12">
      <h2 className="text-2xl font-bold text-white mb-4">
        {partner
          ? `Want to partner with Release like ${partner}?`
          : "Want to see your company alongside these amazing partners?"}
      </h2>
      <p className="text-gray-300 mb-6">
        Reach out to our partner team and let's create value together.
      </p>
      <a
        href="mailto:partners@release.com"
        className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
      >
        Contact Partner Team
      </a>
    </div>
  );
}
