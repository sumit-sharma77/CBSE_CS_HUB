import {
  Component, computed, inject, OnInit, output, signal
} from '@angular/core';
import {
  FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormControl
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminContentLoaderService } from '../services/admin-content-loader.service';
import { AdminIdGeneratorService } from '../services/admin-id-generator.service';
import { OcrZoneComponent } from '../ocr-zone/ocr-zone';
import { PythonDraft, ParsedOcrResult } from '../admin.types';

interface PythonFile { id: string; label: string; prefix: string; topic: string; }

const PYTHON_FILES: PythonFile[] = [
  { id: 'python-exercises/conditions.json',   label: 'Python - Conditions',   prefix: 'py-cond',  topic: 'conditions'   },
  { id: 'python-exercises/dictionaries.json', label: 'Python - Dictionaries', prefix: 'py-dict',  topic: 'dictionaries' },
  { id: 'python-exercises/functions.json',    label: 'Python - Functions',    prefix: 'py-fn',    topic: 'functions'    },
  { id: 'python-exercises/lists.json',        label: 'Python - Lists',        prefix: 'py-lists', topic: 'lists'        },
  { id: 'python-exercises/loops.json',        label: 'Python - Loops',        prefix: 'py-loops', topic: 'loops'        },
  { id: 'python-exercises/mixed.json',        label: 'Python - Mixed',        prefix: 'py-mixed', topic: 'mixed'        },
  { id: 'python-exercises/strings.json',      label: 'Python - Strings',      prefix: 'py-str',   topic: 'strings'      },
  { id: 'python-exercises/variables.json',    label: 'Python - Variables',    prefix: 'py-vars',  topic: 'variables'    },
];

const PYTHON_TYPES = [
  { value: 'output-based',   label: 'Output-based'   },
  { value: 'fill-blank',     label: 'Fill in Blank'  },
  { value: 'mcq',            label: 'MCQ'            },
  { value: 'short-answer',   label: 'Short Answer'   },
];

