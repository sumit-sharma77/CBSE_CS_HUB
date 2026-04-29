import {
  BookmarkService
} from "./chunk-RHQIL3TT.js";
import {
  Router
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
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵgetCurrentView,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/bookmarks/bookmarks.ts
var _forTrack0 = ($index, $item) => $item.type;
var _forTrack1 = ($index, $item) => $item.itemId;
function Bookmarks_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 2)(1, "p", 4);
    \u0275\u0275text(2, "\u{1F516}");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "p", 5);
    \u0275\u0275text(4, "No bookmarks yet");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "p", 6);
    \u0275\u0275text(6, "Tap the bookmark icon on any chapter, SQL question, or Python exercise to save it here.");
    \u0275\u0275domElementEnd()();
  }
}
function Bookmarks_For_5_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 8)(1, "button", 9);
    \u0275\u0275domListener("click", function Bookmarks_For_5_For_4_Template_button_click_1_listener() {
      const bm_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.navigate(bm_r2));
    });
    \u0275\u0275domElementStart(2, "p", 10);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(4, "p", 11);
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(6, "button", 12);
    \u0275\u0275domListener("click", function Bookmarks_For_5_For_4_Template_button_click_6_listener() {
      const bm_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.remove(bm_r2));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(7, "svg", 13);
    \u0275\u0275domElement(8, "path", 14);
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const bm_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", "Open bookmarked item: " + bm_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(bm_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatDate(bm_r2.addedAt), " ");
  }
}
function Bookmarks_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "section", 3)(1, "h2", 7);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275repeaterCreate(3, Bookmarks_For_5_For_4_Template, 9, 3, "div", 8, _forTrack1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const group_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.groupLabel(group_r4.type), " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(group_r4.items);
  }
}
var Bookmarks = class _Bookmarks {
  bookmarkService = inject(BookmarkService);
  router = inject(Router);
  groupedBookmarks() {
    const types = ["chapter", "sql-question", "python-exercise"];
    return types.map((type) => ({
      type,
      items: this.bookmarkService.bookmarks().filter((b) => b.type === type)
    })).filter((g) => g.items.length > 0);
  }
  groupLabel(type) {
    const labels = {
      chapter: "\u{1F4D6} Study Notes Chapters",
      "sql-question": "\u{1F5C4}\uFE0F SQL Questions",
      "python-exercise": "\u{1F40D} Python Exercises"
    };
    return labels[type] ?? type;
  }
  navigate(bm) {
    const routes = {
      chapter: `/study-notes/${bm.itemId}`,
      "sql-question": "/sql",
      "python-exercise": "/python"
    };
    this.router.navigateByUrl(routes[bm.type] ?? "/");
  }
  remove(bm) {
    this.bookmarkService.toggle(bm.type, bm.itemId, bm.title);
  }
  formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  static \u0275fac = function Bookmarks_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Bookmarks)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Bookmarks, selectors: [["app-bookmarks"]], decls: 6, vars: 1, consts: [[1, "space-y-4"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "text-center", "py-16", "text-gray-400", "dark:text-gray-500", "space-y-2"], [1, "space-y-2"], [1, "text-4xl"], [1, "font-medium"], [1, "text-sm"], [1, "text-sm", "font-semibold", "text-indigo-600", "dark:text-indigo-400", "uppercase", "tracking-wide"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-3", "flex", "items-center", "justify-between", "gap-3"], [1, "flex-1", "text-left", 3, "click"], [1, "font-medium", "text-gray-900", "dark:text-gray-100", "text-sm", "line-clamp-2"], [1, "text-xs", "text-gray-400", "dark:text-gray-500", "mt-0.5"], ["aria-label", "Remove bookmark", 1, "p-1.5", "text-amber-500", "hover:text-gray-400", "dark:hover:text-gray-500", "transition-colors", "shrink-0", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 24 24", "fill", "currentColor", 1, "h-5", "w-5"], ["d", "M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"]], template: function Bookmarks_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Bookmarks");
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(3, Bookmarks_Conditional_3_Template, 7, 0, "div", 2);
      \u0275\u0275repeaterCreate(4, Bookmarks_For_5_Template, 5, 1, "section", 3, _forTrack0);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.bookmarkService.bookmarks().length === 0 ? 3 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.groupedBookmarks());
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Bookmarks, [{
    type: Component,
    args: [{
      selector: "app-bookmarks",
      standalone: true,
      imports: [],
      template: `
    <div class="space-y-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Bookmarks</h1>

      @if (bookmarkService.bookmarks().length === 0) {
        <div class="text-center py-16 text-gray-400 dark:text-gray-500 space-y-2">
          <p class="text-4xl">\u{1F516}</p>
          <p class="font-medium">No bookmarks yet</p>
          <p class="text-sm">Tap the bookmark icon on any chapter, SQL question, or Python exercise to save it here.</p>
        </div>
      }

      @for (group of groupedBookmarks(); track group.type) {
        <section class="space-y-2">
          <h2 class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            {{ groupLabel(group.type) }}
          </h2>
          @for (bm of group.items; track bm.itemId) {
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-3">
              <button (click)="navigate(bm)"
                      class="flex-1 text-left"
                      [attr.aria-label]="'Open bookmarked item: ' + bm.title">
                <p class="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">{{ bm.title }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {{ formatDate(bm.addedAt) }}
                </p>
              </button>
              <button (click)="remove(bm)"
                      aria-label="Remove bookmark"
                      class="p-1.5 text-amber-500 hover:text-gray-400 dark:hover:text-gray-500 transition-colors shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"/>
                </svg>
              </button>
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
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Bookmarks, { className: "Bookmarks", filePath: "src/app/features/bookmarks/bookmarks.ts", lineNumber: 50 });
})();
export {
  Bookmarks
};
//# sourceMappingURL=chunk-5LSGFSE3.js.map
