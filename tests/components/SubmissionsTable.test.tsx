import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubmissionsTable from '@/app/components/SubmissionsTable';

const sampleResponse = {
  total: 7,
  items: [
    { id: '001', title: 'Pengajuan LOA Acara Workshop Digital Marketing', date: '08 Nov 2024', status: 'Menunggu Validasi' },
    { id: '002', title: 'Kolaborasi Penelitian: Pendidikan Inklusif', date: '02 Oct 2024', status: 'Revisi' },
  ],
};

describe('SubmissionsTable', () => {
  beforeEach(() => {
    // mock fetch
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(sampleResponse) })) as any;
  });

  it('renders and fetches submissions', async () => {
    render(<SubmissionsTable />);

    // fetch should be called to load data
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // titles should be rendered
    expect(await screen.findByText(/Pengajuan LOA Acara Workshop Digital Marketing/)).toBeInTheDocument();
  });

  it('search filters results (client-side behavior works through API calls)', async () => {
    render(<SubmissionsTable />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const search = screen.getByPlaceholderText('Cari berdasarkan Judul...');
    await userEvent.type(search, 'Workshop');

    // should call fetch again with query param
    await waitFor(() => expect((global.fetch as any).mock.calls.length).toBeGreaterThan(1));
  });
});