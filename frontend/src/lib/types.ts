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
  frequency?: number;
}

export interface SEOKeywordsResponse {
  keywords: SEOKeyword[];
  total: number;
}

export interface SEOLinkItem {
  id: string;
  source_url: string;
  target_url: string;
  anchor_text?: string | null;
  link_type: string;
  is_internal: boolean;
  is_follow: boolean;
  status_code?: number;
}

export interface SEOLinksResponse {
  links: SEOLinkItem[];
  total: number;
  internal_count: number;
  external_count: number;
  broken_count: number;
}

export interface TechnicalDiagnosticCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  badge: string;
  details: string;
  recommendation?: string | null;
}

export interface SEOTechnicalDiagnostics {
  technical_score: number;
  indexability_score: number;
  discovered_pages: number;
  skipped_pages: number;
  infrastructure_checks: TechnicalDiagnosticCheck[];
  indexability_checks: TechnicalDiagnosticCheck[];
}

// --- AEO Optimization Types ---

export interface AeoCompetitor {
  name: string;
  domain: string;
  mentions?: number;
  mention_rate?: number;
  visibility_score?: number;
}

export interface AeoProject {
  id: string;
  user_id?: string | null;
  name: string;
  domain: string;
  brand_name?: string | null;
  brand_aliases?: string[];
  industry?: string | null;
  country?: string | null;
  target_audience?: string | null;
  target_language?: string;
  competitors?: AeoCompetitor[];
  description?: string | null;
  is_active: boolean;
  aeo_score?: number | null;
  score_label?: string | null;
  mention_score?: number | null;
  citation_score?: number | null;
  position_score?: number | null;
  coverage_score?: number | null;
  last_analyzed_at?: string | null;
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
  brand_name?: string;
  brand_aliases?: string[];
  industry?: string;
  country?: string;
  target_audience?: string;
  target_language?: string;
  competitors?: Array<{ name: string; domain: string }>;
  description?: string;
  settings?: Record<string, unknown>;
}

export interface AeoProjectUpdateInput {
  name?: string;
  domain?: string;
  brand_name?: string;
  brand_aliases?: string[];
  industry?: string;
  country?: string;
  target_audience?: string;
  target_language?: string;
  competitors?: Array<{ name: string; domain: string }>;
  description?: string;
  is_active?: boolean;
}

export interface AeoQuestion {
  id: string;
  project_id: string;
  question_text: string;
  category: string;
  intent: string;
  is_tracked: boolean;
  visibility_status: "visible" | "partial" | "not_visible" | "untested";
  visibility_score?: number | null;
  brand_mentioned?: boolean;
  best_rank_position?: number | null;
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
  is_tracked?: boolean;
}

export interface AeoAnswer {
  id: string;
  project_id: string;
  question_id: string;
  analysis_id?: string | null;
  engine: string;
  model?: string | null;
  answer_text: string;
  brand_mentioned: boolean;
  brand_position?: number | null;
  mention_snippets: string[];
  competitor_mentions: Array<{ name: string; domain: string; mentioned: boolean; mention_count: number }>;
  citations_count: number;
  latency_ms?: number | null;
  token_usage?: Record<string, unknown>;
  status: string;
  error_message?: string | null;
  created_at: string;
  question_text?: string | null;
}

export interface AeoAnswerListResponse {
  answers: AeoAnswer[];
  total: number;
}

export interface AeoCitation {
  id: string;
  project_id: string;
  question_id?: string | null;
  engine: string;
  source_url: string;
  domain: string;
  citation_type?: "own_domain" | "competitor" | "third_party" | "news" | "review" | "documentation" | "government" | "other" | string;
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
  citation_type?: string;
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
  associated_concepts: string[];
  created_at: string;
}

export type AeoEntityResponse = AeoEntity;

export interface AeoEntityCreateInput {
  project_id: string;
  entity_name: string;
  entity_type: string;
  mentions_count?: number;
  visibility_rate?: number;
  associated_concepts?: string[];
}

export interface AeoEntityListResponse {
  entities: AeoEntity[];
  total: number;
}

