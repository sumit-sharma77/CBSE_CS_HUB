import {
  ProgressBar
} from "./chunk-OXNAOHKG.js";
import {
  ProgressService
} from "./chunk-JEU24C5L.js";
import {
  Router
} from "./chunk-S2RS62IU.js";
import {
  HttpClient
} from "./chunk-BVJZPSLF.js";
import "./chunk-UZIXFQP3.js";
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
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/sql-practice/category-list/category-list.ts
var _forTrack0 = ($index, $item) => $item.key;
function SqlCategoryList_For_7_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1, " PYQ ");
    \u0275\u0275elementEnd();
  }
}
function SqlCategoryList_For_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275listener("click", function SqlCategoryList_For_7_Template_div_click_0_listener() {
      const cat_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openCategory(cat_r2.key));
    });
    \u0275\u0275elementStart(1, "div", 6)(2, "div", 7)(3, "span", 8);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 9)(6, "div", 10)(7, "h3", 11);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, SqlCategoryList_For_7_Conditional_9_Template, 2, 0, "span", 12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275element(10, "app-progress-bar", 13);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cat_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", "Open " + cat_r2.label + " category");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(cat_r2.icon);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(cat_r2.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.hasPYQ(cat_r2.key) ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("attempted", ctx_r2.getProgress(cat_r2.key).attempted)("total", ctx_r2.getProgress(cat_r2.key).total)("percentage", ctx_r2.getProgress(cat_r2.key).percentage);
  }
}
var CATEGORIES = [
  { key: "select", label: "SELECT Queries", icon: "\u{1F4CB}" },
  { key: "where", label: "WHERE Clause", icon: "\u{1F50D}" },
  { key: "order-by", label: "ORDER BY", icon: "\u2195\uFE0F" },
  { key: "group-by", label: "GROUP BY & HAVING", icon: "\u{1F4CA}" },
  { key: "aggregate", label: "Aggregate Functions", icon: "\u2211" },
  { key: "joins", label: "JOINs", icon: "\u{1F517}" },
  { key: "keys-constraints", label: "Keys & Constraints", icon: "\u{1F511}" }
];
var SqlCategoryList = class _SqlCategoryList {
  router = inject(Router);
  http = inject(HttpClient);
  progressService = inject(ProgressService);
  categories = CATEGORIES;
  pyqCategories = /* @__PURE__ */ new Set();
  ngOnInit() {
    CATEGORIES.forEach((cat) => {
      this.http.get(`assets/content/sql-questions/${cat.key}.json`).subscribe({
        next: (questions) => {
          if (questions.some((q) => q.isPreviousYear)) {
            this.pyqCategories.add(cat.key);
          }
          this.progressService.updateTotal("sql", cat.key, questions.length);
        }
      });
    });
  }
  hasPYQ(category) {
    return this.pyqCategories.has(category);
  }
  getProgress(category) {
    return this.progressService.getCategoryProgress("sql", category)();
  }
  openCategory(category) {
    this.router.navigate(["/sql", category]);
  }
  static \u0275fac = function SqlCategoryList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SqlCategoryList)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SqlCategoryList, selectors: [["app-sql-category-list"]], decls: 8, vars: 0, consts: [[1, "space-y-4"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "text-sm", "text-gray-500", "dark:text-gray-400"], [1, "space-y-3"], ["role", "button", 1, "cursor-pointer"], ["role", "button", 1, "cursor-pointer", 3, "click"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "shadow-sm", "hover:shadow-md", "transition-shadow"], [1, "flex", "items-center", "gap-3", "mb-3"], [1, "text-2xl"], [1, "flex-1"], [1, "flex", "items-center", "gap-2"], [1, "font-semibold", "text-gray-900", "dark:text-gray-100"], [1, "text-xs", "px-1.5", "py-0.5", "rounded", "bg-amber-100", "dark:bg-amber-900/40", "text-amber-700", "dark:text-amber-300", "font-medium"], [3, "attempted", "total", "percentage"]], template: function SqlCategoryList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "SQL Practice");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "p", 2);
      \u0275\u0275text(4, "7 categories \xB7 Practice with previous year questions");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275repeaterCreate(6, SqlCategoryList_For_7_Template, 11, 7, "div", 4, _forTrack0);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.categories);
    }
  }, dependencies: [ProgressBar], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SqlCategoryList, [{
    type: Component,
    args: [{
      selector: "app-sql-category-list",
      standalone: true,
      imports: [ProgressBar],
      template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">SQL Practice</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">7 categories \xB7 Practice with previous year questions</p>

      <div class="space-y-3">
        @for (cat of categories; track cat.key) {
          <div (click)="openCategory(cat.key)"
               class="cursor-pointer"
               role="button"
               [attr.aria-label]="'Open ' + cat.label + ' category'">
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">{{ cat.icon }}</span>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ cat.label }}</h3>
                    @if (hasPYQ(cat.key)) {
                      <span class="text-xs px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium">
                        PYQ
                      </span>
                    }
                  </div>
                </div>
              </div>
              <app-progress-bar
                [attempted]="getProgress(cat.key).attempted"
                [total]="getProgress(cat.key).total"
                [percentage]="getProgress(cat.key).percentage">
              </app-progress-bar>
            </div>
          </div>
        }
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SqlCategoryList, { className: "SqlCategoryList", filePath: "src/app/features/sql-practice/category-list/category-list.ts", lineNumber: 65 });
})();
export {
  SqlCategoryList
};
//# sourceMappingURL=chunk-IGT763FP.js.map
