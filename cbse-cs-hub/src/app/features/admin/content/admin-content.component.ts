import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

const BASE = environment.apiUrl.replace('/v1', '') + '/admin';

@Component({
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">📚 Content Management</h1>

      @if (message()) {
        <div class="mb-4 p-3 rounded-lg text-sm"
          [class]="messageType() === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
          {{ message() }}
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <!-- Topics -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 class="font-bold text-gray-900 mb-4">Topics</h2>

          <form [formGroup]="topicForm" (ngSubmit)="createTopic()" class="space-y-3 mb-5">
            <input type="text" formControlName="name" placeholder="Topic name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
            <div class="flex gap-2">
              <select formControlName="classLevel" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
              <select formControlName="type" class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>THEORY</option>
                <option>PROGRAMMING</option>
                <option>DBMS</option>
              </select>
              <button type="submit" [disabled]="topicForm.invalid"
                class="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 disabled:opacity-50">
                Add
              </button>
            </div>
          </form>

          <div class="space-y-2 max-h-96 overflow-y-auto">
            @for (topic of topics(); track topic.id) {
              <div class="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div>
                  <span class="font-medium text-sm text-gray-900">{{ topic.name }}</span>
                  <span class="ml-2 text-xs text-gray-400">Class {{ topic.classLevel }} · {{ topic.type }}</span>
                </div>
                <div class="flex gap-2">
                  <button (click)="selectTopic(topic)"
                    class="text-xs px-2 py-1 border border-brand-200 text-brand-600 rounded hover:bg-brand-50">
                    Questions
                  </button>
                  <button (click)="deleteTopic(topic.id)"
                    class="text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50">
                    ✕
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Questions -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 class="font-bold text-gray-900 mb-1">Questions</h2>
          @if (selectedTopic()) {
            <p class="text-sm text-brand-600 mb-4 font-semibold">{{ selectedTopic()!.name }}</p>

            <form [formGroup]="questionForm" (ngSubmit)="createQuestion()" class="space-y-3 mb-5">
              <textarea formControlName="questionText" placeholder="Question text" rows="2"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-400"></textarea>
              <textarea formControlName="optionsJson" placeholder='[{"id":"A","text":"..."},{"id":"B","text":"..."}]' rows="2"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-brand-400"></textarea>
              <div class="flex gap-2">
                <input type="text" formControlName="correctOptionId" placeholder="Correct (A/B/C/D)"
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400">
                <select formControlName="difficultyWeight" class="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="1">Easy</option>
                  <option value="2">Medium</option>
                  <option value="3">Hard</option>
                </select>
                <button type="submit" [disabled]="questionForm.invalid"
                  class="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 disabled:opacity-50">
                  Add
                </button>
              </div>
            </form>

            <div class="space-y-2 max-h-80 overflow-y-auto">
              @for (q of questions(); track q.id) {
                <div class="flex items-start justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <p class="text-sm text-gray-800 flex-1 pr-2 line-clamp-2">{{ q.questionText }}</p>
                  <button (click)="deleteQuestion(q.id)"
                    class="flex-shrink-0 text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50">
                    ✕
                  </button>
                </div>
              }
              @empty {
                <p class="text-sm text-gray-400 text-center py-6">No questions yet. Add above.</p>
              }
            </div>
          } @else {
            <p class="text-sm text-gray-400 text-center py-16">← Select a topic to manage its questions</p>
          }
        </div>
      </div>
    </div>
  `
})
export class AdminContentComponent implements OnInit {
  private http = inject(HttpClient);
  private fb   = inject(FormBuilder);

  readonly topics        = signal<any[]>([]);
  readonly questions     = signal<any[]>([]);
  readonly selectedTopic = signal<any>(null);
  readonly message       = signal<string | null>(null);
  readonly messageType   = signal<'success' | 'error'>('success');

  topicForm = this.fb.group({
    name:       ['', Validators.required],
    classLevel: ['11', Validators.required],
    type:       ['THEORY', Validators.required]
  });

  questionForm = this.fb.group({
    questionText:    ['', Validators.required],
    optionsJson:     ['', Validators.required],
    correctOptionId: ['', Validators.required],
    difficultyWeight:[2]
  });

  ngOnInit(): void { this.loadTopics(); }

  private loadTopics(): void {
    this.http.get<any[]>(`${BASE}/topics`).subscribe({
      next: t => this.topics.set(t),
      error: () => {}
    });
  }

  createTopic(): void {
    const { name, classLevel, type } = this.topicForm.value;
    this.http.post<any>(`${BASE}/topics`, { name, classLevel: Number(classLevel), type }).subscribe({
      next: t => {
        this.topics.update(list => [...list, t]);
        this.topicForm.reset({ name: '', classLevel: '11', type: 'THEORY' });
        this.showMsg('Topic created', 'success');
      },
      error: () => this.showMsg('Failed to create topic', 'error')
    });
  }

  deleteTopic(id: number): void {
    if (!confirm('Delete this topic and all its questions?')) return;
    this.http.delete(`${BASE}/topics/${id}`).subscribe({
      next: () => {
        this.topics.update(list => list.filter(t => t.id !== id));
        if (this.selectedTopic()?.id === id) { this.selectedTopic.set(null); this.questions.set([]); }
        this.showMsg('Topic deleted', 'success');
      },
      error: () => this.showMsg('Failed to delete topic', 'error')
    });
  }

  selectTopic(topic: any): void {
    this.selectedTopic.set(topic);
    this.http.get<any[]>(`${BASE}/topics/${topic.id}/questions`).subscribe({
      next: q => this.questions.set(q),
      error: () => {}
    });
  }

  createQuestion(): void {
    const topic = this.selectedTopic();
    if (!topic) return;
    const { questionText, optionsJson, correctOptionId, difficultyWeight } = this.questionForm.value;
    this.http.post<any>(`${BASE}/topics/${topic.id}/questions`, {
      topicId: topic.id, questionText, type: 'MCQ',
      optionsJson, correctOptionId, difficultyWeight: Number(difficultyWeight)
    }).subscribe({
      next: q => {
        this.questions.update(list => [...list, q]);
        this.questionForm.reset({ questionText: '', optionsJson: '', correctOptionId: '', difficultyWeight: 2 });
        this.showMsg('Question added', 'success');
      },
      error: () => this.showMsg('Failed to add question — check JSON format', 'error')
    });
  }

  deleteQuestion(id: number): void {
    this.http.delete(`${BASE}/questions/${id}`).subscribe({
      next: () => { this.questions.update(list => list.filter(q => q.id !== id)); this.showMsg('Deleted', 'success'); },
      error: () => this.showMsg('Failed to delete', 'error')
    });
  }

  private showMsg(msg: string, type: 'success' | 'error'): void {
    this.message.set(msg); this.messageType.set(type);
    setTimeout(() => this.message.set(null), 3000);
  }
}
