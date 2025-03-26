export interface JWTPort {
    generateToken(payload: string): Promise<string>;
}