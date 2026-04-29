import {
  CodeBlock
} from "./chunk-J4GI6IZO.js";
import {
  BookmarkBtn
} from "./chunk-U3DUJTCO.js";
import "./chunk-RHQIL3TT.js";
import {
  ProgressBar
} from "./chunk-OXNAOHKG.js";
import {
  ProgressService
} from "./chunk-JEU24C5L.js";
import {
  ActivatedRoute
} from "./chunk-S2RS62IU.js";
import {
  HttpClient
} from "./chunk-BVJZPSLF.js";
import "./chunk-UZIXFQP3.js";
import {
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
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
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/python-practice/exercise-list/exercise-list.ts
var _forTrack0 = ($index, $item) => $item.value;
var _forTrack1 = ($index, $item) => $item.id;
function PythonExerciseList_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 10);
    \u0275\u0275listener("click", function PythonExerciseList_For_6_Template_button_click_0_listener() {
      const f_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.diffFilter.set(f_r2.value));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("bg-indigo-600", ctx_r2.diffFilter() === f_r2.value)("text-white", ctx_r2.diffFilter() === f_r2.value)("bg-gray-100", ctx_r2.diffFilter() !== f_r2.value)("dark:bg-gray-800", ctx_r2.diffFilter() !== f_r2.value);
    \u0275\u0275attribute("aria-label", "Filter " + f_r2.label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", f_r2.label, " ");
  }
}
function PythonExerciseList_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275text(1, "Loading exercises\u2026");
    \u0275\u0275elementEnd();
  }
}
function PythonExerciseList_For_11_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-code-block", 17);
  }
  if (rf & 2) {
    const ex_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("code", ex_r4.codeSnippet);
  }
}
function PythonExerciseList_For_11_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function PythonExerciseList_For_11_Conditional_12_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ex_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.reveal(ex_r4));
    });
    \u0275\u0275text(1, " Show Solution ");
    \u0275\u0275elementEnd();
  }
}
function PythonExerciseList_For_11_Conditional_13_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-code-block", 17);
  }
  if (rf & 2) {
    const ex_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("code", ex_r4.annotatedCode);
  }
}
function PythonExerciseList_For_11_Conditional_13_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ex_r4 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" Output: ", ex_r4.answer, " ");
  }
}
function PythonExerciseList_For_11_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PythonExerciseList_For_11_Conditional_13_Conditional_0_Template, 1, 1, "app-code-block", 17)(1, PythonExerciseList_For_11_Conditional_13_Conditional_1_Template, 2, 1, "div", 20);
    \u0275\u0275elementStart(2, "p", 21);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ex_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(ex_r4.annotatedCode ? 0 : 1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("\u{1F4A1} ", ex_r4.explanation);
  }
}
function PythonExerciseList_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 11)(2, "div", 12)(3, "div", 13)(4, "span", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 14);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p", 15);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(10, "app-bookmark-btn", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, PythonExerciseList_For_11_Conditional_11_Template, 1, 1, "app-code-block", 17);
    \u0275\u0275conditionalCreate(12, PythonExerciseList_For_11_Conditional_12_Template, 2, 0, "button", 18)(13, PythonExerciseList_For_11_Conditional_13_Template, 4, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ex_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r2.typeClass(ex_r4.type));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r2.typeLabel(ex_r4.type), " ");
    \u0275\u0275advance();
    \u0275\u0275classMap(ctx_r2.diffClass(ex_r4.difficulty));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ex_r4.difficulty, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ex_r4.questionText);
    \u0275\u0275advance();
    \u0275\u0275property("itemId", ex_r4.id)("title", ex_r4.questionText.slice(0, 60));
    \u0275\u0275advance();
    \u0275\u0275conditional(ex_r4.codeSnippet ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.revealed().has(ex_r4.id) ? 12 : 13);
  }
}
function PythonExerciseList_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "span", 22);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" \u{1F389} You completed ", ctx_r2.visibleExercises().length, "/", ctx_r2.visibleExercises().length, " exercises in this topic! ");
  }
}
var PythonExerciseList = class _PythonExerciseList {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  progressService = inject(ProgressService);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  exercises = signal([], ...ngDevMode ? [{ debugName: "exercises" }] : (
    /* istanbul ignore next */
    []
  ));
  revealed = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "revealed" }] : (
    /* istanbul ignore next */
    []
  ));
  diffFilter = signal("all", ...ngDevMode ? [{ debugName: "diffFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  topicKey = "";
  filters = [
    { label: "All", value: "all" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" }
  ];
  topic = signal("", ...ngDevMode ? [{ debugName: "topic" }] : (
    /* istanbul ignore next */
    []
  ));
  progressData() {
    return this.progressService.getCategoryProgress("python", this.topicKey)();
  }
  visibleExercises() {
    const f = this.diffFilter();
    return f === "all" ? this.exercises() : this.exercises().filter((e) => e.difficulty === f);
  }
  allRevealed() {
    const visible = this.visibleExercises();
    return visible.length > 0 && visible.every((e) => this.revealed().has(e.id));
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.topicKey = params.get("topic") ?? "";
      this.topic.set(this.topicKey.replace(/-/g, " "));
      this.load();
    });
  }
  load() {
    this.loading.set(true);
    this.http.get(`assets/content/python-exercises/${this.topicKey}.json`).subscribe({
      next: (exercises) => {
        this.exercises.set(exercises);
        this.progressService.updateTotal("python", this.topicKey, exercises.length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  reveal(ex) {
    const next = new Set(this.revealed());
    next.add(ex.id);
    this.revealed.set(next);
    this.progressService.recordAttempt("python", this.topicKey, ex.id);
  }
  typeLabel(type) {
    const map = {
      "output-based": "Output",
      "logic": "Logic",
      "coding": "Coding"
    };
    return map[type] ?? type;
  }
  typeClass(type) {
    const map = {
      "output-based": "border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400",
      "logic": "border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-400",
      "coding": "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
    };
    return map[type] ?? "";
  }
  diffClass(d) {
    return d === "beginner" ? "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400" : "border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-400";
  }
  static \u0275fac = function PythonExerciseList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PythonExerciseList)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PythonExerciseList, selectors: [["app-python-exercise-list"]], decls: 13, vars: 6, consts: [[1, "space-y-4"], [1, "flex", "items-center", "justify-between", "flex-wrap", "gap-2"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-gray-100", "capitalize"], [1, "flex", "gap-2"], [1, "text-xs", "px-3", "py-1.5", "rounded-full", "font-medium", "transition-colors", 3, "bg-indigo-600", "text-white", "bg-gray-100", "dark:bg-gray-800"], [1, "sticky", "top-14", "z-10", "bg-white", "dark:bg-gray-950", "pt-1", "pb-2"], [3, "attempted", "total", "percentage"], [1, "text-center", "py-12", "text-gray-500", "dark:text-gray-400"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "space-y-3"], [1, "text-center", "py-4", "bg-indigo-50", "dark:bg-indigo-900/20", "rounded-xl", "border", "border-indigo-100", "dark:border-indigo-800"], [1, "text-xs", "px-3", "py-1.5", "rounded-full", "font-medium", "transition-colors", 3, "click"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "flex-1"], [1, "flex", "flex-wrap", "gap-1.5", "mb-2"], [1, "text-xs", "px-2", "py-0.5", "rounded-full", "border"], [1, "text-sm", "text-gray-800", "dark:text-gray-200"], ["type", "python-exercise", 3, "itemId", "title"], ["language", "python", 3, "code"], ["aria-label", "Show solution", 1, "w-full", "py-2", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "text-sm", "font-medium", "hover:bg-indigo-700", "transition-colors"], ["aria-label", "Show solution", 1, "w-full", "py-2", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "text-sm", "font-medium", "hover:bg-indigo-700", "transition-colors", 3, "click"], [1, "bg-green-50", "dark:bg-green-900/20", "border", "border-green-200", "dark:border-green-800", "rounded-lg", "p-3", "text-sm", "font-mono", "text-green-800", "dark:text-green-300"], [1, "text-sm", "text-gray-600", "dark:text-gray-400", "leading-relaxed"], [1, "text-indigo-700", "dark:text-indigo-300", "font-medium"]], template: function PythonExerciseList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 3);
      \u0275\u0275repeaterCreate(5, PythonExerciseList_For_6_Template, 2, 10, "button", 4, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 5);
      \u0275\u0275element(8, "app-progress-bar", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(9, PythonExerciseList_Conditional_9_Template, 2, 0, "div", 7);
      \u0275\u0275repeaterCreate(10, PythonExerciseList_For_11_Template, 14, 11, "div", 8, _forTrack1);
      \u0275\u0275conditionalCreate(12, PythonExerciseList_Conditional_12_Template, 3, 2, "div", 9);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.topic(), " Exercises ");
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.filters);
      \u0275\u0275advance(3);
      \u0275\u0275property("attempted", ctx.progressData().attempted)("total", ctx.progressData().total)("percentage", ctx.progressData().percentage);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.visibleExercises());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.allRevealed() && ctx.visibleExercises().length > 0 ? 12 : -1);
    }
  }, dependencies: [CodeBlock, BookmarkBtn, ProgressBar], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PythonExerciseList, [{
    type: Component,
    args: [{
      selector: "app-python-exercise-list",
      standalone: true,
      imports: [CodeBlock, BookmarkBtn, ProgressBar],
      template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
          {{ topic() }} Exercises
        </h1>
        <div class="flex gap-2">
          @for (f of filters; track f.value) {
            <button (click)="diffFilter.set(f.value)"
                    [class.bg-indigo-600]="diffFilter() === f.value"
                    [class.text-white]="diffFilter() === f.value"
                    [class.bg-gray-100]="diffFilter() !== f.value"
                    [class.dark:bg-gray-800]="diffFilter() !== f.value"
                    class="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                    [attr.aria-label]="'Filter ' + f.label">
              {{ f.label }}
            </button>
          }
        </div>
      </div>

      <!-- Sticky progress -->
      <div class="sticky top-14 z-10 bg-white dark:bg-gray-950 pt-1 pb-2">
        <app-progress-bar
          [attempted]="progressData().attempted"
          [total]="progressData().total"
          [percentage]="progressData().percentage">
        </app-progress-bar>
      </div>

      @if (loading()) {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Loading exercises\u2026</div>
      }

      @for (ex of visibleExercises(); track ex.id) {
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span class="text-xs px-2 py-0.5 rounded-full border"
                      [class]="typeClass(ex.type)">
                  {{ typeLabel(ex.type) }}
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full border"
                      [class]="diffClass(ex.difficulty)">
                  {{ ex.difficulty }}
                </span>
              </div>
              <p class="text-sm text-gray-800 dark:text-gray-200">{{ ex.questionText }}</p>
            </div>
            <app-bookmark-btn type="python-exercise"
                              [itemId]="ex.id"
                              [title]="ex.questionText.slice(0, 60)">
            </app-bookmark-btn>
          </div>

          <!-- Code snippet for output-based questions -->
          @if (ex.codeSnippet) {
            <app-code-block language="python" [code]="ex.codeSnippet"></app-code-block>
          }

          @if (!revealed().has(ex.id)) {
            <button (click)="reveal(ex)"
                    class="w-full py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                    aria-label="Show solution">
              Show Solution
            </button>
          } @else {
            @if (ex.annotatedCode) {
              <app-code-block language="python" [code]="ex.annotatedCode"></app-code-block>
            } @else {
              <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm font-mono text-green-800 dark:text-green-300">
                Output: {{ ex.answer }}
              </div>
            }
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">\u{1F4A1} {{ ex.explanation }}</p>
          }
        </div>
      }

      @if (allRevealed() && visibleExercises().length > 0) {
        <div class="text-center py-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
          <span class="text-indigo-700 dark:text-indigo-300 font-medium">
            \u{1F389} You completed {{ visibleExercises().length }}/{{ visibleExercises().length }} exercises in this topic!
          </span>
        </div>
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PythonExerciseList, { className: "PythonExerciseList", filePath: "src/app/features/python-practice/exercise-list/exercise-list.ts", lineNumber: 115 });
})();
export {
  PythonExerciseList
};
//# sourceMappingURL=chunk-TMFDZRB4.js.map
