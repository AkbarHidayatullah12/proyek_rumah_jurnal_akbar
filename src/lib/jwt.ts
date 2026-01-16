export interface DecodedToken {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch {
    return null;
  }
};
