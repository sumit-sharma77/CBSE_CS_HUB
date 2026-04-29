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

// src/app/core/services/mcq-progress.service.ts
var STORAGE_KEY = "cbse-mcq-progress";
var McqProgressService = class _McqProgressService {
  storage = inject(StorageService);
  progress = signal(this.storage.get(STORAGE_KEY) ?? {}, ...ngDevMode ? [{ debugName: "progress" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      this.storage.set(STORAGE_KEY, this.progress());
    });
  }
  /** Save a single MCQ answer. */
  saveAnswer(setId, questionId, selectedIndex, correctIndex) {
    const current = this.progress();
    const session = current[setId] ?? { answers: {}, score: 0, total: 0 };
    if (session.answers[questionId] !== void 0)
      return;
    const newScore = session.score + (selectedIndex === correctIndex ? 1 : 0);
    const updatedSession = __spreadProps(__spreadValues({}, session), {
      answers: __spreadProps(__spreadValues({}, session.answers), { [questionId]: selectedIndex }),
      score: newScore
    });
    this.progress.set(__spreadProps(__spreadValues({}, current), { [setId]: updatedSession }));
  }
  /** Mark a quiz set as completed with final score. */
  markCompleted(setId, total) {
    const current = this.progress();
    const session = current[setId] ?? { answers: {}, score: 0, total };
    this.progress.set(__spreadProps(__spreadValues({}, current), {
      [setId]: __spreadProps(__spreadValues({}, session), { total, completedAt: (/* @__PURE__ */ new Date()).toISOString() })
    }));
  }
  /** Get saved session for a set (or null if not started). */
  getSession(setId) {
    return this.progress()[setId] ?? null;
  }
  /** Reset progress for a single set. */
  resetSet(setId) {
    const current = __spreadValues({}, this.progress());
    delete current[setId];
    this.progress.set(current);
  }
  /** Reset all MCQ progress. */
  resetAll() {
    this.progress.set({});
    this.storage.remove(STORAGE_KEY);
  }
  static \u0275fac = function McqProgressService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _McqProgressService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _McqProgressService, factory: _McqProgressService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(McqProgressService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

export {
  McqProgressService
};
//# sourceMappingURL=chunk-7MFXBZF3.js.map