export interface AeoEngineStatus {
  engine_id: string;
  name: string;
  is_connected: boolean;
  is_available?: boolean;
  tracked_questions: number;
  visibility_rate: number;
  status_label: string;
}

export interface AeoLogEntry {
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  step: string;
  message: string;
}

export interface AeoAnalysis {
  id: string;
  project_id: string;
  status: "queued" | "running" | "completed" | "completed_with_warnings" | "failed" | "cancelled";
  progress: number;
  current_step: string;
  logs: AeoLogEntry[];
  engines_analyzed: string[];
  questions_analyzed_count: number;
  answers_collected_count: number;
  mentions_found_count: number;
  citations_found_count: number;
  overall_score?: number | null;
  summary_data?: Record<string, unknown>;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
}

export interface AeoVisibilityTrendPoint {
  date: string;
  score: number;
  mention_score?: number;
  citation_score?: number;
  coverage_score?: number;
}

export interface AeoVisibilityData {
  project_id: string;
  project_name: string;
  domain: string;
  overall_score?: number | null;
  score_label: string;
  mention_score: number;
  citation_score: number;
  position_score: number;
  coverage_score: number;
  score_change: number;
  last_analyzed_at?: string | null;
  trend: AeoVisibilityTrendPoint[];
  snapshots_count: number;
}

