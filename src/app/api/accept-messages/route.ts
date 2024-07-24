import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if (!session || !session.user){
        console.log("error");
        return Response.json({
            success:false,
            message: "Not Authenticated 0",
        }, {status: 401});
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
                                userId,
                                { isAcceptingMessage: acceptMessages },
                                { new: true },
                            ).exec();

        if (!updatedUser){
            return Response.json({
                success: false,
                message: "Failed to update user status",
                updatedUser,
            }, {status: 401});
        }

        return Response.json({
            success: true,
            message: `Updated user to ${acceptMessages}`,
        }, {status: 200});

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to update user status",
        }, {status: 500});
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log("session", session);
    const user: User = session?.user as User;

    if (!session || !user){
        console.log("No Session!");
        return Response.json({
            success:false,
            message: "Not Authenticated 0",
        }, {status: 401});
    }

    const userId = user?._id;
    
    try {
        const foundUser = await userModel.findById(userId);
    
        if (!foundUser){
            return Response.json({
                success: false,
                message: "user not found",
            }, {status: 404});
        }
    
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, {status: 200})
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to get user status",
        }, {status: 500});
    }
}

