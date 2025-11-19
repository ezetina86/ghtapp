import { type Request, type Response, type NextFunction } from "express";
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}
export declare const authenticateToken: (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=auth.d.ts.map