export interface AeoRecommendation {
  id: string;
  project_id: string;
  recommendation_code?: string | null;
  title: string;
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  priority_level?: "critical" | "high" | "medium" | "low";
  priority_score: number;
  severity: "critical" | "high" | "medium" | "low";
  opportunity_score: number;
  reason: string;
  why_it_matters?: string | null;
  current_state: string;
  recommended_action: string;
  how_to_fix?: string | null;
  expected_impact: string;
  estimated_impact: number;
  current_score?: number | null;
  potential_score?: number | null;
  affected_prompt_count: number;
  affected_answer_count: number;
  affected_urls?: string[];
  implementation_steps?: string[];
  verification_status?: "unverified" | "verified" | "failed";
  status: "open" | "in_progress" | "fixed" | "ignored" | "implemented" | "dismissed";
  notes?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export type AeoAction = AeoRecommendation;

export interface AeoRecommendationListResponse {
  recommendations: AeoRecommendation[];
  total: number;
}

export interface AeoActionSummary {
  project_id: string;
  project_name?: string | null;
  domain?: string | null;
  total_actions: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  open_count: number;
  in_progress_count: number;
  fixed_count: number;
  ignored_count: number;
  current_score: number;
  estimated_impact: number;
  potential_score: number;
  category_breakdown: Record<string, { total: number; fixed: number; open: number }>;
}

export interface AeoContentBrief {
  target_question: string;
  recommended_title: string;
  content_type: string;
  target_category: string;
  suggested_word_count: string;
  recommended_headings: string[];
  essential_entities: string[];
  structured_faqs: Array<{ question: string; answer_guideline: string }>;
  citation_opportunities: string[];
  internal_link_targets: string[];
}

export interface AeoContentGapItem {
  topic: string;
  prompt: string;
  category: string;
  intent: string;
  competitor_coverage: boolean;
  competitors_mentioned: string[];
  brand_coverage: boolean;
  priority: "critical" | "high" | "medium" | "low";
  recommended_content_type: string;
  estimated_impact: number;
  brief: AeoContentBrief;
}

export interface AeoContentGapResponse {
  total_gaps_count: number;
  missing_topics_count: number;
  competitor_covered_gaps_count: number;
  high_priority_gaps_count: number;
  gaps: AeoContentGapItem[];
}

export interface AeoPromptOpportunity {
  question_id: string;
  prompt: string;
  category: string;
  intent: string;
  brand_mentioned: boolean;
  competitor_mentions: string[];
  has_citations: boolean;
  priority: "critical" | "high" | "medium" | "low";
  recommended_action: string;
}

export interface AeoPromptGapResponse {
  total_tracked: number;
  covered_prompts_count: number;
  uncovered_prompts_count: number;
  coverage_rate: number;
  intent_breakdown: Record<string, { total: number; covered: number; uncovered: number }>;
  category_breakdown: Record<string, { total: number; covered: number; uncovered: number }>;
  opportunities: AeoPromptOpportunity[];
}

export interface AeoCitationOpportunity {
  question_id: string;
  prompt: string;
  category: string;
  intent: string;
  total_citations: number;
  own_citations_count: number;
  competitor_sources: string[];
  cited_domains: string[];
  priority: "critical" | "high" | "medium" | "low";
  recommendation: string;
}

export interface AeoCitationGapResponse {
  total_citations: number;
  own_citations_count: number;
  competitor_citations_count: number;
  third_party_citations_count: number;
  own_citation_share: number;
  top_cited_domains: Array<{ domain: string; count: number; is_own: boolean; is_competitor: boolean; citation_type: string }>;
  opportunities: AeoCitationOpportunity[];
}

export interface AeoEntityGapItem {
  entity: string;
  type: string;
  frequency?: number;
  gap: string;
  priority: "critical" | "high" | "medium" | "low";
  recommendation: string;
}

export interface AeoEntityGapResponse {
  total_entities_count: number;
  brand_entities_count: number;
  product_entities_count: number;
  service_entities_count: number;
  industry_entities_count: number;
  weak_entities_count: number;
  entities_list: Array<{ id: string; name: string; type: string; mentions: number; visibility_rate: number; concepts: string[] }>;
  gaps: AeoEntityGapItem[];
}

export interface AeoOptimizationHistoryComparison {
  audit_id: string;
  analysis_id?: string | null;
  created_at: string;
  overall_score: number;
  score_label: string;
  score_delta: number;
  mention_score: number;
  mention_delta: number;
  citation_score: number;
  citation_delta: number;
  coverage_score: number;
  coverage_delta: number;
  total_questions: number;
  questions_mentioned: number;
  own_citations: number;
  competitor_citations: number;
  resolved_actions_count: number;
  open_actions_count: number;
}

export interface AeoOptimizationHistoryResponse {
  project_id: string;
  project_name: string;
  domain: string;
  current_score?: number | null;
  total_audits: number;
  comparisons: AeoOptimizationHistoryComparison[];
}

export interface AeoContentOptimizationResult {
  target_question: string;
  brand_name: string;
  word_count: number;
  content_quality_score: number;
  has_direct_answer: boolean;
  missing_facts: string[];
  recommended_headings: string[];
  direct_answer_suggestion: string;
  citation_opportunities: string[];
  ai_readability_recommendations: string[];
}

export interface AeoDirectAnswerOptimizationResult {
  target_question: string;
  readiness_score: number;
  readiness_label: string;
  passed_criteria_count: number;
  total_criteria_count: number;
  checklist: Array<{ dimension: string; status: "pass" | "missing"; guidance: string }>;
  recommended_next_action: string;
}

export interface AeoDashboardSummary {
  aeo_score?: number | null;
  score_label?: string | null;
  answer_visibility_rate: number;
  questions_tracked: number;
  total_citations: number;
  total_projects: number;
  active_project_id?: string | null;
  active_project_name?: string | null;
  score_trend: Array<{ date: string; score: number }>;
  engines: AeoEngineStatus[];
  recent_questions: AeoQuestion[];
  recent_citations: AeoCitation[];
  total_opportunities?: number;
  critical_opportunities?: number;
  high_opportunities?: number;
  open_opportunities?: number;
  in_progress_opportunities?: number;
  fixed_opportunities?: number;
  estimated_potential_gain?: number;
  potential_score?: number;
  top_opportunities?: Array<{
    id: string;
    title: string;
    category: string;
    priority_level: string;
    priority_score: number;
    estimated_impact: number;
    reason: string;
    status: string;
  }>;
  completion_rate?: number;
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

// --- Phase 7 AEO Intelligence & Monitoring Types ---

export interface AeoMonitoringSchedule {
  id: string;
  project_id: string;
  frequency: "daily" | "weekly" | "monthly";
  enabled: boolean;
  selected_engines: string[];
  alert_thresholds: Record<string, number>;
  last_run_at?: string | null;
  next_run_at?: string | null;
  last_status?: string | null;
  last_error?: string | null;
}

export interface AeoTrendPoint {
  id: string;
  date: string;
  timestamp: string;
  overall_score: number;
  score?: number;
  mention_score: number;
  citation_score: number;
  position_score: number;
  coverage_score: number;
  mention_rate: number;
  citation_rate: number;
  average_position?: number | null;
  total_questions: number;
  questions_mentioned: number;
}

export interface AeoTrendResponse {
  project_id: string;
  time_range: string;
  has_enough_data: boolean;
  message: string;
  points_count: number;
  score_change: number;
  trend_direction: "improving" | "declining" | "stable";
  first_score?: number | null;
  current_score?: number | null;
  timeline: AeoTrendPoint[];
}

export interface AeoEngineComparisonItem {
  provider: string;
  display_name: string;
  is_configured: boolean;
  has_data: boolean;
  score?: number | null;
  mention_rate?: number | null;
  citation_rate?: number | null;
  coverage_rate?: number | null;
  average_position?: number | null;
  questions_tested?: number | null;
  questions_mentioned?: number | null;
  citations_count?: number | null;
  status_label: string;
}

export interface AeoEngineComparisonResponse {
  project_id: string;
  has_data: boolean;
  provider_parity: string;
  parity_ratio: number;
  engines: AeoEngineComparisonItem[];
}

export interface AeoCompetitorItem {
  name: string;
  mention_count: number;
  citation_count: number;
  share_of_voice: number;
  average_position?: number | null;
  trend: "gaining" | "losing" | "stable";
  delta: number;
}

export interface AeoCompetitorComparisonChartItem {
  name: string;
  is_brand: boolean;
  share_of_voice: number;
  mentions: number;
  citations: number;
}

export interface AeoCompetitorIntelligenceResponse {
  project_id: string;
  has_data: boolean;
  brand_name: string;
  brand_share_of_voice: number;
  total_market_mentions: number;
  competitors_count: number;
  highest_share_of_voice?: string | null;
  biggest_gainer?: { name: string; delta: string } | null;
  biggest_loser?: { name: string; delta: string } | null;
  competitors_tracked: AeoCompetitorItem[];
  comparison_chart_data: AeoCompetitorComparisonChartItem[];
}

export interface AeoChangeEvent {
  id: string;
  project_id: string;
  analysis_id?: string | null;
  event_type: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  provider?: string | null;
  description: string;
  previous_value?: string | null;
  current_value?: string | null;
  delta?: number | null;
  percentage_delta?: number | null;
  related_prompt_id?: string | null;
  related_competitor?: string | null;
  created_at: string;
}

export interface AeoAlert {
  id: string;
  project_id: string;
  change_event_id?: string | null;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  status: "new" | "acknowledged" | "resolved";
  provider?: string | null;
  created_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
}

export interface AeoExecutiveIntelligence {
  project_id: string;
  brand_name: string;
  domain: string;
  aeo_score?: number | null;
  monitoring_health_score: number;
  monitoring_health_status: "Healthy" | "Attention Needed" | "Critical Risk";
  data_freshness: "Fresh" | "Recent" | "Stale" | "No Data";
  last_analyzed_at?: string | null;
  executive_summary: string;
  top_risks: Array<{
    id: string;
    title: string;
    severity: string;
    description: string;
    created_at: string;
  }>;
  top_opportunities: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    estimated_impact: number;
    why_it_matters: string;
  }>;
  recent_changes: Array<{
    id: string;
    event_type: string;
    severity: string;
    description: string;
    previous_value?: string | null;
    current_value?: string | null;
    delta?: number | null;
    provider?: string | null;
    created_at: string;
  }>;
  competitive_position: {
    brand_share_of_voice: number;
    highest_competitor?: string | null;
    competitors_tracked: number;
  };
}

export interface AeoPromptMovementItem {
  question_id: string;
  prompt: string;
  category: string;
  intent: string;
  provider: string;
  previous_status: string;
  current_status: string;
  movement: "gained" | "lost" | "unchanged";
  position?: number | null;
  citation_found: boolean;
  visibility_score: number;
}

export interface AeoCitationMovementItem {
  domain: string;
  citation_type: string;
  count: number;
  engines: string[];
  sample_urls: string[];
  trend: string;
}

export interface AeoEntityMovementItem {
  id: string;
  name: string;
  entity_type: string;
  confidence_score: number;
  frequency: number;
  associated_concepts: string[];
  trend: string;
}

// ==========================================
// PHASE 8: GEO (Generative Engine Optimization) TYPES
// ==========================================

export interface GeoProject {
  id: string;
  user_id?: string | null;
  name: string;
  domain: string;
  brand_name?: string | null;
  brand_aliases: string[];
  description?: string | null;
  industry?: string | null;
  sub_industry?: string | null;
  target_audience?: string | null;
  target_locations: string[];
  target_languages: string[];
  products: string[];
  services: string[];
  primary_topics: string[];
  competitors: Array<{ name: string; domain?: string; aliases?: string[] }>;
  social_profiles: Record<string, string>;
  logo_url?: string | null;
  status: "active" | "paused" | "archived";

