import { redirect } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skanema.com'

export default async function QRRedirectPage({ params }) {
  const { code } = await params

  const res  = await fetch(`${API_URL}/api/qr/redirect/${code}`, { 
    cache: 'no-store',
    next : { revalidate: 0 }
  })
  const data = await res.json()
  
  if (data?.url && data.url !== 'https://www.skanema.com') {
    redirect(data.url)
  }
  
  redirect('https://www.skanema.com')
}