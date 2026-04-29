import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-XM2PN737.js";

// src/app/core/services/storage.service.ts
var StorageService = class _StorageService {
  quotaExceeded = signal(false, ...ngDevMode ? [{ debugName: "quotaExceeded" }] : (
    /* istanbul ignore next */
    []
  ));
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null)
        return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.quotaExceeded.set(false);
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        this.quotaExceeded.set(true);
      }
    }
  }
  getString(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  setString(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        this.quotaExceeded.set(true);
      }
    }
  }
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
    }
  }
  static \u0275fac = function StorageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StorageService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _StorageService, factory: _StorageService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StorageService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  StorageService
};
//# sourceMappingURL=chunk-UZIXFQP3.js.map
