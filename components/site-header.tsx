'use client'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabase } from './SupabaseSessionProvider'
import { buttonVariants } from './ui/button'
import { UserNav } from './user-nav'
import { ChevronRight, Plus, PlusCircle } from 'lucide-react'

export function SiteHeader() {
  const pathName = usePathname()
  const { user } = useSupabase()
  return (

    <header className='top-0 z-40 w-full border-b'>
      {pathName !== siteConfig.links.signin &&
        pathName !== siteConfig.links.signup && (
          <div>
            <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 '>
              <div className='flex flex-1 items-center justify-end space-x-4'>
                {user ? (
                  <nav className='flex items-center space-x-1'>
                    <UserNav />
                  </nav>
                ) : (
                  <nav className='flex items-center space-x-1'>
                    <Link
                      href={siteConfig.links.signup}
                      className={cn(buttonVariants({ variant: 'default' }), 'mr-2 p-0 w-10')}
                    >
                      <Plus />
                    </Link>
                    <Link
                      href={siteConfig.links.signin}
                      className={cn(buttonVariants({ variant: 'outline' }), 'p-0 w-10')
                      }
                    >
                      <ChevronRight />
                    </Link>

                  </nav>
                )}
              </div>
            </div>
          </div>
        )}
    </header>
  )
}
