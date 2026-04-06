import { apiService } from './api';

export interface CollectionSummary {
  totalTagihan: number;
  totalTerbayar: number;
  totalOutstanding: number;
  jumlahInvoice: number;
  jumlahOutstanding: number;
  jumlahPaid: number;
}

export interface Invoice {
  noFaktur: string;
  tanggal: string;
  noDo: string;
  noSo: string;
  nilaiFaktur: number;
  saldo: number;
  status: 'Outstanding' | 'Paid';
  jenisPembayaran: 'Cash' | 'Credit';
}

export interface InvoiceDetail extends Invoice {
  nilaiGross: number;
  totalDiskon: number;
  nilaiNett: number;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  partCode: string;
  partName: string;
  qty: number;
  harga: number;
  diskon: number;
  subtotal: number;
}

export interface PaymentReminder {
  noFaktur: string;
  tanggal: string;
  jatuhTempo: string | null;
  sisaHari: number | null;
  saldo: number;
  message: string;
}

interface CollectionsListResponse {
  summary: CollectionSummary;
  outstanding: Invoice[];
  paid: Invoice[];
}

interface CollectionsParams {
  dari?: string;
  sampai?: string;
  filter?: 'outstanding' | 'paid';
}

interface RemindersParams {
  bulan?: number;
  tahun?: number;
  days?: number;
}

class CollectionService {
  async getCollectionsList(params?: CollectionsParams) {
    const queryParams = new URLSearchParams();

    if (params?.dari) queryParams.append('dari', params.dari);
    if (params?.sampai) queryParams.append('sampai', params.sampai);
    if (params?.filter) queryParams.append('filter', params.filter);

    const query = queryParams.toString();
    const endpoint = query ? `/collections?${query}` : '/collections';

    return apiService.get<CollectionsListResponse>(endpoint);
  }

  async getSummary(dari?: string, sampai?: string) {
    const queryParams = new URLSearchParams();

    if (dari) queryParams.append('dari', dari);
    if (sampai) queryParams.append('sampai', sampai);

    const query = queryParams.toString();
    const endpoint = query ? `/collections/summary?${query}` : '/collections/summary';

    return apiService.get<CollectionSummary>(endpoint);
  }

  async getInvoiceDetail(noFaktur: string) {
    const fakturPath = noFaktur.replace(/\//g, '/');
    return apiService.get<InvoiceDetail>(`/collections/${fakturPath}`);
  }

  async getReminders(params?: RemindersParams) {
    const queryParams = new URLSearchParams();

    if (params?.bulan) queryParams.append('bulan', params.bulan.toString());
    if (params?.tahun) queryParams.append('tahun', params.tahun.toString());
    if (params?.days) queryParams.append('days', params.days.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/collections/reminders?${query}` : '/collections/reminders';

    return apiService.get<{ reminders: PaymentReminder[] }>(endpoint);
  }
}

export const collectionService = new CollectionService();
