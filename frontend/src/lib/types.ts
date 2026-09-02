export type ScanStatus =
  | "queued"
  | "initializing"
  | "crawling"
  | "analyzing"
  | "scoring"
  | "completed"
  | "failed"
  | "cancelled";

export type ScanType = "full_audit" | "technical_seo" | "quick_scan";
export type SEOSeverity = "critical" | "high" | "medium" | "low" | "info";
export type SEOCategory = "technical" | "indexability" | "metadata" | "links";

export interface ScanLogEntry {
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  step: string;
  message: string;
}

export interface ScanSummary {
  id: string;
  status: ScanStatus;
  progress: number;
  current_step: string;
  overall_score?: number | null;
  created_at: string;
}

// --- SEO Project & Scan Types ---

export interface Project {
  id: string;
  user_id?: string | null;
  name: string;
  domain: string;
  description?: string | null;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  latest_scan?: ScanSummary | null;
  total_scans: number;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}

export interface ProjectCreateInput {
  name: string;
  domain: string;
  description?: string;
  settings?: Record<string, unknown>;
}

export interface ProjectUpdateInput {
  name?: string;
  domain?: string;
  description?: string;
  is_active?: boolean;
  settings?: Record<string, unknown>;
}

export interface Scan {
  id: string;
  project_id: string;
  target_url: string;
  scan_type: ScanType | string;
  status: ScanStatus;
  progress: number;
  current_step: string;
  logs: ScanLogEntry[];
  meta_data: Record<string, unknown>;
  error_message?: string | null;
  pages_discovered: number;
  pages_crawled: number;
  pages_failed: number;
  pages_skipped: number;
  issues_count: number;
  overall_score?: number | null;
  technical_score?: number | null;
  indexability_score?: number | null;
  metadata_score?: number | null;
  links_score?: number | null;
  score_breakdown?: Record<string, unknown>;
  crawl_duration?: number | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScanListResponse {
  scans: Scan[];
  total: number;
}

export interface ScanCreateInput {
  scan_type?: ScanType;
  target_url?: string;
}

export interface ScanCancelResponse {
  id: string;
  status: ScanStatus;
  message: string;
}

export interface SEOPageImage {
  id: string;
  src: string;
  alt: string | null;
  width?: number | null;
  height?: number | null;
  is_internal: boolean;
}

export interface SEOPageLink {
  id: string;
  target_url: string;
  anchor_text?: string | null;
  link_type: string;
  status_code?: number | null;
  is_internal: boolean;
  is_follow: boolean;
}

export interface SEOIssue {
  id: string;
  scan_id: string;
  page_id?: string | null;
  page_url?: string | null;
  issue_code: string;
  category: SEOCategory | string;
  severity: SEOSeverity;
  title: string;
  description: string;
  recommendation: string;
  details: Record<string, unknown>;
  status: string;
  created_at: string;
}

export interface SEOPage {
  id: string;
  scan_id: string;
  url: string;
  final_url: string;
  status_code: number;
  content_type: string;
  title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  language?: string | null;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  word_count: number;
  response_time: number;
  content_length: number;
  is_indexable: boolean;
  is_internal: boolean;
  crawl_depth: number;
  render_method: string;
  issues_count: number;
  created_at: string;
}

export interface SEOPageDetail extends SEOPage {
  robots_directive?: string | null;
  x_robots_tag?: string | null;
  headings: {
    h1?: string[];
    h2?: string[];
    h3?: string[];
  };
  redirect_chain: Array<{ status_code: number; url: string }>;
  open_graph: Record<string, string>;
  twitter_card: Record<string, string>;
  structured_data: Array<Record<string, unknown>>;
  images: SEOPageImage[];
  links: SEOPageLink[];
  issues: SEOIssue[];
}

export interface SEOPageListResponse {
  pages: SEOPage[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SEOIssueListResponse {
  issues: SEOIssue[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  severity_counts: Record<SEOSeverity, number>;
}

export interface ScoreDeductionItem {
  issue_code: string;
  title: string;
  severity: SEOSeverity;
  affected_pages: number;
  penalty: number;
}

export interface ScoreBreakdown {
  formula: string;
  base_score: number;
  category_scores: Record<string, number>;
  deductions_by_category: Record<string, ScoreDeductionItem[]>;
}

export interface ScanResultsResponse {
  scan_id: string;
  project_id: string;
  target_url: string;
  status: ScanStatus;
  overall_score: number | null;
  score_label: string | null;
  technical_score: number | null;
  indexability_score: number | null;
  metadata_score: number | null;
  links_score: number | null;
  score_breakdown: ScoreBreakdown;
  pages_discovered: number;
  pages_crawled: number;
  pages_failed: number;
  pages_skipped: number;
  issues_count: number;
  severity_counts: Record<SEOSeverity, number>;
  crawl_duration?: number | null;
  started_at?: string | null;
  completed_at?: string | null;
  meta_data: Record<string, unknown>;
}

export interface SeoDashboardSummary {
  overall_score?: number | null;
  score_label?: string | null;
  total_projects: number;
  total_crawled_pages: number;
  total_issues: number;
  severity_counts: Record<string, number>;
  crawl_overview: {
    crawled: number;
    discovered: number;
    skipped: number;
    failed: number;
  };
  score_trend: Array<{ date: string; score: number; target_url?: string }>;
  top_issues: Array<{ title: string; severity: string; affected_pages: number }>;
  recent_scans: Scan[];
}

export interface SEOKeyword {
  id: string;
  keyword: string;
  intent: "informational" | "commercial" | "transactional" | "navigational";
  search_volume: number;
  difficulty: number;
  target_url?: string;
  position?: number;
  change?: number;
}

// --- AEO Optimization Types ---

export interface AeoProject {
  id: string;
  user_id?: string | null;
  name: string;
  domain: string;
  description?: string | null;
  is_active: boolean;
  aeo_score?: number | null;
  questions_count: number;
  citations_count: number;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AeoProjectListResponse {
  projects: AeoProject[];
  total: number;
}

export interface AeoProjectCreateInput {
  name: string;
  domain: string;
  description?: string;
  settings?: Record<string, unknown>;
}

export interface AeoQuestion {
  id: string;
  project_id: string;
  question_text: string;
  category: string;
  intent: string;
  is_tracked: boolean;
  visibility_status: "visible" | "partial" | "not_visible";
  visibility_score: number;
  trend_change: number;
  last_checked_at?: string | null;
  created_at: string;
}

export type AeoQuestionResponse = AeoQuestion;

export interface AeoQuestionListResponse {
  questions: AeoQuestion[];
  total: number;
}

export interface AeoQuestionCreateInput {
  project_id: string;
  question_text: string;
  category: string;
  intent: string;
}

export interface AeoCitation {
  id: string;
  project_id: string;
  question_id?: string | null;
  engine: string;
  source_url: string;
  domain: string;
  citation_status: string;
  citation_text?: string | null;
  created_at: string;
}

export interface AeoCitationCreateInput {
  project_id: string;
  question_id?: string;
  engine: string;
  source_url: string;
  domain?: string;
  citation_status?: string;
  citation_text?: string;
}

export interface AeoCitationListResponse {
  citations: AeoCitation[];
  total: number;
}

export interface AeoEntity {
  id: string;
  project_id: string;
  entity_name: string;
  entity_type: string;
  mentions_count: number;
  visibility_rate: number;
  created_at: string;
}

export type AeoEntityResponse = AeoEntity;

export interface AeoEntityCreateInput {
  project_id: string;
  entity_name: string;
  entity_type: string;
}

export interface AeoEntityListResponse {
  entities: AeoEntity[];
  total: number;
}

export interface AeoEngineStatus {
  engine_id: string;
  name: string;
  is_connected: boolean;
  tracked_questions: number;
  visibility_rate: number;
  citations_count: number;
  status_label: string;
}

export interface AeoDashboardSummary {
  aeo_score?: number | null;
  score_label?: string | null;
  answer_visibility_rate: number;
  questions_tracked: number;
  total_citations: number;
  total_projects: number;
  score_trend: Array<{ date: string; score: number }>;
  engines: AeoEngineStatus[];
  recent_questions: AeoQuestion[];
  recent_citations: AeoCitation[];
}

// --- Phase 4 SEO Action Center & Optimization Types ---

export type RecommendationPriority = "critical" | "high" | "medium" | "low";
export type RecommendationStatus = "open" | "in_progress" | "fixed" | "ignored";
export type RecommendationEffort = "low" | "medium" | "high";

export interface SeoRecommendation {
  id: string;
  project_id: string;
  scan_id: string;
  issue_id?: string | null;
  page_id?: string | null;
  issue_code: string;
  title: string;
  description: string;
  why_it_matters: string;
  how_to_fix: string;
  category: string;
  priority: RecommendationPriority;
  priority_score: number;
  estimated_impact: number;
  effort: RecommendationEffort;
  status: RecommendationStatus;
  notes?: string | null;
  affected_pages_count: number;
  affected_urls: string[];
  current_state?: string | null;
  recommended_state?: string | null;
  verification_status: "unverified" | "verified" | "failed";
  verification_details: Record<string, unknown>;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeoRecommendationListResponse {
  recommendations: SeoRecommendation[];
  total: number;
}

export interface SeoRecommendationUpdateInput {
  status?: RecommendationStatus;
  notes?: string;
}

export interface SeoRecommendationBulkUpdateInput {
  action_ids: string[];
  status: RecommendationStatus;
  notes?: string;
}

export interface VerifyFixResponse {
  recommendation_id: string;
  status: "verified" | "not_fixed" | "failed";
  message: string;
  is_fixed: boolean;
  details: Record<string, unknown>;
}

export interface CategoryProgress {
  category: string;
  total_actions: number;
  fixed_actions: number;
  progress_percentage: number;
}

export interface SeoOptimizationSummary {
  project_id: string;
  scan_id?: string | null;
  total_actions: number;
  critical_actions: number;
  high_priority_actions: number;
  medium_priority_actions: number;
  low_priority_actions: number;
  in_progress_actions: number;
  fixed_actions: number;
  ignored_actions: number;
  estimated_seo_impact: number;
  current_seo_score?: number | null;
  potential_seo_score?: number | null;
  optimization_progress: number;
  category_breakdown: CategoryProgress[];
  top_opportunities: SeoRecommendation[];
}

export interface OptimizationHistoryItem {
  id: string;
  project_id: string;
  scan_id: string;
  previous_scan_id?: string | null;
  previous_score?: number | null;
  current_score: number;
  score_change: number;
  issues_before: number;
  issues_after: number;
  issues_resolved: number;
  new_issues: number;
  remaining_issues: number;
  pages_improved: number;
  pages_declined: number;
  category_score_changes: Record<string, number>;
  details: Record<string, unknown>;
  created_at: string;
}

export interface OptimizationHistoryListResponse {
  comparisons: OptimizationHistoryItem[];
  total: number;
}

export interface TitleSuggestion {
  title: string;
  character_count: number;
  length_status: "optimal" | "too_short" | "too_long";
  keyword_presence: boolean;
  brand_presence: boolean;
}

export interface TitleOptimizationResponse {
  current_title?: string | null;
  suggestions: TitleSuggestion[];
  provider: string;
}

export interface DescriptionSuggestion {
  description: string;
  character_count: number;
  length_status: "optimal" | "too_short" | "too_long";
  keyword_presence: boolean;
  cta_presence: boolean;
  readability_score: string;
}

export interface DescriptionOptimizationResponse {
  current_description?: string | null;
  suggestions: DescriptionSuggestion[];
  provider: string;
}

export interface ContentRecommendationItem {
  title: string;
  description: string;
  category: string;
  priority: string;
  impact: string;
}

export interface ContentOptimizationResponse {
  url: string;
  word_count: number;
  word_count_status: "thin" | "acceptable" | "optimal";
  heading_structure: {
    h1_count: number;
    h1_samples: string[];
    h2_count: number;
    h2_samples: string[];
  };
  readability_indicator: string;
  duplicate_signals: string[];
  recommendations: ContentRecommendationItem[];
}

export interface InternalLinkOpportunity {
  source_url: string;
  target_url: string;
  recommended_anchor: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface InternalLinksOptimizationResponse {
  total_opportunities: number;
  orphan_pages: string[];
  low_inbound_pages: Array<{ url: string; inbound_links: number }>;
  opportunities: InternalLinkOpportunity[];
}

export interface HealthResponse {
  status: string;
  version: string;
  environment: string;
  database: string;
  redis: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  detail?: string | Array<{ msg: string; loc?: string[] }>;
  status?: number;
}
