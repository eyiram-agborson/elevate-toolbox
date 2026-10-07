// Shapes returned by the Toolbox backend (Elevate endpoints).

export type CycleStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED';
export type TargetStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'SUBMITTED';
export type ReviewStatus =
  | 'DRAFT'
  | 'SELF_REVIEW_SUBMITTED'
  | 'MANAGER_REVIEWED'
  | 'HR_VALIDATED';

export interface Me {
  uid: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  unitId?: string | null;
  levels: string[];
  managedUnitIds: string[];
  permissions: string[];
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListResponse<T> {
  message: string;
  data: T[];
  pagination: Pagination;
}

export interface PersonRef {
  _id: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string | null;
}

export interface UnitRef {
  _id: string;
  name: string;
}

export interface Cycle {
  _id: string;
  name: string;
  period: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  startDate: string;
  endDate: string;
  targetStartDate?: string;
  targetEndDate?: string;
  reviewStartDate?: string;
  reviewEndDate?: string;
  status: CycleStatus;
}

export interface Kpi {
  title: string;
  weight: number;
  targets: string[];
  staffComments?: string;
  staffScore?: number;
  managerComments?: string;
  rating?: number;
  performance?: number;
  score?: number;
}

export interface TemplateCriterion {
  title: string;
  description?: string;
  weight: number;
}

export interface Template {
  _id: string;
  name: string;
  description?: string;
  unit: UnitRef | string;
  criteria: TemplateCriterion[];
  updatedAt?: string;
}

export interface Target {
  _id: string;
  staff: PersonRef;
  setBy: string | null;
  unit: UnitRef | string;
  performanceCycle: Cycle | string;
  kpiTemplate: Template | string;
  kpis: Kpi[];
  status: TargetStatus;
  updatedAt?: string;
}

export interface SetTargetsResponse {
  message: string;
  data: Target[];
  skipped: string[];
}

export interface Review {
  _id: string;
  staff: PersonRef;
  manager: PersonRef | null;
  unit: UnitRef | string;
  performanceCycle: Cycle | string;
  target: string;
  kpis: Kpi[];
  selfReviewComments?: string;
  managerReviewComments?: string;
  overallScore?: number;
  status: ReviewStatus;
  hrValidation?: {
    validatedBy?: string;
    validatedAt?: string;
    originalScore?: number;
    finalScore?: number;
    comments?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ManagedUnit {
  _id: string;
  name: string;
  isSubUnit: boolean;
  parentUnit: string | null;
  unitHead: string | null;
  memberCount: number;
}

export interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  jobTitle: string | null;
  unit: string | null;
}

export interface DepartmentRow {
  unit: { _id: string; name: string; isSubUnit: boolean; parentUnit: string | null };
  unitHead: PersonRef | null;
  staffCount: number;
  selfReviewCount: number;
  managerReviewCount: number;
  reviewCount: number;
  averageScore: number | null;
}

export interface ManagerRow {
  manager: PersonRef & { unit?: UnitRef | null };
  unit?: UnitRef | null;
  teamSize: number;
  completedReviews: number;
  completionRate: number;
  teamAverageScore: number | null;
}

export interface ManagerDetails {
  manager: PersonRef;
  teamSize: number;
  completedReviews: number;
  completionRate: number;
  teamAverageScore: number | null;
  members: {
    staff: PersonRef & { unit?: UnitRef | null };
    reviewId: string | null;
    status: ReviewStatus;
    overallScore: number | null;
  }[];
}

export interface EmployeeRow {
  staff: PersonRef & { unit?: UnitRef | null };
  manager: PersonRef | null;
  reviewId: string | null;
  status: ReviewStatus;
  overallScore: number | null;
  managerScore: number | null;
  validationScore: number | null;
}
