import { API_BASE_URL } from "./constants";
import {
  AeoCitationListResponse,
  AeoDashboardSummary,
  AeoEntityCreateInput,
  AeoEntityListResponse,
  AeoEntityResponse,
  AeoProject,
  AeoProjectCreateInput,
  AeoProjectListResponse,
  AeoQuestionCreateInput,
  AeoQuestionListResponse,
  AeoQuestionResponse,
  ApiError,
  HealthResponse,
  Project,
  ProjectCreateInput,
  ProjectListResponse,
  ProjectUpdateInput,
  Scan,
  ScanCancelResponse,
  ScanCreateInput,
  ScanListResponse,
  ScanResultsResponse,
  SeoDashboardSummary,
  SEOIssueListResponse,
  SEOPageDetail,
  SEOPageListResponse,
} from "./types";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        const detail = errorData.detail || errorData.message || "An unexpected error occurred";
        const message = typeof detail === "string" ? detail : JSON.stringify(detail);

        const error: ApiError = {
          message,
          detail: errorData.detail,
          status: response.status,
        };
        throw error;
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (err: unknown) {
      if ((err as ApiError)?.status) {
        throw err;
      }
      throw {
        message: (err as Error)?.message || "Failed to connect to DMOS Backend API. Ensure backend is running.",
        status: 500,
      } as ApiError;
    }
  }

  // --- Health ---
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  // ==========================================
  // SEO OPTIMIZATION APIS
  // ==========================================

  async getSeoDashboard(): Promise<SeoDashboardSummary> {
    return this.request<SeoDashboardSummary>("/seo/dashboard");
  }

  async getProjects(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<ProjectListResponse> {
    const query = new URLSearchParams();
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<ProjectListResponse>(`/projects${qs}`);
  }

  async getProject(projectId: string): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}`);
  }

  async createProject(input: ProjectCreateInput): Promise<Project> {
    return this.request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateProject(
    projectId: string,
    input: ProjectUpdateInput
  ): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async deleteProject(projectId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/projects/${projectId}`,
      {
        method: "DELETE",
      }
    );
  }

  async createScan(
    projectId: string,
    input?: ScanCreateInput
  ): Promise<Scan> {
    return this.request<Scan>(`/projects/${projectId}/scans`, {
      method: "POST",
      body: JSON.stringify(input || {}),
    });
  }

  async getProjectScans(
    projectId: string,
    params?: { skip?: number; limit?: number }
  ): Promise<ScanListResponse> {
    const query = new URLSearchParams();
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<ScanListResponse>(`/projects/${projectId}/scans${qs}`);
  }

  async getScan(scanId: string): Promise<Scan> {
    return this.request<Scan>(`/scans/${scanId}`);
  }

  async cancelScan(scanId: string): Promise<ScanCancelResponse> {
    return this.request<ScanCancelResponse>(`/scans/${scanId}/cancel`, {
      method: "POST",
    });
  }

  async getScanResults(scanId: string): Promise<ScanResultsResponse> {
    return this.request<ScanResultsResponse>(`/scans/${scanId}/results`);
  }

  async getScanPages(
    scanId: string,
    params?: {
      page?: number;
      page_size?: number;
      search?: string;
      status_code?: number;
      indexability?: boolean;
    }
  ): Promise<SEOPageListResponse> {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", params.page.toString());
    if (params?.page_size !== undefined) query.set("page_size", params.page_size.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.status_code !== undefined) query.set("status_code", params.status_code.toString());
    if (params?.indexability !== undefined) query.set("indexability", params.indexability.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<SEOPageListResponse>(`/scans/${scanId}/pages${qs}`);
  }

  async getScanPageDetail(scanId: string, pageId: string): Promise<SEOPageDetail> {
    return this.request<SEOPageDetail>(`/scans/${scanId}/pages/${pageId}`);
  }

  async getScanIssues(
    scanId: string,
    params?: {
      page?: number;
      page_size?: number;
      severity?: string;
      category?: string;
      issue_code?: string;
      status?: string;
    }
  ): Promise<SEOIssueListResponse> {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set("page", params.page.toString());
    if (params?.page_size !== undefined) query.set("page_size", params.page_size.toString());
    if (params?.severity) query.set("severity", params.severity);
    if (params?.category) query.set("category", params.category);
    if (params?.issue_code) query.set("issue_code", params.issue_code);
    if (params?.status) query.set("status", params.status);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<SEOIssueListResponse>(`/scans/${scanId}/issues${qs}`);
  }

  // ==========================================
  // AEO OPTIMIZATION APIS
  // ==========================================

  async getAeoDashboard(): Promise<AeoDashboardSummary> {
    return this.request<AeoDashboardSummary>("/aeo/dashboard");
  }

  async getAeoProjects(params?: {
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<AeoProjectListResponse> {
    const query = new URLSearchParams();
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoProjectListResponse>(`/aeo/projects${qs}`);
  }

  async getAeoProject(projectId: string): Promise<AeoProject> {
    return this.request<AeoProject>(`/aeo/projects/${projectId}`);
  }

  async createAeoProject(input: AeoProjectCreateInput): Promise<AeoProject> {
    return this.request<AeoProject>("/aeo/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async deleteAeoProject(projectId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/aeo/projects/${projectId}`,
      {
        method: "DELETE",
      }
    );
  }

  async getAeoQuestions(params?: {
    project_id?: string;
    skip?: number;
    limit?: number;
    search?: string;
    intent?: string;
    visibility_status?: string;
  }): Promise<AeoQuestionListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.intent) query.set("intent", params.intent);
    if (params?.visibility_status) query.set("visibility_status", params.visibility_status);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoQuestionListResponse>(`/aeo/questions${qs}`);
  }

  async createAeoQuestion(input: AeoQuestionCreateInput): Promise<AeoQuestionResponse> {
    return this.request<AeoQuestionResponse>("/aeo/questions", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getAeoEntities(params?: {
    project_id?: string;
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<AeoEntityListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoEntityListResponse>(`/aeo/entities${qs}`);
  }

  async createAeoEntity(input: AeoEntityCreateInput): Promise<AeoEntityResponse> {
    return this.request<AeoEntityResponse>("/aeo/entities", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getAeoCitations(params?: {
    project_id?: string;
    skip?: number;
    limit?: number;
    engine?: string;
    search?: string;
  }): Promise<AeoCitationListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    if (params?.engine) query.set("engine", params.engine);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoCitationListResponse>(`/aeo/citations${qs}`);
  }
}

export const api = new ApiClient();
