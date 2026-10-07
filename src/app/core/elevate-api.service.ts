import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Cycle,
  DepartmentRow,
  EmployeeRow,
  Kpi,
  ListResponse,
  ManagedUnit,
  ManagerDetails,
  ManagerRow,
  Review,
  SetTargetsResponse,
  Target,
  TeamMember,
  Template,
  TemplateCriterion,
} from './models';

type Params = Record<string, string | number | undefined | null>;

// One place for every Elevate call. Lists default to 100 rows so screens show everyone.
@Injectable({ providedIn: 'root' })
export class ElevateApi {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  private params(p: Params = {}): HttpParams {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(p)) {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    }
    return params;
  }

  private list<T>(path: string, p: Params = {}): Observable<ListResponse<T>> {
    return this.http.get<ListResponse<T>>(`${this.base}${path}`, {
      params: this.params({ page: 1, pageSize: 100, ...p }),
    });
  }

  // ---- units and people -----------------------------------------------------
  units(): Observable<ManagedUnit[]> {
    return this.http.get<ManagedUnit[]>(`${this.base}/elevate/units`);
  }

  team(unitId?: string): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.base}/elevate/team`, {
      params: this.params({ unitId }),
    });
  }

  // ---- cycles -----------------------------------------------------------------
  cycles(p: Params = {}): Observable<Cycle[]> {
    return this.list<Cycle>('/performance-cycles', p).pipe(map((r) => r.data));
  }

  activeCycle(): Observable<Cycle | null> {
    return this.cycles({ status: 'ACTIVE' }).pipe(map((list) => list[0] ?? null));
  }

  createCycle(body: Partial<Cycle>): Observable<Cycle> {
    return this.http
      .post<{ data: Cycle }>(`${this.base}/performance-cycles`, body)
      .pipe(map((r) => r.data));
  }

  updateCycle(id: string, body: Partial<Cycle>): Observable<Cycle> {
    return this.http
      .patch<{ data: Cycle }>(`${this.base}/performance-cycles/${id}`, body)
      .pipe(map((r) => r.data));
  }

  activateCycle(id: string): Observable<Cycle> {
    return this.http
      .patch<{ data: Cycle }>(`${this.base}/performance-cycles/${id}/activate`, {})
      .pipe(map((r) => r.data));
  }

  // ---- KPI templates -------------------------------------------------------------
  templates(p: Params = {}): Observable<Template[]> {
    return this.list<Template>('/kpi-templates', p).pipe(map((r) => r.data));
  }

  templateForUnit(unitId: string): Observable<Template> {
    return this.http
      .get<{ data: Template }>(`${this.base}/kpi-templates/for-unit/${unitId}`)
      .pipe(map((r) => r.data));
  }

  createTemplate(body: {
    unit: string;
    name: string;
    description?: string;
    criteria: TemplateCriterion[];
  }): Observable<Template> {
    return this.http
      .post<{ data: Template }>(`${this.base}/kpi-templates`, body)
      .pipe(map((r) => r.data));
  }

  updateTemplate(
    id: string,
    body: Partial<{ unit: string; name: string; description: string; criteria: TemplateCriterion[] }>,
  ): Observable<Template> {
    return this.http
      .patch<{ data: Template }>(`${this.base}/kpi-templates/${id}`, body)
      .pipe(map((r) => r.data));
  }

  // ---- targets ---------------------------------------------------------------------
  setTargets(body: {
    unitId: string;
    performanceCycleId: string;
    staffId?: string;
    kpiTemplateId?: string;
    kpis: Pick<Kpi, 'title' | 'weight' | 'targets'>[];
  }): Observable<SetTargetsResponse> {
    return this.http.post<SetTargetsResponse>(`${this.base}/target-elevate`, body);
  }

  approveTarget(id: string): Observable<Target> {
    return this.http
      .patch<{ data: Target }>(`${this.base}/target-elevate/${id}/approve`, {})
      .pipe(map((r) => r.data));
  }

  myTargets(p: Params = {}): Observable<Target[]> {
    return this.list<Target>('/target-elevate/mine', p).pipe(map((r) => r.data));
  }

  targets(p: Params = {}): Observable<Target[]> {
    return this.list<Target>('/target-elevate', p).pipe(map((r) => r.data));
  }

  // ---- reviews -----------------------------------------------------------------------
  selfReview(body: {
    targetId: string;
    comments?: string;
    kpis: { title: string; staffScore: number; staffComments?: string }[];
  }): Observable<Review> {
    return this.http
      .post<{ data: Review }>(`${this.base}/review-elevate/self-review`, body)
      .pipe(map((r) => r.data));
  }

  managerReview(
    id: string,
    body: {
      comments?: string;
      kpis: { title: string; rating: number; managerComments?: string }[];
    },
  ): Observable<Review> {
    return this.http
      .patch<{ data: Review }>(`${this.base}/review-elevate/${id}/manager-review`, body)
      .pipe(map((r) => r.data));
  }

  validate(id: string, body: { finalScore?: number; comments?: string }): Observable<Review> {
    return this.http
      .patch<{ data: Review }>(`${this.base}/review-elevate/${id}/validate`, body)
      .pipe(map((r) => r.data));
  }

  reviews(p: Params = {}): Observable<Review[]> {
    return this.list<Review>('/review-elevate', p).pipe(map((r) => r.data));
  }

  myReviews(p: Params = {}): Observable<Review[]> {
    return this.list<Review>('/review-elevate/my-targets', p).pipe(map((r) => r.data));
  }

  teamReviews(p: Params = {}): Observable<Review[]> {
    return this.list<Review>('/review-elevate/team', p).pipe(map((r) => r.data));
  }

  review(id: string): Observable<Review> {
    return this.http
      .get<{ data: Review }>(`${this.base}/review-elevate/${id}`)
      .pipe(map((r) => r.data));
  }

  // ---- analytics (HR / executive) --------------------------------------------------------
  departments(cycleId: string): Observable<DepartmentRow[]> {
    return this.http.get<DepartmentRow[]>(`${this.base}/performance-analytics/departments`, {
      params: this.params({ performanceCycleId: cycleId }),
    });
  }

  managers(cycleId: string, unitId?: string): Observable<ManagerRow[]> {
    return this.http.get<ManagerRow[]>(`${this.base}/performance-analytics/managers`, {
      params: this.params({ performanceCycleId: cycleId, unitId }),
    });
  }

  managerDetails(managerId: string, cycleId: string): Observable<ManagerDetails> {
    return this.http.get<ManagerDetails>(
      `${this.base}/performance-analytics/managers/${managerId}`,
      { params: this.params({ performanceCycleId: cycleId }) },
    );
  }

  employees(cycleId: string, unitId?: string): Observable<EmployeeRow[]> {
    return this.http.get<EmployeeRow[]>(`${this.base}/performance-analytics/employees`, {
      params: this.params({ performanceCycleId: cycleId, unitId }),
    });
  }
}

/** The text of an API error, for showing to the person. */
export function errorText(error: any, fallback = 'Something went wrong. Please try again.'): string {
  const body = error?.error;
  const message = body?.message ?? body?.error;
  if (Array.isArray(message)) return message.join(' · ');
  if (typeof message === 'string') return message;
  if (message?.message) return String(message.message);
  if (error?.status === 0) return 'Cannot reach the server. Is the backend running?';
  return fallback;
}
