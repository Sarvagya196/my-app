import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username'),
        };
        
        const result = UsernameQuerySchema.safeParse(queryParam);

        if (!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: (usernameErrors?.length > 0) ? usernameErrors.join(', ') : "invalid query parameter",
            }, {status: 400});
        }
        
        const {username} = result.data;
        const existingVerifiedUser = await userModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser){
            return Response.json({
                success: false,
                message: "userName is already taken",
            }, {status: 400});
        }

        return Response.json({
            success: true,
            message: "Username Available!",
        }, {status: 200});

    } catch (error) {
        console.log("Error checking userName", error);
        return Response.json({
            success: false,
            message: "Error Checking UserName",
        }, {status: 500});
    }
}

