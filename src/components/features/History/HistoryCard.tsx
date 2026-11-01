import { SquareArrowOutUpRight, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { FeasibilityBadge } from '@/components/shared/FeasibilityBadge'
import type { SimulationRecord } from '@/data/simulation'
import { calcMonthlySavings } from '@/utils/simulation'

interface HistoryCardProps {
  simulation: SimulationRecord
  onDelete: (id: string) => void
}

interface MetricProps {
  label: string
  value: string
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-foreground text-sm font-semibold">{value}</dd>
    </div>
  )
}

export function HistoryCard({ simulation, onDelete }: HistoryCardProps) {
  const navigate = useNavigate()
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

  const monthlySavings = calcMonthlySavings(simulation)
  const createdAt = simulation.createdAt
    ? new Date(simulation.createdAt).toLocaleDateString('pt-BR')
    : '—'

  return (
    <article className="bg-card flex flex-col gap-4 rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] md:flex-row md:items-center md:gap-6">
      <header className="flex min-w-0 flex-col gap-2 md:w-64 md:shrink-0">
        <h2 className="text-foreground text-lg font-semibold break-words">
          {simulation.goalName}
        </h2>
        {simulation.insight && (
          <FeasibilityBadge status={simulation.insight.feasibility.status} />
        )}
      </header>

      <dl className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-4">
        <Metric label="Custo da meta" value={`R$ ${simulation.goalAmount}`} />
        <Metric label="Prazo" value={`${simulation.goalDeadline} meses`} />
        <Metric label="Criada em" value={createdAt} />
        <Metric
          label="Economia mensal necessária"
          value={`R$ ${monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
      </dl>

      <footer className="flex items-center gap-2 md:w-72 md:shrink-0 md:justify-end">
        {isConfirmingDelete ? (
          <>
            <span className="text-muted-foreground mr-auto text-sm md:mr-0">
              Excluir?
            </span>
            <Button
              variant="ghost"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="bg-red-500!"
              onClick={() => onDelete(simulation.id)}
            >
              Excluir
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              icon={SquareArrowOutUpRight}
              className="flex-1 md:flex-none"
              onClick={() => void navigate(`/resultado/${simulation.id}`)}
            >
              Ver detalhes
            </Button>
            <Button
              variant="ghost"
              icon={Trash2}
              className="text-red-500! hover:bg-red-500/10"
              aria-label={`Excluir simulação ${simulation.goalName}`}
              onClick={() => setIsConfirmingDelete(true)}
            />
          </>
        )}
      </footer>
    </article>
  )
}
