import { LandingPage } from '@/components/landing/LandingPage'

export const metadata = {
  title      : 'Skanema — Commandes WhatsApp pour restaurants africains',
  description: 'Automatisez vos commandes WhatsApp. Bot intelligent, paiement Wave, dashboard en temps réel. Essai gratuit 14 jours.',
  alternates : { canonical: 'https://www.skanema.com' },
}

const jsonLd = {
  '@context'   : 'https://schema.org',
  '@type'      : 'SoftwareApplication',
  name         : 'Skanema',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  description  : 'Plateforme SaaS permettant aux restaurants africains de recevoir et gérer leurs commandes directement via WhatsApp avec paiement Wave intégré.',
  url          : 'https://www.skanema.com',
  offers       : {
    '@type'   : 'AggregateOffer',
    priceCurrency: 'XOF',
    lowPrice  : '15000',
    highPrice : '75000',
    offerCount: '3',
  },
  creator: {
    '@type': 'Organization',
    name   : 'Skanema',
    url    : 'https://www.skanema.com',
    logo   : 'https://www.skanema.com/logo.png',
    contactPoint: {
      '@type'      : 'ContactPoint',
      contactType  : 'customer support',
      availableLanguage: ['French'],
    },
    areaServed: [
      'Sénégal', 'Côte d\'Ivoire', 'Mali', 'Guinée',
      'Burkina Faso', 'Niger', 'Togo', 'Bénin',
    ],
  },
  aggregateRating: {
    '@type'      : 'AggregateRating',
    ratingValue  : '4.8',
    reviewCount  : '50',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  )
}
