
import './globals.css'
import { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme-provider'
import { SupabaseProvider } from '@/components/SupabaseSessionProvider'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title:  'Poker Night',
  description: 'Literal Poker Night(mare)',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body
        className={
          'min-h-screen bg-background font-sans antialiased'
        }
      >
        <SupabaseProvider>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            <div className='relative flex min-h-screen flex-col'>
            <SiteHeader />
              <div className="flex">
                <div className="w-full border-t-l">
                  <div className='flex-1'>{children}</div>
                </div>
              </div>
              <TailwindIndicator />
            </div>
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
