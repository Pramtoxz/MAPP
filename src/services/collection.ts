import { apiService } from './api';

export interface CollectionSummary {
  cached?: boolean; // true = fast (< 1 detik), false = slow (2-5 menit)
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

// Helper to get default date range (30 days)
const getDefaultDateRange = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  return {
    dari: thirtyDaysAgo.toISOString().split('T')[0], // YYYY-MM-DD
    sampai: today.toISOString().split('T')[0], // YYYY-MM-DD
  };
};

class CollectionService {
  async getCollectionsList(params?: CollectionsParams) {
    const queryParams = new URLSearchParams();

    // If no date params provided, use default 30 days (for cache/performance)
    const dateRange = (params?.dari && params?.sampai) 
      ? { dari: params.dari, sampai: params.sampai }
      : getDefaultDateRange();

    queryParams.append('dari', dateRange.dari);
    queryParams.append('sampai', dateRange.sampai);
    
    if (params?.filter) queryParams.append('filter', params.filter);

    const endpoint = `/collections?${queryParams.toString()}`;

    return apiService.get<CollectionsListResponse>(endpoint);
  }

  async getSummary(dari?: string, sampai?: string) {
    const queryParams = new URLSearchParams();

    // If no date params provided, use default 30 days (for cache/performance)
    const dateRange = (dari && sampai) 
      ? { dari, sampai }
      : getDefaultDateRange();

    queryParams.append('dari', dateRange.dari);
    queryParams.append('sampai', dateRange.sampai);

    const endpoint = `/collections/summary?${queryParams.toString()}`;

    return apiService.get<CollectionSummary>(endpoint);
  }

  // Helper method to check if date range is using cache (30 days)
  isUsingCache(dari?: string, sampai?: string): boolean {
    if (!dari || !sampai) return true; // Default uses cache
    
    const defaultRange = getDefaultDateRange();
    return dari === defaultRange.dari && sampai === defaultRange.sampai;
  }

  // Get default date range for UI
  getDefaultDateRange() {
    return getDefaultDateRange();
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
