import './globals.css'
import { Providers } from './providers'

const BASE_URL = 'https://www.skanema.com'

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default : 'Skanema — Commandes WhatsApp pour restaurants africains',
    template: '%s | Skanema',
  },
  description:
    'Skanema permet aux restaurants africains de recevoir et gérer leurs commandes directement via WhatsApp. Bot intelligent, paiement Wave, dashboard en temps réel.',

  keywords: [
    'commande WhatsApp restaurant',
    'bot WhatsApp restaurant Sénégal',
    'commande en ligne restaurant Dakar',
    'paiement Wave restaurant',
    'gestion commandes restaurant Afrique',
    'livraison restaurant Sénégal',
    'SaaS restaurant Afrique',
    'Skanema',
  ],

  authors : [{ name: 'Skanema', url: BASE_URL }],
  creator : 'Skanema',
  publisher: 'Skanema',

  openGraph: {
    type       : 'website',
    locale     : 'fr_SN',
    url        : BASE_URL,
    siteName   : 'Skanema',
    title      : 'Skanema — Commandes WhatsApp pour restaurants africains',
    description: 'Recevez et gérez vos commandes directement via WhatsApp. Bot intelligent, paiement Wave, dashboard en temps réel.',
    images: [
      {
        url   : '/og-image.png',
        width : 1200,
        height: 630,
        alt   : 'Skanema — Commandes WhatsApp pour restaurants africains',
      },
    ],
  },

  twitter: {
    card       : 'summary_large_image',
    title      : 'Skanema — Commandes WhatsApp pour restaurants africains',
    description: 'Recevez et gérez vos commandes directement via WhatsApp.',
    images     : ['/og-image.png'],
  },

  robots: {
    index    : true,
    follow   : true,
    googleBot: {
      index              : true,
      follow             : true,
      'max-image-preview': 'large',
      'max-snippet'      : -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
  },

  icons: {
    icon  : '/favicon.ico',
    apple : '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
