import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

const BASE = environment.apiUrl.replace('/v1', '') + '/admin';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">👥 Users</h1>

      @if (message()) {
        <div class="mb-4 p-3 rounded-lg text-sm"
          [class]="messageType() === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
          {{ message() }}
        </div>
      }

      <!-- Roles modal -->
      @if (roleTarget()) {
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div class="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <h3 class="font-bold text-gray-900 mb-4">Change Role</h3>
            <form [formGroup]="roleForm" (ngSubmit)="submitRole()" class="space-y-4">
              <select formControlName="role"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>STUDENT</option>
                <option>ADMIN</option>
              </select>
              <div class="flex gap-3">
                <button type="submit" class="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold">Save</button>
                <button type="button" (click)="roleTarget.set(null)"
                  class="flex-1 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      }

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
              <th class="text-left px-4 py-3 font-semibold text-gray-600">Joined</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="px-4 py-3">{{ user.email }}</td>
                <td class="px-4 py-3">{{ user.displayName }}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                    [class]="user.role === 'ADMIN' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500">{{ user.createdAt | date:'mediumDate' }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2 justify-end">
                    <button (click)="openRoleModal(user)"
                      class="text-xs px-3 py-1 border border-brand-300 text-brand-600 rounded-lg hover:bg-brand-50">
                      Role
                    </button>
                    <button (click)="deleteUser(user)"
                      class="text-xs px-3 py-1 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            }
            @empty {
              <tr><td colspan="5" class="text-center py-10 text-gray-400">No users found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private http = inject(HttpClient);
  private fb   = inject(FormBuilder);

  readonly users      = signal<any[]>([]);
  readonly roleTarget = signal<any>(null);
  readonly message    = signal<string | null>(null);
  readonly messageType = signal<'success' | 'error'>('success');

  roleForm = this.fb.group({ role: ['STUDENT', Validators.required] });

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.http.get<any>(`${BASE}/users?size=200`).subscribe({
      next: p => this.users.set(p.content ?? []),
      error: () => {}
    });
  }

  openRoleModal(user: any): void {
    this.roleTarget.set(user);
    this.roleForm.patchValue({ role: user.role });
  }

  submitRole(): void {
    const target = this.roleTarget();
    if (!target) return;
    this.http.put(`${BASE}/users/${target.id}/role`, this.roleForm.value).subscribe({
      next: (u: any) => {
        this.users.update(list => list.map(x => x.id === u.id ? u : x));
        this.roleTarget.set(null);
        this.showMsg('Role updated', 'success');
      },
      error: () => this.showMsg('Failed to update role', 'error')
    });
  }

  deleteUser(user: any): void {
    if (!confirm(`Delete user ${user.email}? This cannot be undone.`)) return;
    this.http.delete(`${BASE}/users/${user.id}`).subscribe({
      next: () => {
        this.users.update(list => list.filter(u => u.id !== user.id));
        this.showMsg('User deleted', 'success');
      },
      error: () => this.showMsg('Failed to delete user', 'error')
    });
  }

  private showMsg(msg: string, type: 'success' | 'error'): void {
    this.message.set(msg);
    this.messageType.set(type);
    setTimeout(() => this.message.set(null), 3000);
  }
}
