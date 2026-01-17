import { apiService } from './api';

export interface Part {
  id: string;
  image: string;
  partNumber: string;
  name: string;
  description: string;
  price: number;
  isReady: boolean;
  stock?: number;
  category?: string;
}

interface PartsListResponse {
  items: Part[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PartsListParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'partNumber';
  order?: 'asc' | 'desc';
}

class PartsService {
  async getPartsList(params?: PartsListParams) {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const query = queryParams.toString();
    const endpoint = query ? `/parts?${query}` : '/parts';

    return apiService.get<PartsListResponse>(endpoint);
  }

  async getPartDetail(id: string) {
    return apiService.get<Part>(`/parts/${id}`);
  }
}

export const partsService = new PartsService();
