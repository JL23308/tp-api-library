import * as express from "express";
import * as jwt from "jsonwebtoken";
import {decode} from "jsonwebtoken";

let adminRight: string[] = ["admin", "read", "write", "delete", "update"];
let userRight: string[] = ["read", "write:Book"];
let managerRight: string[] = ["read", "write", "update", "delete:BookCopy"];

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === "jwt") {
        const token = request.headers["authorization"];

        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));
            } else {
                jwt.verify(token, "your_secret_key",
                    function(error, decoded: any) {
                        if (error)
                            return reject(new Error("Invalid token"));

                        const username = decoded.username;
                        const permissions = decoded.permissions;
                        if(scopes !== undefined) {
                            // Gestion des droits

                        }
                        resolve(decoded);
                    }

                );
            }
        });
    } else {
        throw new Error("Only support JWT authentication");
    }
}
