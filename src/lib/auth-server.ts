import jwt from 'jsonwebtoken';

export function getUserFromRequest(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader) return null;

        const token = authHeader.split(' ')[1];
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        return {
            id: decoded.id as number,
            email: decoded.email as string,
            role: decoded.role as string,
            name: (decoded.name || decoded.email) as string // Fallback to email if name is missing in token
        };
    } catch (error) {
        return null;
    }
}
