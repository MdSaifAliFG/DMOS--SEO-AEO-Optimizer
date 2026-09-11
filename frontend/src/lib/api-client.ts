import { API_BASE_URL } from "./constants";
import {
  AeoAnalysis,
  AeoAnswer,
  AeoAnswerListResponse,
  AeoCitation,
  AeoCitationCreateInput,
  AeoCitationListResponse,
  AeoDashboardSummary,
  AeoEntity,
  AeoEntityCreateInput,
  AeoEntityListResponse,
  AeoEntityResponse,
  AeoProject,
  AeoProjectCreateInput,
  AeoProjectUpdateInput,
  AeoProjectListResponse,
  AeoQuestion,
  AeoQuestionCreateInput,
  AeoQuestionListResponse,
  AeoQuestionResponse,
  AeoRecommendation,
  AeoRecommendationListResponse,
  AeoVisibilityData,
  AeoActionSummary,
  AeoContentGapResponse,
  AeoPromptGapResponse,
  AeoCitationGapResponse,
  AeoEntityGapResponse,
  AeoOptimizationHistoryResponse,
  AeoContentOptimizationResult,
  AeoDirectAnswerOptimizationResult,
  AeoMonitoringSchedule,
  AeoTrendResponse,
  AeoEngineComparisonResponse,
  AeoCompetitorIntelligenceResponse,
  AeoChangeEvent,
  AeoAlert,
  AeoExecutiveIntelligence,
  AeoPromptMovementItem,
  AeoCitationMovementItem,
  AeoEntityMovementItem,
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
  SeoRecommendation,
  SeoRecommendationListResponse,
  SeoRecommendationUpdateInput,
  SeoRecommendationBulkUpdateInput,
  VerifyFixResponse,
  SeoOptimizationSummary,
  OptimizationHistoryListResponse,
  TitleOptimizationResponse,
  DescriptionOptimizationResponse,
  ContentOptimizationResponse,
  InternalLinksOptimizationResponse,
  SEOKeywordsResponse,
  SEOLinksResponse,
  SEOTechnicalDiagnostics,
  GeoProject,
  GeoProjectListResponse,
  GeoProjectCreateInput,
  GeoProjectUpdateInput,
  GeoBrandProfile,
  GeoBrandProfileUpdateInput,
  GeoQuestion,
  GeoQuestionListResponse,
  GeoAnswer,
  GeoAnswerListResponse,
  GeoCitation,
  GeoCitationListResponse,
  GeoEntity,
  GeoEntityListResponse,
  GeoCompetitorResponse,
  GeoIssue,
  GeoIssueListResponse,
  GeoRecommendation,
  GeoRecommendationListResponse,
  GeoActionSummary,
  GeoDashboardData,
  GeoVisibilityData,
  GeoHistoryData,
  GeoMonitoringSchedule,
  GeoAlert,
  GeoOptimizeResult,
  GeoReport,
  GeoAnalysisJob,
  UnifiedSearchIntelligence,
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
        message: (err as Error)?.message || "Failed to connect to SeoSensing Backend API. Ensure backend is running.",
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
    return this.request<SEOPageDetail>(`/scans/${scanId}/pages/${encodeURIComponent(pageId)}`);
  }

  async getPageDetails(scanId: string, pageIdOrUrl: string): Promise<SEOPageDetail> {
    return this.getScanPageDetail(scanId, pageIdOrUrl);
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

  async getSeoKeywords(params?: {
    project_id?: string;
    scan_id?: string;
    limit?: number;
  }): Promise<SEOKeywordsResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.scan_id) query.set("scan_id", params.scan_id);
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<SEOKeywordsResponse>(`/seo/keywords${qs}`);
  }

  async extractSeoKeywords(input: {
    project_id?: string;
    scan_id?: string;
    limit?: number;
  }): Promise<SEOKeywordsResponse> {
    return this.request<SEOKeywordsResponse>("/seo/keywords/extract", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getSeoLinks(params?: {
    project_id?: string;
    scan_id?: string;
    link_type?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<SEOLinksResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.scan_id) query.set("scan_id", params.scan_id);
    if (params?.link_type) query.set("link_type", params.link_type);
    if (params?.search) query.set("search", params.search);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<SEOLinksResponse>(`/seo/links${qs}`);
  }

  async getSeoTechnicalDiagnostics(params?: {
    project_id?: string;
    scan_id?: string;
  }): Promise<SEOTechnicalDiagnostics> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.scan_id) query.set("scan_id", params.scan_id);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<SEOTechnicalDiagnostics>(`/seo/technical/diagnostics${qs}`);
  }

  // ==========================================
  // AEO OPTIMIZATION APIS
  // ==========================================

  async getAeoDashboard(projectId?: string): Promise<AeoDashboardSummary> {
    const qs = projectId ? `?project_id=${projectId}` : "";
    return this.request<AeoDashboardSummary>(`/aeo/dashboard${qs}`);
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

  async updateAeoProject(projectId: string, input: AeoProjectUpdateInput): Promise<AeoProject> {
    return this.request<AeoProject>(`/aeo/projects/${projectId}`, {
      method: "PATCH",
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

  async triggerAeoAnalysis(
    projectId: string,
    input?: { engines?: string[]; allow_test_mode?: boolean }
  ): Promise<AeoAnalysis> {
    return this.request<AeoAnalysis>(`/aeo/projects/${projectId}/analyze`, {
      method: "POST",
      body: JSON.stringify(input || {}),
    });
  }

  async getAeoAnalysis(analysisId: string): Promise<AeoAnalysis> {
    return this.request<AeoAnalysis>(`/aeo/analysis/${analysisId}`);
  }

  async getAeoQuestions(params?: {
    project_id?: string;
    skip?: number;
    limit?: number;
    search?: string;
    intent?: string;
    category?: string;
    visibility_status?: string;
  }): Promise<AeoQuestionListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.intent) query.set("intent", params.intent);
    if (params?.category) query.set("category", params.category);
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

  async updateAeoQuestion(
    questionId: string,
    input: Partial<AeoQuestionCreateInput>
  ): Promise<AeoQuestionResponse> {
    return this.request<AeoQuestionResponse>(`/aeo/questions/${questionId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async deleteAeoQuestion(questionId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/aeo/questions/${questionId}`,
      {
        method: "DELETE",
      }
    );
  }

  async generateAeoQuestions(input: {
    project_id: string;
    max_questions?: number;
  }): Promise<AeoQuestionListResponse> {
    return this.request<AeoQuestionListResponse>("/aeo/questions/generate", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getAeoAnswers(params?: {
    project_id?: string;
    question_id?: string;
    engine?: string;
    brand_mentioned?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<AeoAnswerListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.question_id) query.set("question_id", params.question_id);
    if (params?.engine) query.set("engine", params.engine);
    if (params?.brand_mentioned !== undefined) query.set("brand_mentioned", params.brand_mentioned.toString());
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoAnswerListResponse>(`/aeo/answers${qs}`);
  }

  async getAeoAnswer(answerId: string): Promise<AeoAnswer> {
    return this.request<AeoAnswer>(`/aeo/answers/${answerId}`);
  }

  async getAeoEntities(params?: {
    project_id?: string;
    entity_type?: string;
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<AeoEntityListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.entity_type) query.set("entity_type", params.entity_type);
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
    engine?: string;
    citation_type?: string;
    skip?: number;
    limit?: number;
    search?: string;
  }): Promise<AeoCitationListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.engine) query.set("engine", params.engine);
    if (params?.citation_type) query.set("citation_type", params.citation_type);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoCitationListResponse>(`/aeo/citations${qs}`);
  }

  async createAeoCitation(input: AeoCitationCreateInput): Promise<AeoCitation> {
    return this.request<AeoCitation>("/aeo/citations", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getAeoVisibility(projectId: string): Promise<AeoVisibilityData> {
    return this.request<AeoVisibilityData>(`/aeo/visibility/${projectId}`);
  }

  async getAeoRecommendations(projectId: string): Promise<AeoRecommendationListResponse> {
    return this.request<AeoRecommendationListResponse>(`/aeo/recommendations/${projectId}`);
  }

  async getAeoReport(projectId: string): Promise<any> {
    return this.request<any>(`/aeo/reports/${projectId}`);
  }

  // --- Phase 6 AEO Optimization & Action Center Methods ---

  async getAeoActions(params?: {
    project_id?: string;
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<AeoRecommendationListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.status) query.set("status", params.status);
    if (params?.priority) query.set("priority", params.priority);
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoRecommendationListResponse>(`/aeo/actions${qs}`);
  }

  async getAeoAction(actionId: string): Promise<AeoRecommendation> {
    return this.request<AeoRecommendation>(`/aeo/actions/${actionId}`);
  }

  async generateAeoActions(projectId: string): Promise<AeoRecommendationListResponse> {
    return this.request<AeoRecommendationListResponse>("/aeo/actions/generate", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
  }

  async updateAeoAction(
    actionId: string,
    input: { status?: string; notes?: string }
  ): Promise<AeoRecommendation> {
    return this.request<AeoRecommendation>(`/aeo/actions/${actionId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async verifyAeoAction(actionId: string): Promise<{
    action_id: string;
    is_resolved: boolean;
    verification_status: string;
    status: string;
    message: string;
    action: AeoRecommendation;
  }> {
    return this.request<{
      action_id: string;
      is_resolved: boolean;
      verification_status: string;
      status: string;
      message: string;
      action: AeoRecommendation;
    }>(`/aeo/actions/${actionId}/verify`, {
      method: "POST",
    });
  }

  async ignoreAeoAction(actionId: string): Promise<AeoRecommendation> {
    return this.request<AeoRecommendation>(`/aeo/actions/${actionId}/ignore`, {
      method: "POST",
    });
  }

  async bulkUpdateAeoActions(
    actionIds: string[],
    status: string
  ): Promise<{ success: boolean; updated_count: number; status: string }> {
    return this.request<{ success: boolean; updated_count: number; status: string }>(
      "/aeo/actions/bulk",
      {
        method: "POST",
        body: JSON.stringify({ action_ids: actionIds, status }),
      }
    );
  }

  async getAeoActionsSummary(projectId: string): Promise<AeoActionSummary> {
    return this.request<AeoActionSummary>(`/aeo/actions/summary/${projectId}`);
  }

  async getAeoContentGaps(projectId: string): Promise<AeoContentGapResponse> {
    return this.request<AeoContentGapResponse>("/aeo/gaps/content", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
  }

  async getAeoPromptGaps(projectId: string): Promise<AeoPromptGapResponse> {
    return this.request<AeoPromptGapResponse>("/aeo/gaps/prompts", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
  }

  async getAeoCitationGaps(projectId: string): Promise<AeoCitationGapResponse> {
    return this.request<AeoCitationGapResponse>("/aeo/gaps/citations", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
  }

  async getAeoEntityGaps(projectId: string): Promise<AeoEntityGapResponse> {
    return this.request<AeoEntityGapResponse>("/aeo/gaps/entities", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    });
  }

  async getAeoOptimizationHistory(projectId: string, limit: number = 15): Promise<AeoOptimizationHistoryResponse> {
    return this.request<AeoOptimizationHistoryResponse>(
      `/aeo/optimization-history/${projectId}?limit=${limit}`
    );
  }

  async optimizeAeoContent(input: {
    target_question: string;
    existing_content: string;
    target_keyword?: string;
    brand_name?: string;
    product_service?: string;
  }): Promise<AeoContentOptimizationResult> {
    return this.request<AeoContentOptimizationResult>("/aeo/optimize/content", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async optimizeAeoDirectAnswer(input: {
    target_question: string;
    existing_content: string;
    brand_name?: string;
  }): Promise<AeoDirectAnswerOptimizationResult> {
    return this.request<AeoDirectAnswerOptimizationResult>("/aeo/optimize/answer", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  // --- Phase 7 AEO Monitoring & Intelligence Client Methods ---

  async getAeoMonitoringSchedule(projectId: string): Promise<AeoMonitoringSchedule> {
    return this.request<AeoMonitoringSchedule>(`/aeo/monitoring/${projectId}`);
  }

  async runAeoMonitoringCycle(projectId: string, allowTestMode: boolean = false): Promise<AeoAnalysis> {
    return this.request<AeoAnalysis>(`/aeo/monitoring/${projectId}/run?allow_test_mode=${allowTestMode}`, {
      method: "POST",
    });
  }

  async updateAeoMonitoringSchedule(
    projectId: string,
    input: Partial<{
      frequency: string;
      enabled: boolean;
      selected_engines: string[];
      alert_thresholds: Record<string, number>;
    }>
  ): Promise<AeoMonitoringSchedule> {
    return this.request<AeoMonitoringSchedule>(`/aeo/monitoring/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async getAeoTrends(projectId: string, range: "7d" | "30d" | "90d" | "all" = "30d"): Promise<AeoTrendResponse> {
    return this.request<AeoTrendResponse>(`/aeo/trends/${projectId}?range=${range}`);
  }

  async getAeoEngineComparison(projectId: string): Promise<AeoEngineComparisonResponse> {
    return this.request<AeoEngineComparisonResponse>(`/aeo/engines/${projectId}`);
  }

  async getAeoCompetitorIntelligence(projectId: string): Promise<AeoCompetitorIntelligenceResponse> {
    return this.request<AeoCompetitorIntelligenceResponse>(`/aeo/competitors/${projectId}`);
  }

  async getAeoChanges(
    projectId: string,
    params?: { severity?: string; event_type?: string; limit?: number }
  ): Promise<AeoChangeEvent[]> {
    const query = new URLSearchParams();
    if (params?.severity && params.severity !== "all") query.set("severity", params.severity);
    if (params?.event_type && params.event_type !== "all") query.set("event_type", params.event_type);
    if (params?.limit) query.set("limit", params.limit.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoChangeEvent[]>(`/aeo/changes/${projectId}${qs}`);
  }

  async getAeoAlerts(
    projectId: string,
    params?: { status?: string; severity?: string; limit?: number }
  ): Promise<AeoAlert[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "all") query.set("status", params.status);
    if (params?.severity && params.severity !== "all") query.set("severity", params.severity);
    if (params?.limit) query.set("limit", params.limit.toString());
    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<AeoAlert[]>(`/aeo/alerts/${projectId}${qs}`);
  }

  async updateAeoAlert(alertId: string, status: "acknowledged" | "resolved" | "new"): Promise<AeoAlert> {
    return this.request<AeoAlert>(`/aeo/alerts/${alertId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async getAeoExecutiveIntelligence(projectId: string): Promise<AeoExecutiveIntelligence> {
    return this.request<AeoExecutiveIntelligence>(`/aeo/intelligence/${projectId}`);
  }

  async getAeoPromptMovements(projectId: string, movement?: string): Promise<AeoPromptMovementItem[]> {
    const qs = movement && movement !== "all" ? `?movement=${movement}` : "";
    return this.request<AeoPromptMovementItem[]>(`/aeo/monitoring/${projectId}/prompts${qs}`);
  }

  async getAeoCitationMovements(projectId: string): Promise<AeoCitationMovementItem[]> {
    return this.request<AeoCitationMovementItem[]>(`/aeo/monitoring/${projectId}/citations`);
  }

  async getAeoEntityMovements(projectId: string): Promise<AeoEntityMovementItem[]> {
    return this.request<AeoEntityMovementItem[]>(`/aeo/monitoring/${projectId}/entities`);
  }

  // --- Phase 4 SEO Action Center & Optimization Methods ---

  async getSeoActions(params?: {
    project_id?: string;
    scan_id?: string;
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<SeoRecommendationListResponse> {
    const query = new URLSearchParams();
    if (params?.project_id) query.set("project_id", params.project_id);
    if (params?.scan_id) query.set("scan_id", params.scan_id);
    if (params?.status) query.set("status", params.status);
    if (params?.priority) query.set("priority", params.priority);
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.skip !== undefined) query.set("skip", params.skip.toString());
    if (params?.limit !== undefined) query.set("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    return this.request<SeoRecommendationListResponse>(`/seo/actions${qs}`);
  }

  async getSeoAction(actionId: string): Promise<SeoRecommendation> {
    return this.request<SeoRecommendation>(`/seo/actions/${actionId}`);
  }

  async generateSeoActions(params: {
    scan_id: string;
    project_id: string;
  }): Promise<SeoRecommendationListResponse> {
    const qs = `?scan_id=${params.scan_id}&project_id=${params.project_id}`;
    return this.request<SeoRecommendationListResponse>(`/seo/actions/generate${qs}`, {
      method: "POST",
    });
  }

  async updateSeoAction(
    actionId: string,
    input: SeoRecommendationUpdateInput
  ): Promise<SeoRecommendation> {
    return this.request<SeoRecommendation>(`/seo/actions/${actionId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async verifySeoAction(actionId: string): Promise<VerifyFixResponse> {
    return this.request<VerifyFixResponse>(`/seo/actions/${actionId}/verify`, {
      method: "POST",
    });
  }

  async ignoreSeoAction(actionId: string): Promise<SeoRecommendation> {
    return this.request<SeoRecommendation>(`/seo/actions/${actionId}/ignore`, {
      method: "POST",
    });
  }

  async bulkUpdateSeoActions(
    input: SeoRecommendationBulkUpdateInput
  ): Promise<{ success: boolean; updated_count: number }> {
    return this.request<{ success: boolean; updated_count: number }>(
      "/seo/actions/bulk",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );
  }

  async getSeoActionsSummary(projectId: string): Promise<SeoOptimizationSummary> {
    return this.request<SeoOptimizationSummary>(`/seo/actions/summary/${projectId}`);
  }

  async getOptimizationHistory(
    projectId: string,
    limit?: number
  ): Promise<OptimizationHistoryListResponse> {
    const qs = limit ? `?limit=${limit}` : "";
    return this.request<OptimizationHistoryListResponse>(
      `/seo/optimization-history/${projectId}${qs}`
    );
  }

  async optimizeTitle(input: {
    current_title?: string;
    target_url: string;
    target_keyword?: string;
    brand_name?: string;
    page_content_snippet?: string;
  }): Promise<TitleOptimizationResponse> {
    return this.request<TitleOptimizationResponse>("/seo/optimize/title", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async optimizeDescription(input: {
    current_description?: string;
    target_url: string;
    target_keyword?: string;
    brand_name?: string;
    page_content_snippet?: string;
  }): Promise<DescriptionOptimizationResponse> {
    return this.request<DescriptionOptimizationResponse>(
      "/seo/optimize/description",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );
  }

  async optimizeContent(input: {
    project_id: string;
    page_id?: string;
    target_url?: string;
  }): Promise<ContentOptimizationResponse> {
    return this.request<ContentOptimizationResponse>("/seo/optimize/content", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async optimizeInternalLinks(input: {
    project_id: string;
    scan_id?: string;
  }): Promise<InternalLinksOptimizationResponse> {
    return this.request<InternalLinksOptimizationResponse>(
      "/seo/optimize/internal-links",
      {
        method: "POST",
        body: JSON.stringify(input),
      }
    );
  }

  // ==========================================
  // GEO (Generative Engine Optimization) APIs
  // ==========================================

  async getGeoProjects(): Promise<GeoProjectListResponse> {
    return this.request<GeoProjectListResponse>("/geo/projects");
  }

  async getGeoProject(id: string): Promise<GeoProject> {
    return this.request<GeoProject>(`/geo/projects/${id}`);
  }

  async createGeoProject(input: GeoProjectCreateInput): Promise<GeoProject> {
    return this.request<GeoProject>("/geo/projects", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateGeoProject(id: string, input: GeoProjectUpdateInput): Promise<GeoProject> {
    return this.request<GeoProject>(`/geo/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async deleteGeoProject(id: string): Promise<void> {
    return this.request<void>(`/geo/projects/${id}`, {
      method: "DELETE",
    });
  }

  async getGeoBrandProfile(projectId: string): Promise<GeoBrandProfile> {
    return this.request<GeoBrandProfile>(`/geo/projects/${projectId}/brand-profile`);
  }

  async updateGeoBrandProfile(projectId: string, input: GeoBrandProfileUpdateInput): Promise<GeoBrandProfile> {
    return this.request<GeoBrandProfile>(`/geo/projects/${projectId}/brand-profile`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  }

  async triggerGeoAnalysis(input: {
    project_id: string;
    providers?: string[];
    crawling_enabled?: boolean;
    question_count?: number;
  }): Promise<GeoAnalysisJob> {
    return this.request<GeoAnalysisJob>("/geo/analyze", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getGeoAnalysisStatus(analysisId: string): Promise<GeoAnalysisJob> {
    return this.request<GeoAnalysisJob>(`/geo/analysis/${analysisId}`);
  }

  async getGeoDashboard(projectId: string): Promise<GeoDashboardData> {
    return this.request<GeoDashboardData>(`/geo/dashboard/${projectId}`);
  }

  async getGeoQuestions(
    projectId: string,
    params?: { category?: string; intent?: string; search?: string }
  ): Promise<GeoQuestionListResponse> {
    const searchParams = new URLSearchParams({ project_id: projectId });
    if (params?.category) searchParams.append("category", params.category);
    if (params?.intent) searchParams.append("intent", params.intent);
    if (params?.search) searchParams.append("search", params.search);
    return this.request<GeoQuestionListResponse>(`/geo/questions?${searchParams.toString()}`);
  }

  async generateGeoQuestions(
    projectId: string,
    categories?: string[],
    countPerCategory: number = 1
  ): Promise<GeoQuestion[]> {
    return this.request<GeoQuestion[]>("/geo/questions/generate", {
      method: "POST",
      body: JSON.stringify({
        project_id: projectId,
        categories,
        count_per_category: countPerCategory,
      }),
    });
  }

  async getGeoAnswers(
    projectId: string,
    params?: { provider?: string; recommended_only?: boolean }
  ): Promise<GeoAnswerListResponse> {
    const searchParams = new URLSearchParams({ project_id: projectId });
    if (params?.provider) searchParams.append("provider", params.provider);
    if (params?.recommended_only) searchParams.append("recommended_only", "true");
    return this.request<GeoAnswerListResponse>(`/geo/answers?${searchParams.toString()}`);
  }

  async getGeoAnswer(id: string): Promise<GeoAnswer> {
    return this.request<GeoAnswer>(`/geo/answers/${id}`);
  }

  async getGeoCitations(
    projectId: string,
    sourceType?: string
  ): Promise<GeoCitationListResponse> {
    const searchParams = new URLSearchParams({ project_id: projectId });
    if (sourceType) searchParams.append("source_type", sourceType);
    return this.request<GeoCitationListResponse>(`/geo/citations?${searchParams.toString()}`);
  }

  async getGeoEntities(
    projectId: string,
    entityType?: string
  ): Promise<GeoEntityListResponse> {
    const searchParams = new URLSearchParams({ project_id: projectId });
    if (entityType) searchParams.append("entity_type", entityType);
    return this.request<GeoEntityListResponse>(`/geo/entities?${searchParams.toString()}`);
  }

  async getGeoCompetitors(projectId: string): Promise<GeoCompetitorResponse> {
    return this.request<GeoCompetitorResponse>(`/geo/competitors/${projectId}`);
  }

  async getGeoVisibility(projectId: string): Promise<GeoVisibilityData> {
    return this.request<GeoVisibilityData>(`/geo/visibility/${projectId}`);
  }

  async getGeoHistory(projectId: string): Promise<GeoHistoryData> {
    return this.request<GeoHistoryData>(`/geo/history/${projectId}`);
  }

  async getGeoIssues(
    projectId: string,
    params?: { severity?: string; category?: string; status?: string }
  ): Promise<GeoIssueListResponse> {
    const searchParams = new URLSearchParams({ project_id: projectId });
    if (params?.severity) searchParams.append("severity", params.severity);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.status) searchParams.append("status", params.status);
    return this.request<GeoIssueListResponse>(`/geo/issues?${searchParams.toString()}`);
  }

  getGeoIssuesCsvExportUrl(projectId: string): string {
    return `${this.baseUrl}/geo/issues/${projectId}/export-csv`;
  }

  async getGeoActions(
    projectId: string,
    params?: { status?: string; priority_level?: string }
  ): Promise<GeoRecommendationListResponse> {
    const searchParams = new URLSearchParams({ project_id: projectId });
    if (params?.status) searchParams.append("status", params.status);
    if (params?.priority_level) searchParams.append("priority_level", params.priority_level);
    return this.request<GeoRecommendationListResponse>(`/geo/actions?${searchParams.toString()}`);
  }

  async getGeoAction(id: string): Promise<GeoRecommendation> {
    return this.request<GeoRecommendation>(`/geo/actions/${id}`);
  }

  async updateGeoAction(
    id: string,
    input: { status?: string; notes?: string }
  ): Promise<GeoRecommendation> {
    return this.request<GeoRecommendation>(`/geo/actions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async verifyGeoAction(id: string): Promise<GeoRecommendation> {
    return this.request<GeoRecommendation>(`/geo/actions/${id}/verify`, {
      method: "POST",
    });
  }

  async ignoreGeoAction(id: string): Promise<GeoRecommendation> {
    return this.request<GeoRecommendation>(`/geo/actions/${id}/ignore`, {
      method: "POST",
    });
  }

  async bulkUpdateGeoActions(
    projectId: string,
    recommendationIds: string[],
    action: "complete" | "ignore" | "verify" | "start"
  ): Promise<{ updated: number }> {
    return this.request<{ updated: number }>(`/geo/actions/bulk?project_id=${projectId}`, {
      method: "POST",
      body: JSON.stringify({ recommendation_ids: recommendationIds, action }),
    });
  }

  async getGeoActionsSummary(projectId: string): Promise<GeoActionSummary> {
    return this.request<GeoActionSummary>(`/geo/actions/summary/${projectId}`);
  }

  async optimizeGeoContent(input: {
    project_id: string;
    topic: string;
    content_type?: string;
    existing_content?: string;
  }): Promise<GeoOptimizeResult> {
    return this.request<GeoOptimizeResult>("/geo/optimize/content", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async optimizeGeoDirectAnswer(input: {
    project_id: string;
    question: string;
    context?: string;
    target_word_count?: number;
  }): Promise<GeoOptimizeResult> {
    return this.request<GeoOptimizeResult>("/geo/optimize/answer", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async optimizeGeoEntity(input: {
    project_id: string;
    entity_name: string;
    entity_type?: string;
  }): Promise<GeoOptimizeResult> {
    return this.request<GeoOptimizeResult>("/geo/optimize/entity", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async optimizeGeoComparison(input: {
    project_id: string;
    competitor_name: string;
    category?: string;
  }): Promise<GeoOptimizeResult> {
    return this.request<GeoOptimizeResult>("/geo/optimize/comparison", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async optimizeGeoCommercial(input: {
    project_id: string;
    pricing_page_url?: string;
    product_tier?: string;
  }): Promise<GeoOptimizeResult> {
    return this.request<GeoOptimizeResult>("/geo/optimize/commercial", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getGeoMonitoringSchedule(projectId: string): Promise<GeoMonitoringSchedule> {
    return this.request<GeoMonitoringSchedule>(`/geo/monitoring/${projectId}`);
  }

  async updateGeoMonitoringSchedule(
    projectId: string,
    input: Partial<GeoMonitoringSchedule>
  ): Promise<GeoMonitoringSchedule> {
    return this.request<GeoMonitoringSchedule>(`/geo/monitoring/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async getGeoAlerts(projectId: string): Promise<GeoAlert[]> {
    return this.request<GeoAlert[]>(`/geo/alerts?project_id=${projectId}`);
  }

  async getGeoReport(projectId: string): Promise<GeoReport> {
    return this.request<GeoReport>(`/geo/reports/${projectId}`);
  }

  async generateGeoReport(input: {
    project_id: string;
    format?: string;
  }): Promise<GeoReport> {
    return this.request<GeoReport>("/geo/reports", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async getUnifiedSearchIntelligence(projectId: string): Promise<UnifiedSearchIntelligence> {
    return this.request<UnifiedSearchIntelligence>(`/geo/unified-intelligence/${projectId}`);
  }
}


export const api = new ApiClient();

