import { ChevronDown } from 'lucide-react'
import type { SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
}

export function Select({ options, className, ...rest }: SelectProps) {
  return (
    <div
      className={[
        'bg-input relative flex min-w-0 items-center rounded-2xl shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]',
        className,
      ].join(' ')}
    >
      <select
        className="themed-select text-foreground w-full cursor-pointer appearance-none truncate bg-transparent p-3 pr-8 text-xs outline-none md:p-4 md:pr-10 md:text-sm"
        {...rest}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-card text-foreground"
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="text-muted-foreground pointer-events-none absolute right-3 md:right-4"
      />
    </div>
  )
}
