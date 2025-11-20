import type { Request, Response } from "express";
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}
export declare const getSessions: (
  req: AuthRequest,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createSession: (
  req: AuthRequest,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSession: (
  req: AuthRequest,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSession: (
  req: AuthRequest,
  res: Response,
) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=sessionController.d.ts.map
