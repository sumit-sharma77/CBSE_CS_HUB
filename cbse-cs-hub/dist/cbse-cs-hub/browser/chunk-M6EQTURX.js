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
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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

// src/app/features/sql-practice/question-list/question-list.ts
var _forTrack0 = ($index, $item) => $item.id;
function SqlQuestionList_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275text(1, "Loading questions\u2026");
    \u0275\u0275elementEnd();
  }
}
function SqlQuestionList_For_10_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const q_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" CBSE ", q_r1.year, "", q_r1.marks ? " \xB7 " + q_r1.marks + " marks" : "", " ");
  }
}
function SqlQuestionList_For_10_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 17);
    \u0275\u0275listener("click", function SqlQuestionList_For_10_Conditional_10_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const q_r1 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.reveal(q_r1));
    });
    \u0275\u0275text(1, " Show Answer ");
    \u0275\u0275elementEnd();
  }
}
function SqlQuestionList_For_10_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-code-block", 18);
    \u0275\u0275elementStart(1, "p", 19);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const q_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("code", q_r1.answer);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("\u{1F4D6} ", q_r1.explanation);
  }
}
function SqlQuestionList_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "div", 9)(2, "div", 10)(3, "div", 11)(4, "span", 12);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, SqlQuestionList_For_10_Conditional_6_Template, 2, 2, "span", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 14);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(9, "app-bookmark-btn", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, SqlQuestionList_For_10_Conditional_10_Template, 2, 0, "button", 16)(11, SqlQuestionList_For_10_Conditional_11_Template, 3, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const q_r1 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275classMap(ctx_r2.difficultyClass(q_r1.difficulty));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", q_r1.difficulty, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(q_r1.isPreviousYear ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(q_r1.questionText);
    \u0275\u0275advance();
    \u0275\u0275property("itemId", q_r1.id)("title", q_r1.questionText.slice(0, 60));
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.revealed().has(q_r1.id) ? 10 : 11);
  }
}
function SqlQuestionList_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "No questions found.");
    \u0275\u0275elementEnd();
  }
}
var SqlQuestionList = class _SqlQuestionList {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  progressService = inject(ProgressService);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  questions = signal([], ...ngDevMode ? [{ debugName: "questions" }] : (
    /* istanbul ignore next */
    []
  ));
  revealed = signal(/* @__PURE__ */ new Set(), ...ngDevMode ? [{ debugName: "revealed" }] : (
    /* istanbul ignore next */
    []
  ));
  pyqOnly = signal(false, ...ngDevMode ? [{ debugName: "pyqOnly" }] : (
    /* istanbul ignore next */
    []
  ));
  visibleQuestions = computed(() => {
    const pyqOnly = this.pyqOnly();
    return pyqOnly ? this.questions().filter((q) => q.isPreviousYear) : this.questions();
  }, ...ngDevMode ? [{ debugName: "visibleQuestions" }] : (
    /* istanbul ignore next */
    []
  ));
  category = "";
  categoryLabel() {
    return this.category.replace(/-/g, " ");
  }
  progressData() {
    return this.progressService.getCategoryProgress("sql", this.category)();
  }
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get("category") ?? "";
      this.load();
    });
  }
  load() {
    this.loading.set(true);
    this.http.get(`assets/content/sql-questions/${this.category}.json`).subscribe({
      next: (qs) => {
        this.questions.set(qs);
        this.progressService.updateTotal("sql", this.category, qs.length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  reveal(q) {
    const next = new Set(this.revealed());
    next.add(q.id);
    this.revealed.set(next);
    this.progressService.recordAttempt("sql", this.category, q.id);
  }
  difficultyClass(d) {
    const map = {
      easy: "border-green-300 text-green-700 dark:border-green-700 dark:text-green-400",
      medium: "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400",
      hard: "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
    };
    return map[d] ?? "";
  }
  static \u0275fac = function SqlQuestionList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SqlQuestionList)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SqlQuestionList, selectors: [["app-sql-question-list"]], decls: 12, vars: 15, consts: [[1, "space-y-4"], [1, "flex", "items-center", "justify-between"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-gray-100", "capitalize"], ["aria-label", "Toggle Previous Year filter", 1, "text-xs", "px-3", "py-1.5", "rounded-full", "font-medium", "transition-colors", 3, "click"], [1, "sticky", "top-14", "z-10", "bg-white", "dark:bg-gray-950", "pt-1", "pb-2"], [3, "attempted", "total", "percentage"], [1, "text-center", "py-12", "text-gray-500", "dark:text-gray-400"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "space-y-3"], [1, "text-center", "py-8", "text-gray-400", "dark:text-gray-500"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "flex-1"], [1, "flex", "flex-wrap", "gap-1.5", "mb-2"], [1, "text-xs", "px-2", "py-0.5", "rounded-full", "border"], [1, "text-xs", "px-2", "py-0.5", "rounded-full", "bg-amber-100", "dark:bg-amber-900/40", "text-amber-700", "dark:text-amber-300"], [1, "text-sm", "text-gray-800", "dark:text-gray-200", "leading-relaxed"], ["type", "sql-question", 3, "itemId", "title"], ["aria-label", "Show answer", 1, "w-full", "py-2", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "text-sm", "font-medium", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "transition-colors"], ["aria-label", "Show answer", 1, "w-full", "py-2", "rounded-lg", "bg-indigo-600", "dark:bg-indigo-500", "text-white", "text-sm", "font-medium", "hover:bg-indigo-700", "dark:hover:bg-indigo-600", "transition-colors", 3, "click"], ["language", "sql", 3, "code"], [1, "text-sm", "text-gray-600", "dark:text-gray-400", "leading-relaxed"]], template: function SqlQuestionList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "button", 3);
      \u0275\u0275listener("click", function SqlQuestionList_Template_button_click_4_listener() {
        return ctx.pyqOnly.set(!ctx.pyqOnly());
      });
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4);
      \u0275\u0275element(7, "app-progress-bar", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(8, SqlQuestionList_Conditional_8_Template, 2, 0, "div", 6);
      \u0275\u0275repeaterCreate(9, SqlQuestionList_For_10_Template, 12, 8, "div", 7, _forTrack0);
      \u0275\u0275conditionalCreate(11, SqlQuestionList_Conditional_11_Template, 2, 0, "div", 8);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.categoryLabel(), " ");
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-amber-500", ctx.pyqOnly())("text-white", ctx.pyqOnly())("bg-gray-100", !ctx.pyqOnly())("dark:bg-gray-800", !ctx.pyqOnly());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.pyqOnly() ? "\u2713 PYQ Only" : "PYQ Only", " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("attempted", ctx.progressData().attempted)("total", ctx.progressData().total)("percentage", ctx.progressData().percentage);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.visibleQuestions());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.visibleQuestions().length === 0 && !ctx.loading() ? 11 : -1);
    }
  }, dependencies: [CodeBlock, BookmarkBtn, ProgressBar], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SqlQuestionList, [{
    type: Component,
    args: [{
      selector: "app-sql-question-list",
      standalone: true,
      imports: [CodeBlock, BookmarkBtn, ProgressBar],
      template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
          {{ categoryLabel() }}
        </h1>
        <button (click)="pyqOnly.set(!pyqOnly())"
                [class.bg-amber-500]="pyqOnly()"
                [class.text-white]="pyqOnly()"
                [class.bg-gray-100]="!pyqOnly()"
                [class.dark:bg-gray-800]="!pyqOnly()"
                class="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                aria-label="Toggle Previous Year filter">
          {{ pyqOnly() ? '\u2713 PYQ Only' : 'PYQ Only' }}
        </button>
      </div>

      <!-- Sticky progress bar -->
      <div class="sticky top-14 z-10 bg-white dark:bg-gray-950 pt-1 pb-2">
        <app-progress-bar
          [attempted]="progressData().attempted"
          [total]="progressData().total"
          [percentage]="progressData().percentage">
        </app-progress-bar>
      </div>

      @if (loading()) {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Loading questions\u2026</div>
      }

      @for (q of visibleQuestions(); track q.id) {
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <!-- Header -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <div class="flex flex-wrap gap-1.5 mb-2">
                <span class="text-xs px-2 py-0.5 rounded-full border"
                      [class]="difficultyClass(q.difficulty)">
                  {{ q.difficulty }}
                </span>
                @if (q.isPreviousYear) {
                  <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                    CBSE {{ q.year }}{{ q.marks ? ' \xB7 ' + q.marks + ' marks' : '' }}
                  </span>
                }
              </div>
              <p class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{{ q.questionText }}</p>
            </div>
            <app-bookmark-btn type="sql-question"
                              [itemId]="q.id"
                              [title]="q.questionText.slice(0, 60)">
            </app-bookmark-btn>
          </div>

          <!-- Show Answer toggle -->
          @if (!revealed().has(q.id)) {
            <button (click)="reveal(q)"
                    class="w-full py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                    aria-label="Show answer">
              Show Answer
            </button>
          } @else {
            <app-code-block language="sql" [code]="q.answer"></app-code-block>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">\u{1F4D6} {{ q.explanation }}</p>
          }
        </div>
      }

      @if (visibleQuestions().length === 0 && !loading()) {
        <div class="text-center py-8 text-gray-400 dark:text-gray-500">No questions found.</div>
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SqlQuestionList, { className: "SqlQuestionList", filePath: "src/app/features/sql-practice/question-list/question-list.ts", lineNumber: 99 });
})();
export {
  SqlQuestionList
};
//# sourceMappingURL=chunk-M6EQTURX.js.map
