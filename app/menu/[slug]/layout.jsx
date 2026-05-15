const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'
const BASE_URL = 'https://www.skanema.com'

export async function generateMetadata({ params }) {
  const { slug } = params

  try {
    const res  = await fetch(`${API_URL}/api/public/menu/${slug}`, { next: { revalidate: 3600 } })
    const data = await res.json()

    if (!data.success) return { title: 'Menu | Skanema' }

    const resto = data.restaurant

    return {
      title      : `${resto.name} — Commander sur WhatsApp`,
      description: `Commandez vos plats préférés chez ${resto.name} directement via WhatsApp. Livraison rapide, paiement Wave sécurisé.`,
      openGraph  : {
        title      : `${resto.name} — Commander sur WhatsApp`,
        description: `Découvrez le menu de ${resto.name} et commandez en quelques secondes via WhatsApp.`,
        url        : `${BASE_URL}/menu/${slug}`,
        images     : resto.logoUrl ? [{ url: resto.logoUrl, width: 400, height: 400, alt: resto.name }] : [],
      },
      twitter: {
        card       : 'summary',
        title      : `${resto.name} — Commander sur WhatsApp`,
        description: `Commandez chez ${resto.name} via WhatsApp.`,
      },
      alternates: {
        canonical: `${BASE_URL}/menu/${slug}`,
      },
    }
  } catch (_) {
    return { title: 'Menu | Skanema' }
  }
}

export default function MenuLayout({ children }) {
  return children
}
