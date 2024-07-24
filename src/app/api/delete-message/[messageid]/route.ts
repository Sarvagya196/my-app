import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}){
    const messageId = params.messageid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user){
        return Response.json({
            success: false,
            message: "Not Authenticated",
        }, {status: 401});
    }

    try {
        const updatedResult = await userModel.updateOne(
            {_id: _user._id},
            {$pull: {messages: {_id: messageId}}}
        ).exec();
        if (updatedResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: "Message not Found",
            }, {status: 404});
        }

        return Response.json({
            success: true,
            message: "Message deleted",
        }, {status: 200});
        
    } catch (error) {
        console.log("Error deleting message", error);
        return Response.json({
            success: false,
            message: "Error deleting Message",
        }, {status: 500});
    }
}