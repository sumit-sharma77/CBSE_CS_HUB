import { Component, signal } from '@angular/core';
import { AdminContentLoaderService } from '../services/admin-content-loader.service';
import { AdminIdGeneratorService } from '../services/admin-id-generator.service';
import { McqEditorComponent } from '../mcq-editor/mcq-editor';
import { SqlEditorComponent } from '../sql-editor/sql-editor';
import { PythonEditorComponent } from '../python-editor/python-editor';

export type AdminTab = 'mcq' | 'sql' | 'python';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [McqEditorComponent, SqlEditorComponent, PythonEditorComponent],
  providers: [AdminContentLoaderService, AdminIdGeneratorService],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Dev-only banner -->
      <div class="bg-amber-500 text-amber-950 text-center text-xs font-semibold py-1.5 px-4">
        ⚠️ ADMIN PANEL — Development mode only. Not accessible in production.
      </div>

      <!-- Header -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">Content Editor</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">Create and export CBSE CS Hub content</p>
      </div>

      <!-- Tab bar -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div class="flex">
          @for (tab of tabs; track tab.id) {
            <button
              (click)="switchTab(tab.id)"
              [class]="tabClass(tab.id)"
              type="button">
              {{ tab.label }}
            </button>
          }
        </div>
      </div>

      <!-- Content area -->
      <div class="p-4 max-w-4xl mx-auto">
        @switch (activeTab()) {
          @case ('mcq') {
            <app-mcq-editor (dirtyChange)="isDirty.set($event)"></app-mcq-editor>
          }
          @case ('sql') {
            <app-sql-editor (dirtyChange)="isDirty.set($event)"></app-sql-editor>
          }
          @case ('python') {
            <app-python-editor (dirtyChange)="isDirty.set($event)"></app-python-editor>
          }
        }
      </div>
    </div>
  `,
})
export class AdminShellComponent {
  activeTab = signal<AdminTab>('mcq');
  isDirty = signal(false);

  readonly tabs: { id: AdminTab; label: string }[] = [
    { id: 'mcq', label: '🧠 MCQ' },
    { id: 'sql', label: '🗄️ SQL' },
    { id: 'python', label: '🐍 Python' },
  ];

  tabClass(tab: AdminTab): string {
    const base = 'flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors';
    return this.activeTab() === tab
      ? `${base} border-indigo-500 text-indigo-600 dark:text-indigo-400`
      : `${base} border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`;
  }

  switchTab(tab: AdminTab): void {
    if (this.isDirty() && this.activeTab() !== tab) {
      if (!window.confirm('You have unsaved changes — switching tabs will clear the form. Continue?')) {
        return;
      }
      this.isDirty.set(false);
    }
    this.activeTab.set(tab);
  }
}
