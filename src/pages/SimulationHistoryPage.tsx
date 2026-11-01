import { History, SearchX } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { HistoryCard } from '@/components/features/History/HistoryCard'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { PageHero } from '@/components/shared/PageHero'
import { Select } from '@/components/shared/Select'
import { feasibilityStyles } from '@/data/feasibilityStyles'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

const ALL_STATUSES = 'all'

const statusOptions = [
  { value: ALL_STATUSES, label: 'Todas as viabilidades' },
  ...Object.entries(feasibilityStyles).map(([value, { label }]) => ({
    value,
    label,
  })),
]

type SortOrder = 'newest' | 'oldest'

const sortOptions = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigas' },
]

// Ignora maiúsculas e acentos na busca ("japao" encontra "Japão")
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(ALL_STATUSES)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [simulations, setSimulations] = useState(getAllSimulations)

  const handleDelete = (id: string) => {
    deleteSimulation(id)
    setSimulations((current) => current.filter((item) => item.id !== id))
  }

  const query = normalize(search.trim())
  const filteredSimulations = simulations
    .filter(
      (simulation) =>
        normalize(simulation.goalName).includes(query) &&
        (statusFilter === ALL_STATUSES ||
          simulation.insight?.feasibility.status === statusFilter),
    )
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) {
        return Number(!a.createdAt) - Number(!b.createdAt)
      }

      return sortOrder === 'newest'
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt)
    })

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Consulte as simulações que você já fez."
      />

      {simulations.length === 0 ? (
        <div className="bg-card flex flex-col items-center gap-4 rounded-2xl p-10 text-center">
          <History size={32} className="text-primary" />
          <p className="text-muted-foreground text-sm">
            Você ainda não fez nenhuma simulação.
          </p>
          <Button variant="primary" onClick={() => void navigate('/')}>
            Nova simulação
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                type="search"
                autoFocus={true}
                aria-label="Buscar simulação pelo nome da meta"
                placeholder="Buscar pelo nome da meta"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="flex gap-3 md:contents">
              <Select
                className="flex-1 md:w-60 md:flex-none"
                aria-label="Filtrar por viabilidade"
                options={statusOptions}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              />
              <Select
                className="flex-1 md:w-60 md:flex-none"
                aria-label="Ordenar por data de criação"
                options={sortOptions}
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
              />
            </div>
          </div>

          {filteredSimulations.length === 0 ? (
            <div className="bg-card flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
              <SearchX size={32} className="text-primary" />
              <p className="text-muted-foreground text-sm">
                Nenhuma simulação encontrada com esses filtros.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredSimulations.map((simulation) => (
                <HistoryCard
                  key={simulation.id}
                  simulation={simulation}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
