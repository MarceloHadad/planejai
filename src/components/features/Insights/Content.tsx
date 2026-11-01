import type { PropsWithChildren } from 'react'

import { FeasibilityBadge } from '@/components/shared/FeasibilityBadge'
import type { InsightData } from '@/services/aiService'

interface ContentProps {
  insight: InsightData
}

function Paragraph({ children }: PropsWithChildren) {
  return (
    <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
  )
}

function SectionTitle({ children }: PropsWithChildren) {
  return (
    <h3 className="text-foreground mt-5 mb-1.5 text-sm leading-relaxed font-semibold">
      {children}
    </h3>
  )
}

function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="text-muted-foreground ml-6 list-decimal text-sm leading-relaxed">
      {items.map((item, index) => (
        <li key={index} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  )
}

export function Content({ insight }: ContentProps) {
  return (
    <div className="lg:max-h-93 lg:scrollbar-thin lg:[scrollbar-color:var(--border)_transparent] lg:overflow-y-auto lg:pr-2">
      <section className="flex flex-col gap-2">
        <div className="flex flex-col items-start gap-2 sm:flex-row">
          <span className="text-foreground text-sm font-semibold">
            🎯 Viabilidade da Meta
          </span>
          <FeasibilityBadge status={insight.feasibility.status} />
        </div>
        <Paragraph>{insight.feasibility.content}</Paragraph>
      </section>

      <section>
        <SectionTitle>💰 Diagnóstico Financeiro</SectionTitle>
        <Paragraph>{insight.diagnosis.content}</Paragraph>
      </section>

      <section>
        <SectionTitle>📋 Sugestões Práticas</SectionTitle>
        <OrderedList items={insight.suggestions.items} />
      </section>

      <section>
        <SectionTitle>💡 Como Aumentar sua Renda</SectionTitle>
        <OrderedList items={insight.extraIncome.items} />
      </section>

      <section>
        <SectionTitle>🏦 Sugestões de Investimento</SectionTitle>
        <OrderedList items={insight.investment.items} />
      </section>

      <section>
        <SectionTitle>🚀 Mensagem Final</SectionTitle>
        <Paragraph>{insight.motivation.content}</Paragraph>
      </section>
    </div>
  )
}
