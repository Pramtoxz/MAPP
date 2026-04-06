import { apiService } from './api';

export interface Part {
  id: string;
  image: string;
  partNumber: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isReady?: boolean;
  stock?: number;
}

export interface VehicleType {
  code: string;
  name: string;
}

export interface Category {
  code: string;
  name: string;
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
  vehicle_type?: string;
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
    if (params?.vehicle_type) queryParams.append('vehicle_type', params.vehicle_type);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const query = queryParams.toString();
    const endpoint = query ? `/parts?${query}` : '/parts';

    return apiService.get<PartsListResponse>(endpoint);
  }

  async getPartDetail(partNumber: string) {
    return apiService.get<Part>(`/parts/${partNumber}`);
  }

  async getVehicleTypes(search?: string) {
    const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<VehicleType[]>(`/filters/vehicle-types${queryParams}`);
  }

  async getCategories(search?: string) {
    const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<Category[]>(`/filters/categories${queryParams}`);
  }
}

export const partsService = new PartsService();
