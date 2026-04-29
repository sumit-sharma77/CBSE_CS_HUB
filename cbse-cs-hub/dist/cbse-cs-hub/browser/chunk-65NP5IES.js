import {
  TimeAgoPipe
} from "./chunk-M655QVVP.js";
import {
  RecentlyViewedService
} from "./chunk-4WECW4T2.js";
import {
  BookmarkService
} from "./chunk-RHQIL3TT.js";
import {
  ProgressBar
} from "./chunk-OXNAOHKG.js";
import {
  ProgressService
} from "./chunk-JEU24C5L.js";
import {
  Router
} from "./chunk-S2RS62IU.js";
import "./chunk-BVJZPSLF.js";
import {
  StorageService
} from "./chunk-UZIXFQP3.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/progress/progress.ts
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.itemId;
function Progress_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "p", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "app-progress-bar", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cat_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(cat_r1.label);
    \u0275\u0275advance();
    \u0275\u0275property("attempted", ctx_r1.getSqlProgress(cat_r1.key).attempted)("total", ctx_r1.getSqlProgress(cat_r1.key).total)("percentage", ctx_r1.getSqlProgress(cat_r1.key).percentage);
  }
}
function Progress_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "p", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "app-progress-bar", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r3.label);
    \u0275\u0275advance();
    \u0275\u0275property("attempted", ctx_r1.getPythonProgress(t_r3.key).attempted)("total", ctx_r1.getPythonProgress(t_r3.key).total)("percentage", ctx_r1.getPythonProgress(t_r3.key).percentage);
  }
}
function Progress_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 9);
    \u0275\u0275text(1, "Nothing viewed yet. Start exploring!");
    \u0275\u0275elementEnd();
  }
}
function Progress_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 15);
    \u0275\u0275listener("click", function Progress_For_23_Template_button_click_0_listener() {
      const entry_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navigate(entry_r5.routePath));
    });
    \u0275\u0275elementStart(1, "div", 16)(2, "span", 17);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "p", 18);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 19);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "timeAgo");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "span", 20);
    \u0275\u0275text(11, "\u2192");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entry_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", "Go to " + entry_r5.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.moduleIcon(entry_r5.type));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(entry_r5.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 4, entry_r5.visitedAt));
  }
}
function Progress_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function Progress_Conditional_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resetConfirm = true);
    });
    \u0275\u0275text(1, " Reset All Data ");
    \u0275\u0275elementEnd();
  }
}
function Progress_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "p", 22);
    \u0275\u0275text(2, "This will permanently delete:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ul", 23)(4, "li");
    \u0275\u0275text(5, "All SQL practice progress");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "li");
    \u0275\u0275text(7, "All Python practice progress");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "li");
    \u0275\u0275text(9, "All bookmarks");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "li");
    \u0275\u0275text(11, "All personal notes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "li");
    \u0275\u0275text(13, "Recently viewed history");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 24)(15, "button", 25);
    \u0275\u0275listener("click", function Progress_Conditional_25_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.confirmReset());
    });
    \u0275\u0275text(16, " Yes, Reset Everything ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "button", 26);
    \u0275\u0275listener("click", function Progress_Conditional_25_Template_button_click_17_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.resetConfirm = false);
    });
    \u0275\u0275text(18, " Cancel ");
    \u0275\u0275elementEnd()()();
  }
}
var SQL_CATEGORIES = [
  { key: "select", label: "SELECT Queries" },
  { key: "where", label: "WHERE Clause" },
  { key: "order-by", label: "ORDER BY" },
  { key: "group-by", label: "GROUP BY & HAVING" },
  { key: "aggregate", label: "Aggregate Functions" },
  { key: "joins", label: "JOINs" },
  { key: "keys-constraints", label: "Keys & Constraints" }
];
var PYTHON_TOPICS = [
  { key: "variables", label: "Variables & Types" },
  { key: "conditions", label: "Conditions" },
  { key: "loops", label: "Loops" },
  { key: "functions", label: "Functions" },
  { key: "lists", label: "Lists" },
  { key: "strings", label: "Strings" },
  { key: "dictionaries", label: "Dictionaries" },
  { key: "mixed", label: "Mixed Practice" }
];
var Progress = class _Progress {
  progressService = inject(ProgressService);
  bookmarkService = inject(BookmarkService);
  recentlyViewedService = inject(RecentlyViewedService);
  storageService = inject(StorageService);
  router = inject(Router);
  sqlCategories = SQL_CATEGORIES;
  pythonTopics = PYTHON_TOPICS;
  resetConfirm = false;
  getSqlProgress(key) {
    return this.progressService.getCategoryProgress("sql", key)();
  }
  getPythonProgress(key) {
    return this.progressService.getCategoryProgress("python", key)();
  }
  navigate(path) {
    this.router.navigateByUrl(path);
  }
  moduleIcon(type) {
    const icons = {
      chapter: "\u{1F4D6}",
      "sql-question": "\u{1F5C4}\uFE0F",
      "python-exercise": "\u{1F40D}"
    };
    return icons[type] ?? "\u{1F4C4}";
  }
  confirmReset() {
    this.progressService.reset();
    this.bookmarkService.clear();
    this.recentlyViewedService.clear();
    this.storageService.remove("cbse-notes");
    this.resetConfirm = false;
    this.router.navigate(["/"]);
  }
  static \u0275fac = function Progress_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Progress)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Progress, selectors: [["app-progress"]], decls: 26, vars: 3, consts: [[1, "space-y-6"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "space-y-3"], [1, "font-semibold", "text-gray-900", "dark:text-gray-100", "flex", "items-center", "gap-2"], [1, "space-y-1"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "flex", "items-center", "justify-between"], [1, "text-gray-700", "dark:text-gray-300", "font-medium"], [1, "text-indigo-600", "dark:text-indigo-400", "font-bold", "text-lg"], [1, "font-semibold", "text-gray-900", "dark:text-gray-100"], [1, "text-sm", "text-gray-400", "dark:text-gray-500"], [1, "w-full", "flex", "items-start", "justify-between", "gap-3", "py-2", "border-t", "border-gray-100", "dark:border-gray-700", "first:border-0", "text-left", "hover:bg-gray-50", "dark:hover:bg-gray-700/50", "rounded", "px-1", "transition-colors"], ["aria-label", "Reset all data", 1, "w-full", "py-3", "rounded-xl", "border", "border-red-300", "dark:border-red-700", "text-red-600", "dark:text-red-400", "font-medium", "hover:bg-red-50", "dark:hover:bg-red-900/20", "transition-colors"], [1, "bg-red-50", "dark:bg-red-900/20", "rounded-xl", "border", "border-red-200", "dark:border-red-800", "p-4", "space-y-3"], [1, "text-sm", "text-gray-600", "dark:text-gray-400"], [3, "attempted", "total", "percentage"], [1, "w-full", "flex", "items-start", "justify-between", "gap-3", "py-2", "border-t", "border-gray-100", "dark:border-gray-700", "first:border-0", "text-left", "hover:bg-gray-50", "dark:hover:bg-gray-700/50", "rounded", "px-1", "transition-colors", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "text-sm"], [1, "text-sm", "font-medium", "text-gray-800", "dark:text-gray-200", "line-clamp-1"], [1, "text-xs", "text-gray-400", "dark:text-gray-500"], [1, "text-xs", "text-indigo-500", "dark:text-indigo-400", "shrink-0"], ["aria-label", "Reset all data", 1, "w-full", "py-3", "rounded-xl", "border", "border-red-300", "dark:border-red-700", "text-red-600", "dark:text-red-400", "font-medium", "hover:bg-red-50", "dark:hover:bg-red-900/20", "transition-colors", 3, "click"], [1, "text-sm", "text-red-700", "dark:text-red-300", "font-medium"], [1, "text-sm", "text-red-600", "dark:text-red-400", "list-disc", "pl-4", "space-y-1"], [1, "flex", "gap-3"], ["aria-label", "Confirm reset all data", 1, "flex-1", "py-2", "rounded-lg", "bg-red-500", "text-white", "font-medium", "hover:bg-red-600", "transition-colors", 3, "click"], ["aria-label", "Cancel reset", 1, "flex-1", "py-2", "rounded-lg", "bg-gray-200", "dark:bg-gray-700", "text-gray-700", "dark:text-gray-300", "font-medium", 3, "click"]], template: function Progress_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "My Progress");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "section", 2)(4, "h2", 3);
      \u0275\u0275text(5, " \u{1F5C4}\uFE0F SQL Practice ");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(6, Progress_For_7_Template, 4, 4, "div", 4, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "section", 2)(9, "h2", 3);
      \u0275\u0275text(10, " \u{1F40D} Python Practice ");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(11, Progress_For_12_Template, 4, 4, "div", 4, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 5)(14, "span", 6);
      \u0275\u0275text(15, "\u{1F516} Bookmarks");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "span", 7);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "section", 2)(19, "h2", 8);
      \u0275\u0275text(20, "\u{1F550} Recently Viewed");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(21, Progress_Conditional_21_Template, 2, 0, "p", 9);
      \u0275\u0275repeaterCreate(22, Progress_For_23_Template, 12, 6, "button", 10, _forTrack1);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(24, Progress_Conditional_24_Template, 2, 0, "button", 11)(25, Progress_Conditional_25_Template, 19, 0, "div", 12);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.sqlCategories);
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.pythonTopics);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.bookmarkService.bookmarks().length);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.recentlyViewedService.entries().length === 0 ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.recentlyViewedService.entries());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.resetConfirm ? 24 : 25);
    }
  }, dependencies: [ProgressBar, TimeAgoPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Progress, [{
    type: Component,
    args: [{
      selector: "app-progress",
      standalone: true,
      imports: [ProgressBar, TimeAgoPipe],
      template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">My Progress</h1>

      <!-- SQL Section -->
      <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          \u{1F5C4}\uFE0F SQL Practice
        </h2>
        @for (cat of sqlCategories; track cat.key) {
          <div class="space-y-1">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ cat.label }}</p>
            <app-progress-bar
              [attempted]="getSqlProgress(cat.key).attempted"
              [total]="getSqlProgress(cat.key).total"
              [percentage]="getSqlProgress(cat.key).percentage">
            </app-progress-bar>
          </div>
        }
      </section>

      <!-- Python Section -->
      <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          \u{1F40D} Python Practice
        </h2>
        @for (t of pythonTopics; track t.key) {
          <div class="space-y-1">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t.label }}</p>
            <app-progress-bar
              [attempted]="getPythonProgress(t.key).attempted"
              [total]="getPythonProgress(t.key).total"
              [percentage]="getPythonProgress(t.key).percentage">
            </app-progress-bar>
          </div>
        }
      </section>

      <!-- Bookmarks summary -->
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <span class="text-gray-700 dark:text-gray-300 font-medium">\u{1F516} Bookmarks</span>
        <span class="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{{ bookmarkService.bookmarks().length }}</span>
      </div>

      <!-- Recently Viewed -->
      <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100">\u{1F550} Recently Viewed</h2>
        @if (recentlyViewedService.entries().length === 0) {
          <p class="text-sm text-gray-400 dark:text-gray-500">Nothing viewed yet. Start exploring!</p>
        }
        @for (entry of recentlyViewedService.entries(); track entry.itemId) {
          <button (click)="navigate(entry.routePath)"
                  class="w-full flex items-start justify-between gap-3 py-2 border-t border-gray-100 dark:border-gray-700 first:border-0 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded px-1 transition-colors"
                  [attr.aria-label]="'Go to ' + entry.title">
            <div class="flex items-center gap-2">
              <span class="text-sm">{{ moduleIcon(entry.type) }}</span>
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{{ entry.title }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ entry.visitedAt | timeAgo }}</p>
              </div>
            </div>
            <span class="text-xs text-indigo-500 dark:text-indigo-400 shrink-0">\u2192</span>
          </button>
        }
      </section>

      <!-- Reset All Data -->
      @if (!resetConfirm) {
        <button (click)="resetConfirm = true"
                aria-label="Reset all data"
                class="w-full py-3 rounded-xl border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          Reset All Data
        </button>
      } @else {
        <div class="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4 space-y-3">
          <p class="text-sm text-red-700 dark:text-red-300 font-medium">This will permanently delete:</p>
          <ul class="text-sm text-red-600 dark:text-red-400 list-disc pl-4 space-y-1">
            <li>All SQL practice progress</li>
            <li>All Python practice progress</li>
            <li>All bookmarks</li>
            <li>All personal notes</li>
            <li>Recently viewed history</li>
          </ul>
          <div class="flex gap-3">
            <button (click)="confirmReset()"
                    class="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                    aria-label="Confirm reset all data">
              Yes, Reset Everything
            </button>
            <button (click)="resetConfirm = false"
                    class="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                    aria-label="Cancel reset">
              Cancel
            </button>
          </div>
        </div>
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Progress, { className: "Progress", filePath: "src/app/features/progress/progress.ts", lineNumber: 135 });
})();
export {
  Progress
};
//# sourceMappingURL=chunk-65NP5IES.js.map