  geo_score?: number | null;
  visibility_score?: number | null;
  mention_score?: number | null;
  recommendation_score?: number | null;
  entity_score?: number | null;
  citation_score?: number | null;
  content_score?: number | null;
  authority_score?: number | null;
  technical_score?: number | null;
  consistency_score?: number | null;

  score_label?: string | null;
  confidence?: string | null;
  data_coverage?: number | null;

  last_analyzed_at?: string | null;
  questions_count?: number;
  answers_count?: number;
  citations_count?: number;
  entities_count?: number;
  issues_count?: number;
  recommendations_count?: number;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface GeoProjectListResponse {
  projects: GeoProject[];
  total: number;
}

export interface GeoProjectCreateInput {
  name: string;
  domain: string;
  brand_name?: string;
  brand_aliases?: string[];
  description?: string;
  industry?: string;
  sub_industry?: string;
  target_audience?: string;
  target_locations?: string[];
  target_languages?: string[];
  products?: string[];
  services?: string[];
  primary_topics?: string[];
  competitors?: Array<{ name: string; domain?: string; aliases?: string[] }>;
  social_profiles?: Record<string, string>;
  logo_url?: string;
}

export interface GeoProjectUpdateInput {
  name?: string;
  domain?: string;
  brand_name?: string;
  brand_aliases?: string[];
  description?: string;
  industry?: string;
  sub_industry?: string;
  target_audience?: string;
  target_locations?: string[];
  target_languages?: string[];
  products?: string[];
  services?: string[];
  primary_topics?: string[];
  competitors?: Array<{ name: string; domain?: string; aliases?: string[] }>;
  social_profiles?: Record<string, string>;
  logo_url?: string;
  status?: "active" | "paused" | "archived";
}

export interface GeoBrandProfile {
  id: string;
  project_id: string;
  brand_name: string;
  legal_name?: string | null;
  aliases: string[];
  short_description?: string | null;
  long_description?: string | null;
  industry?: string | null;
  category?: string | null;
  products: string[];
  services: string[];
  use_cases: string[];
  target_users: string[];
  locations: string[];
  pricing_model?: string | null;
  key_features: string[];
  differentiators: string[];
  competitors: string[];
  social_links: Record<string, string>;
  official_urls: string[];
  support_url?: string | null;
  documentation_url?: string | null;
  contact_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeoBrandProfileUpdateInput {
  brand_name?: string;
  legal_name?: string;
  aliases?: string[];
  short_description?: string;
  long_description?: string;
  industry?: string;
  category?: string;
  products?: string[];
  services?: string[];
  use_cases?: string[];
  target_users?: string[];
  locations?: string[];
  pricing_model?: string;
  key_features?: string[];
  differentiators?: string[];
  competitors?: string[];
  social_links?: Record<string, string>;
  official_urls?: string[];
  support_url?: string;
  documentation_url?: string;
  contact_url?: string;
}

export interface GeoQuestion {
  id: string;
  project_id: string;
  question: string;
  category: string;
  intent: string;
  priority: string;
  search_type: string;
  target_entity?: string | null;
  target_product?: string | null;
  target_service?: string | null;
  is_active: boolean;
  brand_mentioned: boolean;
  recommended: boolean;
  best_position?: number | null;
  created_at: string;
  updated_at: string;
}

export interface GeoQuestionListResponse {
  questions: GeoQuestion[];
  total: number;
}

export interface GeoAnswer {
  id: string;
  project_id: string;
  question_id: string;
  provider: string;
  model?: string | null;
  answer_text: string;
  latency_ms?: number | null;
  token_usage: Record<string, number>;
  request_id?: string | null;

