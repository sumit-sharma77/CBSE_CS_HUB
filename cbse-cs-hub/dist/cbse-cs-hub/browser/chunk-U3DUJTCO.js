import {
  BookmarkService
} from "./chunk-RHQIL3TT.js";
import {
  Component,
  Input,
  computed,
  inject,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵnamespaceSVG
} from "./chunk-XM2PN737.js";

// src/app/shared/components/bookmark-btn/bookmark-btn.ts
function BookmarkBtn_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 1);
    \u0275\u0275domElement(1, "path", 3);
    \u0275\u0275domElementEnd();
  }
}
function BookmarkBtn_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 2);
    \u0275\u0275domElement(1, "path", 4);
    \u0275\u0275domElementEnd();
  }
}
var BookmarkBtn = class _BookmarkBtn {
  type = input.required(...ngDevMode ? [{ debugName: "type" }] : (
    /* istanbul ignore next */
    []
  ));
  itemId = input.required(...ngDevMode ? [{ debugName: "itemId" }] : (
    /* istanbul ignore next */
    []
  ));
  title = input.required(...ngDevMode ? [{ debugName: "title" }] : (
    /* istanbul ignore next */
    []
  ));
  bookmarkService = inject(BookmarkService);
  isBookmarked = computed(() => this.bookmarkService.isBookmarked(this.type(), this.itemId())(), ...ngDevMode ? [{ debugName: "isBookmarked" }] : (
    /* istanbul ignore next */
    []
  ));
  onToggle(event) {
    event.stopPropagation();
    this.bookmarkService.toggle(this.type(), this.itemId(), this.title());
  }
  static \u0275fac = function BookmarkBtn_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BookmarkBtn)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BookmarkBtn, selectors: [["app-bookmark-btn"]], inputs: { type: [1, "type"], itemId: [1, "itemId"], title: [1, "title"] }, decls: 3, vars: 6, consts: [[1, "p-1.5", "rounded-full", "hover:bg-gray-100", "dark:hover:bg-gray-700", "transition-colors", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 24 24", "fill", "currentColor", 1, "h-5", "w-5"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "h-5", "w-5"], ["d", "M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"]], template: function BookmarkBtn_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "button", 0);
      \u0275\u0275domListener("click", function BookmarkBtn_Template_button_click_0_listener($event) {
        return ctx.onToggle($event);
      });
      \u0275\u0275conditionalCreate(1, BookmarkBtn_Conditional_1_Template, 2, 0, ":svg:svg", 1)(2, BookmarkBtn_Conditional_2_Template, 2, 0, ":svg:svg", 2);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("text-amber-500", ctx.isBookmarked())("text-gray-400", !ctx.isBookmarked());
      \u0275\u0275attribute("aria-label", ctx.isBookmarked() ? "Remove bookmark" : "Add bookmark");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isBookmarked() ? 1 : 2);
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BookmarkBtn, [{
    type: Component,
    args: [{
      selector: "app-bookmark-btn",
      standalone: true,
      template: `
    <button (click)="onToggle($event)"
            [attr.aria-label]="isBookmarked() ? 'Remove bookmark' : 'Add bookmark'"
            class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            [class.text-amber-500]="isBookmarked()"
            [class.text-gray-400]="!isBookmarked()">
      @if (isBookmarked()) {
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"/>
        </svg>
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M5 3a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2H5z"/>
        </svg>
      }
    </button>
  `
    }]
  }], null, { type: [{ type: Input, args: [{ isSignal: true, alias: "type", required: true }] }], itemId: [{ type: Input, args: [{ isSignal: true, alias: "itemId", required: true }] }], title: [{ type: Input, args: [{ isSignal: true, alias: "title", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BookmarkBtn, { className: "BookmarkBtn", filePath: "src/app/shared/components/bookmark-btn/bookmark-btn.ts", lineNumber: 26 });
})();

export {
  BookmarkBtn
};
//# sourceMappingURL=chunk-U3DUJTCO.js.map
