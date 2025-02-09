import { BenefitIcons } from './BenefitIcons'
import { BenefitType } from '../types'

export function SignupBenefit({ benefit }: { benefit: BenefitType }) {
  return (
    <div>
      <div className="mb-4">
        <BenefitIcons icon={benefit.icon} />
      </div>
      <h3 className="text-xl font-bold text-gray-100 mb-2">
        {benefit.title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed">
        {benefit.description}
      </p>
    </div>
  )
} 