  brand_mentioned: boolean;
  brand_mention_type: string;
  brand_position?: number | null;
  recommendation_position?: number | null;
  recommended: boolean;
  recommendation_strength: string;
  sentiment: string;
  confidence: number;

  competitor_mentions: Array<{ name: string; position?: number; recommended?: boolean }>;
  competitor_positions: Record<string, number>;

  citation_count: number;
  own_domain_citations: number;
  competitor_citations: number;
  third_party_citations: number;
  raw_citations: Array<{ url: string; domain?: string; title?: string }>;
  created_at: string;
}

export interface GeoAnswerListResponse {
  answers: GeoAnswer[];
  total: number;
}

export interface GeoCitation {
  id: string;
  project_id: string;
  answer_id?: string | null;
  url: string;
  domain: string;
  source_type: string;
  title?: string | null;
  brand_related: boolean;
  competitor_related: boolean;
  authority_score?: number | null;
  authority_status: string;
  citation_position: number;
  created_at: string;
}

export interface GeoCitationListResponse {
  citations: GeoCitation[];
  total: number;
  own_citation_rate: number;
  competitor_citation_rate: number;
  third_party_citation_rate: number;
  citation_diversity: number;
}

export interface GeoEntity {
  id: string;
  project_id: string;
  name: string;
  entity_type: string;
  description?: string | null;
  aliases: string[];
  parent_entity?: string | null;
  related_entities: string[];
  related_topics: string[];
  products: string[];
  services: string[];
  competitors: string[];
  source: string;
  confidence: number;
  consistency_status: string;
  created_at: string;
  updated_at: string;
}

export interface GeoEntityListResponse {
  entities: GeoEntity[];
  total: number;
  consistency_score: number;
}

export interface GeoCompetitorItem {
  name: string;
  domain?: string | null;
  mention_rate: number;
  recommendation_rate: number;
  average_position?: number | null;
  citation_rate: number;
  share_of_voice: number;
  geo_gap: number;
  trend: "gaining" | "losing" | "stable";
}

export interface GeoCompetitorResponse {
  project_id: string;
  brand_name: string;
  brand_share_of_voice: number;
  brand_mention_rate: number;
  brand_recommendation_rate: number;
  competitors: GeoCompetitorItem[];
}

export interface GeoIssue {
  id: string;
  project_id: string;
  issue_code: string;
  category: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  priority_score: number;
  affected_urls: string[];
  affected_questions: string[];
  evidence: Record<string, unknown>;
  status: "open" | "in_progress" | "resolved" | "ignored";
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
}

export interface GeoIssueListResponse {
  issues: GeoIssue[];
  total: number;
}

export interface GeoRecommendation {
  id: string;
  project_id: string;
  recommendation_code: string;
  title: string;
  description: string;
  category: string;
  priority_score: number;
  priority_level: "critical" | "high" | "medium" | "low";
  why_it_matters: string;
  how_to_fix: string;
  implementation_steps: string[];
  affected_prompt_count: number;
  affected_answer_count: number;
  affected_urls: string[];
  estimated_impact: number;
  potential_score: number;
  verification_status: "unverified" | "pending" | "verified" | "failed" | "partial";
  status: "open" | "in_progress" | "completed" | "ignored";
  notes?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeoRecommendationListResponse {
  recommendations: GeoRecommendation[];
  total: number;
}

export interface GeoActionSummary {
  project_id: string;
  total_actions: number;
  open_actions: number;
  in_progress_actions: number;
  completed_actions: number;
  verified_actions: number;
  ignored_actions: number;
  average_priority_score: number;
  potential_total_gain: number;
}

export interface GeoDashboardData {
  project: GeoProject;
  brand_profile?: GeoBrandProfile | null;
  geo_score?: number | null;
  score_label?: string | null;
  confidence: string;
  data_coverage: number;

