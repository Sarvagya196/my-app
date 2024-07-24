import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username); //to convert spaces etc.
        const user = await userModel.findOne({username: decodedUsername});

        if (!user){
            return Response.json({
                success: false,
                message: "user not found",
            }, {status: 500});
        }

        const isCodeValid = (user.verifyCode === code) && (user.verifyCodeExpiry > new Date());

        if (isCodeValid){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "User verified successfully",
            }, {status: 200});
        }else{
            return Response.json({
                success: false,
                message: "Either code is wrong or expired",
            }, {status: 400});
        }

    } catch (error) {
        console.log("error verifying user", error);
        return Response.json({
            success: false,
            message: "Error verifying user",
        }, {status: 500});
    }
}