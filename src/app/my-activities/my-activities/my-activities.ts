import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../services/role';
import { ElevateApi, errorText } from '../../core/elevate-api.service';
import { Cycle } from '../../core/models';
import { cycleName, fmtRange } from '../../core/format';

@Component({
  selector: 'app-my-activities',
  imports: [],
  templateUrl: './my-activities.html',
  styleUrl: './my-activities.css',
})
export class MyActivities implements OnInit {
  private readonly roleService = inject(Role);
  private readonly api = inject(ElevateApi);
  private readonly router = inject(Router);

  readonly cycles = signal<Cycle[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly current = computed(() => this.cycles().find((c) => c.status === 'ACTIVE') ?? null);
  readonly previous = computed(() => this.cycles().filter((c) => c.status === 'CLOSED'));

  readonly fmtRange = fmtRange;
  readonly cycleName = cycleName;

  ngOnInit(): void {
    this.api.cycles().subscribe({
      next: (list) => {
        this.cycles.set(
          [...list].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
        );
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(errorText(e, 'Could not load performance cycles.'));
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  /** Open the "my cycle" screen for a cycle: managers have their own route, everyone else the staff one. */
  view(cycle: Cycle): void {
    const path = this.roleService.getRole() === 'manager' ? '/elevate/manager-elevate' : '/elevate/user-elevate';
    this.router.navigate([path], { queryParams: { cycle: cycle._id } });
  }
}