@Component({
  selector: 'app-python-editor',
  standalone: true,
  imports: [ReactiveFormsModule, OcrZoneComponent],
  template: `
    <div class="space-y-4">
      <!-- File picker -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content File</label>
        <select [value]="selectedFile()" (change)="onFileChange($event)"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          @for (f of pythonFiles; track f.id) { <option [value]="f.id">{{ f.label }}</option> }
        </select>
      </div>

      @if (viewMode() === 'list') {
        <!-- LIST VIEW -->
        <div class="space-y-3">
          <div class="flex gap-2">
            <input [formControl]="filterCtrl" type="search" placeholder="Filter by ID or question..."
              class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <button type="button" (click)="startAdd()"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
              + Add Question
            </button>
          </div>

          @if (allItems() === null) {
            <div class="rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-6 text-center">
              <p class="text-sm text-red-600 dark:text-red-400">Could not load content. Ensure dev server is running.</p>
            </div>
          } @else if (allItems()!.length === 0) {
            <div class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">No questions yet.</p>
              <button type="button" (click)="startAdd()"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                + Add First Question
              </button>
            </div>
          } @else {
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <span class="text-xs text-gray-500">{{ filteredItems().length }} / {{ allItems()!.length }} questions</span>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (item of filteredItems(); track item.id) {
                  <div class="px-4 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <div class="flex items-start gap-3">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400">{{ item.id }}</span>
                          <span class="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{{ item.type }}</span>
                          <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">{{ item.difficulty }}</span>
                          @if (item.isPreviousYear) {
                            <span class="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                              PYQ {{ item.year }}
                            </span>
                          }
                        </div>
                        <p class="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{{ item.questionText ?? item.codeSnippet }}</p>
                      </div>
                      <div class="flex gap-1.5 shrink-0">
                        <button type="button" (click)="startEdit(item)"
                          class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100
                                 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors">
                          Edit
                        </button>
                        <button type="button" (click)="deleteItem(item)"
                          class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 hover:bg-red-100
                                 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

      } @else {
        <!-- FORM VIEW -->
        <div class="space-y-5">
          <div class="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <button type="button" (click)="backToList()"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              &larr; Back to List
            </button>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-auto">
              {{ editMode() ? 'Editing: ' + editingOriginalId() : '+ New Python Question' }}
            </span>
          </div>

          <app-ocr-zone (parsed)="onOcrParsed($event)"></app-ocr-zone>

          <form [formGroup]="form" class="space-y-4">
            <!-- ID -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question ID</label>
              @if (editMode()) {
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                  <span class="text-xs font-mono text-indigo-700 dark:text-indigo-300">{{ form.get('id')!.value }}</span>
                  <span class="text-xs text-indigo-400 ml-auto">Editing existing</span>
                </div>
              } @else {
                <div class="flex gap-2">
                  <input formControlName="id" type="text"
                    class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                           text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="auto-generated">
                  <button type="button" (click)="generateId()"
                    class="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                           text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                    Auto
                  </button>
                </div>
              }
              @if (idCtrl.invalid && idCtrl.touched) { <p class="mt-1 text-xs text-red-500">ID is required</p> }
              @if (!idUnique()) { <p class="mt-1 text-xs text-red-500">ID already exists</p> }
            </div>

            <!-- Type -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question Type</label>
              <select formControlName="type"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                @for (t of pythonTypes; track t.value) { <option [value]="t.value">{{ t.label }}</option> }
              </select>
            </div>

            <!-- Question (optional for output-based) -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question <span class="text-gray-400">(optional for output-based)</span></label>
              <textarea formControlName="questionText" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter the question text..."></textarea>
            </div>

            <!-- Code Snippet (only for output-based) -->
            @if (form.get('type')!.value === 'output-based') {
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Code Snippet</label>
                <textarea formControlName="codeSnippet" rows="5"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  placeholder="x = 10&#10;print(x)"></textarea>
                @if (form.get('codeSnippet')!.invalid && form.get('codeSnippet')!.touched) { <p class="mt-1 text-xs text-red-500">Required for output-based questions</p> }
              </div>
            }

            <!-- Answer -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Answer <span class="text-gray-400">(optional)</span></label>
              <textarea formControlName="answer" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="The expected answer..."></textarea>
            </div>

            <!-- Explanation -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Explanation</label>
              <textarea formControlName="explanation" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Explain the answer..."></textarea>
              @if (form.get('explanation')!.invalid && form.get('explanation')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
            </div>

            <!-- Difficulty -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Difficulty</label>
              <select formControlName="difficulty"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
              </select>
            </div>

            <!-- PYQ -->
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input formControlName="isPreviousYear" type="checkbox" class="accent-indigo-600 h-4 w-4 rounded">
                <span class="text-sm text-gray-700 dark:text-gray-300">Previous Year Question</span>
              </label>
              @if (form.get('isPreviousYear')!.value) {
                <input formControlName="year" type="number" min="1990" max="2030"
                  class="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Year">
              }
            </div>

            @if (saveError()) {
              <div class="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700 px-4 py-3">
                <p class="text-xs text-red-600 dark:text-red-400">{{ saveError() }}</p>
              </div>
            }

            <div class="flex gap-2 pt-2">
              <button type="button" (click)="onSubmit()"
                class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-medium rounded-lg transition-colors"
                [disabled]="form.invalid || !idUnique() || saving()">
                @if (saving()) { Saving… } @else { {{ editMode() ? 'Save Changes' : 'Add Question' }} }
              </button>
              <button type="button" (click)="backToList()"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
})
export class PythonEditorComponent implements OnInit {
  dirtyChange = output<boolean>();

  private fb = inject(FormBuilder);
  private loader = inject(AdminContentLoaderService);
  private idGen = inject(AdminIdGeneratorService);

  readonly pythonFiles = PYTHON_FILES;
  readonly pythonTypes = PYTHON_TYPES;

  selectedFile = signal(PYTHON_FILES[0].id);
  viewMode = signal<'list' | 'form'>('list');
  editMode = signal(false);
  editingOriginalId = signal<string | null>(null);
  saving = signal(false);
  saveError = signal<string | null>(null);

  filterCtrl = new FormControl('');
  private filterValue = toSignal(this.filterCtrl.valueChanges, { initialValue: '' });

  form!: FormGroup;

  get idCtrl(): AbstractControl { return this.form.get('id')!; }

  allItems = computed<PythonDraft[] | null>(() =>
    this.loader.load<PythonDraft>(this.selectedFile())() as PythonDraft[] | null
  );

  filteredItems = computed<PythonDraft[]>(() => {
    const all = this.allItems() ?? [];
    const q = (this.filterValue() ?? '').toLowerCase().trim();
    if (!q) return all;
    return all.filter(i => (i.id + ' ' + (i.questionText ?? i.codeSnippet ?? '')).toLowerCase().includes(q));
  });

  existingItems = computed<{ id: string }[]>(() => this.allItems() ?? []);

  idUnique = computed(() => {
    const id = this.idCtrl?.value as string;
    if (!id) return true;
    if (id === this.editingOriginalId()) return true;
    return this.idGen.validateId(id, this.existingItems());
  });

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', Validators.required],
      type: ['output-based', Validators.required],
      questionText: [''],
      codeSnippet: [''],
      answer: [''],
      explanation: ['', Validators.required],
      difficulty: ['beginner', Validators.required],
      isPreviousYear: [false],
      year: [null],
    });
    // conditional required for codeSnippet
    this.form.get('type')!.valueChanges.subscribe((t: string) => {
      const ctrl = this.form.get('codeSnippet')!;
      if (t === 'output-based') ctrl.setValidators(Validators.required);
      else ctrl.clearValidators();
      ctrl.updateValueAndValidity();
    });
    this.form.valueChanges.subscribe(() => this.dirtyChange.emit(this.form.dirty));
  }

  onFileChange(event: Event): void {
    this.selectedFile.set((event.target as HTMLSelectElement).value);
    this.viewMode.set('list');
  }

  generateId(): void {
    const file = this.pythonFiles.find(f => f.id === this.selectedFile())!;
    this.form.get('id')!.setValue(this.idGen.nextId(this.existingItems(), file.prefix));
  }

  startAdd(): void {
    this.form.reset({ type: 'output-based', difficulty: 'beginner', isPreviousYear: false });
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.viewMode.set('form');
  }

  startEdit(item: PythonDraft): void {
    this.form.patchValue({
      id: item.id, type: item.type ?? 'output-based', questionText: item.questionText ?? '',
      codeSnippet: item.codeSnippet ?? '', answer: item.answer ?? '',
      explanation: item.explanation, difficulty: item.difficulty ?? 'beginner',
      isPreviousYear: item.isPreviousYear ?? false,
      year: item.year ?? null,
    });
    this.editMode.set(true);
    this.editingOriginalId.set(item.id);
    this.saveError.set(null);
    this.viewMode.set('form');
    this.dirtyChange.emit(true);
  }

  backToList(): void {
    this.viewMode.set('list');
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.dirtyChange.emit(false);
  }

  deleteItem(item: PythonDraft): void {
    if (!confirm(`Delete "${item.id}"? This will overwrite the JSON file.`)) return;
    const remaining = (this.allItems() ?? []).filter(i => i.id !== item.id);
    this.loader.save(this.selectedFile(), remaining).subscribe({
      error: (err: Error) => alert(err.message),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.idUnique()) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const file = this.pythonFiles.find(f => f.id === this.selectedFile())!;
    const existing = this.allItems();
    const existingItem = existing?.find(i => i.id === v.id);
    const d: PythonDraft = {
      id: v.id,
      topic: existingItem?.topic ?? file.topic,
      type: v.type,
      ...(v.questionText ? { questionText: v.questionText } : {}),
      ...(v.type === 'output-based' && v.codeSnippet ? { codeSnippet: v.codeSnippet } : {}),
      ...(v.answer ? { answer: v.answer } : {}),
      explanation: v.explanation,
      difficulty: v.difficulty,
      ...(v.isPreviousYear ? { isPreviousYear: true } : {}),
      ...(v.isPreviousYear && v.year ? { year: v.year } : {}),
    };
    const updated = this.editMode()
      ? (existing ?? []).map(i => i.id === this.editingOriginalId() ? d : i)
      : [...(existing ?? []), d];

    this.saving.set(true);
    this.saveError.set(null);
    this.loader.save(this.selectedFile(), updated).subscribe({
      next: () => { this.saving.set(false); this.backToList(); },
      error: (err: Error) => { this.saving.set(false); this.saveError.set(err.message); },
    });
  }

  reset(): void { this.backToList(); }

  onOcrParsed(result: ParsedOcrResult): void {
    if (result.questionText) this.form.get('questionText')!.setValue(result.questionText);
    this.form.markAsDirty();
    this.dirtyChange.emit(true);
  }
}
