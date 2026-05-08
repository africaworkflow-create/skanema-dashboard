import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title      : 'Skanema — Dashboard',
  description : 'Gérez votre restaurant et vos commandes WhatsApp',
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
