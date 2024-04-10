import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function OrderNotFound(): JSX.Element {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Nie znaleziono zamówienia"
        description="Być może zostało usunięte lub zmieniono jego dane"
        retryLink="/admin/zamowienia"
        retryLinkText="Wróć do listy zamówień"
      />
    </Shell>
  )
}
