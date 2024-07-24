'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

function Page() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({ //can add type here
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn('credentials', {redirect:false, identifier: data.identifier, password: data.password});
      console.log(result);
      if (result?.error){
        toast({
          title: "login failed",
          description: "username or password is incorrect",
          variant: "destructive",
        });
      }

      if (result?.url){
        router.replace('/dashboard');
      }
    } catch (error) {
      toast({
        title: "LogIn Failed",
        description: "Error, try again later"
      });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className='text-center'>
            <h1 className='text-4xl font-extrabold tracking-tight'>Join this Website</h1>
            <p className='mb-4'>Sign In to start your journey</p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                    <Input placeholder="Email / Username" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input placeholder="password" type='password' {...field}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit">
                Log In
            </Button>

            </form>
        </Form>

        <div className='text-center mt-4'>
                <p>Already have a account?{' '}
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign Up</Link>
                </p>
        </div>

        
    </div>
</div>
  )
  }

export default Page;
