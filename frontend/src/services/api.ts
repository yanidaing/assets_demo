const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface Asset {
  id: number;
  name: string;
  status: "Activated" | "Lost" | "Damaged";
  Location: string;
  Agency: string;
  Date: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  Barcode: string;
}

export interface AssetStats {
  status: string;
  count: number;
}

export interface AssetSummary {
  total: number;
  statuses: Record<string, number>;
}

export interface AssetReport {
  propertyIncome: number;
  propertySold: number;
  propertyOutcome: number;
  propertyClient: number;
  sellingReports: Array<{
    month: string;
    value: number;
  }>;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  // ดึงข้อมูล assets ทั้งหมด
  async getAssets(): Promise<Asset[]> {
    return this.request<Asset[]>("/assets");
  }

  // ดึงข้อมูล asset ตาม barcode
  async getAssetByBarcode(barcode: string): Promise<Asset> {
    return this.request<Asset>(`/assets/${barcode}`);
  }

  // อัปเดตสถานะของ asset
  async updateAssetStatus(
    barcode: string,
    status: string
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/assets/${barcode}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // ดึงสถิติ assets
  async getAssetStats(): Promise<AssetStats[]> {
    return this.request<AssetStats[]>("/assets/stats");
  }

  // ดึงสรุปข้อมูล assets
  async getAssetSummary(): Promise<AssetSummary> {
    return this.request<AssetSummary>("/assets/summary");
  }

  // ดึงรายงาน assets
  async getAssetReport(): Promise<AssetReport> {
    return this.request<AssetReport>("/assets/report");
  }

  // อัปเดตข้อมูล asset
  async updateAsset(asset: Asset): Promise<Asset> {
    return this.request<Asset>(`/assets/${asset.id}`, {
      method: "PUT",
      body: JSON.stringify(asset),
    });
  }

  // ลบ asset
  async deleteAsset(id: number): Promise<void> {
    const url = `/assets/${id}`;
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    // 204 No Content: do not parse response
    return;
  }

  // เพิ่ม asset ใหม่
  async addAsset(asset: Omit<Asset, "id">): Promise<Asset> {
    return this.request<Asset>("/assets", {
      method: "POST",
      body: JSON.stringify(asset),
    });
  }

  // ดึงข้อมูล users ทั้งหมด
  async getUsers(): Promise<any[]> {
    return this.request<any[]>("/users");
  }

  // อัปเดต role ของ user
  async updateUserRole(id: number, role: string): Promise<void> {
    await this.request<void>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  }
}

export const apiService = new ApiService();
