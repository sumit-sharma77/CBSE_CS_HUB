import {
  CodeBlock
} from "./chunk-J4GI6IZO.js";
import {
  BookmarkBtn
} from "./chunk-U3DUJTCO.js";
import "./chunk-RHQIL3TT.js";
import {
  ActivatedRoute,
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
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/study-notes/chapter-viewer/chapter-viewer.ts
var _c0 = () => [];
var _forTrack0 = ($index, $item) => $item.heading;
function ChapterViewer_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1, "Loading chapter\u2026");
    \u0275\u0275elementEnd();
  }
}
function ChapterViewer_Conditional_2_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tag_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tag_r2, " ");
  }
}
function ChapterViewer_Conditional_2_For_11_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-code-block", 13);
  }
  if (rf & 2) {
    const block_r3 = ctx.$implicit;
    \u0275\u0275property("language", block_r3.language)("code", block_r3.code)("explanation", block_r3.explanation ?? "");
  }
}
function ChapterViewer_Conditional_2_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section")(1, "h2", 11);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 12);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, ChapterViewer_Conditional_2_For_11_For_6_Template, 1, 3, "app-code-block", 13, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", section_r4.heading, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", section_r4.content, " ");
    \u0275\u0275advance();
    \u0275\u0275repeater(section_r4.codeBlocks ?? \u0275\u0275pureFunction0(2, _c0));
  }
}
function ChapterViewer_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2)(1, "div")(2, "p", 3);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h1", 4);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 5);
    \u0275\u0275repeaterCreate(7, ChapterViewer_Conditional_2_For_8_Template, 2, 1, "span", 6, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(9, "app-bookmark-btn", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(10, ChapterViewer_Conditional_2_For_11_Template, 7, 3, "section", null, _forTrack0);
    \u0275\u0275elementStart(12, "div", 8)(13, "button", 9);
    \u0275\u0275listener("click", function ChapterViewer_Conditional_2_Template_button_click_13_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.navigate(-1));
    });
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "button", 10);
    \u0275\u0275listener("click", function ChapterViewer_Conditional_2_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r4 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r4.navigate(1));
    });
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_10_0;
    const ctx_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2(" Class ", ctx_r4.chapter().classLevel, " \xB7 Chapter ", ctx_r4.chapter().chapterNumber, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r4.chapter().title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r4.chapter().tags);
    \u0275\u0275advance(2);
    \u0275\u0275property("itemId", ctx_r4.chapter().id)("title", ctx_r4.chapter().title);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r4.chapter().sections);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", !ctx_r4.prevChapter());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u2190 ", ((tmp_8_0 = ctx_r4.prevChapter()) == null ? null : tmp_8_0.title) ?? "Previous", " ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r4.nextChapter());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_10_0 = ctx_r4.nextChapter()) == null ? null : tmp_10_0.title) ?? "Next", " \u2192 ");
  }
}
function ChapterViewer_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275text(1, "Chapter not found.");
    \u0275\u0275elementEnd();
  }
}
var ChapterViewer = class _ChapterViewer {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  chapter = signal(null, ...ngDevMode ? [{ debugName: "chapter" }] : (
    /* istanbul ignore next */
    []
  ));
  prevChapter = signal(null, ...ngDevMode ? [{ debugName: "prevChapter" }] : (
    /* istanbul ignore next */
    []
  ));
  nextChapter = signal(null, ...ngDevMode ? [{ debugName: "nextChapter" }] : (
    /* istanbul ignore next */
    []
  ));
  allChapters = [];
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("chapterId");
      this.loadChapter(id);
    });
  }
  loadChapter(id) {
    this.loading.set(true);
    Promise.all([
      this.http.get("assets/content/study-notes/class-12-index.json").toPromise(),
      this.http.get("assets/content/study-notes/class-11-index.json").toPromise()
    ]).then(([c12, c11]) => {
      this.allChapters = [...c12 ?? [], ...c11 ?? []].sort((a, b) => {
        if (a.classLevel !== b.classLevel)
          return b.classLevel - a.classLevel;
        return a.chapterNumber - b.chapterNumber;
      });
      const idx = this.allChapters.findIndex((c) => c.id === id);
      this.prevChapter.set(idx > 0 ? this.allChapters[idx - 1] : null);
      this.nextChapter.set(idx < this.allChapters.length - 1 ? this.allChapters[idx + 1] : null);
      const entry = this.allChapters.find((c) => c.id === id);
      const assetPath = entry?.assetPath ?? `study-notes/class-12/${id}.json`;
      this.http.get(`assets/content/${assetPath}`).subscribe({
        next: (chapter) => {
          this.chapter.set(chapter);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    });
  }
  navigate(dir) {
    const target = dir === -1 ? this.prevChapter() : this.nextChapter();
    if (target) {
      this.router.navigate(["/study-notes", target.id]);
    }
  }
  static \u0275fac = function ChapterViewer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChapterViewer)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChapterViewer, selectors: [["app-chapter-viewer"]], decls: 4, vars: 1, consts: [[1, "space-y-6", "max-w-2xl"], [1, "text-center", "py-12", "text-gray-500", "dark:text-gray-400"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "text-sm", "text-indigo-600", "dark:text-indigo-400", "font-medium"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100", "mt-1"], [1, "flex", "flex-wrap", "gap-1.5", "mt-2"], [1, "text-xs", "px-2", "py-0.5", "rounded-full", "bg-indigo-50", "dark:bg-indigo-900/40", "text-indigo-700", "dark:text-indigo-300"], ["type", "chapter", 3, "itemId", "title"], [1, "flex", "justify-between", "items-center", "pt-4", "border-t", "border-gray-200", "dark:border-gray-700"], ["aria-label", "Previous chapter", 1, "flex", "items-center", "gap-2", "px-4", "py-2", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "text-sm", "text-gray-700", "dark:text-gray-300", "hover:bg-gray-50", "dark:hover:bg-gray-800", "disabled:opacity-30", "disabled:cursor-not-allowed", 3, "click", "disabled"], ["aria-label", "Next chapter", 1, "flex", "items-center", "gap-2", "px-4", "py-2", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "text-sm", "text-gray-700", "dark:text-gray-300", "hover:bg-gray-50", "dark:hover:bg-gray-800", "disabled:opacity-30", "disabled:cursor-not-allowed", 3, "click", "disabled"], [1, "text-xl", "font-semibold", "text-gray-800", "dark:text-gray-200", "mb-3", "border-b", "border-gray-200", "dark:border-gray-700", "pb-2"], [1, "text-gray-700", "dark:text-gray-300", "leading-relaxed", "whitespace-pre-line", "text-sm"], [3, "language", "code", "explanation"]], template: function ChapterViewer_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, ChapterViewer_Conditional_1_Template, 2, 0, "div", 1)(2, ChapterViewer_Conditional_2_Template, 17, 9)(3, ChapterViewer_Conditional_3_Template, 2, 0, "div", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading() ? 1 : ctx.chapter() ? 2 : 3);
    }
  }, dependencies: [CodeBlock, BookmarkBtn], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChapterViewer, [{
    type: Component,
    args: [{
      selector: "app-chapter-viewer",
      standalone: true,
      imports: [CodeBlock, BookmarkBtn],
      template: `
    <div class="space-y-6 max-w-2xl">
      @if (loading()) {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Loading chapter\u2026</div>
      } @else if (chapter()) {
        <!-- Header -->
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
              Class {{ chapter()!.classLevel }} \xB7 Chapter {{ chapter()!.chapterNumber }}
            </p>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {{ chapter()!.title }}
            </h1>
            <div class="flex flex-wrap gap-1.5 mt-2">
              @for (tag of chapter()!.tags; track tag) {
                <span class="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                  {{ tag }}
                </span>
              }
            </div>
          </div>
          <app-bookmark-btn type="chapter"
                            [itemId]="chapter()!.id"
                            [title]="chapter()!.title">
          </app-bookmark-btn>
        </div>

        <!-- Sections -->
        @for (section of chapter()!.sections; track section.heading) {
          <section>
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
              {{ section.heading }}
            </h2>
            <div class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">
              {{ section.content }}
            </div>
            @for (block of section.codeBlocks ?? []; track $index) {
              <app-code-block [language]="block.language"
                              [code]="block.code"
                              [explanation]="block.explanation ?? ''">
              </app-code-block>
            }
          </section>
        }

        <!-- Prev / Next Navigation -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <button (click)="navigate(-1)"
                  [disabled]="!prevChapter()"
                  aria-label="Previous chapter"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
            \u2190 {{ prevChapter()?.title ?? 'Previous' }}
          </button>
          <button (click)="navigate(1)"
                  [disabled]="!nextChapter()"
                  aria-label="Next chapter"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">
            {{ nextChapter()?.title ?? 'Next' }} \u2192
          </button>
        </div>
      } @else {
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">Chapter not found.</div>
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChapterViewer, { className: "ChapterViewer", filePath: "src/app/features/study-notes/chapter-viewer/chapter-viewer.ts", lineNumber: 108 });
})();
export {
  ChapterViewer
};
//# sourceMappingURL=chunk-K5MQIZQR.js.map
