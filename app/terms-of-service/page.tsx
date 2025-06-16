import { PolicyPage } from "@/components/policy-page"
import { TermsOfServiceContent } from "@/components/terms-of-service-content"

export const metadata = {
  title: "Términos de Servicio | UPARSISTEM",
  description: "Términos y condiciones de uso de los servicios de UPARSISTEM.",
}

export default function TermsOfServicePage() {
  return (
    <PolicyPage title="Términos de Servicio" lastUpdated="15 de mayo de 2024">
      <TermsOfServiceContent />
    </PolicyPage>
  )
}
