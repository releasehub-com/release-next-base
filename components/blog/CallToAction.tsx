export default function CallToAction({ copy, link }: { copy: string; link: string }) {
  return (
    <div className="my-12 p-8 bg-gray-800 rounded-lg">
      <div className="max-w-3xl mx-auto text-center">
        <div 
          className="text-lg text-gray-200 mb-6"
          dangerouslySetInnerHTML={{ __html: copy }} 
        />
        <a
          href={link}
          className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Release for Free
        </a>
      </div>
    </div>
  );
} 