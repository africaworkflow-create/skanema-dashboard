import { redirect } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

export default async function QRRedirectPage({ params }) {
  const { code } = params

  try {
    const res = await fetch(`${API_URL}/api/qr/redirect/${code}`, { cache: 'no-store' })
    const data = await res.json()
    if (data.url) redirect(data.url)
  } catch (_) {}

  redirect('https://www.skanema.com')
}
