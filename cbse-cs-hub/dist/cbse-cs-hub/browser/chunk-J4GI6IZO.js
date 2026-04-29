import {
  Component,
  Input,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵnextContext,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-XM2PN737.js";

// src/app/shared/components/code-block/code-block.ts
function CodeBlock_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 6);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u{1F4A1} ", ctx_r0.explanation(), " ");
  }
}
var CodeBlock = class _CodeBlock {
  language = input("text", ...ngDevMode ? [{ debugName: "language" }] : (
    /* istanbul ignore next */
    []
  ));
  code = input.required(...ngDevMode ? [{ debugName: "code" }] : (
    /* istanbul ignore next */
    []
  ));
  explanation = input("", ...ngDevMode ? [{ debugName: "explanation" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function CodeBlock_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CodeBlock)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CodeBlock, selectors: [["app-code-block"]], inputs: { language: [1, "language"], code: [1, "code"], explanation: [1, "explanation"] }, decls: 9, vars: 3, consts: [["codeEl", ""], [1, "my-3", "rounded-lg", "overflow-hidden", "border", "border-gray-200", "dark:border-gray-700"], [1, "flex", "items-center", "justify-between", "px-3", "py-1.5", "bg-gray-100", "dark:bg-gray-800", "border-b", "border-gray-200", "dark:border-gray-700"], [1, "text-xs", "font-mono", "text-gray-500", "dark:text-gray-400", "uppercase"], [1, "overflow-x-auto", "bg-gray-50", "dark:bg-gray-900", "p-4", "text-sm"], [1, "font-mono", "text-gray-800", "dark:text-gray-200"], [1, "px-4", "py-2", "bg-amber-50", "dark:bg-amber-900/20", "border-t", "border-amber-100", "dark:border-amber-900/30", "text-sm", "text-amber-800", "dark:text-amber-300"]], template: function CodeBlock_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 1)(1, "div", 2)(2, "span", 3);
      \u0275\u0275text(3);
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(4, "pre", 4)(5, "code", 5, 0);
      \u0275\u0275text(7);
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(8, CodeBlock_Conditional_8_Template, 2, 1, "div", 6);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.language());
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.code());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.explanation() ? 8 : -1);
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CodeBlock, [{
    type: Component,
    args: [{
      selector: "app-code-block",
      standalone: true,
      template: `
    <div class="my-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span class="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">{{ language() }}</span>
      </div>
      <pre class="overflow-x-auto bg-gray-50 dark:bg-gray-900 p-4 text-sm"><code #codeEl class="font-mono text-gray-800 dark:text-gray-200">{{ code() }}</code></pre>
      @if (explanation()) {
        <div class="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-t border-amber-100 dark:border-amber-900/30 text-sm text-amber-800 dark:text-amber-300">
          \u{1F4A1} {{ explanation() }}
        </div>
      }
    </div>
  `
    }]
  }], null, { language: [{ type: Input, args: [{ isSignal: true, alias: "language", required: false }] }], code: [{ type: Input, args: [{ isSignal: true, alias: "code", required: true }] }], explanation: [{ type: Input, args: [{ isSignal: true, alias: "explanation", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CodeBlock, { className: "CodeBlock", filePath: "src/app/shared/components/code-block/code-block.ts", lineNumber: 20 });
})();

export {
  CodeBlock
};
//# sourceMappingURL=chunk-J4GI6IZO.js.map
