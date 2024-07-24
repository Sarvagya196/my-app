import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request) {
    console.log("sending request...");
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUserName = await userModel.findOne({
            username,
            isVerified: true
        });
        
        if (existingUserVerifiedByUserName) {
            return Response.json({
                success: false,
                message: "userName already taken",
            },
            {
                status: 400
            })
        }

        const existingUserVerifiedByEmail = await userModel.findOne({
            email
        });

        const verifyCode = Math.floor(100000 + Math.random()*90000).toString();

        if (existingUserVerifiedByEmail){
            if (existingUserVerifiedByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User with this email already exists"
                }, {status: 400});
            } else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserVerifiedByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();
        }

        //send verify email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500});
        }

        return Response.json({
            success: true,
            message: "User registered successfully...please verify your email"
        }, {status: 201});

    } catch (error) {
        console.log('Error registering user', error);
        return Response.json(
            {
                success: false,
                message: "Error registering User"
            },
            {
                status: 500
            }
        )
    }
}