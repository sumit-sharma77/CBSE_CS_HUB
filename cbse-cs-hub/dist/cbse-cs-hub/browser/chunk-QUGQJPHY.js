import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-LG47JR2W.js";
import {
  Component,
  Input,
  Output,
  input,
  output,
  setClassMetadata,
  signal,
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
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext
} from "./chunk-XM2PN737.js";

// src/app/shared/components/search-bar/search-bar.ts
function SearchBar_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 5);
    \u0275\u0275listener("click", function SearchBar_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clear());
    });
    \u0275\u0275text(1, " \u2715 ");
    \u0275\u0275elementEnd();
  }
}
var SearchBar = class _SearchBar {
  placeholder = input("Search\u2026", ...ngDevMode ? [{ debugName: "placeholder" }] : (
    /* istanbul ignore next */
    []
  ));
  query = signal("", ...ngDevMode ? [{ debugName: "query" }] : (
    /* istanbul ignore next */
    []
  ));
  queryChange = output();
  debounceTimer = null;
  onInput(value) {
    this.query.set(value);
    if (this.debounceTimer)
      clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.queryChange.emit(value);
    }, 300);
  }
  clear() {
    this.query.set("");
    this.queryChange.emit("");
  }
  ngOnDestroy() {
    if (this.debounceTimer)
      clearTimeout(this.debounceTimer);
  }
  static \u0275fac = function SearchBar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SearchBar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SearchBar, selectors: [["app-search-bar"]], inputs: { placeholder: [1, "placeholder"] }, outputs: { queryChange: "queryChange" }, decls: 5, vars: 4, consts: [[1, "relative"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "h-4", "w-4", "text-gray-400"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"], ["type", "search", 1, "w-full", "pl-9", "pr-4", "py-2", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "placeholder-gray-400", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "text-sm", 3, "ngModelChange", "keydown.escape", "ngModel", "placeholder"], ["aria-label", "Clear search", 1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-gray-400", "hover:text-gray-600", "dark:hover:text-gray-200"], ["aria-label", "Clear search", 1, "absolute", "right-3", "top-1/2", "-translate-y-1/2", "text-gray-400", "hover:text-gray-600", "dark:hover:text-gray-200", 3, "click"]], template: function SearchBar_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(1, "svg", 1);
      \u0275\u0275element(2, "path", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(3, "input", 3);
      \u0275\u0275listener("ngModelChange", function SearchBar_Template_input_ngModelChange_3_listener($event) {
        return ctx.onInput($event);
      })("keydown.escape", function SearchBar_Template_input_keydown_escape_3_listener() {
        return ctx.clear();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, SearchBar_Conditional_4_Template, 2, 0, "button", 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275property("ngModel", ctx.query())("placeholder", ctx.placeholder());
      \u0275\u0275attribute("aria-label", ctx.placeholder());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.query() ? 4 : -1);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SearchBar, [{
    type: Component,
    args: [{
      selector: "app-search-bar",
      standalone: true,
      imports: [FormsModule],
      template: `
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg"
           fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
      </svg>
      <input
        type="search"
        [ngModel]="query()"
        (ngModelChange)="onInput($event)"
        (keydown.escape)="clear()"
        [placeholder]="placeholder()"
        class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        [attr.aria-label]="placeholder()"
      />
      @if (query()) {
        <button (click)="clear()" aria-label="Clear search"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          \u2715
        </button>
      }
    </div>
  `
    }]
  }], null, { placeholder: [{ type: Input, args: [{ isSignal: true, alias: "placeholder", required: false }] }], queryChange: [{ type: Output, args: ["queryChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SearchBar, { className: "SearchBar", filePath: "src/app/shared/components/search-bar/search-bar.ts", lineNumber: 33 });
})();

export {
  SearchBar
};
//# sourceMappingURL=chunk-QUGQJPHY.js.map
