'use client'
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import * as z from 'zod';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{username: string}>();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({ //can add type here
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            //const response = await axios.post<ApiResponse>('/api/verify-code', {username: params.username , code: data.code,});
            const response = await axios.post<ApiResponse>('/api/verify-code', {username: params.username, code: data.code,});
            toast({
                title: "success",
                description: response.data.message
            });
            router.replace(`/sign-in`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: 'Verification Failed Failed',
                description: errorMessage,
                variant: "destructive"
            });
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight'>Verify your Account</h1>
                    <p className='mb-4'>Enter the verification code sent on your email</p>
                </div>

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Verification Code</FormLabel> 
                            <Input {...field} /> 
                            <FormMessage />
                        </FormItem>
                    )}
                    />

                    <Button type="submit">Verify</Button>
                </form>
                </Form>
            </div>
        </div>
    )
}
