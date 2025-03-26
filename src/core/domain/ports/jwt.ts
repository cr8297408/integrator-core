export interface JWTPort {
    generateToken(payload: Record<string, any>): Promise<string>;
}