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

// src/app/core/services/bookmark.service.ts
var STORAGE_KEY = "cbse-bookmarks";
var BookmarkService = class _BookmarkService {
  storage = inject(StorageService);
  bookmarks = signal(this.storage.get(STORAGE_KEY) ?? [], ...ngDevMode ? [{ debugName: "bookmarks" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.bookmarks());
    });
  }
  toggle(type, itemId, title) {
    const current = this.bookmarks();
    const exists = current.some((b) => b.type === type && b.itemId === itemId);
    if (exists) {
      this.bookmarks.set(current.filter((b) => !(b.type === type && b.itemId === itemId)));
    } else {
      this.bookmarks.set([...current, { type, itemId, title, addedAt: (/* @__PURE__ */ new Date()).toISOString() }]);
    }
  }
  isBookmarked(type, itemId) {
    return computed(() => this.bookmarks().some((b) => b.type === type && b.itemId === itemId));
  }
  clear() {
    this.bookmarks.set([]);
    this.storage.remove(STORAGE_KEY);
  }
  static \u0275fac = function BookmarkService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BookmarkService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BookmarkService, factory: _BookmarkService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BookmarkService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  BookmarkService
};
//# sourceMappingURL=chunk-RHQIL3TT.js.map
