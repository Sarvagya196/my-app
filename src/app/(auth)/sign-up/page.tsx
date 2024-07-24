'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from "axios";
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'


function Page() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIscheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 300);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({ //can add type here
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username){
                setIscheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    );
                } finally{
                    setIscheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast({
                title: "Success",
                description: response.data.message
            });
            router.replace(`/verify/${username}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: 'SignUp Failed',
                description: errorMessage,
                variant: "destructive"
            });
        } finally{
            setIsSubmitting(false);
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
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                            <Input placeholder="username" {...field} 
                            onChange={(e) => {
                                field.onChange(e);
                                debounced(e.target.value);
                            }}
                            />
                        </FormControl>
                        {isCheckingUsername && <Loader2 className='animate-spin'/>}
                        <p className={`text-sm ${usernameMessage === "Username Available!" ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="email" {...field} />
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

                    <Button type="submit" disabled={isSubmitting}>
                        {
                            isSubmitting ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait
                                </>
                            ) : ('Sign Up')
                        }
                    </Button>

                    </form>
                </Form>

                <div className='text-center mt-4'>
                        <p>Already a member?{' '}
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign In</Link>
                        </p>
                </div>

                
            </div>
        </div>
    )
}

export default Page;
