import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function CustomerNotFound(): JSX.Element {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Nie znaleziono klienta"
        description="Być może został usunięty lub zmieniono jego dane"
        retryLink="/admin/kliencie"
        retryLinkText="Wróć do listy klientów"
      />
    </Shell>
  )
}
