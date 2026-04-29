import {
  RouterLink
} from "./chunk-S2RS62IU.js";
import "./chunk-BVJZPSLF.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-XM2PN737.js";
import "./chunk-OCBFZOLU.js";

// src/app/features/forbidden/forbidden.ts
var ForbiddenComponent = class _ForbiddenComponent {
  static \u0275fac = function ForbiddenComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ForbiddenComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ForbiddenComponent, selectors: [["app-forbidden"]], decls: 10, vars: 0, consts: [[1, "min-h-screen", "flex", "items-center", "justify-center", "px-4"], [1, "text-center", "space-y-4", "max-w-sm"], [1, "text-6xl"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "text-gray-600", "dark:text-gray-400"], ["routerLink", "/", 1, "inline-block", "mt-4", "px-5", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "rounded-lg", "font-medium", "transition-colors"]], template: function ForbiddenComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
      \u0275\u0275text(3, "\u{1F6AB}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "h1", 3);
      \u0275\u0275text(5, "403 \u2014 Access Denied");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 4);
      \u0275\u0275text(7, " The Admin panel is only available in development mode. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "a", 5);
      \u0275\u0275text(9, " Back to Home ");
      \u0275\u0275elementEnd()()();
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ForbiddenComponent, [{
    type: Component,
    args: [{
      selector: "app-forbidden",
      standalone: true,
      imports: [RouterLink],
      template: `
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="text-center space-y-4 max-w-sm">
        <div class="text-6xl">\u{1F6AB}</div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">403 \u2014 Access Denied</h1>
        <p class="text-gray-600 dark:text-gray-400">
          The Admin panel is only available in development mode.
        </p>
        <a routerLink="/"
           class="inline-block mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          Back to Home
        </a>
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ForbiddenComponent, { className: "ForbiddenComponent", filePath: "src/app/features/forbidden/forbidden.ts", lineNumber: 24 });
})();
export {
  ForbiddenComponent
};
//# sourceMappingURL=chunk-KZSIBSTD.js.map
