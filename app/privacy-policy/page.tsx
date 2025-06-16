import { PolicyPage } from "@/components/policy-page"
import { PrivacyPolicyContent } from "@/components/privacy-policy-content"

export const metadata = {
  title: "Política de Privacidad | UPARSISTEM",
  description: "Política de privacidad de UPARSISTEM. Información sobre cómo protegemos sus datos personales.",
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Política de Privacidad" lastUpdated="15 de mayo de 2024">
      <PrivacyPolicyContent />
    </PolicyPage>
  )
}
