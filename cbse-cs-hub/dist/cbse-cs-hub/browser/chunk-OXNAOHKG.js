import {
  Component,
  Input,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-XM2PN737.js";

// src/app/shared/components/progress-bar/progress-bar.ts
var ProgressBar = class _ProgressBar {
  attempted = input.required(...ngDevMode ? [{ debugName: "attempted" }] : (
    /* istanbul ignore next */
    []
  ));
  total = input.required(...ngDevMode ? [{ debugName: "total" }] : (
    /* istanbul ignore next */
    []
  ));
  percentage = input.required(...ngDevMode ? [{ debugName: "percentage" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function ProgressBar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProgressBar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProgressBar, selectors: [["app-progress-bar"]], inputs: { attempted: [1, "attempted"], total: [1, "total"], percentage: [1, "percentage"] }, decls: 8, vars: 5, consts: [[1, "w-full"], [1, "flex", "justify-between", "text-xs", "text-gray-500", "dark:text-gray-400", "mb-1"], [1, "h-2", "bg-gray-200", "dark:bg-gray-700", "rounded-full", "overflow-hidden"], [1, "h-full", "bg-indigo-500", "dark:bg-indigo-400", "rounded-full", "transition-all", "duration-300"]], template: function ProgressBar_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "span");
      \u0275\u0275text(3);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "span");
      \u0275\u0275text(5);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(6, "div", 2);
      \u0275\u0275domElement(7, "div", 3);
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate2("", ctx.attempted(), "/", ctx.total(), " attempted");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.percentage(), "%");
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("width", ctx.percentage(), "%");
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressBar, [{
    type: Component,
    args: [{
      selector: "app-progress-bar",
      standalone: true,
      template: `
    <div class="w-full">
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{{ attempted() }}/{{ total() }} attempted</span>
        <span>{{ percentage() }}%</span>
      </div>
      <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300"
             [style.width.%]="percentage()">
        </div>
      </div>
    </div>
  `
    }]
  }], null, { attempted: [{ type: Input, args: [{ isSignal: true, alias: "attempted", required: true }] }], total: [{ type: Input, args: [{ isSignal: true, alias: "total", required: true }] }], percentage: [{ type: Input, args: [{ isSignal: true, alias: "percentage", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProgressBar, { className: "ProgressBar", filePath: "src/app/shared/components/progress-bar/progress-bar.ts", lineNumber: 20 });
})();

export {
  ProgressBar
};
//# sourceMappingURL=chunk-OXNAOHKG.js.map
