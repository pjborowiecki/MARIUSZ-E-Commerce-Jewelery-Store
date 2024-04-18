import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function AdminSubcategoryNotFound(): JSX.Element {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Nie znaleziono podkategorii"
        description="Być może została usunięta lub zmieniono jej nazwę"
        retryLink="/admin/podkategorie"
        retryLinkText="Wróć do listy podkategorii"
      />
    </Shell>
  )
}
