'use client'

import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useFormik } from 'formik'
import * as React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SignUp({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const handleFormSubmit = async (
    email: string,
    password: string
  ) => {
    setIsLoading(true)
    const result = await supabase.auth.signUp({
      email,
      password
    })
    if (result.error) {
      setIsLoading(false)
      return
    } else {
      await supabase
        .from('users')
        .update({ username: values.name })
        .eq('id', result.data.user?.id)
    }
    setIsLoading(false)
  }


  const { values, errors, touched, handleSubmit, handleChange } = useFormik({
    initialValues: {
      name: '',
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
              <Label className='sr-only' htmlFor='name'>
                Name
              </Label>
              <Input
                id='name'
                placeholder='Full Name'
                type='text'
                autoCapitalize='none'
                autoComplete='name'
                autoCorrect='off'
                disabled={isLoading}
                onChange={handleChange}
                value={values.name}
                className={`${
                  errors.name && touched.name ? 'border-rose-500' : ''
                }`}
              />
            </div>
            {errors.name && touched.name ? (
              <p className='text-xs text-rose-500'>{errors.name}</p>
            ) : null}
            <div className='grid gap-1'>
              <Label className='sr-only' htmlFor='email'>
                Email
              </Label>
              <Input
                id='email'
                placeholder='name@example.com'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                disabled={isLoading}
                onChange={handleChange}
                value={values.email}
                className={`${
                  errors.email && touched.email ? 'border-rose-500' : ''
                }`}
              />
            </div>
            {errors.email && touched.email ? (
              <p className='text-xs  text-rose-500'>{errors.email}</p>
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
                  errors.password && touched.password ? 'border-rose-500' : ''
                }`}
              />
            </div>
            {errors.password && touched.password ? (
              <p className='text-xs  text-rose-500'>{errors.password}</p>
            ) : null}
            <Button type='submit' disabled={isLoading}>
             
              Sign Up with Email
            </Button>
          </div>
        </form>
      
    </div>
  )
}
