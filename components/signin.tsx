'use client'

import { siteConfig } from '@/config/site'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useUserStore } from '@/app/store'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SignIn({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [authError, setAuthError] = React.useState('')
  const router = useRouter()
  
  const updateUser = useUserStore((state) => state.updateUser)
  const handleFormSubmit = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (!error) {
        const results = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
      if (results?.data && results?.data.at(0)) {
        updateUser({username: results?.data.at(0).username, id: results?.data.at(0).id, email: results?.data?.at(0).email, index: results?.data.at(0).index})
      }
        router.push('/')
      } else {
        setAuthError(error.message)
        setIsLoading(false)
      }
    } catch (err: any) {
      setIsLoading(false)
    }
  }


  const { values, errors, touched, handleSubmit, handleChange } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: (values) => {
      handleFormSubmit(values.email, values.password)
    }
  })

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              onChange={handleChange}
              value={values.email}
              className={`${
                (errors.email && touched.email) || authError
                  ? 'border-rose-500'
                  : ''
              }`}
            />
          </div>
          {errors.email && touched.email ? (
            <p className='text-xs text-rose-500'>{errors.email}</p>
          ) : null}
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='password'>
              Password
            </Label>
            <Input
              id='password'
              placeholder='Password'
              type='password'
              autoCapitalize='none'
              autoComplete='passworn'
              autoCorrect='off'
              disabled={isLoading}
              onChange={handleChange}
              value={values.password}
              className={`${
                (errors.password && touched.password) || authError
                  ? 'border-rose-500'
                  : ''
              }`}
            />
          </div>
          {errors.password && touched.password ? (
            <p className='text-xs text-rose-500'>{errors.password}</p>
          ) : null}
          {authError ? (
            <p className='text-xs text-rose-500'>{authError}</p>
          ) : null}
          <Button disabled={isLoading}>
            {'Login'}
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Don´t have an account
          </span>
        </div>
      </div>
      <Button
        onClick={() => router.push(siteConfig.links.signup)}
        variant='outline'
        type='button'
        disabled={isLoading}
      >
        Sign Up
      </Button>
    </div>
  )
}
