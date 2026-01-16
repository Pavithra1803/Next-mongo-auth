import jwt,{JwtPayload} from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
}

export function signToken(payload:object){
    return jwt.sign(payload,getJwtSecret(),{
        expiresIn:"1d",
    });
}

export function verifyToken(token:string): JwtPayload {
    return jwt.verify(token,getJwtSecret()) as JwtPayload;
}