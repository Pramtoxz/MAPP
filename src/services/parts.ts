import { apiService } from './api';

export interface Part {
  id: string;
  image: string;
  partNumber: string;
  name: string;
  description: string;
  price: number;
  category: string;
  // Field only available in detail - for internal use only, not displayed to user
  isReady?: boolean;
}

interface PartsListResponse {
  items: Part[];
  pagination: {
    currentPage: number;
    perPage: number;
    hasMore: boolean;
  };
}

interface PartsListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: 'nm_part' | 'het' | 'kd_part';
  order?: 'asc' | 'desc';
}

class PartsService {
  async getPartsList(params?: PartsListParams) {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const query = queryParams.toString();
    const endpoint = query ? `/parts?${query}` : '/parts';

    return apiService.get<PartsListResponse>(endpoint);
  }

  async getPartDetail(partNumber: string) {
    return apiService.get<Part>(`/parts/${partNumber}`);
  }
}

export const partsService = new PartsService();
