declare namespace Express {
  export interface Request {
    company: Record<string, unknown>
    user: Record<string, unknown>
  }
}