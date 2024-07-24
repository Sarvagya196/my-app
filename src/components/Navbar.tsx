'use client'
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

function Navbar() {

    const {data: session} = useSession();
    const user = session?.user;

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='flex flex-col md:flex-row container mx-auto justify-between items-center'>
                <a href='/' className='text-xl font-bold mb-4 md:mb-0'>Mystry Messgae</a>
                {
                    session ? (
                        <>
                        <span className='md:mr-18'>Welcome, {user?.username || user?.email}</span>
                        <Button onClick={() => signOut()}>Logout</Button>
                        </>
                    ) : (<Link href="/sign-in">
                        <Button className='w-full md:w-auto'>LogIn</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
