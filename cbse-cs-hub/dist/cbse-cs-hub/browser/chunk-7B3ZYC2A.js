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
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
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
  ɵɵtextInterpolate1
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/python-practice/topic-list/topic-list.ts
var _forTrack0 = ($index, $item) => $item.value;
var _forTrack1 = ($index, $item) => $item.key;
function PythonTopicList_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 6);
    \u0275\u0275listener("click", function PythonTopicList_For_5_Template_button_click_0_listener() {
      const f_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.activeFilter.set(f_r2.value));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("bg-indigo-600", ctx_r2.activeFilter() === f_r2.value)("text-white", ctx_r2.activeFilter() === f_r2.value)("bg-gray-100", ctx_r2.activeFilter() !== f_r2.value)("dark:bg-gray-800", ctx_r2.activeFilter() !== f_r2.value)("text-gray-600", ctx_r2.activeFilter() !== f_r2.value)("dark:text-gray-300", ctx_r2.activeFilter() !== f_r2.value);
    \u0275\u0275attribute("aria-label", "Filter by " + f_r2.label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", f_r2.label, " ");
  }
}
function PythonTopicList_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275listener("click", function PythonTopicList_For_8_Template_div_click_0_listener() {
      const topic_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.openTopic(topic_r5.key));
    });
    \u0275\u0275elementStart(1, "div", 8)(2, "div", 9)(3, "span", 10);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h3", 11);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(7, "app-progress-bar", 12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const topic_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", "Open topic: " + topic_r5.label);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(topic_r5.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(topic_r5.label);
    \u0275\u0275advance();
    \u0275\u0275property("attempted", ctx_r2.getProgress(topic_r5.key).attempted)("total", ctx_r2.getProgress(topic_r5.key).total)("percentage", ctx_r2.getProgress(topic_r5.key).percentage);
  }
}
var TOPICS = [
  { key: "variables", label: "Variables & Types", icon: "\u{1F4CC}" },
  { key: "conditions", label: "Conditions (if/elif/else)", icon: "\u{1F500}" },
  { key: "loops", label: "Loops (for/while)", icon: "\u{1F501}" },
  { key: "functions", label: "Functions", icon: "\u2699\uFE0F" },
  { key: "lists", label: "Lists", icon: "\u{1F4CB}" },
  { key: "strings", label: "Strings", icon: "\u{1F524}" },
  { key: "dictionaries", label: "Dictionaries", icon: "\u{1F4D6}" },
  { key: "mixed", label: "Mixed Practice", icon: "\u{1F3AF}" }
];
var PythonTopicList = class _PythonTopicList {
  router = inject(Router);
  http = inject(HttpClient);
  progressService = inject(ProgressService);
  topics = TOPICS;
  activeFilter = signal("all", ...ngDevMode ? [{ debugName: "activeFilter" }] : (
    /* istanbul ignore next */
    []
  ));
  filters = [
    { label: "All", value: "all" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" }
  ];
  ngOnInit() {
    TOPICS.forEach((t) => {
      this.http.get(`assets/content/python-exercises/${t.key}.json`).subscribe({
        next: (exercises) => {
          this.progressService.updateTotal("python", t.key, exercises.length);
        }
      });
    });
  }
  getProgress(topic) {
    return this.progressService.getCategoryProgress("python", topic)();
  }
  openTopic(topic) {
    this.router.navigate(["/python", topic], {
      queryParams: this.activeFilter() !== "all" ? { diff: this.activeFilter() } : {}
    });
  }
  static \u0275fac = function PythonTopicList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PythonTopicList)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PythonTopicList, selectors: [["app-python-topic-list"]], decls: 9, vars: 0, consts: [[1, "space-y-4"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "flex", "gap-2", "flex-wrap"], [1, "text-sm", "px-4", "py-1.5", "rounded-full", "font-medium", "transition-colors", 3, "bg-indigo-600", "text-white", "bg-gray-100", "dark:bg-gray-800", "text-gray-600", "dark:text-gray-300"], [1, "space-y-3"], ["role", "button", 1, "cursor-pointer"], [1, "text-sm", "px-4", "py-1.5", "rounded-full", "font-medium", "transition-colors", 3, "click"], ["role", "button", 1, "cursor-pointer", 3, "click"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "shadow-sm", "hover:shadow-md", "transition-shadow"], [1, "flex", "items-center", "gap-3", "mb-3"], [1, "text-2xl"], [1, "font-semibold", "text-gray-900", "dark:text-gray-100", "flex-1"], [3, "attempted", "total", "percentage"]], template: function PythonTopicList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Python Practice");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2);
      \u0275\u0275repeaterCreate(4, PythonTopicList_For_5_Template, 2, 14, "button", 3, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 4);
      \u0275\u0275repeaterCreate(7, PythonTopicList_For_8_Template, 8, 6, "div", 5, _forTrack1);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.filters);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.topics);
    }
  }, dependencies: [ProgressBar], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PythonTopicList, [{
    type: Component,
    args: [{
      selector: "app-python-topic-list",
      standalone: true,
      imports: [ProgressBar],
      template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Python Practice</h1>

      <!-- Difficulty filter -->
      <div class="flex gap-2 flex-wrap">
        @for (f of filters; track f.value) {
          <button (click)="activeFilter.set(f.value)"
                  [class.bg-indigo-600]="activeFilter() === f.value"
                  [class.text-white]="activeFilter() === f.value"
                  [class.bg-gray-100]="activeFilter() !== f.value"
                  [class.dark:bg-gray-800]="activeFilter() !== f.value"
                  [class.text-gray-600]="activeFilter() !== f.value"
                  [class.dark:text-gray-300]="activeFilter() !== f.value"
                  class="text-sm px-4 py-1.5 rounded-full font-medium transition-colors"
                  [attr.aria-label]="'Filter by ' + f.label">
            {{ f.label }}
          </button>
        }
      </div>

      <div class="space-y-3">
        @for (topic of topics; track topic.key) {
          <div (click)="openTopic(topic.key)"
               class="cursor-pointer"
               role="button"
               [attr.aria-label]="'Open topic: ' + topic.label">
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">{{ topic.icon }}</span>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 flex-1">{{ topic.label }}</h3>
              </div>
              <app-progress-bar
                [attempted]="getProgress(topic.key).attempted"
                [total]="getProgress(topic.key).total"
                [percentage]="getProgress(topic.key).percentage">
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PythonTopicList, { className: "PythonTopicList", filePath: "src/app/features/python-practice/topic-list/topic-list.ts", lineNumber: 66 });
})();
export {
  PythonTopicList
};
//# sourceMappingURL=chunk-7B3ZYC2A.js.map
