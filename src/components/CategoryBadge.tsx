import { CATEGORY_CONFIG } from '@/lib/categories'
import type { Category } from '@/types/expense'

export default function CategoryBadge({ category }: { category: Category }) {
  const cfg = CATEGORY_CONFIG[category]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bgClass} ${cfg.textClass}`}>
      {cfg.label}
    </span>
  )
}
