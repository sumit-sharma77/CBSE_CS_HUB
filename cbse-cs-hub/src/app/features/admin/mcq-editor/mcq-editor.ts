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
import { McqDraft, ParsedOcrResult } from '../admin.types';

interface McqFile { id: string; label: string; prefix: string; }

const MCQ_FILES: McqFile[] = [
  { id: 'mcq/cl12-python.json',                label: 'Class 12 - Python',              prefix: 'cl12-py'  },
  { id: 'mcq/cl12-sql.json',                   label: 'Class 12 - SQL',                 prefix: 'cl12-sql' },
  { id: 'mcq/cl12-networking.json',            label: 'Class 12 - Networking',          prefix: 'cl12-nw'  },
  { id: 'mcq/cl11-python.json',                label: 'Class 11 - Python',              prefix: 'cl11-py'  },
  { id: 'mcq/cl11-computer-fundamentals.json', label: 'Class 11 - Comp. Fundamentals',  prefix: 'cl11-cf'  },
];

@Component({
  selector: 'app-mcq-editor',
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
          @for (f of mcqFiles; track f.id) { <option [value]="f.id">{{ f.label }}</option> }
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
              <p class="text-sm text-red-600 dark:text-red-400">Could not load content. Ensure both servers are running.</p>
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
                          @if (item.isPreviousYear) {
                            <span class="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                              PYQ {{ item.year }}
                            </span>
                          }
                        </div>
                        <p class="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{{ item.question }}</p>
                        <p class="text-xs text-gray-400 mt-0.5">Correct: {{ item.options[item.correctIndex] }}</p>
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
              {{ editMode() ? 'Editing: ' + editingOriginalId() : '+ New MCQ Question' }}
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

            <!-- Question -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question</label>
              <textarea formControlName="question" rows="3"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter the question text..."></textarea>
              @if (form.get('question')!.invalid && form.get('question')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
            </div>

            <!-- Options -->
            <div formArrayName="options" class="space-y-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Options (select radio = correct answer)</label>
              @for (opt of optionControls; track $index) {
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-gray-500 w-5 shrink-0">{{ optionLabels[$index] }}</span>
                  <input [formControlName]="$index" type="text"
                    class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                           text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Option ' + optionLabels[$index]">
                  <input type="radio" name="correct" [value]="$index"
                    [checked]="form.get('correctIndex')!.value === $index"
                    (change)="form.get('correctIndex')!.setValue($index)"
                    class="accent-indigo-600 h-4 w-4 cursor-pointer shrink-0">
                </div>
              }
            </div>

            <!-- Explanation -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Explanation</label>
              <textarea formControlName="explanation" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Why is this the correct answer?"></textarea>
              @if (form.get('explanation')!.invalid && form.get('explanation')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
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
export class McqEditorComponent implements OnInit {
  dirtyChange = output<boolean>();

  private fb = inject(FormBuilder);
  private loader = inject(AdminContentLoaderService);
  private idGen = inject(AdminIdGeneratorService);

  readonly mcqFiles = MCQ_FILES;
  readonly optionLabels = ['A', 'B', 'C', 'D'];

  selectedFile = signal(MCQ_FILES[0].id);
  viewMode = signal<'list' | 'form'>('list');
  editMode = signal(false);
  editingOriginalId = signal<string | null>(null);
  saving = signal(false);
  saveError = signal<string | null>(null);

  filterCtrl = new FormControl('');
  private filterValue = toSignal(this.filterCtrl.valueChanges, { initialValue: '' });

  form!: FormGroup;

  get idCtrl(): AbstractControl { return this.form.get('id')!; }
  get optionControls(): AbstractControl[] {
    return (this.form.get('options') as import('@angular/forms').FormArray).controls;
  }

  allItems = computed<McqDraft[] | null>(() =>
    this.loader.load<McqDraft>(this.selectedFile())() as McqDraft[] | null
  );

  filteredItems = computed<McqDraft[]>(() => {
    const all = this.allItems() ?? [];
    const q = (this.filterValue() ?? '').toLowerCase().trim();
    if (!q) return all;
    return all.filter(i => (i.id + ' ' + i.question).toLowerCase().includes(q));
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
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      correctIndex: [null, Validators.required],
      explanation: ['', Validators.required],
      isPreviousYear: [false],
      year: [null],
    });
    this.form.valueChanges.subscribe(() => this.dirtyChange.emit(this.form.dirty));
  }

  onFileChange(event: Event): void {
    this.selectedFile.set((event.target as HTMLSelectElement).value);
    this.viewMode.set('list');
  }

  generateId(): void {
    const file = this.mcqFiles.find(f => f.id === this.selectedFile())!;
    this.form.get('id')!.setValue(this.idGen.nextId(this.existingItems(), file.prefix));
  }

  startAdd(): void {
    this.form.reset({ isPreviousYear: false, correctIndex: null });
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.viewMode.set('form');
  }

  startEdit(item: McqDraft): void {
    const opts = item.options ?? ['', '', '', ''];
    const optArray = this.form.get('options') as import('@angular/forms').FormArray;
    opts.forEach((o, i) => optArray.at(i).setValue(o ?? ''));
    this.form.patchValue({
      id: item.id,
      question: item.question,
      correctIndex: item.correctIndex ?? null,
      explanation: item.explanation,
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

  deleteItem(item: McqDraft): void {
    if (!confirm(`Delete "${item.id}"? This will overwrite the JSON file.`)) return;
    const remaining = (this.allItems() ?? []).filter(i => i.id !== item.id);
    this.loader.save(this.selectedFile(), remaining).subscribe({
      error: (err: Error) => alert(err.message),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.idUnique()) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    const item: McqDraft = {
      id: v.id, question: v.question,
      options: v.options as [string, string, string, string],
      correctIndex: v.correctIndex as 0 | 1 | 2 | 3,
      explanation: v.explanation,
      isPreviousYear: v.isPreviousYear ?? false,
      ...(v.isPreviousYear && v.year ? { year: v.year } : {}),
    };
    const existing = this.allItems() ?? [];
    const updated = this.editMode()
      ? existing.map(i => i.id === this.editingOriginalId() ? item : i)
      : [...existing, item];

    this.saving.set(true);
    this.saveError.set(null);
    this.loader.save(this.selectedFile(), updated).subscribe({
      next: () => { this.saving.set(false); this.backToList(); },
      error: (err: Error) => { this.saving.set(false); this.saveError.set(err.message); },
    });
  }

  reset(): void { this.backToList(); }

  onOcrParsed(result: ParsedOcrResult): void {
    if (result.questionText) this.form.get('question')!.setValue(result.questionText);
    if (result.options) {
      const optArray = this.form.get('options') as import('@angular/forms').FormArray;
      result.options.forEach((opt, i) => optArray.at(i).setValue(opt));
    }
    this.form.markAsDirty();
    this.dirtyChange.emit(true);
  }
}


interface McqFile { id: string; label: string; prefix: string; }

