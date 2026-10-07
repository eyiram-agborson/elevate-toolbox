import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth.service';
import { errorText } from '../core/elevate-api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <main class="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4">
      <form
        class="w-full max-w-[400px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        (ngSubmit)="submit()"
      >
        <img src="/etz-logo.png" alt="ETZ logo" class="mb-6 h-6 w-auto object-contain" />
        <h1 class="text-[22px] font-semibold text-gray-900">Sign in to Elevate</h1>
        <p class="mt-1 text-[14px] text-gray-500">Use your Toolbox email and password.</p>

        <label class="mt-6 block text-[13px] font-medium text-gray-700" for="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="username"
          [(ngModel)]="email"
          required
          class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[14px] outline-none focus:border-[#2F87DA]"
        />

        <label class="mt-4 block text-[13px] font-medium text-gray-700" for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          [(ngModel)]="password"
          required
          class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[14px] outline-none focus:border-[#2F87DA]"
        />

        @if (error()) {
          <p class="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">{{ error() }}</p>
        }

        <button
          type="submit"
          [disabled]="busy()"
          class="mt-6 w-full rounded-lg bg-[#2F87DA] py-2.5 text-[14px] font-medium !text-white disabled:opacity-60"
        >
          {{ busy() ? 'Signing in…' : 'Sign in' }}
        </button>

        @if (demo.length) {
          <div class="mt-6 border-t border-gray-200 pt-4">
            <p class="text-[12px] font-medium uppercase tracking-wide text-gray-400">Demo accounts</p>
            <div class="mt-2 flex flex-wrap gap-2">
              @for (a of demo; track a.email) {
                <button
                  type="button"
                  (click)="email = a.email"
                  class="rounded-full border border-gray-200 px-3 py-1 text-[12px] text-gray-600 hover:border-[#2F87DA] hover:text-[#2F87DA]"
                >
                  {{ a.label }}
                </button>
              }
            </div>
          </div>
        }
      </form>
    </main>
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  readonly busy = signal(false);
  readonly error = signal('');
  readonly demo = environment.demoLogin ? environment.demoAccounts : [];

  submit(): void {
    if (!this.email || !this.password) {
      this.error.set('Enter your email and password.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => {
        this.busy.set(false);
        this.error.set(errorText(e, 'Sign-in failed. Check your email and password.'));
      },
    });
  }
}
