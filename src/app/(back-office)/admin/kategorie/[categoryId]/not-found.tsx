import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function AdminCategoryNotFound(): JSX.Element {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Nie znaleziono kategorii"
        description="Być może została usunięta lub zmieniono jej nazwę"
        retryLink="/admin/kategorie"
        retryLinkText="Wróć do listy kategorii"
      />
    </Shell>
  )
}
