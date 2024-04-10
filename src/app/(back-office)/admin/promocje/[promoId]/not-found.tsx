import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function PromoNotFound(): JSX.Element {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Nie znaleziono promocji"
        description="Być może została usunięta lub zmieniono jej nazwę"
        retryLink="/admin/promocje"
        retryLinkText="Wróć do listy promocji"
      />
    </Shell>
  )
}
