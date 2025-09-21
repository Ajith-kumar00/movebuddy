const API_BASE_URL = 'http://localhost:3001';

export interface FolderData {
  name: string;
  title: string;
  description?: string;
  publishingYear?: number;
  image?: string;
  userId: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  tags?: string[];
  estimatedCost?: number;
  actualCost?: number;
  metadata?: Record<string, unknown>;
}

export interface Folder extends FolderData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderListResponse {
  folders: Folder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FolderStats {
  total: number;
  byStatus: Record<string, number>;
  byYear: Record<string, number>;
  totalCost: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const folderApi = {
  async create(folderData: FolderData): Promise<ApiResponse<Folder>> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderData)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          message: 'Folder created successfully!'
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to create folder'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  },

  async getAll(params?: {
    userId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<FolderListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.userId) queryParams.append('userId', params.userId);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${API_BASE_URL}/folders?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to fetch folders'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  },

  async getMovieList(params?: {
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<FolderListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.userId) queryParams.append('userId', params.userId);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${API_BASE_URL}/folders/movies?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to fetch movie list'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  },

  async getById(id: string): Promise<ApiResponse<Folder>> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to fetch folder'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  },

  async update(id: string, folderData: Partial<FolderData>): Promise<ApiResponse<Folder>> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderData)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
          message: 'Folder updated successfully!'
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to update folder'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Folder deleted successfully!'
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to delete folder'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  },

  async search(query: string, userId?: string): Promise<ApiResponse<FolderListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      if (userId) queryParams.append('userId', userId);

      const response = await fetch(`${API_BASE_URL}/folders/search?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to search folders'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  },

  async getByYear(year: number, userId?: string): Promise<ApiResponse<FolderListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      if (userId) queryParams.append('userId', userId);

      const response = await fetch(`${API_BASE_URL}/folders/year/${year}?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to fetch folders by year'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  },

  async getStats(userId?: string): Promise<ApiResponse<FolderStats>> {
    try {
      const queryParams = new URLSearchParams();
      if (userId) queryParams.append('userId', userId);

      const response = await fetch(`${API_BASE_URL}/folders/stats?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || 'Failed to fetch statistics'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }
};
