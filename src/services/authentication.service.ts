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
       let permissions: string[];
        switch (username){
            case "admin":
                permissions = ["admin", "read", "write", "delete", "update"];
                break;
            case "manager":
                permissions = ["read", "write", "update", "delete:BookCopy"];
                break;
            default:
                permissions = ["read", "write:Book"];
                break;
        }
        const token: string = jwt.sign(
            { username: username, permissions: permissions },
            "your_secret_key",
            { expiresIn: "1h" });
        return token;
    }
}

export const authenticationService: AuthenticationService = new AuthenticationService();