  visibility_score?: number | null;
  recommendation_score?: number | null;
  citation_score?: number | null;
  entity_score?: number | null;
  content_score?: number | null;
  technical_score?: number | null;
  authority_score?: number | null;
  consistency_score?: number | null;

  mention_rate: number;
  recommendation_rate: number;
  own_citation_rate: number;
  share_of_voice: number;

  provider_breakdown: Array<{
    key: string;
    name: string;
    status: string;
    is_configured: boolean;
    supports_search: boolean;
    supports_citations: boolean;
  }>;
  competitor_share_of_voice: GeoCompetitorItem[];
  citation_sources: Array<{ domain: string; count: number }>;
  top_issues: GeoIssue[];
  top_recommendations: GeoRecommendation[];
  recent_history: Array<Record<string, unknown>>;
}

export interface GeoVisibilityData {
  project_id: string;
  current_geo_score?: number | null;
  mention_rate: number;
  recommendation_rate: number;
  citation_rate: number;
  share_of_voice: number;
  providers: Array<{
    provider: string;
    status: string;
    has_data: boolean;
    total_queries: number;
    mention_rate: number;
    recommendation_rate: number;
  }>;
  snapshots_count: number;
}

export interface GeoHistoryData {
  project_id: string;
  snapshots: Array<{
    id: string;
    provider: string;
    geo_score?: number | null;
    mention_rate: number;
    recommendation_rate: number;
    citation_rate: number;
    share_of_voice: number;
    created_at?: string | null;
  }>;
  change_events: Array<{
    id: string;
    event_type: string;
    severity: string;
    before_value?: string | null;
    after_value?: string | null;
    delta?: number | null;
    description: string;
    detected_at?: string | null;
  }>;
  optimization_history: Array<{
    id: string;
    action: string;
    before_score?: number | null;
    after_score?: number | null;
    delta?: number | null;
    verified: boolean;
    timestamp?: string | null;
  }>;
}

export interface GeoMonitoringSchedule {
  id: string;
  project_id: string;
  frequency: "daily" | "weekly" | "monthly" | "manual";
  enabled: boolean;
  providers: string[];
  question_limit: number;
  last_run?: string | null;
  next_run?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeoAlert {
  id: string;
  project_id: string;
  alert_type: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "new" | "acknowledged" | "resolved";
  provider?: string | null;
  detected_at: string;
}

export interface GeoOptimizeResult {
  tool: string;
  title: string;
  direct_answer?: string | null;
  suggested_headings: string[];
  missing_facts: string[];
  recommended_structure: string[];
  supporting_evidence: string[];
  internal_links: string[];
  external_authorities: string[];
  schema_markup?: Record<string, unknown> | null;
  commercial_readiness_score?: number | null;
  expected_impact: string;
}

export interface GeoReport {
  project_id: string;
  generated_at: string;
  executive_summary: string;
  geo_score?: number | null;
  score_label?: string | null;
  ai_visibility: number;
  recommendation_visibility: number;
  citation_health: number;
  entity_clarity: number;
  content_extractability: number;
  technical_accessibility: number;
  top_strengths: string[];
  top_weaknesses: string[];
  top_competitors: Array<Record<string, unknown>>;
  top_sources: Array<Record<string, unknown>>;
  top_recommendations: Array<Record<string, unknown>>;
}

export interface GeoAnalysisJob {
  id: string;
  project_id: string;
  status: "queued" | "running" | "completed" | "partial" | "failed";
  progress: number;
  current_step: string;
  providers: string[];
  results_summary: Record<string, unknown>;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
}

export interface UnifiedSearchIntelligence {
  project_id: string;
  brand_name: string;
  domain: string;
  seo_score?: number | null;
  aeo_score?: number | null;
  geo_score?: number | null;
  unified_score?: number | null;
  formula: string;
  has_sufficient_data: boolean;
  executive_brief: string;
}


