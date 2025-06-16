import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { AccessibilityPanel } from "@/components/accessibility-panel"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UPARSISTEM - Centro de Entrenamiento en Trabajo Seguro en Altura",
  description: "Formación especializada en trabajo seguro en altura, certificados en calidad NTC 6052:2014 ICONTEC",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={montserrat.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
        <WhatsAppButton
          phoneNumber="573202509270"
          message="Hola, me gustaría obtener más información sobre los servicios de altura UPARSISTEM."
        />
        <AccessibilityPanel />
      </body>
    </html>
  )
}
