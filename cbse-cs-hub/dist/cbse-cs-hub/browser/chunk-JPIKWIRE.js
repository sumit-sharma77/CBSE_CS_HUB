import {
  SearchBar
} from "./chunk-QUGQJPHY.js";
import {
  RecentlyViewedService
} from "./chunk-4WECW4T2.js";
import "./chunk-LG47JR2W.js";
import {
  BookmarkBtn
} from "./chunk-U3DUJTCO.js";
import "./chunk-RHQIL3TT.js";
import {
  Router
} from "./chunk-S2RS62IU.js";
import {
  HttpClient
} from "./chunk-BVJZPSLF.js";
import "./chunk-UZIXFQP3.js";
import {
  Component,
  Input,
  computed,
  forkJoin,
  inject,
  input,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
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

// src/app/shared/components/card/card.ts
var _c0 = [[["", "slot", "action"]], "*"];
var _c1 = ["[slot=action]", "*"];
function Card_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 4);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.subtitle());
  }
}
function Card_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const tag_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tag_r2, " ");
  }
}
function Card_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 5);
    \u0275\u0275repeaterCreate(1, Card_Conditional_7_For_2_Template, 2, 1, "span", 6, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.tags());
  }
}
var Card = class _Card {
  title = input.required(...ngDevMode ? [{ debugName: "title" }] : (
    /* istanbul ignore next */
    []
  ));
  subtitle = input("", ...ngDevMode ? [{ debugName: "subtitle" }] : (
    /* istanbul ignore next */
    []
  ));
  tags = input([], ...ngDevMode ? [{ debugName: "tags" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function Card_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Card)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Card, selectors: [["app-card"]], inputs: { title: [1, "title"], subtitle: [1, "subtitle"], tags: [1, "tags"] }, ngContentSelectors: _c1, decls: 9, vars: 3, consts: [[1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-4", "shadow-sm", "hover:shadow-md", "transition-shadow"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "flex-1", "min-w-0"], [1, "font-semibold", "text-gray-900", "dark:text-gray-100", "truncate"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "mt-0.5", "truncate"], [1, "flex", "flex-wrap", "gap-1.5", "mt-2"], [1, "text-xs", "px-2", "py-0.5", "rounded-full", "bg-indigo-50", "dark:bg-indigo-900/40", "text-indigo-700", "dark:text-indigo-300"]], template: function Card_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c0);
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h3", 3);
      \u0275\u0275text(4);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(5, Card_Conditional_5_Template, 2, 1, "p", 4);
      \u0275\u0275domElementEnd();
      \u0275\u0275projection(6);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(7, Card_Conditional_7_Template, 3, 0, "div", 5);
      \u0275\u0275projection(8, 1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.title());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.subtitle() ? 5 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.tags().length > 0 ? 7 : -1);
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Card, [{
    type: Component,
    args: [{
      selector: "app-card",
      standalone: true,
      template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ title() }}</h3>
          @if (subtitle()) {
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ subtitle() }}</p>
          }
        </div>
        <ng-content select="[slot=action]"></ng-content>
      </div>
      @if (tags().length > 0) {
        <div class="flex flex-wrap gap-1.5 mt-2">
          @for (tag of tags(); track tag) {
            <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
              {{ tag }}
            </span>
          }
        </div>
      }
      <ng-content></ng-content>
    </div>
  `
    }]
  }], null, { title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: true }] }], subtitle: [{ type: Input, args: [{ isSignal: true, alias: "subtitle", required: false }] }], tags: [{ type: Input, args: [{ isSignal: true, alias: "tags", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Card, { className: "Card", filePath: "src/app/shared/components/card/card.ts", lineNumber: 30 });
})();

// src/app/features/study-notes/chapter-list/chapter-list.ts
var _forTrack0 = ($index, $item) => $item.classLevel;
var _forTrack1 = ($index, $item) => $item.id;
function ChapterList_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275text(1, "Loading chapters\u2026");
    \u0275\u0275elementEnd();
  }
}
function ChapterList_Conditional_5_For_1_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275listener("click", function ChapterList_Conditional_5_For_1_For_5_Template_div_click_0_listener() {
      const chapter_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.openChapter(chapter_r2));
    });
    \u0275\u0275elementStart(1, "app-card", 10);
    \u0275\u0275element(2, "app-bookmark-btn", 11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const chapter_r2 = ctx.$implicit;
    \u0275\u0275attribute("aria-label", "Open chapter: " + chapter_r2.title);
    \u0275\u0275advance();
    \u0275\u0275property("title", chapter_r2.title)("subtitle", "Chapter " + chapter_r2.chapterNumber)("tags", chapter_r2.tags);
    \u0275\u0275advance();
    \u0275\u0275property("itemId", chapter_r2.id)("title", chapter_r2.title);
  }
}
function ChapterList_Conditional_5_For_1_ForEmpty_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, "No chapters match your search.");
    \u0275\u0275elementEnd();
  }
}
function ChapterList_Conditional_5_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section")(1, "h2", 5);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 6);
    \u0275\u0275repeaterCreate(4, ChapterList_Conditional_5_For_1_For_5_Template, 3, 6, "div", 7, _forTrack1, false, ChapterList_Conditional_5_For_1_ForEmpty_6_Template, 2, 0, "p", 8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const group_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Class ", group_r4.classLevel, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(group_r4.chapters);
  }
}
function ChapterList_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(' No results for "', ctx_r2.filterQuery(), '" ');
  }
}
function ChapterList_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ChapterList_Conditional_5_For_1_Template, 7, 2, "section", null, _forTrack0);
    \u0275\u0275conditionalCreate(2, ChapterList_Conditional_5_Conditional_2_Template, 2, 1, "div", 4);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r2.filteredGroups());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.filteredGroups().length === 0 && ctx_r2.filterQuery() ? 2 : -1);
  }
}
var ChapterList = class _ChapterList {
  http = inject(HttpClient);
  router = inject(Router);
  recentlyViewed = inject(RecentlyViewedService);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  allChapters = signal([], ...ngDevMode ? [{ debugName: "allChapters" }] : (
    /* istanbul ignore next */
    []
  ));
  filterQuery = signal("", ...ngDevMode ? [{ debugName: "filterQuery" }] : (
    /* istanbul ignore next */
    []
  ));
  filteredGroups = computed(() => {
    const q = this.filterQuery().toLowerCase();
    const chapters = q ? this.allChapters().filter((c) => c.title.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q))) : this.allChapters();
    const class12 = chapters.filter((c) => c.classLevel === 12).sort((a, b) => a.chapterNumber - b.chapterNumber);
    const class11 = chapters.filter((c) => c.classLevel === 11).sort((a, b) => a.chapterNumber - b.chapterNumber);
    return [
      ...class12.length ? [{ classLevel: 12, chapters: class12 }] : [],
      ...class11.length ? [{ classLevel: 11, chapters: class11 }] : []
    ];
  }, ...ngDevMode ? [{ debugName: "filteredGroups" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    forkJoin({
      class12: this.http.get("assets/content/study-notes/class-12-index.json"),
      class11: this.http.get("assets/content/study-notes/class-11-index.json")
    }).subscribe({
      next: ({ class12, class11 }) => {
        this.allChapters.set([...class12, ...class11]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
  openChapter(chapter) {
    this.recentlyViewed.track({
      type: "chapter",
      itemId: chapter.id,
      title: chapter.title,
      routePath: `/study-notes/${chapter.id}`
    });
    this.router.navigate(["/study-notes", chapter.id]);
  }
  static \u0275fac = function ChapterList_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChapterList)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChapterList, selectors: [["app-chapter-list"]], decls: 6, vars: 1, consts: [[1, "space-y-6"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], ["placeholder", "Search chapters by title or tag\u2026", 3, "queryChange"], [1, "text-center", "py-12", "text-gray-500", "dark:text-gray-400"], [1, "text-center", "py-8", "text-gray-500", "dark:text-gray-400"], [1, "text-lg", "font-semibold", "text-indigo-700", "dark:text-indigo-300", "mb-3"], [1, "space-y-3"], ["role", "button", 1, "cursor-pointer"], [1, "text-gray-400", "dark:text-gray-500", "text-sm", "py-2"], ["role", "button", 1, "cursor-pointer", 3, "click"], [3, "title", "subtitle", "tags"], ["slot", "action", "type", "chapter", 3, "itemId", "title"]], template: function ChapterList_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Study Notes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "app-search-bar", 2);
      \u0275\u0275listener("queryChange", function ChapterList_Template_app_search_bar_queryChange_3_listener($event) {
        return ctx.filterQuery.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, ChapterList_Conditional_4_Template, 2, 0, "div", 3)(5, ChapterList_Conditional_5_Template, 3, 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.loading() ? 4 : 5);
    }
  }, dependencies: [SearchBar, Card, BookmarkBtn], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChapterList, [{
    type: Component,
    args: [{
      selector: "app-chapter-list",
      standalone: true,
      imports: [SearchBar, Card, BookmarkBtn],
      template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Study Notes</h1>

      <app-search-bar placeholder="Search chapters by title or tag\u2026"
                      (queryChange)="filterQuery.set($event)">
      </app-search-bar>

      @if (loading()) {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Loading chapters\u2026</div>
      } @else {
        @for (group of filteredGroups(); track group.classLevel) {
          <section>
            <h2 class="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
              Class {{ group.classLevel }}
            </h2>
            <div class="space-y-3">
              @for (chapter of group.chapters; track chapter.id) {
                <div (click)="openChapter(chapter)"
                     class="cursor-pointer"
                     role="button"
                     [attr.aria-label]="'Open chapter: ' + chapter.title">
                  <app-card [title]="chapter.title"
                            [subtitle]="'Chapter ' + chapter.chapterNumber"
                            [tags]="chapter.tags">
                    <app-bookmark-btn slot="action"
                                      type="chapter"
                                      [itemId]="chapter.id"
                                      [title]="chapter.title">
                    </app-bookmark-btn>
                  </app-card>
                </div>
              }
              @empty {
                <p class="text-gray-400 dark:text-gray-500 text-sm py-2">No chapters match your search.</p>
              }
            </div>
          </section>
        }
        @if (filteredGroups().length === 0 && filterQuery()) {
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            No results for "{{ filterQuery() }}"
          </div>
        }
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChapterList, { className: "ChapterList", filePath: "src/app/features/study-notes/chapter-list/chapter-list.ts", lineNumber: 71 });
})();
export {
  ChapterList
};
//# sourceMappingURL=chunk-JPIKWIRE.js.map
