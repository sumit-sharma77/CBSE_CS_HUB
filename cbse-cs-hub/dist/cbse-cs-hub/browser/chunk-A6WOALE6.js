import {
  SearchBar
} from "./chunk-QUGQJPHY.js";
import "./chunk-LG47JR2W.js";
import {
  Router
} from "./chunk-S2RS62IU.js";
import {
  HttpClient
} from "./chunk-BVJZPSLF.js";
import {
  Component,
  Injectable,
  inject,
  map,
  of,
  setClassMetadata,
  shareReplay,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/core/services/search.service.ts
var SearchService = class _SearchService {
  http = inject(HttpClient);
  index$ = null;
  loadIndex() {
    if (!this.index$) {
      this.index$ = this.http.get("assets/content/search-index.json").pipe(shareReplay(1));
    }
    return this.index$;
  }
  search(query) {
    if (!query || query.trim().length < 2) {
      return of([]);
    }
    const q = query.toLowerCase().trim();
    return this.loadIndex().pipe(map((entries) => entries.filter((e) => e.title.toLowerCase().includes(q) || e.tags.some((tag) => tag.toLowerCase().includes(q)))));
  }
  static \u0275fac = function SearchService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SearchService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SearchService, factory: _SearchService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SearchService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/search-results/search-results.ts
var _forTrack0 = ($index, $item) => $item.module;
var _forTrack1 = ($index, $item) => $item.id;
function SearchResults_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(' No results for "', ctx_r0.query(), '" ');
  }
}
function SearchResults_For_6_For_4_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 10);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tag_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tag_r4, " ");
  }
}
function SearchResults_For_6_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275listener("click", function SearchResults_For_6_For_4_Template_div_click_0_listener() {
      const result_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.navigate(result_r3));
    });
    \u0275\u0275elementStart(1, "p", 8);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 9);
    \u0275\u0275repeaterCreate(4, SearchResults_For_6_For_4_For_5_Template, 2, 1, "span", 10, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 11);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const result_r3 = ctx.$implicit;
    \u0275\u0275attribute("aria-label", "Open: " + result_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(result_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(result_r3.tags.slice(0, 3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(result_r3.preview);
  }
}
function SearchResults_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 4)(1, "h2", 5);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, SearchResults_For_6_For_4_Template, 8, 3, "div", 6, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const group_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.moduleLabel(group_r5.module), " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(group_r5.items);
  }
}
var SearchResults = class _SearchResults {
  searchService = inject(SearchService);
  router = inject(Router);
  query = signal("", ...ngDevMode ? [{ debugName: "query" }] : (
    /* istanbul ignore next */
    []
  ));
  results = signal([], ...ngDevMode ? [{ debugName: "results" }] : (
    /* istanbul ignore next */
    []
  ));
  searching = signal(false, ...ngDevMode ? [{ debugName: "searching" }] : (
    /* istanbul ignore next */
    []
  ));
  groupedResults() {
    const modules = ["study-notes", "sql", "python"];
    return modules.map((m) => ({ module: m, items: this.results().filter((r) => r.module === m) })).filter((g) => g.items.length > 0);
  }
  search(q) {
    this.query.set(q);
    if (!q || q.length < 2) {
      this.results.set([]);
      return;
    }
    this.searching.set(true);
    this.searchService.search(q).subscribe({
      next: (results) => {
        this.results.set(results);
        this.searching.set(false);
      },
      error: () => this.searching.set(false)
    });
  }
  navigate(result) {
    this.router.navigateByUrl(result.routePath);
  }
  moduleLabel(module) {
    const labels = {
      "study-notes": "\u{1F4D6} Study Notes",
      sql: "\u{1F5C4}\uFE0F SQL Practice",
      python: "\u{1F40D} Python Practice"
    };
    return labels[module] ?? module;
  }
  static \u0275fac = function SearchResults_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SearchResults)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SearchResults, selectors: [["app-search-results"]], decls: 7, vars: 1, consts: [[1, "space-y-4"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], ["placeholder", "Search by title or tag\u2026", 3, "queryChange"], [1, "text-center", "py-8", "text-gray-400", "dark:text-gray-500"], [1, "space-y-2"], [1, "text-sm", "font-semibold", "text-indigo-600", "dark:text-indigo-400", "uppercase", "tracking-wide"], ["role", "button", 1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-3", "cursor-pointer", "hover:shadow-md", "transition-shadow"], ["role", "button", 1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-3", "cursor-pointer", "hover:shadow-md", "transition-shadow", 3, "click"], [1, "font-medium", "text-gray-900", "dark:text-gray-100", "text-sm"], [1, "flex", "flex-wrap", "gap-1", "mt-1"], [1, "text-xs", "px-1.5", "py-0.5", "rounded-full", "bg-indigo-50", "dark:bg-indigo-900/40", "text-indigo-600", "dark:text-indigo-400"], [1, "text-xs", "text-gray-500", "dark:text-gray-400", "mt-1.5", "line-clamp-2"]], template: function SearchResults_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Search");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "app-search-bar", 2);
      \u0275\u0275listener("queryChange", function SearchResults_Template_app_search_bar_queryChange_3_listener($event) {
        return ctx.search($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, SearchResults_Conditional_4_Template, 2, 1, "div", 3);
      \u0275\u0275repeaterCreate(5, SearchResults_For_6_Template, 5, 1, "section", 4, _forTrack0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.query() && ctx.results().length === 0 && !ctx.searching() ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.groupedResults());
    }
  }, dependencies: [SearchBar], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SearchResults, [{
    type: Component,
    args: [{
      selector: "app-search-results",
      standalone: true,
      imports: [SearchBar],
      template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Search</h1>

      <app-search-bar placeholder="Search by title or tag\u2026" (queryChange)="search($event)">
      </app-search-bar>

      @if (query() && results().length === 0 && !searching()) {
        <div class="text-center py-8 text-gray-400 dark:text-gray-500">
          No results for "{{ query() }}"
        </div>
      }

      @for (group of groupedResults(); track group.module) {
        <section class="space-y-2">
          <h2 class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            {{ moduleLabel(group.module) }}
          </h2>
          @for (result of group.items; track result.id) {
            <div (click)="navigate(result)"
                 role="button"
                 [attr.aria-label]="'Open: ' + result.title"
                 class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:shadow-md transition-shadow">
              <p class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ result.title }}</p>
              <div class="flex flex-wrap gap-1 mt-1">
                @for (tag of result.tags.slice(0, 3); track tag) {
                  <span class="text-xs px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                    {{ tag }}
                  </span>
                }
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{{ result.preview }}</p>
            </div>
          }
        </section>
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SearchResults, { className: "SearchResults", filePath: "src/app/features/search-results/search-results.ts", lineNumber: 49 });
})();
export {
  SearchResults
};
//# sourceMappingURL=chunk-A6WOALE6.js.map
