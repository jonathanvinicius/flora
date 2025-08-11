import { jwtDecode } from 'jwt-decode';

export interface ITokenPayload {
  userId: string;
}
export class JWTTokenUtil {
  /**
   * Get Token Datas
   * @returns {ITokenPayload}
   */
  static getTokenPayload(token: string): ITokenPayload {
    try {
      const decodedToken = jwtDecode<any>(token);

      const tokenPayload: ITokenPayload = {
        userId: decodedToken.userId,
      };

      return tokenPayload;
    } catch {
      return null;
    }
  }
}
