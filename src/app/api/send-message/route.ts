import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await userModel.findOne({username}).exec();
        console.log("username on send-messages: ", user);
        if (!user){
            return Response.json({
                success: false,
                message: "User not found",
            }, {status: 404});
        }

        if (!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User is not accepting the messages",
            }, {status: 403});
        }
        const newMessage = { content, createdAt: new Date() };
        console.log("where is error");
        user.messages.push(newMessage as Message);
        console.log("here is error");
        await user.save();
        console.log("lets try here");

        return Response.json({
            success: true,
            message: "Message sent successfully!",
        }, {status: 200});

    } catch (error) {
        console.log("unexpected error sending message", error);
        return Response.json({
            success: false,
            message: "Internal server error 1",
        }, {status: 500});
    }
}