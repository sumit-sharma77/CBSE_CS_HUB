import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-LG47JR2W.js";
import {
  StorageService
} from "./chunk-UZIXFQP3.js";
import {
  Component,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XM2PN737.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-OCBFZOLU.js";

// src/app/features/notes/notes.ts
var _forTrack0 = ($index, $item) => $item.id;
function Notes_Conditional_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function Notes_Conditional_1_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.exportAll());
    });
    \u0275\u0275text(1, " Export ");
    \u0275\u0275elementEnd();
  }
}
function Notes_Conditional_1_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "p", 13);
    \u0275\u0275text(2, "\u{1F4DD}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 14);
    \u0275\u0275text(4, "No notes yet");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 15);
    \u0275\u0275text(6, 'Tap "+ New Note" to create your first note');
    \u0275\u0275elementEnd()();
  }
}
function Notes_Conditional_1_Conditional_9_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1('No notes match "', ctx_r2.searchQuery(), '"');
  }
}
function Notes_Conditional_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275conditionalCreate(1, Notes_Conditional_1_Conditional_9_Conditional_1_Template, 7, 0, "div", 12)(2, Notes_Conditional_1_Conditional_9_Conditional_2_Template, 2, 1, "p");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.notes().length === 0 ? 1 : 2);
  }
}
function Notes_Conditional_1_For_12_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "button", 24);
    \u0275\u0275listener("click", function Notes_Conditional_1_For_12_Conditional_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r6);
      const note_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.confirmDelete(note_r5.id));
    });
    \u0275\u0275text(2, " Delete ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 25);
    \u0275\u0275listener("click", function Notes_Conditional_1_For_12_Conditional_10_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.deleteConfirm.set(null));
    });
    \u0275\u0275text(4, " Cancel ");
    \u0275\u0275elementEnd()();
  }
}
function Notes_Conditional_1_For_12_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function Notes_Conditional_1_For_12_Conditional_11_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const note_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deleteConfirm.set(note_r5.id));
    });
    \u0275\u0275text(1, " \u{1F5D1}\uFE0F ");
    \u0275\u0275elementEnd();
  }
}
function Notes_Conditional_1_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 16)(2, "button", 17);
    \u0275\u0275listener("click", function Notes_Conditional_1_For_12_Template_button_click_2_listener() {
      const note_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.openNote(note_r5));
    });
    \u0275\u0275elementStart(3, "h3", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 19);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 20);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 21);
    \u0275\u0275conditionalCreate(10, Notes_Conditional_1_For_12_Conditional_10_Template, 5, 0, "div", 22)(11, Notes_Conditional_1_For_12_Conditional_11_Template, 2, 0, "button", 23);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const note_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("aria-label", "Open note: " + note_r5.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(note_r5.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Updated ", ctx_r2.formatDate(note_r5.updatedAt), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", note_r5.content, " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.deleteConfirm() === note_r5.id ? 10 : 11);
  }
}
function Notes_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "h1", 3);
    \u0275\u0275text(2, "My Notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 4);
    \u0275\u0275conditionalCreate(4, Notes_Conditional_1_Conditional_4_Template, 2, 0, "button", 5);
    \u0275\u0275elementStart(5, "button", 6);
    \u0275\u0275listener("click", function Notes_Conditional_1_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.createNote());
    });
    \u0275\u0275text(6, " + New Note ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(7, "div", 7)(8, "input", 8);
    \u0275\u0275listener("ngModelChange", function Notes_Conditional_1_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.searchQuery.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, Notes_Conditional_1_Conditional_9_Template, 3, 1, "div", 9);
    \u0275\u0275elementStart(10, "div", 1);
    \u0275\u0275repeaterCreate(11, Notes_Conditional_1_For_12_Template, 12, 5, "div", 10, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.notes().length > 0 ? 4 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r2.searchQuery());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.filteredNotes().length === 0 ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.filteredNotes());
  }
}
function Notes_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "button", 27);
    \u0275\u0275listener("click", function Notes_Conditional_2_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.closeEditor());
    });
    \u0275\u0275text(3, " \u2190 Back ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 28);
    \u0275\u0275text(5, " \u2713 Saved ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "textarea", 29);
    \u0275\u0275listener("ngModelChange", function Notes_Conditional_2_Template_textarea_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onContentChange($event));
    });
    \u0275\u0275text(7, "          ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275classProp("opacity-0", !ctx_r2.savedIndicator());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r2.editContent());
  }
}
var STORAGE_KEY = "cbse-notes";
function generateId() {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2);
}
var Notes = class _Notes {
  storage = inject(StorageService);
  notes = signal(this.storage.get(STORAGE_KEY) ?? [], ...ngDevMode ? [{ debugName: "notes" }] : (
    /* istanbul ignore next */
    []
  ));
  searchQuery = signal("", ...ngDevMode ? [{ debugName: "searchQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  editingNote = signal(null, ...ngDevMode ? [{ debugName: "editingNote" }] : (
    /* istanbul ignore next */
    []
  ));
  editContent = signal("", ...ngDevMode ? [{ debugName: "editContent" }] : (
    /* istanbul ignore next */
    []
  ));
  deleteConfirm = signal(null, ...ngDevMode ? [{ debugName: "deleteConfirm" }] : (
    /* istanbul ignore next */
    []
  ));
  savedIndicator = signal(false, ...ngDevMode ? [{ debugName: "savedIndicator" }] : (
    /* istanbul ignore next */
    []
  ));
  saveTimer = null;
  filteredNotes = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const sorted = [...this.notes()].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return q ? sorted.filter((n) => n.content.toLowerCase().includes(q)) : sorted;
  }, ...ngDevMode ? [{ debugName: "filteredNotes" }] : (
    /* istanbul ignore next */
    []
  ));
  createNote() {
    const note = {
      id: generateId(),
      title: "New Note",
      content: "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.notes.set([note, ...this.notes()]);
    this.storage.set(STORAGE_KEY, this.notes());
    this.openNote(note);
  }
  openNote(note) {
    this.editingNote.set(note);
    this.editContent.set(note.content);
  }
  onContentChange(value) {
    this.editContent.set(value);
    if (this.saveTimer)
      clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.autoSave(value), 2e3);
  }
  autoSave(content) {
    const current = this.editingNote();
    if (!current)
      return;
    const title = content.split("\n")[0].trim().slice(0, 60) || "Untitled";
    const updated = __spreadProps(__spreadValues({}, current), { title, content, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
    this.editingNote.set(updated);
    this.notes.set(this.notes().map((n) => n.id === updated.id ? updated : n));
    this.storage.set(STORAGE_KEY, this.notes());
    this.savedIndicator.set(true);
    setTimeout(() => this.savedIndicator.set(false), 2e3);
  }
  closeEditor() {
    if (this.editContent() !== this.editingNote()?.content) {
      this.autoSave(this.editContent());
    }
    this.editingNote.set(null);
    if (this.saveTimer)
      clearTimeout(this.saveTimer);
  }
  confirmDelete(id) {
    this.notes.set(this.notes().filter((n) => n.id !== id));
    this.storage.set(STORAGE_KEY, this.notes());
    this.deleteConfirm.set(null);
  }
  exportAll() {
    const content = this.notes().sort((a2, b) => new Date(b.updatedAt).getTime() - new Date(a2.updatedAt).getTime()).map((n) => `=== ${n.title} ===
Updated: ${new Date(n.updatedAt).toLocaleString()}

${n.content}`).join("\n\n" + "\u2500".repeat(40) + "\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-cbse-notes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  }
  static \u0275fac = function Notes_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Notes)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Notes, selectors: [["app-notes"]], decls: 3, vars: 1, consts: [[1, "space-y-4"], [1, "space-y-3"], [1, "flex", "items-center", "justify-between"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "flex", "gap-2"], ["aria-label", "Export all notes", 1, "text-sm", "px-3", "py-1.5", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "text-gray-600", "dark:text-gray-300", "hover:bg-gray-50", "dark:hover:bg-gray-800"], ["aria-label", "Create new note", 1, "text-sm", "px-3", "py-1.5", "rounded-lg", "bg-indigo-600", "text-white", "hover:bg-indigo-700", 3, "click"], [1, "relative"], ["type", "search", "placeholder", "Search notes\u2026", "aria-label", "Search notes", 1, "w-full", "pl-4", "pr-4", "py-2", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "ngModelChange", "ngModel"], [1, "text-center", "py-16", "text-gray-400", "dark:text-gray-500"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4"], ["aria-label", "Export all notes", 1, "text-sm", "px-3", "py-1.5", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "text-gray-600", "dark:text-gray-300", "hover:bg-gray-50", "dark:hover:bg-gray-800", 3, "click"], [1, "space-y-2"], [1, "text-4xl"], [1, "font-medium"], [1, "text-sm"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "flex-1", "text-left", 3, "click"], [1, "font-semibold", "text-gray-900", "dark:text-gray-100", "truncate"], [1, "text-xs", "text-gray-400", "dark:text-gray-500", "mt-0.5"], [1, "text-sm", "text-gray-600", "dark:text-gray-400", "mt-1", "line-clamp-2"], [1, "flex", "items-center", "gap-1"], [1, "flex", "gap-1"], ["aria-label", "Delete note", 1, "p-1.5", "text-gray-400", "hover:text-red-500", "dark:hover:text-red-400", "transition-colors"], ["aria-label", "Confirm delete", 1, "text-xs", "px-2", "py-1", "rounded", "bg-red-500", "text-white", "hover:bg-red-600", 3, "click"], ["aria-label", "Cancel delete", 1, "text-xs", "px-2", "py-1", "rounded", "bg-gray-200", "dark:bg-gray-700", "text-gray-700", "dark:text-gray-300", 3, "click"], ["aria-label", "Delete note", 1, "p-1.5", "text-gray-400", "hover:text-red-500", "dark:hover:text-red-400", "transition-colors", 3, "click"], ["aria-label", "Back to notes list", 1, "flex", "items-center", "gap-1", "text-sm", "text-indigo-600", "dark:text-indigo-400", "hover:underline", 3, "click"], [1, "text-xs", "text-green-600", "dark:text-green-400"], ["placeholder", "Start writing your note\u2026", "aria-label", "Note content editor", 1, "w-full", "min-h-[60vh]", "p-4", "rounded-xl", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "text-sm", "resize-none", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "leading-relaxed", 3, "ngModelChange", "ngModel"]], template: function Notes_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, Notes_Conditional_1_Template, 13, 3)(2, Notes_Conditional_2_Template, 8, 3, "div", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.editingNote() ? 1 : 2);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Notes, [{
    type: Component,
    args: [{
      selector: "app-notes",
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
                 placeholder="Search notes\u2026"
                 class="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 aria-label="Search notes">
        </div>

        @if (filteredNotes().length === 0) {
          <div class="text-center py-16 text-gray-400 dark:text-gray-500">
            @if (notes().length === 0) {
              <div class="space-y-2">
                <p class="text-4xl">\u{1F4DD}</p>
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
                      \u{1F5D1}\uFE0F
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
              \u2190 Back
            </button>
            <span class="text-xs text-green-600 dark:text-green-400" [class.opacity-0]="!savedIndicator()">
              \u2713 Saved
            </span>
          </div>
          <textarea
            [ngModel]="editContent()"
            (ngModelChange)="onContentChange($event)"
            placeholder="Start writing your note\u2026"
            class="w-full min-h-[60vh] p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            aria-label="Note content editor">
          </textarea>
        </div>
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Notes, { className: "Notes", filePath: "src/app/features/notes/notes.ts", lineNumber: 135 });
})();
export {
  Notes
};
//# sourceMappingURL=chunk-JF5F2WQ5.js.map
