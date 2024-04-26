import type { Product } from "@/db/schema/index"

interface FeaturedProductsSectionProps {
  featuredProducts: Product[]
}

export function FeaturedProductsSection({
  featuredProducts,
}: Readonly<FeaturedProductsSectionProps>): JSX.Element {
  return (
    <section className="w-full space-y-5">
      <div>Polecane produkty</div>

      <div className="xs:grid-cols-2 grid w-full animate-fade-up grid-cols-1 gap-4 md:grid-cols-4">
        {/* TODO: Replace with product cards; style; add pagination */}
        {featuredProducts.map((product) => (
          <div key={product.id} className="rounded-md border p-5">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
