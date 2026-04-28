import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../core/services/storage.service';

interface PersonalNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'cbse-notes';

function generateId(): string {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2);
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4">
      @if (!editingNote()) {
        <!-- List View -->
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">My Notes</h1>
          <div class="flex gap-2">
            @if (notes().length > 0) {
              <button (click)="exportAll()"
                      aria-label="Export all notes"
                      class="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Export
              </button>
            }
            <button (click)="createNote()"
                    aria-label="Create new note"
                    class="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              + New Note
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="relative">
          <input type="search"
                 [ngModel]="searchQuery()"
                 (ngModelChange)="searchQuery.set($event)"
                 placeholder="Search notes…"
                 class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 aria-label="Search notes">
        </div>

        @if (filteredNotes().length === 0) {
          <div class="text-center py-16 text-gray-400 dark:text-gray-500">
            @if (notes().length === 0) {
              <div class="space-y-2">
                <p class="text-4xl">📝</p>
                <p class="font-medium">No notes yet</p>
                <p class="text-sm">Tap "+ New Note" to create your first note</p>
              </div>
            } @else {
              <p>No notes match "{{ searchQuery() }}"</p>
            }
          </div>
        }

        <div class="space-y-3">
          @for (note of filteredNotes(); track note.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div class="flex items-start justify-between gap-2">
                <button (click)="openNote(note)"
                        class="flex-1 text-left"
                        [attr.aria-label]="'Open note: ' + note.title">
                  <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ note.title }}</h3>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Updated {{ formatDate(note.updatedAt) }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {{ note.content }}
                  </p>
                </button>
                <div class="flex items-center gap-1">
                  @if (deleteConfirm() === note.id) {
                    <div class="flex gap-1">
                      <button (click)="confirmDelete(note.id)"
                              class="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                              aria-label="Confirm delete">
                        Delete
                      </button>
                      <button (click)="deleteConfirm.set(null)"
                              class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              aria-label="Cancel delete">
                        Cancel
                      </button>
                    </div>
                  } @else {
                    <button (click)="deleteConfirm.set(note.id)"
                            aria-label="Delete note"
                            class="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                      🗑️
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Editor View -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <button (click)="closeEditor()"
                    aria-label="Back to notes list"
                    class="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              ← Back
            </button>
            <span class="text-xs text-green-600 dark:text-green-400" [class.opacity-0]="!savedIndicator()">
              ✓ Saved
            </span>
          </div>
          <textarea
            [ngModel]="editContent()"
            (ngModelChange)="onContentChange($event)"
            placeholder="Start writing your note…"
            class="w-full min-h-[60vh] p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            aria-label="Note content editor">
          </textarea>
        </div>
      }
    </div>
  `,
})
export class Notes {
  private storage = inject(StorageService);

  protected notes = signal<PersonalNote[]>(
    this.storage.get<PersonalNote[]>(STORAGE_KEY) ?? []
  );
  protected searchQuery = signal('');
  protected editingNote = signal<PersonalNote | null>(null);
  protected editContent = signal('');
  protected deleteConfirm = signal<string | null>(null);
  protected savedIndicator = signal(false);

  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  protected filteredNotes = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const sorted = [...this.notes()].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return q ? sorted.filter(n => n.content.toLowerCase().includes(q)) : sorted;
  });

  protected createNote(): void {
    const note: PersonalNote = {
      id: generateId(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.notes.set([note, ...this.notes()]);
    this.storage.set(STORAGE_KEY, this.notes());
    this.openNote(note);
  }

  protected openNote(note: PersonalNote): void {
    this.editingNote.set(note);
    this.editContent.set(note.content);
  }

  protected onContentChange(value: string): void {
    this.editContent.set(value);
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.autoSave(value), 2000);
  }

  private autoSave(content: string): void {
    const current = this.editingNote();
    if (!current) return;
    const title = content.split('\n')[0].trim().slice(0, 60) || 'Untitled';
    const updated: PersonalNote = { ...current, title, content, updatedAt: new Date().toISOString() };
    this.editingNote.set(updated);
    this.notes.set(this.notes().map(n => n.id === updated.id ? updated : n));
    this.storage.set(STORAGE_KEY, this.notes());
    this.savedIndicator.set(true);
    setTimeout(() => this.savedIndicator.set(false), 2000);
  }

  protected closeEditor(): void {
    if (this.editContent() !== this.editingNote()?.content) {
      this.autoSave(this.editContent());
    }
    this.editingNote.set(null);
    if (this.saveTimer) clearTimeout(this.saveTimer);
  }

  protected confirmDelete(id: string): void {
    this.notes.set(this.notes().filter(n => n.id !== id));
    this.storage.set(STORAGE_KEY, this.notes());
    this.deleteConfirm.set(null);
  }

  protected exportAll(): void {
    const content = this.notes()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map(n => `=== ${n.title} ===\nUpdated: ${new Date(n.updatedAt).toLocaleString()}\n\n${n.content}`)
      .join('\n\n' + '─'.repeat(40) + '\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-cbse-notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  }
}
