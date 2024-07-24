'use client'
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import dayjs from 'dayjs';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
  
import React from 'react'
import { Message } from "@/model/User"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: any) => void;
}

function MessageCard( {message, onMessageDelete} : MessageCardProps ) {

    const { toast } = useToast();
    const handleDeleteConform = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast({
                title: response.data.message
            });
            onMessageDelete(message._id);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message || 'failed to delete Message',
                variant: "destructive",
            });
        }
    }


    return (
        <Card className="card-bordered">
            <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle>{message.content}</CardTitle>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive"><X className="w-5 h-5"/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this message
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConform}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
        </Card>
    )
}

export default MessageCard;
