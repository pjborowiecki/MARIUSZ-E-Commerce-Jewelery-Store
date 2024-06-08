import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function ProductNotFound(): JSX.Element {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Nie znaleziono produktu"
        description="By może produkt został usunięty lub wyprzedany"
        retryLink="/produkty"
        retryLinkText="Wróć do listy produktów"
      />
    </Shell>
  )
}
