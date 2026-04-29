import {
  StorageService
} from "./chunk-UZIXFQP3.js";
import {
  Injectable,
  computed,
  effect,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XM2PN737.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-OCBFZOLU.js";

// src/app/core/services/progress.service.ts
var STORAGE_KEY = "cbse-progress";
var DEFAULT_STORE = { sql: {}, python: {} };
var ProgressService = class _ProgressService {
  storage = inject(StorageService);
  progress = signal(this.storage.get(STORAGE_KEY) ?? DEFAULT_STORE, ...ngDevMode ? [{ debugName: "progress" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.progress());
    });
  }
  recordAttempt(module, categoryKey, itemId) {
    const current = this.progress();
    const section = module === "sql" ? current.sql : current.python;
    const existing = section[categoryKey] ?? { attempted: [], total: 0 };
    if (existing.attempted.includes(itemId))
      return;
    const updated = __spreadProps(__spreadValues({}, existing), { attempted: [...existing.attempted, itemId] });
    this.progress.set(__spreadProps(__spreadValues({}, current), {
      [module]: __spreadProps(__spreadValues({}, section), { [categoryKey]: updated })
    }));
  }
  updateTotal(module, categoryKey, total) {
    const current = this.progress();
    const section = module === "sql" ? current.sql : current.python;
    const existing = section[categoryKey] ?? { attempted: [], total: 0 };
    this.progress.set(__spreadProps(__spreadValues({}, current), {
      [module]: __spreadProps(__spreadValues({}, section), { [categoryKey]: __spreadProps(__spreadValues({}, existing), { total }) })
    }));
  }
  getCategoryProgress(module, categoryKey) {
    return computed(() => {
      const section = module === "sql" ? this.progress().sql : this.progress().python;
      const cat = section[categoryKey] ?? { attempted: [], total: 0 };
      const attempted = cat.attempted.length;
      const total = cat.total;
      const percentage = total > 0 ? Math.round(attempted / total * 100) : 0;
      return { attempted, total, percentage };
    });
  }
  reset() {
    this.progress.set(DEFAULT_STORE);
    this.storage.remove(STORAGE_KEY);
  }
  static \u0275fac = function ProgressService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProgressService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProgressService, factory: _ProgressService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  ProgressService
};
//# sourceMappingURL=chunk-JEU24C5L.js.map
