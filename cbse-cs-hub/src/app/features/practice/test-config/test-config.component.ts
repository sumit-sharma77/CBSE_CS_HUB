import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Topic { id: number; name: string; classLevel: string; }

@Component({
  selector: 'app-test-config',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Start a Practice Test</h1>

      <!-- Topics -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 class="font-semibold text-gray-900 mb-4">Select Topics</h2>
        @if (topics().length) {
          <div class="flex flex-wrap gap-2">
            @for (topic of topics(); track topic.id) {
              <button (click)="toggleTopic(topic.id)"
                class="px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                [class]="selectedTopics().has(topic.id) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-400'">
                {{ topic.name }}
              </button>
            }
          </div>
        } @else {
          <div class="space-y-2">@for (i of [1,2,3,4,5]; track i) { <div class="h-7 w-28 bg-gray-100 rounded-full animate-pulse inline-block mr-2"></div> }</div>
        }
      </div>

      <!-- Mode -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 class="font-semibold text-gray-900 mb-4">Test Mode</h2>
        <div class="grid grid-cols-3 gap-3">
          @for (mode of modes; track mode.value) {
            <button (click)="selectedMode.set(mode.value)"
              class="p-4 rounded-xl border-2 text-center transition-all"
              [class]="selectedMode() === mode.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-200'">
              <div class="font-bold text-gray-900">{{ mode.label }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ mode.desc }}</div>
            </button>
          }
        </div>
      </div>

      <button (click)="startTest()"
        [disabled]="!selectedTopics().size || loading()"
        class="w-full py-4 bg-brand-600 text-white font-bold text-lg rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-colors">
        @if (loading()) { Starting... } @else { Start Test → }
      </button>
    </div>
  `
})
export class TestConfigComponent implements OnInit {
  private http   = inject(HttpClient);
  private router = inject(Router);

  readonly topics         = signal<Topic[]>([]);
  readonly selectedTopics = signal<Set<number>>(new Set());
  readonly selectedMode   = signal('STANDARD');
  readonly loading        = signal(false);

  modes = [
    { value: 'QUICK',    label: 'Quick',    desc: '10 Q · 10 min' },
    { value: 'STANDARD', label: 'Standard', desc: '25 Q · 30 min' },
    { value: 'FULL',     label: 'Full',     desc: '50 Q · 60 min' }
  ];

  ngOnInit(): void {
    this.http.get<Topic[]>(`${environment.apiUrl}/topics`).subscribe({
      next: t => this.topics.set(t),
      error: () => {}
    });
  }

  toggleTopic(id: number): void {
    this.selectedTopics.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  startTest(): void {
    this.loading.set(true);
    this.http.post<any>(`${environment.apiUrl}/tests/sessions`, {
      topicIds: Array.from(this.selectedTopics()),
      mode: this.selectedMode()
    }).subscribe({
      next: (res) => this.router.navigate(['/practice/session', res.sessionId]),
      error: () => this.loading.set(false)
    });
  }
}
