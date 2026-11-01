import { feasibilityStyles } from '@/data/feasibilityStyles'
import type { InsightData } from '@/services/aiService'

interface FeasibilityBadgeProps {
  status: InsightData['feasibility']['status']
}

export function FeasibilityBadge({ status }: FeasibilityBadgeProps) {
  const styles = feasibilityStyles[status] as
    (typeof feasibilityStyles)[typeof status] | undefined

  // A IA pode retornar um status fora do esperado
  if (!styles) {
    return null
  }

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.className}`}
    >
      {styles.label}
    </span>
  )
}
