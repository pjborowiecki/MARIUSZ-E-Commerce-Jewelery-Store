import type { Category } from "@/db/schema/index"

import { CategoryCard } from "@/components/store-front/category-card"

interface CategoriesSectionProps {
  categories: Category[]
}

export function CategoriesSection({
  categories,
}: Readonly<CategoriesSectionProps>): JSX.Element {
  return (
    <section className="w-full space-y-5">
      <div>
        <h3 className="text-xl font-semibold">Kategorie</h3>
      </div>
      <div className="grid w-full animate-fade-up grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </section>
  )
}
