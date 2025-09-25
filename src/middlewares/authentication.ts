import * as express from "express";
import * as jwt from "jsonwebtoken";
import {decode} from "jsonwebtoken";

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

                        const permissions: string[] = decoded.permissions;
                        if(scopes !== undefined) {
                            const hasAllScopes = scopes.every(scope => permissions.includes(scope));
                            if (!hasAllScopes) {
                                return reject(new Error("Insufficient rights"));
                            }
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
