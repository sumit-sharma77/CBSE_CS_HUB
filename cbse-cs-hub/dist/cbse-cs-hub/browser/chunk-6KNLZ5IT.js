import {
  TimeAgoPipe
} from "./chunk-M655QVVP.js";
import {
  RecentlyViewedService
} from "./chunk-4WECW4T2.js";
import {
  ProgressService
} from "./chunk-JEU24C5L.js";
import {
  RouterLink
} from "./chunk-S2RS62IU.js";
import "./chunk-BVJZPSLF.js";
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
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/home/home.ts
var _forTrack0 = ($index, $item) => $item.route;
var _forTrack1 = ($index, $item) => $item.itemId;
function Home_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 5)(1, "span", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 14);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const card_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", card_r1.route);
    \u0275\u0275attribute("aria-label", card_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r1.description);
  }
}
function Home_Conditional_25_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 17)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 18)(4, "p", 19);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 20);
    \u0275\u0275text(7);
    \u0275\u0275pipe(8, "timeAgo");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 21);
    \u0275\u0275text(10, "\u2192");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const entry_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("routerLink", entry_r2.routePath);
    \u0275\u0275attribute("aria-label", "Revisit: " + entry_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.moduleIcon(entry_r2.type));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(entry_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(8, 5, entry_r2.visitedAt));
  }
}
function Home_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 12)(1, "h2", 16);
    \u0275\u0275text(2, "Recently Viewed");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, Home_Conditional_25_For_4_Template, 11, 7, "a", 17, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.recentlyViewed.entries().slice(0, 5));
  }
}
var Home = class _Home {
  recentlyViewed = inject(RecentlyViewedService);
  progressService = inject(ProgressService);
  moduleCards = [
    { label: "Study Notes", route: "/study-notes", icon: "\u{1F4D6}", description: "Class 11 & 12 chapters" },
    { label: "MCQ Quiz", route: "/mcq", icon: "\u{1F9E0}", description: "CBSE PYQ MCQs \xB7 Class 11 & 12" },
    { label: "SQL Practice", route: "/sql", icon: "\u{1F5C4}\uFE0F", description: "7 categories + PYQ" },
    { label: "Python Practice", route: "/python", icon: "\u{1F40D}", description: "8 topics + exercises" },
    { label: "My Notes", route: "/notes", icon: "\u{1F4DD}", description: "Personal study notes" },
    { label: "Progress", route: "/progress", icon: "\u{1F4CA}", description: "Track your performance" }
  ];
  sqlAttempted() {
    return ["select", "where", "order-by", "group-by", "aggregate", "joins", "keys-constraints"].reduce((sum, k) => sum + this.progressService.getCategoryProgress("sql", k)().attempted, 0);
  }
  pythonAttempted() {
    return ["variables", "conditions", "loops", "functions", "lists", "strings", "dictionaries", "mixed"].reduce((sum, k) => sum + this.progressService.getCategoryProgress("python", k)().attempted, 0);
  }
  moduleIcon(type) {
    const icons = { chapter: "\u{1F4D6}", "sql-question": "\u{1F5C4}\uFE0F", "python-exercise": "\u{1F40D}", mcq: "\u{1F9E0}" };
    return icons[type] ?? "\u{1F4C4}";
  }
  static \u0275fac = function Home_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Home)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Home, selectors: [["app-home"]], decls: 26, vars: 3, consts: [[1, "space-y-6"], [1, "text-center", "py-4"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "mt-1"], [1, "grid", "grid-cols-2", "gap-3"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "flex", "flex-col", "items-center", "text-center", "gap-2", "hover:shadow-md", "transition-shadow", 3, "routerLink"], [1, "bg-indigo-50", "dark:bg-indigo-900/20", "rounded-xl", "border", "border-indigo-100", "dark:border-indigo-800/50", "p-4", "flex", "justify-around"], [1, "text-center"], [1, "text-lg", "font-bold", "text-indigo-700", "dark:text-indigo-300"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "text-center", "border-x", "border-indigo-200", "dark:border-indigo-800", "px-4"], ["routerLink", "/progress", 1, "text-lg", "font-bold", "text-indigo-700", "dark:text-indigo-300", "hover:underline"], [1, "space-y-2"], [1, "text-3xl"], [1, "font-semibold", "text-sm", "text-gray-900", "dark:text-gray-100"], [1, "text-xs", "text-gray-500", "dark:text-gray-400", "leading-tight"], [1, "font-semibold", "text-gray-700", "dark:text-gray-200"], [1, "flex", "items-center", "gap-3", "bg-white", "dark:bg-gray-800", "rounded-lg", "border", "border-gray-200", "dark:border-gray-700", "px-3", "py-2", "hover:shadow-sm", "transition-shadow", 3, "routerLink"], [1, "flex-1", "min-w-0"], [1, "text-sm", "font-medium", "text-gray-800", "dark:text-gray-200", "truncate"], [1, "text-xs", "text-gray-400", "dark:text-gray-500"], [1, "text-xs", "text-indigo-500", "dark:text-indigo-400", "shrink-0"]], template: function Home_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h1", 2);
      \u0275\u0275text(3, "CBSE CS Hub");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "p", 3);
      \u0275\u0275text(5, " Class 11 & 12 Computer Science \xB7 Study Notes, SQL, Python ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4);
      \u0275\u0275repeaterCreate(7, Home_For_8_Template, 7, 5, "a", 5, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(9, "div", 6)(10, "div", 7)(11, "p", 8);
      \u0275\u0275text(12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "p", 9);
      \u0275\u0275text(14, "SQL attempted");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 10)(16, "p", 8);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "p", 9);
      \u0275\u0275text(19, "Python attempted");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(20, "div", 7)(21, "a", 11);
      \u0275\u0275text(22, " View \u2192 ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "p", 9);
      \u0275\u0275text(24, "All progress");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(25, Home_Conditional_25_Template, 5, 0, "section", 12);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.moduleCards);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.sqlAttempted());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.pythonAttempted());
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.recentlyViewed.entries().length > 0 ? 25 : -1);
    }
  }, dependencies: [RouterLink, TimeAgoPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Home, [{
    type: Component,
    args: [{
      selector: "app-home",
      standalone: true,
      imports: [RouterLink, TimeAgoPipe],
      template: `
    <div class="space-y-6">
      <!-- Hero -->
      <div class="text-center py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">CBSE CS Hub</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Class 11 &amp; 12 Computer Science \xB7 Study Notes, SQL, Python
        </p>
      </div>

      <!-- Module cards (4 content modules) -->
      <div class="grid grid-cols-2 gap-3">
        @for (card of moduleCards; track card.route) {
          <a [routerLink]="card.route"
             class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center text-center gap-2 hover:shadow-md transition-shadow"
             [attr.aria-label]="card.label">
            <span class="text-3xl">{{ card.icon }}</span>
            <span class="font-semibold text-sm text-gray-900 dark:text-gray-100">{{ card.label }}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400 leading-tight">{{ card.description }}</span>
          </a>
        }
      </div>

      <!-- Progress summary strip -->
      <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-4 flex justify-around">
        <div class="text-center">
          <p class="text-lg font-bold text-indigo-700 dark:text-indigo-300">{{ sqlAttempted() }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">SQL attempted</p>
        </div>
        <div class="text-center border-x border-indigo-200 dark:border-indigo-800 px-4">
          <p class="text-lg font-bold text-indigo-700 dark:text-indigo-300">{{ pythonAttempted() }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Python attempted</p>
        </div>
        <div class="text-center">
          <a routerLink="/progress" class="text-lg font-bold text-indigo-700 dark:text-indigo-300 hover:underline">
            View \u2192
          </a>
          <p class="text-xs text-gray-500 dark:text-gray-400">All progress</p>
        </div>
      </div>

      <!-- Recently Viewed (last 5) -->
      @if (recentlyViewed.entries().length > 0) {
        <section class="space-y-2">
          <h2 class="font-semibold text-gray-700 dark:text-gray-200">Recently Viewed</h2>
          @for (entry of recentlyViewed.entries().slice(0, 5); track entry.itemId) {
            <a [routerLink]="entry.routePath"
               class="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 hover:shadow-sm transition-shadow"
               [attr.aria-label]="'Revisit: ' + entry.title">
              <span>{{ moduleIcon(entry.type) }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ entry.title }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500">{{ entry.visitedAt | timeAgo }}</p>
              </div>
              <span class="text-xs text-indigo-500 dark:text-indigo-400 shrink-0">\u2192</span>
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Home, { className: "Home", filePath: "src/app/features/home/home.ts", lineNumber: 80 });
})();
export {
  Home
};
//# sourceMappingURL=chunk-6KNLZ5IT.js.map
