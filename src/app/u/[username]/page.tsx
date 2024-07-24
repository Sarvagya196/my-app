'use client'
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { MessageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

function SendMessage() {
  const params = useParams<{username: string}>();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema)
  });

  const messageContent = form.watch('content');

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      console.log("content", {...data});
      const resposne = await axios.post<ApiResponse>('/api/send-message', {
        username,
        ...data,
      });
      toast({
        title: resposne.data.message,
      });
      form.reset({...form.getValues(), content:''});

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to Send Message",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally{
      setIsLoading(false);
    }
  }

  return (
    <div className='container mx-auto my-6 bg-white rounded p-6 max-w-4xl'>
      <h1 className='text-center text-4xl font-bold mb-6'>
        Send Anonymous Message!
      </h1>
      <Form {...form}>
        <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField 
          control={form.control}
          name = 'content'
          render = {({field}) => (
            <FormItem>
              <FormLabel>Send message to @{username}</FormLabel>
              <FormControl>
                <Textarea 
                placeholder='Enter your message here'
                className='resize-none'
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />

          <div className='flex justify-center'>
            {isLoading ? (
              <Button disabled>
                <Loader2 className='h-4 w-4 mr-2 animate-spin'/>
                Please Wait
              </Button>
            ) : (
              <Button type='submit' disabled={isLoading || !messageContent}>
                Send Message
              </Button>
            )}
          </div>
        </form>
      </Form>

      <Separator className='my-6'/>

      <div className='text-center'>
        <div className='mb-4'>Get Your Messages now!</div>
        <Link href={'/sign-up'}>
            <Button>Create your Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default SendMessage;
