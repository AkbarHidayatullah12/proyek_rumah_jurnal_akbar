import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/submissions/route';

describe('GET /api/submissions', () => {
  it('returns items and total (fallback sample)', async () => {
    const res = await GET(new Request('http://localhost/api/submissions?page=1&perPage=5'));
    expect(res).toBeInstanceOf(Response);
    const json = await res.json();
    expect(json).toHaveProperty('total');
    expect(Array.isArray(json.items)).toBe(true);
  });

  it('filters by query and status', async () => {
    const res = await GET(new Request('http://localhost/api/submissions?status=Disetujui&q=Workshop'));
    const json = await res.json();
    // Ensure response structure
    expect(json).toHaveProperty('total');
    expect(Array.isArray(json.items)).toBe(true);
  });
});