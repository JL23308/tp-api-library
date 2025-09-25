import {User} from "../models/user.model";
import {CustomError} from "../middlewares/errorHandler";
import jwt from "jsonwebtoken"

class AuthenticationService{
    public async authenticate(username: string, password: string): Promise<string>{
        const user: User | null = await User.findOne({where : {username, password}});

        if(!user){
            let error: CustomError = new Error("Invalid username or password");
            error.status = 401;
            throw error;
        }

        const token: string = jwt.sign(
            { username: user.username },
            "your_secret_key",
            { expiresIn: "1h" });
        return token;
    }
}

export const authenticationService: AuthenticationService = new AuthenticationService();