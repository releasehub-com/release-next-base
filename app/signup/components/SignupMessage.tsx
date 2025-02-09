import { ContentType } from '../types'
import { SignupBenefit } from './SignupBenefit'

interface SignupMessageProps {
  content: ContentType;
}

export function SignupMessage({ content }: SignupMessageProps) {
  return (
    <div className="w-full lg:w-1/2 bg-gray-800 p-6 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-700">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-100 leading-tight mb-8 lg:mb-16">
          {content.title}
        </h2>

        <div className="space-y-8 lg:space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.benefits.map((benefit, index) => (
              <SignupBenefit key={index} benefit={benefit} />
            ))}
          </div>

          <div className="mt-8 lg:mt-0">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-100 mb-2">
              We can keep going...
            </h3>
            <p className="text-base lg:text-lg text-blue-400 mb-6 lg:mb-8">
              but it's best to try it for yourself
            </p>
            <ul className="space-y-4">
              {content.steps.map((step, index) => (
                <li key={index} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 