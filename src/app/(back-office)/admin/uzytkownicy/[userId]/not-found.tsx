import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function AdminUserNotFound(): JSX.Element {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Nie znaleziono użytkownika"
        description="Być może został usunięty lub zmieniono jego dane"
        retryLink="/admin/uzytkownicy"
        retryLinkText="Wróć do listy użytkowników"
      />
    </Shell>
  )
}
