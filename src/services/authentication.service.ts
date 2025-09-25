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
        switch (username) {
            case "admin":
                permissions = [
                    "read:Author", "write:Author", "update:Author", "delete:Author",
                    "read:Book", "write:Book", "update:Book", "delete:Book",
                    "read:BookCopy", "write:BookCopy", "update:BookCopy", "delete:BookCopy",
                ];
                break;
            case "manager":
                permissions = [
                    "read:Author", "write:Author", "update:Author",
                    "read:Book", "write:Book", "update:Book",
                    "read:BookCopy", "write:BookCopy", "update:BookCopy", "delete:BookCopy"
                ];
                break;
            default:
                permissions = [
                    "read:Author", "read:Book", "read:BookCopy",
                    "write:Book"
                ];
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