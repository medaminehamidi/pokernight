import SignIn from '@/components/signin'
import { siteConfig } from '@/config/site'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
}

export default function AuthenticationPage() {
  return (
    <div className='container flex h-[99vh] items-center justify-center p-6 '>
      <div className='container relative grid h-[800px] flex-col items-center justify-center rounded-lg border-2 lg:max-w-none lg:px-0'>
        <Link
          href='/'
          className='absolute left-4 top-4 flex items-center text-lg font-medium md:left-8 md:top-8'
        >
          <span className='ml-2 inline-block font-bold'>{siteConfig.name}</span>
        </Link>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Signin to your account
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password below to access your account
              </p>
            </div>
            <SignIn />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking continue, you agree to our{' '}
              <Link
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
