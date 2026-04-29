import {
  StorageService
} from "./chunk-UZIXFQP3.js";
import {
  Injectable,
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

// src/app/core/services/recently-viewed.service.ts
var STORAGE_KEY = "cbse-recently-viewed";
var MAX_ENTRIES = 10;
var RecentlyViewedService = class _RecentlyViewedService {
  storage = inject(StorageService);
  entries = signal(this.storage.get(STORAGE_KEY) ?? [], ...ngDevMode ? [{ debugName: "entries" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.entries());
    });
  }
  track(entry) {
    const current = this.entries().filter((e) => e.itemId !== entry.itemId);
    const updated = [
      __spreadProps(__spreadValues({}, entry), { visitedAt: (/* @__PURE__ */ new Date()).toISOString() }),
      ...current
    ].slice(0, MAX_ENTRIES);
    this.entries.set(updated);
  }
  clear() {
    this.entries.set([]);
    this.storage.remove(STORAGE_KEY);
  }
  static \u0275fac = function RecentlyViewedService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RecentlyViewedService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RecentlyViewedService, factory: _RecentlyViewedService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RecentlyViewedService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  RecentlyViewedService
};
//# sourceMappingURL=chunk-4WECW4T2.js.map
