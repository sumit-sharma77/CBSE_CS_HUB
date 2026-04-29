import {
  McqProgressService
} from "./chunk-7MFXBZF3.js";
import {
  RouterLink
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
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/mcq/category-list/category-list.ts
var _c0 = () => [1, 2, 3];
var _c1 = (a0) => ["/mcq", a0];
var _forTrack0 = ($index, $item) => $item.id;
function McqCategoryList_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "span", 5);
    \u0275\u0275text(2, "\u{1F3C6}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "p", 6);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 7);
    \u0275\u0275text(7, "across all quiz sets");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 8)(9, "p", 9);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 10);
    \u0275\u0275text(12, "accuracy");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", ctx_r0.totalCorrect(), " correct out of ", ctx_r0.totalAttempted(), " attempted ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r0.overallPercent(), "%");
  }
}
function McqCategoryList_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 11);
  }
}
function McqCategoryList_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275repeaterCreate(1, McqCategoryList_Conditional_7_For_2_Template, 1, 0, "div", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
  }
}
function McqCategoryList_Conditional_8_For_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1, "\u2713 Completed");
    \u0275\u0275elementEnd();
  }
}
function McqCategoryList_Conditional_8_For_5_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1, "In Progress");
    \u0275\u0275elementEnd();
  }
}
function McqCategoryList_Conditional_8_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 14)(1, "div", 16)(2, "div", 17)(3, "span", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 19)(6, "div", 20)(7, "h3", 21);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, McqCategoryList_Conditional_8_For_5_Conditional_9_Template, 2, 0, "span", 22)(10, McqCategoryList_Conditional_8_For_5_Conditional_10_Template, 2, 0, "span", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 24);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 25)(14, "div", 26);
    \u0275\u0275element(15, "div", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 28);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "span", 29);
    \u0275\u0275text(19, "\u203A");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const set_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(11, _c1, set_r2.id));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(set_r2.icon);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(set_r2.topic);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isCompleted(set_r2.id) ? 9 : ctx_r0.isStarted(set_r2.id) ? 10 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(set_r2.description);
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r0.getProgressBarClass(set_r2.id));
    \u0275\u0275styleProp("width", ctx_r0.getSetPercent(set_r2.id), "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ctx_r0.getAnsweredCount(set_r2.id), "/", set_r2.totalQuestions, " ");
  }
}
function McqCategoryList_Conditional_8_For_11_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1, "\u2713 Completed");
    \u0275\u0275elementEnd();
  }
}
function McqCategoryList_Conditional_8_For_11_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1, "In Progress");
    \u0275\u0275elementEnd();
  }
}
function McqCategoryList_Conditional_8_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 14)(1, "div", 30)(2, "div", 17)(3, "span", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 19)(6, "div", 20)(7, "h3", 21);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, McqCategoryList_Conditional_8_For_11_Conditional_9_Template, 2, 0, "span", 22)(10, McqCategoryList_Conditional_8_For_11_Conditional_10_Template, 2, 0, "span", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 24);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 25)(14, "div", 26);
    \u0275\u0275element(15, "div", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 28);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "span", 31);
    \u0275\u0275text(19, "\u203A");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const set_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(11, _c1, set_r3.id));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(set_r3.icon);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(set_r3.topic);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isCompleted(set_r3.id) ? 9 : ctx_r0.isStarted(set_r3.id) ? 10 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(set_r3.description);
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r0.getProgressBarClass(set_r3.id));
    \u0275\u0275styleProp("width", ctx_r0.getSetPercent(set_r3.id), "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ctx_r0.getAnsweredCount(set_r3.id), "/", set_r3.totalQuestions, " ");
  }
}
function McqCategoryList_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4)(1, "h2", 12)(2, "span", 13);
    \u0275\u0275text(3, "Class 12");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(4, McqCategoryList_Conditional_8_For_5_Template, 20, 13, "a", 14, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "section", 4)(7, "h2", 12)(8, "span", 15);
    \u0275\u0275text(9, "Class 11");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(10, McqCategoryList_Conditional_8_For_11_Template, 20, 13, "a", 14, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.class12Sets());
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r0.class11Sets());
  }
}
var McqCategoryList = class _McqCategoryList {
  http = inject(HttpClient);
  mcqProgress = inject(McqProgressService);
  allSets = signal([], ...ngDevMode ? [{ debugName: "allSets" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  class12Sets = signal([], ...ngDevMode ? [{ debugName: "class12Sets" }] : (
    /* istanbul ignore next */
    []
  ));
  class11Sets = signal([], ...ngDevMode ? [{ debugName: "class11Sets" }] : (
    /* istanbul ignore next */
    []
  ));
  totalAttempted = signal(0, ...ngDevMode ? [{ debugName: "totalAttempted" }] : (
    /* istanbul ignore next */
    []
  ));
  totalCorrect = signal(0, ...ngDevMode ? [{ debugName: "totalCorrect" }] : (
    /* istanbul ignore next */
    []
  ));
  overallPercent = signal(0, ...ngDevMode ? [{ debugName: "overallPercent" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.http.get("/CBSE_CS_HUB/assets/content/mcq/mcq-index.json").subscribe({
      next: (sets) => {
        this.allSets.set(sets);
        this.class12Sets.set(sets.filter((s) => s.classLevel === 12));
        this.class11Sets.set(sets.filter((s) => s.classLevel === 11));
        this.loading.set(false);
        this.computeTotals(sets);
      },
      error: () => this.loading.set(false)
    });
  }
  computeTotals(sets) {
    const prog = this.mcqProgress.progress();
    let attempted = 0;
    let correct = 0;
    for (const set of sets) {
      const session = prog[set.id];
      if (session) {
        attempted += Object.keys(session.answers).length;
        correct += session.score;
      }
    }
    this.totalAttempted.set(attempted);
    this.totalCorrect.set(correct);
    this.overallPercent.set(attempted > 0 ? Math.round(correct / attempted * 100) : 0);
  }
  getAnsweredCount(setId) {
    const session = this.mcqProgress.getSession(setId);
    return session ? Object.keys(session.answers).length : 0;
  }
  getSetPercent(setId) {
    const set = this.allSets().find((s) => s.id === setId);
    if (!set || set.totalQuestions === 0)
      return 0;
    return Math.round(this.getAnsweredCount(setId) / set.totalQuestions * 100);
  }
  isStarted(setId) {
    return this.getAnsweredCount(setId) > 0;
  }
  isCompleted(setId) {
    const session = this.mcqProgress.getSession(setId);
    return !!session?.completedAt;
  }
  getProgressBarClass(setId) {
    return this.isCompleted(setId) ? "bg-green-500" : "bg-indigo-500";
  }
  static \u0275fac = function McqCategoryList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _McqCategoryList)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _McqCategoryList, selectors: [["app-mcq-category-list"]], decls: 9, vars: 2, consts: [[1, "space-y-6", "pb-20", "md:pb-6"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "mt-1"], [1, "bg-indigo-50", "dark:bg-indigo-900/20", "rounded-xl", "border", "border-indigo-100", "dark:border-indigo-800/50", "p-4", "flex", "items-center", "gap-4"], [1, "space-y-3"], [1, "text-2xl"], [1, "font-semibold", "text-indigo-800", "dark:text-indigo-200", "text-sm"], [1, "text-xs", "text-indigo-600", "dark:text-indigo-400"], [1, "ml-auto", "text-right"], [1, "text-xl", "font-bold", "text-indigo-700", "dark:text-indigo-300"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "h-24", "bg-gray-100", "dark:bg-gray-800", "rounded-xl", "animate-pulse"], [1, "text-base", "font-semibold", "text-gray-700", "dark:text-gray-300", "flex", "items-center", "gap-2"], [1, "bg-indigo-100", "dark:bg-indigo-900/50", "text-indigo-700", "dark:text-indigo-300", "text-xs", "font-bold", "px-2", "py-0.5", "rounded-full"], [1, "block", 3, "routerLink"], [1, "bg-purple-100", "dark:bg-purple-900/50", "text-purple-700", "dark:text-purple-300", "text-xs", "font-bold", "px-2", "py-0.5", "rounded-full"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "hover:shadow-md", "hover:border-indigo-300", "dark:hover:border-indigo-600", "transition-all", "cursor-pointer"], [1, "flex", "items-start", "gap-3"], [1, "text-2xl", "mt-0.5"], [1, "flex-1", "min-w-0"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "font-semibold", "text-gray-900", "dark:text-gray-100", "text-sm"], [1, "text-xs", "bg-green-100", "dark:bg-green-900/40", "text-green-700", "dark:text-green-300", "px-2", "py-0.5", "rounded-full", "font-medium"], [1, "text-xs", "bg-amber-100", "dark:bg-amber-900/40", "text-amber-700", "dark:text-amber-300", "px-2", "py-0.5", "rounded-full", "font-medium"], [1, "text-xs", "text-gray-500", "dark:text-gray-400", "mt-0.5"], [1, "mt-2", "flex", "items-center", "gap-2"], [1, "flex-1", "h-1.5", "bg-gray-200", "dark:bg-gray-700", "rounded-full", "overflow-hidden"], [1, "h-full", "rounded-full", "transition-all"], [1, "text-xs", "text-gray-500", "dark:text-gray-400", "whitespace-nowrap"], [1, "text-indigo-400", "dark:text-indigo-500", "self-center", "text-lg", "ml-1"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "hover:shadow-md", "hover:border-purple-300", "dark:hover:border-purple-600", "transition-all", "cursor-pointer"], [1, "text-purple-400", "dark:text-purple-500", "self-center", "text-lg", "ml-1"]], template: function McqCategoryList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "h1", 1);
      \u0275\u0275text(3, "MCQ Quiz");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 2);
      \u0275\u0275text(5, " CBSE Previous Year Multiple Choice Questions \xB7 Class 11 & 12 ");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(6, McqCategoryList_Conditional_6_Template, 13, 3, "div", 3);
      \u0275\u0275conditionalCreate(7, McqCategoryList_Conditional_7_Template, 3, 1, "div", 4)(8, McqCategoryList_Conditional_8_Template, 12, 0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.totalAttempted() > 0 ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 7 : 8);
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(McqCategoryList, [{
    type: Component,
    args: [{
      selector: "app-mcq-category-list",
      standalone: true,
      imports: [RouterLink],
      template: `
    <div class="space-y-6 pb-20 md:pb-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">MCQ Quiz</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          CBSE Previous Year Multiple Choice Questions \xB7 Class 11 &amp; 12
        </p>
      </div>

      <!-- Stats strip -->
      @if (totalAttempted() > 0) {
        <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-4 flex items-center gap-4">
          <span class="text-2xl">\u{1F3C6}</span>
          <div>
            <p class="font-semibold text-indigo-800 dark:text-indigo-200 text-sm">
              {{ totalCorrect() }} correct out of {{ totalAttempted() }} attempted
            </p>
            <p class="text-xs text-indigo-600 dark:text-indigo-400">across all quiz sets</p>
          </div>
          <div class="ml-auto text-right">
            <p class="text-xl font-bold text-indigo-700 dark:text-indigo-300">{{ overallPercent() }}%</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">accuracy</p>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3]; track i) {
            <div class="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else {
        <!-- Class 12 -->
        <section class="space-y-3">
          <h2 class="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span class="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full">Class 12</span>
          </h2>
          @for (set of class12Sets(); track set.id) {
            <a [routerLink]="['/mcq', set.id]" class="block">
              <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer">
                <div class="flex items-start gap-3">
                  <span class="text-2xl mt-0.5">{{ set.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">{{ set.topic }}</h3>
                      @if (isCompleted(set.id)) {
                        <span class="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">\u2713 Completed</span>
                      } @else if (isStarted(set.id)) {
                        <span class="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                      }
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ set.description }}</p>
                    <!-- Progress bar -->
                    <div class="mt-2 flex items-center gap-2">
                      <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all"
                             [class]="getProgressBarClass(set.id)"
                             [style.width.%]="getSetPercent(set.id)"></div>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {{ getAnsweredCount(set.id) }}/{{ set.totalQuestions }}
                      </span>
                    </div>
                  </div>
                  <span class="text-indigo-400 dark:text-indigo-500 self-center text-lg ml-1">\u203A</span>
                </div>
              </div>
            </a>
          }
        </section>

        <!-- Class 11 -->
        <section class="space-y-3">
          <h2 class="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <span class="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full">Class 11</span>
          </h2>
          @for (set of class11Sets(); track set.id) {
            <a [routerLink]="['/mcq', set.id]" class="block">
              <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer">
                <div class="flex items-start gap-3">
                  <span class="text-2xl mt-0.5">{{ set.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm">{{ set.topic }}</h3>
                      @if (isCompleted(set.id)) {
                        <span class="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">\u2713 Completed</span>
                      } @else if (isStarted(set.id)) {
                        <span class="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">In Progress</span>
                      }
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ set.description }}</p>
                    <div class="mt-2 flex items-center gap-2">
                      <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all"
                             [class]="getProgressBarClass(set.id)"
                             [style.width.%]="getSetPercent(set.id)"></div>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {{ getAnsweredCount(set.id) }}/{{ set.totalQuestions }}
                      </span>
                    </div>
                  </div>
                  <span class="text-purple-400 dark:text-purple-500 self-center text-lg ml-1">\u203A</span>
                </div>
              </div>
            </a>
          }
        </section>
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(McqCategoryList, { className: "McqCategoryList", filePath: "src/app/features/mcq/category-list/category-list.ts", lineNumber: 134 });
})();
export {
  McqCategoryList
};
//# sourceMappingURL=chunk-DRE3D6YN.js.map
