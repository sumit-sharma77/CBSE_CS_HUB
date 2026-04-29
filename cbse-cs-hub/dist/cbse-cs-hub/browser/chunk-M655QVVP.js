import {
  Pipe,
  setClassMetadata,
  ɵɵdefinePipe
} from "./chunk-XM2PN737.js";

// src/app/shared/pipes/time-ago.pipe.ts
var TimeAgoPipe = class _TimeAgoPipe {
  transform(value) {
    if (!value)
      return "";
    const date = new Date(value);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1e3);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffSec < 60)
      return "just now";
    if (diffMin < 60)
      return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    if (diffHr < 24)
      return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
    if (diffDay === 1)
      return "yesterday";
    if (diffDay < 7)
      return `${diffDay} days ago`;
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }
  static \u0275fac = function TimeAgoPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TimeAgoPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "timeAgo", type: _TimeAgoPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TimeAgoPipe, [{
    type: Pipe,
    args: [{ name: "timeAgo", standalone: true }]
  }], null, null);
})();

export {
  TimeAgoPipe
};
//# sourceMappingURL=chunk-M655QVVP.js.map
