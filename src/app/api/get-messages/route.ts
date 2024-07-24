import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    console.log(session);
    const _user: User = session?.user as User;

    if (!session || !_user){
        return Response.json({
            success: false,
            message: "Not Authenticated 1",
        }, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(_user._id);
    console.log("User Id", userId);

    try {
        // const user = await userModel.aggregate([
        //     { $match: { _id: userId }},
        //     { $unwind: '$messages'},
        //     { $sort: {'messages.createdAt' : -1}},
        //     { $group: {_id: '$_id', messages: {$push: '$messages'}}},
        // ]).exec();

        const user = await userModel.aggregate([ {$match: { _id: userId }}]).exec();

        console.log("Found user is : ",user);
        if (!user || user.length===0){
            return Response.json({
                success: false,
                message: "User not found 1",
            }, {status: 404});
        }

        return Response.json({
            success: true,
            messages: user[0].messages,
        }, {status: 200});

    } catch (error) {
        console.log("unexpected error", error);
        return Response.json({
            success: false,
            message: "An unexpected error occured",
        }, {status: 500});
    }
}