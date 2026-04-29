import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormArrayName,
  FormBuilder,
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  NumberValueAccessor,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-LG47JR2W.js";
import {
  HttpClient
} from "./chunk-BVJZPSLF.js";
import {
  Component,
  DecimalPipe,
  DestroyRef,
  HostListener,
  Injectable,
  Output,
  RuntimeError,
  assertInInjectionContext,
  assertNotInReactiveContext,
  catchError,
  computed,
  inject,
  map,
  of,
  output,
  setClassMetadata,
  signal,
  tap,
  ɵsetClassDebugInfo,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-XM2PN737.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-OCBFZOLU.js";

// src/app/features/admin/services/admin-content-loader.service.ts
var API_BASE = "/api/content/";
var AdminContentLoaderService = class _AdminContentLoaderService {
  http = inject(HttpClient);
  cache = /* @__PURE__ */ new Map();
  load(assetPath) {
    if (this.cache.has(assetPath)) {
      return this.cache.get(assetPath);
    }
    const sig = signal(null, ...ngDevMode ? [{ debugName: "sig" }] : (
      /* istanbul ignore next */
      []
    ));
    this.cache.set(assetPath, sig);
    this.fetch(assetPath, sig);
    return sig;
  }
  /**
   * Writes the questions array back to disk via the local content server.
   * The server handles both plain-array files and wrapper-object files.
   * On success the in-memory cache signal is updated so the list rerenders.
   */
  save(assetPath, items) {
    return this.http.put(API_BASE + assetPath, items).pipe(tap(() => {
      const sig = this.cache.get(assetPath);
      if (sig)
        sig.set(items);
    }), map(() => void 0), catchError((err) => {
      const msg = err.status === 0 ? "Content server not reachable. Is it running? (restart dev server)" : `Save failed: ${err.status} ${err.statusText}`;
      throw new Error(msg);
    }));
  }
  reload(assetPath) {
    const sig = this.cache.get(assetPath);
    if (sig) {
      this.cache.delete(assetPath);
      this.fetch(assetPath, sig);
    }
  }
  fetch(assetPath, sig) {
    this.http.get(API_BASE + assetPath).pipe(catchError((err) => of(err.status === 404 ? [] : null))).subscribe((data) => sig.set(data));
  }
  static \u0275fac = function AdminContentLoaderService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminContentLoaderService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminContentLoaderService, factory: _AdminContentLoaderService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminContentLoaderService, [{
    type: Injectable
  }], null, null);
})();

// src/app/features/admin/services/admin-id-generator.service.ts
var AdminIdGeneratorService = class _AdminIdGeneratorService {
  nextId(existingItems, prefix) {
    let max = 0;
    for (const item of existingItems) {
      if (item.id.startsWith(prefix + "-")) {
        const suffix = item.id.slice(prefix.length + 1);
        const num = parseInt(suffix, 10);
        if (!isNaN(num) && num > max) {
          max = num;
        }
      }
    }
    const next = max + 1;
    return `${prefix}-${String(next).padStart(3, "0")}`;
  }
  validateId(proposedId, existingItems) {
    return !existingItems.some((item) => item.id === proposedId);
  }
  static \u0275fac = function AdminIdGeneratorService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminIdGeneratorService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminIdGeneratorService, factory: _AdminIdGeneratorService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminIdGeneratorService, [{
    type: Injectable
  }], null, null);
})();

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
/**
 * @license Angular v21.2.10
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */
function toSignal(source, options) {
  typeof ngDevMode !== "undefined" && ngDevMode && assertNotInReactiveContext(toSignal, "Invoking `toSignal` causes new subscriptions every time. Consider moving `toSignal` outside of the reactive context and read the signal value where needed.");
  const requiresCleanup = !options?.manualCleanup;
  if (ngDevMode && requiresCleanup && !options?.injector) {
    assertInInjectionContext(toSignal);
  }
  const cleanupRef = requiresCleanup ? options?.injector?.get(DestroyRef) ?? inject(DestroyRef) : null;
  const equal = makeToSignalEqual(options?.equal);
  let state;
  if (options?.requireSync) {
    state = signal({
      kind: 0
    }, __spreadValues({
      equal
    }, ngDevMode ? createDebugNameObject(options?.debugName, "state") : void 0));
  } else {
    state = signal({
      kind: 1,
      value: options?.initialValue
    }, __spreadValues({
      equal
    }, ngDevMode ? createDebugNameObject(options?.debugName, "state") : void 0));
  }
  let destroyUnregisterFn;
  const sub = source.subscribe({
    next: (value) => state.set({
      kind: 1,
      value
    }),
    error: (error) => {
      state.set({
        kind: 2,
        error
      });
      destroyUnregisterFn?.();
    },
    complete: () => {
      destroyUnregisterFn?.();
    }
  });
  if (options?.requireSync && state().kind === 0) {
    throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
  }
  destroyUnregisterFn = cleanupRef?.onDestroy(sub.unsubscribe.bind(sub));
  return computed(() => {
    const current = state();
    switch (current.kind) {
      case 1:
        return current.value;
      case 2:
        throw current.error;
      case 0:
        throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
    }
  }, __spreadValues({
    equal: options?.equal
  }, ngDevMode ? createDebugNameObject(options?.debugName, "source") : void 0));
}
function makeToSignalEqual(userEquality = Object.is) {
  return (a, b) => a.kind === 1 && b.kind === 1 && userEquality(a.value, b.value);
}
function createDebugNameObject(toSignalDebugName, internalSignalDebugName) {
  return {
    debugName: `toSignal${toSignalDebugName ? "#" + toSignalDebugName : ""}.${internalSignalDebugName}`
  };
}

// src/app/features/admin/services/admin-ocr.service.ts
var AdminOcrService = class _AdminOcrService {
  OCR_TIMEOUT_MS = 1e4;
  async processImage(imageData) {
    const { createWorker } = await import("./chunk-45YVBFLT.js");
    const worker = await createWorker("eng");
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("OCR timed out after 10 seconds")), this.OCR_TIMEOUT_MS));
    try {
      const url = URL.createObjectURL(imageData);
      const result = await Promise.race([
        worker.recognize(url),
        timeoutPromise
      ]);
      URL.revokeObjectURL(url);
      const text = result.data.text;
      const confidence = result.data.confidence;
      return {
        text,
        confidence,
        lowConfidence: confidence < 70
      };
    } finally {
      await worker.terminate();
    }
  }
  parseOptionsFromText(text) {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    const optionPattern = /^(?:\(?\s*[AaBbCcDd1234]\s*[\)\.]\s*)(.+)/;
    const extracted = [];
    const questionLines = [];
    let foundFirstOption = false;
    for (const line of lines) {
      const match = line.match(optionPattern);
      if (match) {
        foundFirstOption = true;
        extracted.push(match[1].trim());
      } else if (!foundFirstOption) {
        questionLines.push(line);
      }
    }
    const questionText = questionLines.join(" ").trim() || text.trim();
    if (extracted.length === 4) {
      return {
        questionText,
        options: extracted
      };
    }
    return { questionText, options: null };
  }
  static \u0275fac = function AdminOcrService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminOcrService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AdminOcrService, factory: _AdminOcrService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminOcrService, [{
    type: Injectable
  }], null, null);
})();

// src/app/features/admin/ocr-zone/ocr-zone.ts
function OcrZoneComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 7);
    \u0275\u0275domElement(1, "span", 10);
    \u0275\u0275text(2, " Extracting text\u2026 ");
    \u0275\u0275domElementEnd();
  }
}
function OcrZoneComponent_Conditional_13_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 11)(1, "p", 16);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "number");
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" \u26A0\uFE0F Low OCR confidence (", \u0275\u0275pipeBind2(3, 1, ctx_r1.result().confidence, "1.0-0"), "%) \u2014 please review extracted text carefully. ");
  }
}
function OcrZoneComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 8);
    \u0275\u0275conditionalCreate(1, OcrZoneComponent_Conditional_13_Conditional_1_Template, 4, 4, "div", 11);
    \u0275\u0275domElementStart(2, "div", 12)(3, "p", 13);
    \u0275\u0275text(4, "Extracted text:");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "p", 14);
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(7, "button", 15);
    \u0275\u0275domListener("click", function OcrZoneComponent_Conditional_13_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.applyResult());
    });
    \u0275\u0275text(8, " Apply to Form ");
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.result().lowConfidence ? 1 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.result().text);
  }
}
function OcrZoneComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 9)(1, "div", 17)(2, "p", 18);
    \u0275\u0275text(3);
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage());
  }
}
var ALLOWED_TYPES = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
var MAX_SIZE_MB = 5;
var OcrZoneComponent = class _OcrZoneComponent {
  parsed = output();
  ocr = inject(AdminOcrService);
  status = signal("idle", ...ngDevMode ? [{ debugName: "status" }] : (
    /* istanbul ignore next */
    []
  ));
  dragOver = signal(false, ...ngDevMode ? [{ debugName: "dragOver" }] : (
    /* istanbul ignore next */
    []
  ));
  result = signal(null, ...ngDevMode ? [{ debugName: "result" }] : (
    /* istanbul ignore next */
    []
  ));
  errorMessage = signal("", ...ngDevMode ? [{ debugName: "errorMessage" }] : (
    /* istanbul ignore next */
    []
  ));
  lastParsed = null;
  onWindowPaste(event) {
    const items = event.clipboardData?.items;
    if (!items)
      return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const blob = item.getAsFile();
        if (blob)
          this.processFile(blob);
        break;
      }
    }
  }
  onDragOver(event) {
    event.preventDefault();
    this.dragOver.set(true);
  }
  onDragLeave() {
    this.dragOver.set(false);
  }
  onDrop(event) {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file)
      this.processFile(file);
  }
  onFileInput(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (file)
      this.processFile(file);
  }
  processFile(file) {
    const type = file instanceof File ? file.type : file.type;
    const size = file.size;
    if (!ALLOWED_TYPES.has(type)) {
      this.status.set("error");
      this.errorMessage.set(`Unsupported file type: ${type}. Use PNG, JPEG, or WEBP.`);
      return;
    }
    if (size > MAX_SIZE_MB * 1024 * 1024) {
      this.status.set("error");
      this.errorMessage.set(`Image is too large (${(size / 1024 / 1024).toFixed(1)} MB). Maximum is ${MAX_SIZE_MB} MB.`);
      return;
    }
    this.status.set("processing");
    this.result.set(null);
    this.ocr.processImage(file).then((ocrResult) => {
      this.result.set(ocrResult);
      this.lastParsed = this.ocr.parseOptionsFromText(ocrResult.text);
      this.status.set("done");
    }).catch((err) => {
      this.status.set("error");
      this.errorMessage.set(err.message ?? "OCR failed \u2014 please try again.");
    });
  }
  applyResult() {
    if (this.lastParsed) {
      this.parsed.emit(this.lastParsed);
    }
  }
  static \u0275fac = function OcrZoneComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OcrZoneComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _OcrZoneComponent, selectors: [["app-ocr-zone"]], hostBindings: function OcrZoneComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("paste", function OcrZoneComponent_paste_HostBindingHandler($event) {
        return ctx.onWindowPaste($event);
      }, \u0275\u0275resolveWindow);
    }
  }, outputs: { parsed: "parsed" }, features: [\u0275\u0275ProvidersFeature([AdminOcrService])], decls: 15, vars: 5, consts: [[1, "rounded-xl", "border-2", "border-dashed", "transition-colors", 3, "dragover", "dragleave", "drop"], [1, "p-4", "text-center", "space-y-2"], [1, "text-2xl"], [1, "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "text-indigo-600", "dark:text-indigo-400", "underline", "cursor-pointer", "hover:no-underline"], ["type", "file", "accept", "image/*", 1, "sr-only", 3, "change"], [1, "px-4", "pb-4", "flex", "items-center", "justify-center", "gap-2", "text-sm", "text-indigo-600", "dark:text-indigo-400"], [1, "px-4", "pb-4", "space-y-2"], [1, "px-4", "pb-4"], [1, "inline-block", "h-4", "w-4", "animate-spin", "rounded-full", "border-2", "border-current", "border-t-transparent"], [1, "rounded-lg", "bg-amber-50", "dark:bg-amber-900/30", "border", "border-amber-200", "dark:border-amber-700", "px-3", "py-2"], [1, "rounded-lg", "bg-white", "dark:bg-gray-900", "border", "border-gray-200", "dark:border-gray-700", "p-3"], [1, "text-xs", "font-medium", "text-gray-500", "dark:text-gray-400", "mb-1"], [1, "text-sm", "text-gray-800", "dark:text-gray-200", "whitespace-pre-wrap"], ["type", "button", 1, "w-full", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click"], [1, "text-xs", "text-amber-700", "dark:text-amber-300"], [1, "rounded-lg", "bg-red-50", "dark:bg-red-900/30", "border", "border-red-200", "dark:border-red-700", "px-3", "py-2"], [1, "text-xs", "text-red-700", "dark:text-red-300"]], template: function OcrZoneComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0);
      \u0275\u0275domListener("dragover", function OcrZoneComponent_Template_div_dragover_0_listener($event) {
        return ctx.onDragOver($event);
      })("dragleave", function OcrZoneComponent_Template_div_dragleave_0_listener() {
        return ctx.onDragLeave();
      })("drop", function OcrZoneComponent_Template_div_drop_0_listener($event) {
        return ctx.onDrop($event);
      });
      \u0275\u0275domElementStart(1, "div", 1)(2, "div", 2);
      \u0275\u0275text(3, "\u{1F4F7}");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(4, "p", 3);
      \u0275\u0275text(5, " OCR Image Input ");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(6, "p", 4);
      \u0275\u0275text(7, " Paste (Ctrl+V), drag & drop, or ");
      \u0275\u0275domElementStart(8, "label", 5);
      \u0275\u0275text(9, " browse ");
      \u0275\u0275domElementStart(10, "input", 6);
      \u0275\u0275domListener("change", function OcrZoneComponent_Template_input_change_10_listener($event) {
        return ctx.onFileInput($event);
      });
      \u0275\u0275domElementEnd()();
      \u0275\u0275text(11, " an image of a question ");
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(12, OcrZoneComponent_Conditional_12_Template, 3, 0, "div", 7);
      \u0275\u0275conditionalCreate(13, OcrZoneComponent_Conditional_13_Template, 9, 2, "div", 8);
      \u0275\u0275conditionalCreate(14, OcrZoneComponent_Conditional_14_Template, 4, 1, "div", 9);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classMap(ctx.dragOver() ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30" : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50");
      \u0275\u0275advance(12);
      \u0275\u0275conditional(ctx.status() === "processing" ? 12 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.status() === "done" && ctx.result() ? 13 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.status() === "error" ? 14 : -1);
    }
  }, dependencies: [DecimalPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OcrZoneComponent, [{
    type: Component,
    args: [{
      selector: "app-ocr-zone",
      standalone: true,
      imports: [DecimalPipe],
      providers: [AdminOcrService],
      template: `
    <div class="rounded-xl border-2 border-dashed transition-colors"
         [class]="dragOver()
           ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
           : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'"
         (dragover)="onDragOver($event)"
         (dragleave)="onDragLeave()"
         (drop)="onDrop($event)">

      <div class="p-4 text-center space-y-2">
        <div class="text-2xl">\u{1F4F7}</div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
          OCR Image Input
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Paste (Ctrl+V), drag &amp; drop, or
          <label class="text-indigo-600 dark:text-indigo-400 underline cursor-pointer hover:no-underline">
            browse
            <input type="file" accept="image/*" class="sr-only" (change)="onFileInput($event)">
          </label>
          an image of a question
        </p>
      </div>

      @if (status() === 'processing') {
        <div class="px-4 pb-4 flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Extracting text\u2026
        </div>
      }

      @if (status() === 'done' && result()) {
        <div class="px-4 pb-4 space-y-2">
          @if (result()!.lowConfidence) {
            <div class="rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-3 py-2">
              <p class="text-xs text-amber-700 dark:text-amber-300">
                \u26A0\uFE0F Low OCR confidence ({{ result()!.confidence | number:'1.0-0' }}%) \u2014 please review extracted text carefully.
              </p>
            </div>
          }
          <div class="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Extracted text:</p>
            <p class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ result()!.text }}</p>
          </div>
          <button type="button" (click)="applyResult()"
            class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            Apply to Form
          </button>
        </div>
      }

      @if (status() === 'error') {
        <div class="px-4 pb-4">
          <div class="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-3 py-2">
            <p class="text-xs text-red-700 dark:text-red-300">{{ errorMessage() }}</p>
          </div>
        </div>
      }
    </div>
  `
    }]
  }], null, { parsed: [{ type: Output, args: ["parsed"] }], onWindowPaste: [{
    type: HostListener,
    args: ["window:paste", ["$event"]]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(OcrZoneComponent, { className: "OcrZoneComponent", filePath: "src/app/features/admin/ocr-zone/ocr-zone.ts", lineNumber: 75 });
})();

// src/app/features/admin/mcq-editor/mcq-editor.ts
var _forTrack0 = ($index, $item) => $item.id;
function McqEditorComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    \u0275\u0275property("value", f_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r1.label);
  }
}
function McqEditorComponent_Conditional_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "p", 12);
    \u0275\u0275text(2, "Could not load content. Ensure both servers are running.");
    \u0275\u0275elementEnd()();
  }
}
function McqEditorComponent_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "p", 13);
    \u0275\u0275text(2, "No questions yet.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 14);
    \u0275\u0275listener("click", function McqEditorComponent_Conditional_7_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.startAdd());
    });
    \u0275\u0275text(4, " + Add First Question ");
    \u0275\u0275elementEnd()();
  }
}
function McqEditorComponent_Conditional_7_Conditional_7_For_6_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" PYQ ", item_r6.year, " ");
  }
}
function McqEditorComponent_Conditional_7_Conditional_7_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19)(2, "div", 20)(3, "div", 21)(4, "span", 22);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, McqEditorComponent_Conditional_7_Conditional_7_For_6_Conditional_6_Template, 2, 1, "span", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 24);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 25);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 26)(12, "button", 27);
    \u0275\u0275listener("click", function McqEditorComponent_Conditional_7_Conditional_7_For_6_Template_button_click_12_listener() {
      const item_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.startEdit(item_r6));
    });
    \u0275\u0275text(13, " Edit ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 28);
    \u0275\u0275listener("click", function McqEditorComponent_Conditional_7_Conditional_7_For_6_Template_button_click_14_listener() {
      const item_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.deleteItem(item_r6));
    });
    \u0275\u0275text(15, " Delete ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(item_r6.id);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r6.isPreviousYear ? 6 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.question);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Correct: ", item_r6.options[item_r6.correctIndex]);
  }
}
function McqEditorComponent_Conditional_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 15)(2, "span", 16);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 17);
    \u0275\u0275repeaterCreate(5, McqEditorComponent_Conditional_7_Conditional_7_For_6_Template, 16, 4, "div", 18, _forTrack0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r2.filteredItems().length, " / ", ctx_r2.allItems().length, " questions");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.filteredItems());
  }
}
function McqEditorComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 6);
    \u0275\u0275element(2, "input", 7);
    \u0275\u0275elementStart(3, "button", 8);
    \u0275\u0275listener("click", function McqEditorComponent_Conditional_7_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.startAdd());
    });
    \u0275\u0275text(4, " + Add Question ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, McqEditorComponent_Conditional_7_Conditional_5_Template, 3, 0, "div", 9)(6, McqEditorComponent_Conditional_7_Conditional_6_Template, 5, 0, "div", 10)(7, McqEditorComponent_Conditional_7_Conditional_7_Template, 7, 2, "div", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r2.filterCtrl);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.allItems() === null ? 5 : ctx_r2.allItems().length === 0 ? 6 : 7);
  }
}
function McqEditorComponent_Conditional_8_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "span", 51);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 52);
    \u0275\u0275text(4, "Editing existing");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.form.get("id").value);
  }
}
function McqEditorComponent_Conditional_8_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "input", 53);
    \u0275\u0275elementStart(2, "button", 54);
    \u0275\u0275listener("click", function McqEditorComponent_Conditional_8_Conditional_12_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.generateId());
    });
    \u0275\u0275text(3, " Auto ");
    \u0275\u0275elementEnd()();
  }
}
function McqEditorComponent_Conditional_8_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "ID is required");
    \u0275\u0275elementEnd();
  }
}
function McqEditorComponent_Conditional_8_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "ID already exists");
    \u0275\u0275elementEnd();
  }
}
function McqEditorComponent_Conditional_8_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function McqEditorComponent_Conditional_8_For_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 40)(1, "span", 55);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "input", 56);
    \u0275\u0275elementStart(4, "input", 57);
    \u0275\u0275listener("change", function McqEditorComponent_Conditional_8_For_24_Template_input_change_4_listener() {
      const $index_r10 = \u0275\u0275restoreView(_r9).$index;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.form.get("correctIndex").setValue($index_r10));
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const $index_r10 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.optionLabels[$index_r10]);
    \u0275\u0275advance();
    \u0275\u0275property("formControlName", $index_r10)("placeholder", "Option " + ctx_r2.optionLabels[$index_r10]);
    \u0275\u0275advance();
    \u0275\u0275property("value", $index_r10)("checked", ctx_r2.form.get("correctIndex").value === $index_r10);
  }
}
function McqEditorComponent_Conditional_8_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function McqEditorComponent_Conditional_8_Conditional_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 46);
  }
}
function McqEditorComponent_Conditional_8_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "p", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.saveError());
  }
}
function McqEditorComponent_Conditional_8_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Saving\u2026 ");
  }
}
function McqEditorComponent_Conditional_8_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.editMode() ? "Save Changes" : "Add Question", " ");
  }
}
function McqEditorComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 29)(2, "button", 30);
    \u0275\u0275listener("click", function McqEditorComponent_Conditional_8_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.backToList());
    });
    \u0275\u0275text(3, " \u2190 Back to List ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 31);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "app-ocr-zone", 32);
    \u0275\u0275listener("parsed", function McqEditorComponent_Conditional_8_Template_app_ocr_zone_parsed_6_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onOcrParsed($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "form", 33)(8, "div")(9, "label", 34);
    \u0275\u0275text(10, "Question ID");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, McqEditorComponent_Conditional_8_Conditional_11_Template, 5, 1, "div", 35)(12, McqEditorComponent_Conditional_8_Conditional_12_Template, 4, 0, "div", 6);
    \u0275\u0275conditionalCreate(13, McqEditorComponent_Conditional_8_Conditional_13_Template, 2, 0, "p", 36);
    \u0275\u0275conditionalCreate(14, McqEditorComponent_Conditional_8_Conditional_14_Template, 2, 0, "p", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div")(16, "label", 34);
    \u0275\u0275text(17, "Question");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "textarea", 37);
    \u0275\u0275conditionalCreate(19, McqEditorComponent_Conditional_8_Conditional_19_Template, 2, 0, "p", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 38)(21, "label", 39);
    \u0275\u0275text(22, "Options (select radio = correct answer)");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(23, McqEditorComponent_Conditional_8_For_24_Template, 5, 5, "div", 40, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div")(26, "label", 34);
    \u0275\u0275text(27, "Explanation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "textarea", 41);
    \u0275\u0275conditionalCreate(29, McqEditorComponent_Conditional_8_Conditional_29_Template, 2, 0, "p", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 42)(31, "label", 43);
    \u0275\u0275element(32, "input", 44);
    \u0275\u0275elementStart(33, "span", 45);
    \u0275\u0275text(34, "Previous Year Question");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(35, McqEditorComponent_Conditional_8_Conditional_35_Template, 1, 0, "input", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(36, McqEditorComponent_Conditional_8_Conditional_36_Template, 3, 1, "div", 47);
    \u0275\u0275elementStart(37, "div", 48)(38, "button", 49);
    \u0275\u0275listener("click", function McqEditorComponent_Conditional_8_Template_button_click_38_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onSubmit());
    });
    \u0275\u0275conditionalCreate(39, McqEditorComponent_Conditional_8_Conditional_39_Template, 1, 0)(40, McqEditorComponent_Conditional_8_Conditional_40_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "button", 50);
    \u0275\u0275listener("click", function McqEditorComponent_Conditional_8_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.backToList());
    });
    \u0275\u0275text(42, " Cancel ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r2.editMode() ? "Editing: " + ctx_r2.editingOriginalId() : "+ New MCQ Question", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("formGroup", ctx_r2.form);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.editMode() ? 11 : 12);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.idCtrl.invalid && ctx_r2.idCtrl.touched ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.idUnique() ? 14 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.form.get("question").invalid && ctx_r2.form.get("question").touched ? 19 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.optionControls);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r2.form.get("explanation").invalid && ctx_r2.form.get("explanation").touched ? 29 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275conditional(ctx_r2.form.get("isPreviousYear").value ? 35 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.saveError() ? 36 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.form.invalid || !ctx_r2.idUnique() || ctx_r2.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.saving() ? 39 : 40);
  }
}
var MCQ_FILES = [
  { id: "mcq/cl12-python.json", label: "Class 12 - Python", prefix: "cl12-py" },
  { id: "mcq/cl12-sql.json", label: "Class 12 - SQL", prefix: "cl12-sql" },
  { id: "mcq/cl12-networking.json", label: "Class 12 - Networking", prefix: "cl12-nw" },
  { id: "mcq/cl11-python.json", label: "Class 11 - Python", prefix: "cl11-py" },
  { id: "mcq/cl11-computer-fundamentals.json", label: "Class 11 - Comp. Fundamentals", prefix: "cl11-cf" }
];
var McqEditorComponent = class _McqEditorComponent {
  dirtyChange = output();
  fb = inject(FormBuilder);
  loader = inject(AdminContentLoaderService);
  idGen = inject(AdminIdGeneratorService);
  mcqFiles = MCQ_FILES;
  optionLabels = ["A", "B", "C", "D"];
  selectedFile = signal(MCQ_FILES[0].id, ...ngDevMode ? [{ debugName: "selectedFile" }] : (
    /* istanbul ignore next */
    []
  ));
  viewMode = signal("list", ...ngDevMode ? [{ debugName: "viewMode" }] : (
    /* istanbul ignore next */
    []
  ));
  editMode = signal(false, ...ngDevMode ? [{ debugName: "editMode" }] : (
    /* istanbul ignore next */
    []
  ));
  editingOriginalId = signal(null, ...ngDevMode ? [{ debugName: "editingOriginalId" }] : (
    /* istanbul ignore next */
    []
  ));
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : (
    /* istanbul ignore next */
    []
  ));
  saveError = signal(null, ...ngDevMode ? [{ debugName: "saveError" }] : (
    /* istanbul ignore next */
    []
  ));
  filterCtrl = new FormControl("");
  filterValue = toSignal(this.filterCtrl.valueChanges, { initialValue: "" });
  form;
  get idCtrl() {
    return this.form.get("id");
  }
  get optionControls() {
    return this.form.get("options").controls;
  }
  allItems = computed(() => this.loader.load(this.selectedFile())(), ...ngDevMode ? [{ debugName: "allItems" }] : (
    /* istanbul ignore next */
    []
  ));
  filteredItems = computed(() => {
    const all = this.allItems() ?? [];
    const q = (this.filterValue() ?? "").toLowerCase().trim();
    if (!q)
      return all;
    return all.filter((i) => (i.id + " " + i.question).toLowerCase().includes(q));
  }, ...ngDevMode ? [{ debugName: "filteredItems" }] : (
    /* istanbul ignore next */
    []
  ));
  existingItems = computed(() => this.allItems() ?? [], ...ngDevMode ? [{ debugName: "existingItems" }] : (
    /* istanbul ignore next */
    []
  ));
  idUnique = computed(() => {
    const id = this.idCtrl?.value;
    if (!id)
      return true;
    if (id === this.editingOriginalId())
      return true;
    return this.idGen.validateId(id, this.existingItems());
  }, ...ngDevMode ? [{ debugName: "idUnique" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.form = this.fb.group({
      id: ["", Validators.required],
      question: ["", Validators.required],
      options: this.fb.array([
        this.fb.control("", Validators.required),
        this.fb.control("", Validators.required),
        this.fb.control("", Validators.required),
        this.fb.control("", Validators.required)
      ]),
      correctIndex: [null, Validators.required],
      explanation: ["", Validators.required],
      isPreviousYear: [false],
      year: [null]
    });
    this.form.valueChanges.subscribe(() => this.dirtyChange.emit(this.form.dirty));
  }
  onFileChange(event) {
    this.selectedFile.set(event.target.value);
    this.viewMode.set("list");
  }
  generateId() {
    const file = this.mcqFiles.find((f) => f.id === this.selectedFile());
    this.form.get("id").setValue(this.idGen.nextId(this.existingItems(), file.prefix));
  }
  startAdd() {
    this.form.reset({ isPreviousYear: false, correctIndex: null });
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.viewMode.set("form");
  }
  startEdit(item) {
    const opts = item.options ?? ["", "", "", ""];
    const optArray = this.form.get("options");
    opts.forEach((o, i) => optArray.at(i).setValue(o ?? ""));
    this.form.patchValue({
      id: item.id,
      question: item.question,
      correctIndex: item.correctIndex ?? null,
      explanation: item.explanation,
      isPreviousYear: item.isPreviousYear ?? false,
      year: item.year ?? null
    });
    this.editMode.set(true);
    this.editingOriginalId.set(item.id);
    this.saveError.set(null);
    this.viewMode.set("form");
    this.dirtyChange.emit(true);
  }
  backToList() {
    this.viewMode.set("list");
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.dirtyChange.emit(false);
  }
  deleteItem(item) {
    if (!confirm(`Delete "${item.id}"? This will overwrite the JSON file.`))
      return;
    const remaining = (this.allItems() ?? []).filter((i) => i.id !== item.id);
    this.loader.save(this.selectedFile(), remaining).subscribe({
      error: (err) => alert(err.message)
    });
  }
  onSubmit() {
    if (this.form.invalid || !this.idUnique()) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const item = __spreadValues({
      id: v.id,
      question: v.question,
      options: v.options,
      correctIndex: v.correctIndex,
      explanation: v.explanation,
      isPreviousYear: v.isPreviousYear ?? false
    }, v.isPreviousYear && v.year ? { year: v.year } : {});
    const existing = this.allItems() ?? [];
    const updated = this.editMode() ? existing.map((i) => i.id === this.editingOriginalId() ? item : i) : [...existing, item];
    this.saving.set(true);
    this.saveError.set(null);
    this.loader.save(this.selectedFile(), updated).subscribe({
      next: () => {
        this.saving.set(false);
        this.backToList();
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set(err.message);
      }
    });
  }
  reset() {
    this.backToList();
  }
  onOcrParsed(result) {
    if (result.questionText)
      this.form.get("question").setValue(result.questionText);
    if (result.options) {
      const optArray = this.form.get("options");
      result.options.forEach((opt, i) => optArray.at(i).setValue(opt));
    }
    this.form.markAsDirty();
    this.dirtyChange.emit(true);
  }
  static \u0275fac = function McqEditorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _McqEditorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _McqEditorComponent, selectors: [["app-mcq-editor"]], outputs: { dirtyChange: "dirtyChange" }, decls: 9, vars: 2, consts: [[1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], [1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "change", "value"], [3, "value"], [1, "space-y-3"], [1, "space-y-5"], [1, "flex", "gap-2"], ["type", "search", "placeholder", "Filter by ID or question...", 1, "flex-1", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "formControl"], ["type", "button", 1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", "whitespace-nowrap", 3, "click"], [1, "rounded-xl", "border", "border-red-200", "dark:border-red-700", "bg-red-50", "dark:bg-red-950/30", "p-6", "text-center"], [1, "rounded-xl", "border", "border-dashed", "border-gray-300", "dark:border-gray-600", "p-8", "text-center"], [1, "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "overflow-hidden"], [1, "text-sm", "text-red-600", "dark:text-red-400"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "mb-3"], ["type", "button", 1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-gray-50", "dark:bg-gray-800/60", "border-b", "border-gray-200", "dark:border-gray-700"], [1, "text-xs", "text-gray-500"], [1, "divide-y", "divide-gray-100", "dark:divide-gray-800"], [1, "px-4", "py-3", "bg-white", "dark:bg-gray-900", "hover:bg-gray-50", "dark:hover:bg-gray-800/40", "transition-colors"], [1, "flex", "items-start", "gap-3"], [1, "flex-1", "min-w-0"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "text-xs", "font-mono", "text-indigo-600", "dark:text-indigo-400"], [1, "text-xs", "bg-amber-100", "dark:bg-amber-900/30", "text-amber-700", "dark:text-amber-300", "px-1.5", "py-0.5", "rounded"], [1, "text-sm", "text-gray-700", "dark:text-gray-300", "mt-1", "line-clamp-2"], [1, "text-xs", "text-gray-400", "mt-0.5"], [1, "flex", "gap-1.5", "shrink-0"], ["type", "button", 1, "px-2.5", "py-1.5", "text-xs", "font-medium", "rounded-lg", "bg-indigo-50", "hover:bg-indigo-100", "dark:bg-indigo-900/30", "dark:hover:bg-indigo-900/50", "text-indigo-600", "dark:text-indigo-400", "transition-colors", 3, "click"], ["type", "button", 1, "px-2.5", "py-1.5", "text-xs", "font-medium", "rounded-lg", "bg-red-50", "hover:bg-red-100", "dark:bg-red-900/30", "dark:hover:bg-red-900/50", "text-red-600", "dark:text-red-400", "transition-colors", 3, "click"], [1, "flex", "items-center", "gap-3", "pb-2", "border-b", "border-gray-200", "dark:border-gray-700"], ["type", "button", 1, "text-sm", "text-gray-500", "hover:text-gray-900", "dark:text-gray-400", "dark:hover:text-gray-100", "transition-colors", 3, "click"], [1, "text-sm", "font-semibold", "text-gray-700", "dark:text-gray-300", "ml-auto"], [3, "parsed"], [1, "space-y-4", 3, "formGroup"], [1, "block", "text-xs", "font-medium", "text-gray-600", "dark:text-gray-400", "mb-1"], [1, "flex", "items-center", "gap-2", "px-3", "py-2", "rounded-lg", "bg-indigo-50", "dark:bg-indigo-900/30", "border", "border-indigo-200", "dark:border-indigo-700"], [1, "mt-1", "text-xs", "text-red-500"], ["formControlName", "question", "rows", "3", "placeholder", "Enter the question text...", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-none"], ["formArrayName", "options", 1, "space-y-2"], [1, "block", "text-xs", "font-medium", "text-gray-600", "dark:text-gray-400"], [1, "flex", "items-center", "gap-2"], ["formControlName", "explanation", "rows", "2", "placeholder", "Why is this the correct answer?", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-none"], [1, "flex", "items-center", "gap-3"], [1, "flex", "items-center", "gap-2", "cursor-pointer"], ["formControlName", "isPreviousYear", "type", "checkbox", 1, "accent-indigo-600", "h-4", "w-4", "rounded"], [1, "text-sm", "text-gray-700", "dark:text-gray-300"], ["formControlName", "year", "type", "number", "min", "1990", "max", "2030", "placeholder", "Year", 1, "w-24", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-1.5", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], [1, "rounded-lg", "bg-red-50", "dark:bg-red-950/30", "border", "border-red-200", "dark:border-red-700", "px-4", "py-3"], [1, "flex", "gap-2", "pt-2"], ["type", "button", 1, "flex-1", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "disabled:opacity-40", "disabled:cursor-not-allowed", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click", "disabled"], ["type", "button", 1, "px-4", "py-2", "bg-gray-100", "hover:bg-gray-200", "dark:bg-gray-800", "dark:hover:bg-gray-700", "text-gray-700", "dark:text-gray-300", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click"], [1, "text-xs", "font-mono", "text-indigo-700", "dark:text-indigo-300"], [1, "text-xs", "text-indigo-400", "ml-auto"], ["formControlName", "id", "type", "text", "placeholder", "auto-generated", 1, "flex-1", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "font-mono", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], ["type", "button", 1, "px-3", "py-2", "text-xs", "font-medium", "bg-gray-100", "hover:bg-gray-200", "dark:bg-gray-800", "dark:hover:bg-gray-700", "text-gray-700", "dark:text-gray-300", "rounded-lg", "transition-colors", 3, "click"], [1, "text-xs", "font-mono", "text-gray-500", "w-5", "shrink-0"], ["type", "text", 1, "flex-1", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "formControlName", "placeholder"], ["type", "radio", "name", "correct", 1, "accent-indigo-600", "h-4", "w-4", "cursor-pointer", "shrink-0", 3, "change", "value", "checked"], [1, "text-xs", "text-red-600", "dark:text-red-400"]], template: function McqEditorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "label", 1);
      \u0275\u0275text(3, "Content File");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "select", 2);
      \u0275\u0275listener("change", function McqEditorComponent_Template_select_change_4_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275repeaterCreate(5, McqEditorComponent_For_6_Template, 2, 2, "option", 3, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(7, McqEditorComponent_Conditional_7_Template, 8, 2, "div", 4)(8, McqEditorComponent_Conditional_8_Template, 43, 11, "div", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("value", ctx.selectedFile());
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.mcqFiles);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.viewMode() === "list" ? 7 : 8);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, FormControlDirective, FormGroupDirective, FormControlName, FormArrayName, OcrZoneComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(McqEditorComponent, [{
    type: Component,
    args: [{
      selector: "app-mcq-editor",
      standalone: true,
      imports: [ReactiveFormsModule, OcrZoneComponent],
      template: `
    <div class="space-y-4">
      <!-- File picker -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content File</label>
        <select [value]="selectedFile()" (change)="onFileChange($event)"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          @for (f of mcqFiles; track f.id) { <option [value]="f.id">{{ f.label }}</option> }
        </select>
      </div>

      @if (viewMode() === 'list') {
        <!-- LIST VIEW -->
        <div class="space-y-3">
          <div class="flex gap-2">
            <input [formControl]="filterCtrl" type="search" placeholder="Filter by ID or question..."
              class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <button type="button" (click)="startAdd()"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
              + Add Question
            </button>
          </div>

          @if (allItems() === null) {
            <div class="rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-6 text-center">
              <p class="text-sm text-red-600 dark:text-red-400">Could not load content. Ensure both servers are running.</p>
            </div>
          } @else if (allItems()!.length === 0) {
            <div class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">No questions yet.</p>
              <button type="button" (click)="startAdd()"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                + Add First Question
              </button>
            </div>
          } @else {
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <span class="text-xs text-gray-500">{{ filteredItems().length }} / {{ allItems()!.length }} questions</span>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (item of filteredItems(); track item.id) {
                  <div class="px-4 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <div class="flex items-start gap-3">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400">{{ item.id }}</span>
                          @if (item.isPreviousYear) {
                            <span class="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                              PYQ {{ item.year }}
                            </span>
                          }
                        </div>
                        <p class="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{{ item.question }}</p>
                        <p class="text-xs text-gray-400 mt-0.5">Correct: {{ item.options[item.correctIndex] }}</p>
                      </div>
                      <div class="flex gap-1.5 shrink-0">
                        <button type="button" (click)="startEdit(item)"
                          class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100
                                 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors">
                          Edit
                        </button>
                        <button type="button" (click)="deleteItem(item)"
                          class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 hover:bg-red-100
                                 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

      } @else {
        <!-- FORM VIEW -->
        <div class="space-y-5">
          <div class="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <button type="button" (click)="backToList()"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              &larr; Back to List
            </button>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-auto">
              {{ editMode() ? 'Editing: ' + editingOriginalId() : '+ New MCQ Question' }}
            </span>
          </div>

          <app-ocr-zone (parsed)="onOcrParsed($event)"></app-ocr-zone>

          <form [formGroup]="form" class="space-y-4">
            <!-- ID -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question ID</label>
              @if (editMode()) {
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                  <span class="text-xs font-mono text-indigo-700 dark:text-indigo-300">{{ form.get('id')!.value }}</span>
                  <span class="text-xs text-indigo-400 ml-auto">Editing existing</span>
                </div>
              } @else {
                <div class="flex gap-2">
                  <input formControlName="id" type="text"
                    class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                           text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="auto-generated">
                  <button type="button" (click)="generateId()"
                    class="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                           text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                    Auto
                  </button>
                </div>
              }
              @if (idCtrl.invalid && idCtrl.touched) { <p class="mt-1 text-xs text-red-500">ID is required</p> }
              @if (!idUnique()) { <p class="mt-1 text-xs text-red-500">ID already exists</p> }
            </div>

            <!-- Question -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question</label>
              <textarea formControlName="question" rows="3"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter the question text..."></textarea>
              @if (form.get('question')!.invalid && form.get('question')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
            </div>

            <!-- Options -->
            <div formArrayName="options" class="space-y-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Options (select radio = correct answer)</label>
              @for (opt of optionControls; track $index) {
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono text-gray-500 w-5 shrink-0">{{ optionLabels[$index] }}</span>
                  <input [formControlName]="$index" type="text"
                    class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                           text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    [placeholder]="'Option ' + optionLabels[$index]">
                  <input type="radio" name="correct" [value]="$index"
                    [checked]="form.get('correctIndex')!.value === $index"
                    (change)="form.get('correctIndex')!.setValue($index)"
                    class="accent-indigo-600 h-4 w-4 cursor-pointer shrink-0">
                </div>
              }
            </div>

            <!-- Explanation -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Explanation</label>
              <textarea formControlName="explanation" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Why is this the correct answer?"></textarea>
              @if (form.get('explanation')!.invalid && form.get('explanation')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
            </div>

            <!-- PYQ -->
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input formControlName="isPreviousYear" type="checkbox" class="accent-indigo-600 h-4 w-4 rounded">
                <span class="text-sm text-gray-700 dark:text-gray-300">Previous Year Question</span>
              </label>
              @if (form.get('isPreviousYear')!.value) {
                <input formControlName="year" type="number" min="1990" max="2030"
                  class="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Year">
              }
            </div>

            @if (saveError()) {
              <div class="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700 px-4 py-3">
                <p class="text-xs text-red-600 dark:text-red-400">{{ saveError() }}</p>
              </div>
            }

            <div class="flex gap-2 pt-2">
              <button type="button" (click)="onSubmit()"
                class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-medium rounded-lg transition-colors"
                [disabled]="form.invalid || !idUnique() || saving()">
                @if (saving()) { Saving\u2026 } @else { {{ editMode() ? 'Save Changes' : 'Add Question' }} }
              </button>
              <button type="button" (click)="backToList()"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
    }]
  }], null, { dirtyChange: [{ type: Output, args: ["dirtyChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(McqEditorComponent, { className: "McqEditorComponent", filePath: "src/app/features/admin/mcq-editor/mcq-editor.ts", lineNumber: 223 });
})();

// src/app/features/admin/sql-editor/sql-editor.ts
var _forTrack02 = ($index, $item) => $item.id;
function SqlEditorComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    \u0275\u0275property("value", f_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r1.label);
  }
}
function SqlEditorComponent_Conditional_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "p", 12);
    \u0275\u0275text(2, "Could not load content. Ensure dev server is running.");
    \u0275\u0275elementEnd()();
  }
}
function SqlEditorComponent_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "p", 13);
    \u0275\u0275text(2, "No questions yet.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 14);
    \u0275\u0275listener("click", function SqlEditorComponent_Conditional_7_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.startAdd());
    });
    \u0275\u0275text(4, " + Add First Question ");
    \u0275\u0275elementEnd()();
  }
}
function SqlEditorComponent_Conditional_7_Conditional_7_For_6_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" PYQ ", item_r6.year, " ");
  }
}
function SqlEditorComponent_Conditional_7_Conditional_7_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19)(2, "div", 20)(3, "div", 21)(4, "span", 22);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 23);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, SqlEditorComponent_Conditional_7_Conditional_7_For_6_Conditional_8_Template, 2, 1, "span", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 25);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 26)(12, "button", 27);
    \u0275\u0275listener("click", function SqlEditorComponent_Conditional_7_Conditional_7_For_6_Template_button_click_12_listener() {
      const item_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.startEdit(item_r6));
    });
    \u0275\u0275text(13, " Edit ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 28);
    \u0275\u0275listener("click", function SqlEditorComponent_Conditional_7_Conditional_7_For_6_Template_button_click_14_listener() {
      const item_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.deleteItem(item_r6));
    });
    \u0275\u0275text(15, " Delete ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(item_r6.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.difficulty);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r6.isPreviousYear ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.questionText);
  }
}
function SqlEditorComponent_Conditional_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 15)(2, "span", 16);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 17);
    \u0275\u0275repeaterCreate(5, SqlEditorComponent_Conditional_7_Conditional_7_For_6_Template, 16, 4, "div", 18, _forTrack02);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r2.filteredItems().length, " / ", ctx_r2.allItems().length, " questions");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.filteredItems());
  }
}
function SqlEditorComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 6);
    \u0275\u0275element(2, "input", 7);
    \u0275\u0275elementStart(3, "button", 8);
    \u0275\u0275listener("click", function SqlEditorComponent_Conditional_7_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.startAdd());
    });
    \u0275\u0275text(4, " + Add Question ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, SqlEditorComponent_Conditional_7_Conditional_5_Template, 3, 0, "div", 9)(6, SqlEditorComponent_Conditional_7_Conditional_6_Template, 5, 0, "div", 10)(7, SqlEditorComponent_Conditional_7_Conditional_7_Template, 7, 2, "div", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r2.filterCtrl);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.allItems() === null ? 5 : ctx_r2.allItems().length === 0 ? 6 : 7);
  }
}
function SqlEditorComponent_Conditional_8_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "span", 55);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 56);
    \u0275\u0275text(4, "Editing existing");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.form.get("id").value);
  }
}
function SqlEditorComponent_Conditional_8_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "input", 57);
    \u0275\u0275elementStart(2, "button", 58);
    \u0275\u0275listener("click", function SqlEditorComponent_Conditional_8_Conditional_12_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.generateId());
    });
    \u0275\u0275text(3, " Auto ");
    \u0275\u0275elementEnd()();
  }
}
function SqlEditorComponent_Conditional_8_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "ID is required");
    \u0275\u0275elementEnd();
  }
}
function SqlEditorComponent_Conditional_8_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "ID already exists");
    \u0275\u0275elementEnd();
  }
}
function SqlEditorComponent_Conditional_8_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function SqlEditorComponent_Conditional_8_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function SqlEditorComponent_Conditional_8_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function SqlEditorComponent_Conditional_8_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 50);
  }
}
function SqlEditorComponent_Conditional_8_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51)(1, "p", 59);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.saveError());
  }
}
function SqlEditorComponent_Conditional_8_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Saving\u2026 ");
  }
}
function SqlEditorComponent_Conditional_8_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.editMode() ? "Save Changes" : "Add Question", " ");
  }
}
function SqlEditorComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 29)(2, "button", 30);
    \u0275\u0275listener("click", function SqlEditorComponent_Conditional_8_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.backToList());
    });
    \u0275\u0275text(3, " \u2190 Back to List ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 31);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "app-ocr-zone", 32);
    \u0275\u0275listener("parsed", function SqlEditorComponent_Conditional_8_Template_app_ocr_zone_parsed_6_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onOcrParsed($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "form", 33)(8, "div")(9, "label", 34);
    \u0275\u0275text(10, "Question ID");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, SqlEditorComponent_Conditional_8_Conditional_11_Template, 5, 1, "div", 35)(12, SqlEditorComponent_Conditional_8_Conditional_12_Template, 4, 0, "div", 6);
    \u0275\u0275conditionalCreate(13, SqlEditorComponent_Conditional_8_Conditional_13_Template, 2, 0, "p", 36);
    \u0275\u0275conditionalCreate(14, SqlEditorComponent_Conditional_8_Conditional_14_Template, 2, 0, "p", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div")(16, "label", 34);
    \u0275\u0275text(17, "Question");
    \u0275\u0275elementEnd();
    \u0275\u0275element(18, "textarea", 37);
    \u0275\u0275conditionalCreate(19, SqlEditorComponent_Conditional_8_Conditional_19_Template, 2, 0, "p", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div")(21, "label", 34);
    \u0275\u0275text(22, "SQL Answer");
    \u0275\u0275elementEnd();
    \u0275\u0275element(23, "textarea", 38);
    \u0275\u0275conditionalCreate(24, SqlEditorComponent_Conditional_8_Conditional_24_Template, 2, 0, "p", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div")(26, "label", 34);
    \u0275\u0275text(27, "Explanation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(28, "textarea", 39);
    \u0275\u0275conditionalCreate(29, SqlEditorComponent_Conditional_8_Conditional_29_Template, 2, 0, "p", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div")(31, "label", 34);
    \u0275\u0275text(32, "Difficulty");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(33, "select", 40)(34, "option", 41);
    \u0275\u0275text(35, "Easy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "option", 42);
    \u0275\u0275text(37, "Medium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "option", 43);
    \u0275\u0275text(39, "Hard");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(40, "div")(41, "label", 34);
    \u0275\u0275text(42, "Marks ");
    \u0275\u0275elementStart(43, "span", 44);
    \u0275\u0275text(44, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(45, "input", 45);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 46)(47, "label", 47);
    \u0275\u0275element(48, "input", 48);
    \u0275\u0275elementStart(49, "span", 49);
    \u0275\u0275text(50, "Previous Year Question");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(51, SqlEditorComponent_Conditional_8_Conditional_51_Template, 1, 0, "input", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(52, SqlEditorComponent_Conditional_8_Conditional_52_Template, 3, 1, "div", 51);
    \u0275\u0275elementStart(53, "div", 52)(54, "button", 53);
    \u0275\u0275listener("click", function SqlEditorComponent_Conditional_8_Template_button_click_54_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onSubmit());
    });
    \u0275\u0275conditionalCreate(55, SqlEditorComponent_Conditional_8_Conditional_55_Template, 1, 0)(56, SqlEditorComponent_Conditional_8_Conditional_56_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "button", 54);
    \u0275\u0275listener("click", function SqlEditorComponent_Conditional_8_Template_button_click_57_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.backToList());
    });
    \u0275\u0275text(58, " Cancel ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r2.editMode() ? "Editing: " + ctx_r2.editingOriginalId() : "+ New SQL Question", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("formGroup", ctx_r2.form);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.editMode() ? 11 : 12);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.idCtrl.invalid && ctx_r2.idCtrl.touched ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.idUnique() ? 14 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.form.get("questionText").invalid && ctx_r2.form.get("questionText").touched ? 19 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.form.get("answer").invalid && ctx_r2.form.get("answer").touched ? 24 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r2.form.get("explanation").invalid && ctx_r2.form.get("explanation").touched ? 29 : -1);
    \u0275\u0275advance(22);
    \u0275\u0275conditional(ctx_r2.form.get("isPreviousYear").value ? 51 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.saveError() ? 52 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.form.invalid || !ctx_r2.idUnique() || ctx_r2.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.saving() ? 55 : 56);
  }
}
var SQL_FILES = [
  { id: "sql-questions/aggregate.json", label: "Aggregate Functions", prefix: "sql-agg", category: "aggregate" },
  { id: "sql-questions/group-by.json", label: "GROUP BY", prefix: "sql-groupby", category: "group-by" },
  { id: "sql-questions/joins.json", label: "Joins", prefix: "sql-joins", category: "joins" },
  { id: "sql-questions/keys-constraints.json", label: "Keys & Constraints", prefix: "sql-keys", category: "keys-constraints" },
  { id: "sql-questions/order-by.json", label: "ORDER BY", prefix: "sql-orderby", category: "order-by" },
  { id: "sql-questions/select.json", label: "SELECT", prefix: "sql-select", category: "select" },
  { id: "sql-questions/where.json", label: "WHERE", prefix: "sql-where", category: "where" }
];
var SqlEditorComponent = class _SqlEditorComponent {
  dirtyChange = output();
  fb = inject(FormBuilder);
  loader = inject(AdminContentLoaderService);
  idGen = inject(AdminIdGeneratorService);
  sqlFiles = SQL_FILES;
  selectedFile = signal(SQL_FILES[0].id, ...ngDevMode ? [{ debugName: "selectedFile" }] : (
    /* istanbul ignore next */
    []
  ));
  viewMode = signal("list", ...ngDevMode ? [{ debugName: "viewMode" }] : (
    /* istanbul ignore next */
    []
  ));
  editMode = signal(false, ...ngDevMode ? [{ debugName: "editMode" }] : (
    /* istanbul ignore next */
    []
  ));
  editingOriginalId = signal(null, ...ngDevMode ? [{ debugName: "editingOriginalId" }] : (
    /* istanbul ignore next */
    []
  ));
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : (
    /* istanbul ignore next */
    []
  ));
  saveError = signal(null, ...ngDevMode ? [{ debugName: "saveError" }] : (
    /* istanbul ignore next */
    []
  ));
  filterCtrl = new FormControl("");
  filterValue = toSignal(this.filterCtrl.valueChanges, { initialValue: "" });
  form;
  get idCtrl() {
    return this.form.get("id");
  }
  allItems = computed(() => this.loader.load(this.selectedFile())(), ...ngDevMode ? [{ debugName: "allItems" }] : (
    /* istanbul ignore next */
    []
  ));
  filteredItems = computed(() => {
    const all = this.allItems() ?? [];
    const q = (this.filterValue() ?? "").toLowerCase().trim();
    if (!q)
      return all;
    return all.filter((i) => (i.id + " " + i.questionText).toLowerCase().includes(q));
  }, ...ngDevMode ? [{ debugName: "filteredItems" }] : (
    /* istanbul ignore next */
    []
  ));
  existingItems = computed(() => this.allItems() ?? [], ...ngDevMode ? [{ debugName: "existingItems" }] : (
    /* istanbul ignore next */
    []
  ));
  idUnique = computed(() => {
    const id = this.idCtrl?.value;
    if (!id)
      return true;
    if (id === this.editingOriginalId())
      return true;
    return this.idGen.validateId(id, this.existingItems());
  }, ...ngDevMode ? [{ debugName: "idUnique" }] : (
    /* istanbul ignore next */
    []
  ));
  draftFilename = computed(() => {
    const f = this.sqlFiles.find((f2) => f2.id === this.selectedFile());
    return f ? f.prefix + "-item" : "sql-item";
  }, ...ngDevMode ? [{ debugName: "draftFilename" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.form = this.fb.group({
      id: ["", Validators.required],
      questionText: ["", Validators.required],
      answer: ["", Validators.required],
      explanation: ["", Validators.required],
      difficulty: ["medium", Validators.required],
      isPreviousYear: [false],
      year: [null],
      marks: [null]
    });
    this.form.valueChanges.subscribe(() => this.dirtyChange.emit(this.form.dirty));
  }
  onFileChange(event) {
    this.selectedFile.set(event.target.value);
    this.viewMode.set("list");
  }
  generateId() {
    const file = this.sqlFiles.find((f) => f.id === this.selectedFile());
    this.form.get("id").setValue(this.idGen.nextId(this.existingItems(), file.prefix));
  }
  startAdd() {
    this.form.reset({ difficulty: "medium", isPreviousYear: false });
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.viewMode.set("form");
  }
  startEdit(item) {
    this.form.patchValue({
      id: item.id,
      questionText: item.questionText,
      answer: item.answer,
      explanation: item.explanation,
      difficulty: item.difficulty ?? "medium",
      isPreviousYear: item.isPreviousYear ?? false,
      year: item.year ?? null,
      marks: item.marks ?? null
    });
    this.editMode.set(true);
    this.editingOriginalId.set(item.id);
    this.saveError.set(null);
    this.viewMode.set("form");
    this.dirtyChange.emit(true);
  }
  backToList() {
    this.viewMode.set("list");
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.dirtyChange.emit(false);
  }
  deleteItem(item) {
    if (!confirm(`Delete "${item.id}"? This will overwrite the JSON file.`))
      return;
    const remaining = (this.allItems() ?? []).filter((i) => i.id !== item.id);
    this.loader.save(this.selectedFile(), remaining).subscribe({
      error: (err) => alert(err.message)
    });
  }
  onSubmit() {
    if (this.form.invalid || !this.idUnique()) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const file = this.sqlFiles.find((f) => f.id === this.selectedFile());
    const existing = this.allItems();
    const existingItem = existing?.find((i) => i.id === v.id);
    const item = __spreadValues(__spreadValues({
      id: v.id,
      category: existingItem?.category ?? file.category,
      questionText: v.questionText,
      answer: v.answer,
      explanation: v.explanation,
      difficulty: v.difficulty,
      isPreviousYear: v.isPreviousYear ?? false
    }, v.isPreviousYear && v.year ? { year: v.year } : {}), v.marks ? { marks: v.marks } : {});
    const updated = this.editMode() ? (existing ?? []).map((i) => i.id === this.editingOriginalId() ? item : i) : [...existing ?? [], item];
    this.saving.set(true);
    this.saveError.set(null);
    this.loader.save(this.selectedFile(), updated).subscribe({
      next: () => {
        this.saving.set(false);
        this.backToList();
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set(err.message);
      }
    });
  }
  reset() {
    this.backToList();
  }
  onOcrParsed(result) {
    if (result.questionText)
      this.form.get("questionText").setValue(result.questionText);
    this.form.markAsDirty();
    this.dirtyChange.emit(true);
  }
  static \u0275fac = function SqlEditorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SqlEditorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SqlEditorComponent, selectors: [["app-sql-editor"]], outputs: { dirtyChange: "dirtyChange" }, decls: 9, vars: 2, consts: [[1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], [1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "change", "value"], [3, "value"], [1, "space-y-3"], [1, "space-y-5"], [1, "flex", "gap-2"], ["type", "search", "placeholder", "Filter by ID or question...", 1, "flex-1", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "formControl"], ["type", "button", 1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", "whitespace-nowrap", 3, "click"], [1, "rounded-xl", "border", "border-red-200", "dark:border-red-700", "bg-red-50", "dark:bg-red-950/30", "p-6", "text-center"], [1, "rounded-xl", "border", "border-dashed", "border-gray-300", "dark:border-gray-600", "p-8", "text-center"], [1, "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "overflow-hidden"], [1, "text-sm", "text-red-600", "dark:text-red-400"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "mb-3"], ["type", "button", 1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-gray-50", "dark:bg-gray-800/60", "border-b", "border-gray-200", "dark:border-gray-700"], [1, "text-xs", "text-gray-500"], [1, "divide-y", "divide-gray-100", "dark:divide-gray-800"], [1, "px-4", "py-3", "bg-white", "dark:bg-gray-900", "hover:bg-gray-50", "dark:hover:bg-gray-800/40", "transition-colors"], [1, "flex", "items-start", "gap-3"], [1, "flex-1", "min-w-0"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "text-xs", "font-mono", "text-indigo-600", "dark:text-indigo-400"], [1, "text-xs", "bg-gray-100", "dark:bg-gray-800", "text-gray-500", "px-1.5", "py-0.5", "rounded"], [1, "text-xs", "bg-amber-100", "dark:bg-amber-900/30", "text-amber-700", "dark:text-amber-300", "px-1.5", "py-0.5", "rounded"], [1, "text-sm", "text-gray-700", "dark:text-gray-300", "mt-1", "line-clamp-2"], [1, "flex", "gap-1.5", "shrink-0"], ["type", "button", 1, "px-2.5", "py-1.5", "text-xs", "font-medium", "rounded-lg", "bg-indigo-50", "hover:bg-indigo-100", "dark:bg-indigo-900/30", "dark:hover:bg-indigo-900/50", "text-indigo-600", "dark:text-indigo-400", "transition-colors", 3, "click"], ["type", "button", 1, "px-2.5", "py-1.5", "text-xs", "font-medium", "rounded-lg", "bg-red-50", "hover:bg-red-100", "dark:bg-red-900/30", "dark:hover:bg-red-900/50", "text-red-600", "dark:text-red-400", "transition-colors", 3, "click"], [1, "flex", "items-center", "gap-3", "pb-2", "border-b", "border-gray-200", "dark:border-gray-700"], ["type", "button", 1, "text-sm", "text-gray-500", "hover:text-gray-900", "dark:text-gray-400", "dark:hover:text-gray-100", "transition-colors", 3, "click"], [1, "text-sm", "font-semibold", "text-gray-700", "dark:text-gray-300", "ml-auto"], [3, "parsed"], [1, "space-y-4", 3, "formGroup"], [1, "block", "text-xs", "font-medium", "text-gray-600", "dark:text-gray-400", "mb-1"], [1, "flex", "items-center", "gap-2", "px-3", "py-2", "rounded-lg", "bg-indigo-50", "dark:bg-indigo-900/30", "border", "border-indigo-200", "dark:border-indigo-700"], [1, "mt-1", "text-xs", "text-red-500"], ["formControlName", "questionText", "rows", "3", "placeholder", "Enter the question text...", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-none"], ["formControlName", "answer", "rows", "4", "placeholder", "SELECT ...", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "font-mono", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-y"], ["formControlName", "explanation", "rows", "2", "placeholder", "Explain the SQL query...", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-none"], ["formControlName", "difficulty", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], ["value", "easy"], ["value", "medium"], ["value", "hard"], [1, "text-gray-400"], ["formControlName", "marks", "type", "number", "min", "1", "max", "10", "placeholder", "e.g. 2", 1, "w-24", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], [1, "flex", "items-center", "gap-3"], [1, "flex", "items-center", "gap-2", "cursor-pointer"], ["formControlName", "isPreviousYear", "type", "checkbox", 1, "accent-indigo-600", "h-4", "w-4", "rounded"], [1, "text-sm", "text-gray-700", "dark:text-gray-300"], ["formControlName", "year", "type", "number", "min", "1990", "max", "2030", "placeholder", "Year", 1, "w-24", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-1.5", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], [1, "rounded-lg", "bg-red-50", "dark:bg-red-950/30", "border", "border-red-200", "dark:border-red-700", "px-4", "py-3"], [1, "flex", "gap-2", "pt-2"], ["type", "button", 1, "flex-1", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "disabled:opacity-40", "disabled:cursor-not-allowed", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click", "disabled"], ["type", "button", 1, "px-4", "py-2", "bg-gray-100", "hover:bg-gray-200", "dark:bg-gray-800", "dark:hover:bg-gray-700", "text-gray-700", "dark:text-gray-300", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click"], [1, "text-xs", "font-mono", "text-indigo-700", "dark:text-indigo-300"], [1, "text-xs", "text-indigo-400", "ml-auto"], ["formControlName", "id", "type", "text", "placeholder", "auto-generated", 1, "flex-1", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "font-mono", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], ["type", "button", 1, "px-3", "py-2", "text-xs", "font-medium", "bg-gray-100", "hover:bg-gray-200", "dark:bg-gray-800", "dark:hover:bg-gray-700", "text-gray-700", "dark:text-gray-300", "rounded-lg", "transition-colors", 3, "click"], [1, "text-xs", "text-red-600", "dark:text-red-400"]], template: function SqlEditorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "label", 1);
      \u0275\u0275text(3, "Content File");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "select", 2);
      \u0275\u0275listener("change", function SqlEditorComponent_Template_select_change_4_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275repeaterCreate(5, SqlEditorComponent_For_6_Template, 2, 2, "option", 3, _forTrack02);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(7, SqlEditorComponent_Conditional_7_Template, 8, 2, "div", 4)(8, SqlEditorComponent_Conditional_8_Template, 59, 12, "div", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("value", ctx.selectedFile());
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.sqlFiles);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.viewMode() === "list" ? 7 : 8);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, FormControlDirective, FormGroupDirective, FormControlName, OcrZoneComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SqlEditorComponent, [{
    type: Component,
    args: [{
      selector: "app-sql-editor",
      standalone: true,
      imports: [ReactiveFormsModule, OcrZoneComponent],
      template: `
    <div class="space-y-4">
      <!-- File picker -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content File</label>
        <select [value]="selectedFile()" (change)="onFileChange($event)"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          @for (f of sqlFiles; track f.id) { <option [value]="f.id">{{ f.label }}</option> }
        </select>
      </div>

      @if (viewMode() === 'list') {
        <!-- LIST VIEW -->
        <div class="space-y-3">
          <div class="flex gap-2">
            <input [formControl]="filterCtrl" type="search" placeholder="Filter by ID or question..."
              class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <button type="button" (click)="startAdd()"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
              + Add Question
            </button>
          </div>

          @if (allItems() === null) {
            <div class="rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-6 text-center">
              <p class="text-sm text-red-600 dark:text-red-400">Could not load content. Ensure dev server is running.</p>
            </div>
          } @else if (allItems()!.length === 0) {
            <div class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">No questions yet.</p>
              <button type="button" (click)="startAdd()"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                + Add First Question
              </button>
            </div>
          } @else {
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <span class="text-xs text-gray-500">{{ filteredItems().length }} / {{ allItems()!.length }} questions</span>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (item of filteredItems(); track item.id) {
                  <div class="px-4 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <div class="flex items-start gap-3">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400">{{ item.id }}</span>
                          <span class="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{{ item.difficulty }}</span>
                          @if (item.isPreviousYear) {
                            <span class="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                              PYQ {{ item.year }}
                            </span>
                          }
                        </div>
                        <p class="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{{ item.questionText }}</p>
                      </div>
                      <div class="flex gap-1.5 shrink-0">
                        <button type="button" (click)="startEdit(item)"
                          class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100
                                 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors">
                          Edit
                        </button>
                        <button type="button" (click)="deleteItem(item)"
                          class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 hover:bg-red-100
                                 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

      } @else {
        <!-- FORM VIEW -->
        <div class="space-y-5">
          <div class="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <button type="button" (click)="backToList()"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              &larr; Back to List
            </button>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-auto">
              {{ editMode() ? 'Editing: ' + editingOriginalId() : '+ New SQL Question' }}
            </span>
          </div>

          <app-ocr-zone (parsed)="onOcrParsed($event)"></app-ocr-zone>

          <form [formGroup]="form" class="space-y-4">
            <!-- ID -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question ID</label>
              @if (editMode()) {
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                  <span class="text-xs font-mono text-indigo-700 dark:text-indigo-300">{{ form.get('id')!.value }}</span>
                  <span class="text-xs text-indigo-400 ml-auto">Editing existing</span>
                </div>
              } @else {
                <div class="flex gap-2">
                  <input formControlName="id" type="text"
                    class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                           text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="auto-generated">
                  <button type="button" (click)="generateId()"
                    class="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                           text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                    Auto
                  </button>
                </div>
              }
              @if (idCtrl.invalid && idCtrl.touched) { <p class="mt-1 text-xs text-red-500">ID is required</p> }
              @if (!idUnique()) { <p class="mt-1 text-xs text-red-500">ID already exists</p> }
            </div>

            <!-- Question -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question</label>
              <textarea formControlName="questionText" rows="3"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter the question text..."></textarea>
              @if (form.get('questionText')!.invalid && form.get('questionText')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
            </div>

            <!-- SQL Answer -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">SQL Answer</label>
              <textarea formControlName="answer" rows="4"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                placeholder="SELECT ..."></textarea>
              @if (form.get('answer')!.invalid && form.get('answer')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
            </div>

            <!-- Explanation -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Explanation</label>
              <textarea formControlName="explanation" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Explain the SQL query..."></textarea>
              @if (form.get('explanation')!.invalid && form.get('explanation')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
            </div>

            <!-- Difficulty -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Difficulty</label>
              <select formControlName="difficulty"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <!-- Marks -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Marks <span class="text-gray-400">(optional)</span></label>
              <input formControlName="marks" type="number" min="1" max="10"
                class="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. 2">
            </div>

            <!-- PYQ -->
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input formControlName="isPreviousYear" type="checkbox" class="accent-indigo-600 h-4 w-4 rounded">
                <span class="text-sm text-gray-700 dark:text-gray-300">Previous Year Question</span>
              </label>
              @if (form.get('isPreviousYear')!.value) {
                <input formControlName="year" type="number" min="1990" max="2030"
                  class="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Year">
              }
            </div>

            @if (saveError()) {
              <div class="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700 px-4 py-3">
                <p class="text-xs text-red-600 dark:text-red-400">{{ saveError() }}</p>
              </div>
            }

            <div class="flex gap-2 pt-2">
              <button type="button" (click)="onSubmit()"
                class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-medium rounded-lg transition-colors"
                [disabled]="form.invalid || !idUnique() || saving()">
                @if (saving()) { Saving\u2026 } @else { {{ editMode() ? 'Save Changes' : 'Add Question' }} }
              </button>
              <button type="button" (click)="backToList()"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
    }]
  }], null, { dirtyChange: [{ type: Output, args: ["dirtyChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SqlEditorComponent, { className: "SqlEditorComponent", filePath: "src/app/features/admin/sql-editor/sql-editor.ts", lineNumber: 238 });
})();

// src/app/features/admin/python-editor/python-editor.ts
var _forTrack03 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.value;
function PythonEditorComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    \u0275\u0275property("value", f_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r1.label);
  }
}
function PythonEditorComponent_Conditional_7_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9)(1, "p", 12);
    \u0275\u0275text(2, "Could not load content. Ensure dev server is running.");
    \u0275\u0275elementEnd()();
  }
}
function PythonEditorComponent_Conditional_7_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "p", 13);
    \u0275\u0275text(2, "No questions yet.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 14);
    \u0275\u0275listener("click", function PythonEditorComponent_Conditional_7_Conditional_6_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.startAdd());
    });
    \u0275\u0275text(4, " + Add First Question ");
    \u0275\u0275elementEnd()();
  }
}
function PythonEditorComponent_Conditional_7_Conditional_7_For_6_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" PYQ ", item_r6.year, " ");
  }
}
function PythonEditorComponent_Conditional_7_Conditional_7_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19)(2, "div", 20)(3, "div", 21)(4, "span", 22);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 23);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 24);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, PythonEditorComponent_Conditional_7_Conditional_7_For_6_Conditional_10_Template, 2, 1, "span", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "p", 26);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 27)(14, "button", 28);
    \u0275\u0275listener("click", function PythonEditorComponent_Conditional_7_Conditional_7_For_6_Template_button_click_14_listener() {
      const item_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.startEdit(item_r6));
    });
    \u0275\u0275text(15, " Edit ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "button", 29);
    \u0275\u0275listener("click", function PythonEditorComponent_Conditional_7_Conditional_7_For_6_Template_button_click_16_listener() {
      const item_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.deleteItem(item_r6));
    });
    \u0275\u0275text(17, " Delete ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(item_r6.id);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.type);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.difficulty);
    \u0275\u0275advance();
    \u0275\u0275conditional(item_r6.isPreviousYear ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r6.questionText ?? item_r6.codeSnippet);
  }
}
function PythonEditorComponent_Conditional_7_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 15)(2, "span", 16);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "div", 17);
    \u0275\u0275repeaterCreate(5, PythonEditorComponent_Conditional_7_Conditional_7_For_6_Template, 18, 5, "div", 18, _forTrack03);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r2.filteredItems().length, " / ", ctx_r2.allItems().length, " questions");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.filteredItems());
  }
}
function PythonEditorComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 6);
    \u0275\u0275element(2, "input", 7);
    \u0275\u0275elementStart(3, "button", 8);
    \u0275\u0275listener("click", function PythonEditorComponent_Conditional_7_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.startAdd());
    });
    \u0275\u0275text(4, " + Add Question ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, PythonEditorComponent_Conditional_7_Conditional_5_Template, 3, 0, "div", 9)(6, PythonEditorComponent_Conditional_7_Conditional_6_Template, 5, 0, "div", 10)(7, PythonEditorComponent_Conditional_7_Conditional_7_Template, 7, 2, "div", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("formControl", ctx_r2.filterCtrl);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r2.allItems() === null ? 5 : ctx_r2.allItems().length === 0 ? 6 : 7);
  }
}
function PythonEditorComponent_Conditional_8_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 36)(1, "span", 55);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 56);
    \u0275\u0275text(4, "Editing existing");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.form.get("id").value);
  }
}
function PythonEditorComponent_Conditional_8_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "input", 57);
    \u0275\u0275elementStart(2, "button", 58);
    \u0275\u0275listener("click", function PythonEditorComponent_Conditional_8_Conditional_12_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.generateId());
    });
    \u0275\u0275text(3, " Auto ");
    \u0275\u0275elementEnd()();
  }
}
function PythonEditorComponent_Conditional_8_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1, "ID is required");
    \u0275\u0275elementEnd();
  }
}
function PythonEditorComponent_Conditional_8_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1, "ID already exists");
    \u0275\u0275elementEnd();
  }
}
function PythonEditorComponent_Conditional_8_For_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r9 = ctx.$implicit;
    \u0275\u0275property("value", t_r9.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r9.label);
  }
}
function PythonEditorComponent_Conditional_8_Conditional_27_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1, "Required for output-based questions");
    \u0275\u0275elementEnd();
  }
}
function PythonEditorComponent_Conditional_8_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "label", 35);
    \u0275\u0275text(2, "Code Snippet");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "textarea", 59);
    \u0275\u0275conditionalCreate(4, PythonEditorComponent_Conditional_8_Conditional_27_Conditional_4_Template, 2, 0, "p", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.form.get("codeSnippet").invalid && ctx_r2.form.get("codeSnippet").touched ? 4 : -1);
  }
}
function PythonEditorComponent_Conditional_8_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 37);
    \u0275\u0275text(1, "Required");
    \u0275\u0275elementEnd();
  }
}
function PythonEditorComponent_Conditional_8_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 50);
  }
}
function PythonEditorComponent_Conditional_8_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51)(1, "p", 60);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.saveError());
  }
}
function PythonEditorComponent_Conditional_8_Conditional_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Saving\u2026 ");
  }
}
function PythonEditorComponent_Conditional_8_Conditional_57_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.editMode() ? "Save Changes" : "Add Question", " ");
  }
}
function PythonEditorComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 30)(2, "button", 31);
    \u0275\u0275listener("click", function PythonEditorComponent_Conditional_8_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.backToList());
    });
    \u0275\u0275text(3, " \u2190 Back to List ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 32);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "app-ocr-zone", 33);
    \u0275\u0275listener("parsed", function PythonEditorComponent_Conditional_8_Template_app_ocr_zone_parsed_6_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onOcrParsed($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "form", 34)(8, "div")(9, "label", 35);
    \u0275\u0275text(10, "Question ID");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, PythonEditorComponent_Conditional_8_Conditional_11_Template, 5, 1, "div", 36)(12, PythonEditorComponent_Conditional_8_Conditional_12_Template, 4, 0, "div", 6);
    \u0275\u0275conditionalCreate(13, PythonEditorComponent_Conditional_8_Conditional_13_Template, 2, 0, "p", 37);
    \u0275\u0275conditionalCreate(14, PythonEditorComponent_Conditional_8_Conditional_14_Template, 2, 0, "p", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div")(16, "label", 35);
    \u0275\u0275text(17, "Question Type");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "select", 38);
    \u0275\u0275repeaterCreate(19, PythonEditorComponent_Conditional_8_For_20_Template, 2, 2, "option", 3, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div")(22, "label", 35);
    \u0275\u0275text(23, "Question ");
    \u0275\u0275elementStart(24, "span", 39);
    \u0275\u0275text(25, "(optional for output-based)");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(26, "textarea", 40);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(27, PythonEditorComponent_Conditional_8_Conditional_27_Template, 5, 1, "div");
    \u0275\u0275elementStart(28, "div")(29, "label", 35);
    \u0275\u0275text(30, "Answer ");
    \u0275\u0275elementStart(31, "span", 39);
    \u0275\u0275text(32, "(optional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(33, "textarea", 41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div")(35, "label", 35);
    \u0275\u0275text(36, "Explanation");
    \u0275\u0275elementEnd();
    \u0275\u0275element(37, "textarea", 42);
    \u0275\u0275conditionalCreate(38, PythonEditorComponent_Conditional_8_Conditional_38_Template, 2, 0, "p", 37);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "div")(40, "label", 35);
    \u0275\u0275text(41, "Difficulty");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "select", 43)(43, "option", 44);
    \u0275\u0275text(44, "Beginner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "option", 45);
    \u0275\u0275text(46, "Intermediate");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(47, "div", 46)(48, "label", 47);
    \u0275\u0275element(49, "input", 48);
    \u0275\u0275elementStart(50, "span", 49);
    \u0275\u0275text(51, "Previous Year Question");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(52, PythonEditorComponent_Conditional_8_Conditional_52_Template, 1, 0, "input", 50);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(53, PythonEditorComponent_Conditional_8_Conditional_53_Template, 3, 1, "div", 51);
    \u0275\u0275elementStart(54, "div", 52)(55, "button", 53);
    \u0275\u0275listener("click", function PythonEditorComponent_Conditional_8_Template_button_click_55_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onSubmit());
    });
    \u0275\u0275conditionalCreate(56, PythonEditorComponent_Conditional_8_Conditional_56_Template, 1, 0)(57, PythonEditorComponent_Conditional_8_Conditional_57_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "button", 54);
    \u0275\u0275listener("click", function PythonEditorComponent_Conditional_8_Template_button_click_58_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.backToList());
    });
    \u0275\u0275text(59, " Cancel ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" ", ctx_r2.editMode() ? "Editing: " + ctx_r2.editingOriginalId() : "+ New Python Question", " ");
    \u0275\u0275advance(2);
    \u0275\u0275property("formGroup", ctx_r2.form);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r2.editMode() ? 11 : 12);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.idCtrl.invalid && ctx_r2.idCtrl.touched ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.idUnique() ? 14 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r2.pythonTypes);
    \u0275\u0275advance(8);
    \u0275\u0275conditional(ctx_r2.form.get("type").value === "output-based" ? 27 : -1);
    \u0275\u0275advance(11);
    \u0275\u0275conditional(ctx_r2.form.get("explanation").invalid && ctx_r2.form.get("explanation").touched ? 38 : -1);
    \u0275\u0275advance(14);
    \u0275\u0275conditional(ctx_r2.form.get("isPreviousYear").value ? 52 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.saveError() ? 53 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.form.invalid || !ctx_r2.idUnique() || ctx_r2.saving());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.saving() ? 56 : 57);
  }
}
var PYTHON_FILES = [
  { id: "python-exercises/conditions.json", label: "Python - Conditions", prefix: "py-cond", topic: "conditions" },
  { id: "python-exercises/dictionaries.json", label: "Python - Dictionaries", prefix: "py-dict", topic: "dictionaries" },
  { id: "python-exercises/functions.json", label: "Python - Functions", prefix: "py-fn", topic: "functions" },
  { id: "python-exercises/lists.json", label: "Python - Lists", prefix: "py-lists", topic: "lists" },
  { id: "python-exercises/loops.json", label: "Python - Loops", prefix: "py-loops", topic: "loops" },
  { id: "python-exercises/mixed.json", label: "Python - Mixed", prefix: "py-mixed", topic: "mixed" },
  { id: "python-exercises/strings.json", label: "Python - Strings", prefix: "py-str", topic: "strings" },
  { id: "python-exercises/variables.json", label: "Python - Variables", prefix: "py-vars", topic: "variables" }
];
var PYTHON_TYPES = [
  { value: "output-based", label: "Output-based" },
  { value: "fill-blank", label: "Fill in Blank" },
  { value: "mcq", label: "MCQ" },
  { value: "short-answer", label: "Short Answer" }
];
var PythonEditorComponent = class _PythonEditorComponent {
  dirtyChange = output();
  fb = inject(FormBuilder);
  loader = inject(AdminContentLoaderService);
  idGen = inject(AdminIdGeneratorService);
  pythonFiles = PYTHON_FILES;
  pythonTypes = PYTHON_TYPES;
  selectedFile = signal(PYTHON_FILES[0].id, ...ngDevMode ? [{ debugName: "selectedFile" }] : (
    /* istanbul ignore next */
    []
  ));
  viewMode = signal("list", ...ngDevMode ? [{ debugName: "viewMode" }] : (
    /* istanbul ignore next */
    []
  ));
  editMode = signal(false, ...ngDevMode ? [{ debugName: "editMode" }] : (
    /* istanbul ignore next */
    []
  ));
  editingOriginalId = signal(null, ...ngDevMode ? [{ debugName: "editingOriginalId" }] : (
    /* istanbul ignore next */
    []
  ));
  saving = signal(false, ...ngDevMode ? [{ debugName: "saving" }] : (
    /* istanbul ignore next */
    []
  ));
  saveError = signal(null, ...ngDevMode ? [{ debugName: "saveError" }] : (
    /* istanbul ignore next */
    []
  ));
  filterCtrl = new FormControl("");
  filterValue = toSignal(this.filterCtrl.valueChanges, { initialValue: "" });
  form;
  get idCtrl() {
    return this.form.get("id");
  }
  allItems = computed(() => this.loader.load(this.selectedFile())(), ...ngDevMode ? [{ debugName: "allItems" }] : (
    /* istanbul ignore next */
    []
  ));
  filteredItems = computed(() => {
    const all = this.allItems() ?? [];
    const q = (this.filterValue() ?? "").toLowerCase().trim();
    if (!q)
      return all;
    return all.filter((i) => (i.id + " " + (i.questionText ?? i.codeSnippet ?? "")).toLowerCase().includes(q));
  }, ...ngDevMode ? [{ debugName: "filteredItems" }] : (
    /* istanbul ignore next */
    []
  ));
  existingItems = computed(() => this.allItems() ?? [], ...ngDevMode ? [{ debugName: "existingItems" }] : (
    /* istanbul ignore next */
    []
  ));
  idUnique = computed(() => {
    const id = this.idCtrl?.value;
    if (!id)
      return true;
    if (id === this.editingOriginalId())
      return true;
    return this.idGen.validateId(id, this.existingItems());
  }, ...ngDevMode ? [{ debugName: "idUnique" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.form = this.fb.group({
      id: ["", Validators.required],
      type: ["output-based", Validators.required],
      questionText: [""],
      codeSnippet: [""],
      answer: [""],
      explanation: ["", Validators.required],
      difficulty: ["beginner", Validators.required],
      isPreviousYear: [false],
      year: [null]
    });
    this.form.get("type").valueChanges.subscribe((t) => {
      const ctrl = this.form.get("codeSnippet");
      if (t === "output-based")
        ctrl.setValidators(Validators.required);
      else
        ctrl.clearValidators();
      ctrl.updateValueAndValidity();
    });
    this.form.valueChanges.subscribe(() => this.dirtyChange.emit(this.form.dirty));
  }
  onFileChange(event) {
    this.selectedFile.set(event.target.value);
    this.viewMode.set("list");
  }
  generateId() {
    const file = this.pythonFiles.find((f) => f.id === this.selectedFile());
    this.form.get("id").setValue(this.idGen.nextId(this.existingItems(), file.prefix));
  }
  startAdd() {
    this.form.reset({ type: "output-based", difficulty: "beginner", isPreviousYear: false });
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.viewMode.set("form");
  }
  startEdit(item) {
    this.form.patchValue({
      id: item.id,
      type: item.type ?? "output-based",
      questionText: item.questionText ?? "",
      codeSnippet: item.codeSnippet ?? "",
      answer: item.answer ?? "",
      explanation: item.explanation,
      difficulty: item.difficulty ?? "beginner",
      isPreviousYear: item.isPreviousYear ?? false,
      year: item.year ?? null
    });
    this.editMode.set(true);
    this.editingOriginalId.set(item.id);
    this.saveError.set(null);
    this.viewMode.set("form");
    this.dirtyChange.emit(true);
  }
  backToList() {
    this.viewMode.set("list");
    this.editMode.set(false);
    this.editingOriginalId.set(null);
    this.saveError.set(null);
    this.dirtyChange.emit(false);
  }
  deleteItem(item) {
    if (!confirm(`Delete "${item.id}"? This will overwrite the JSON file.`))
      return;
    const remaining = (this.allItems() ?? []).filter((i) => i.id !== item.id);
    this.loader.save(this.selectedFile(), remaining).subscribe({
      error: (err) => alert(err.message)
    });
  }
  onSubmit() {
    if (this.form.invalid || !this.idUnique()) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const file = this.pythonFiles.find((f) => f.id === this.selectedFile());
    const existing = this.allItems();
    const existingItem = existing?.find((i) => i.id === v.id);
    const d = __spreadValues(__spreadValues(__spreadProps(__spreadValues(__spreadValues(__spreadValues({
      id: v.id,
      topic: existingItem?.topic ?? file.topic,
      type: v.type
    }, v.questionText ? { questionText: v.questionText } : {}), v.type === "output-based" && v.codeSnippet ? { codeSnippet: v.codeSnippet } : {}), v.answer ? { answer: v.answer } : {}), {
      explanation: v.explanation,
      difficulty: v.difficulty
    }), v.isPreviousYear ? { isPreviousYear: true } : {}), v.isPreviousYear && v.year ? { year: v.year } : {});
    const updated = this.editMode() ? (existing ?? []).map((i) => i.id === this.editingOriginalId() ? d : i) : [...existing ?? [], d];
    this.saving.set(true);
    this.saveError.set(null);
    this.loader.save(this.selectedFile(), updated).subscribe({
      next: () => {
        this.saving.set(false);
        this.backToList();
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set(err.message);
      }
    });
  }
  reset() {
    this.backToList();
  }
  onOcrParsed(result) {
    if (result.questionText)
      this.form.get("questionText").setValue(result.questionText);
    this.form.markAsDirty();
    this.dirtyChange.emit(true);
  }
  static \u0275fac = function PythonEditorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PythonEditorComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PythonEditorComponent, selectors: [["app-python-editor"]], outputs: { dirtyChange: "dirtyChange" }, decls: 9, vars: 2, consts: [[1, "space-y-4"], [1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], [1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "change", "value"], [3, "value"], [1, "space-y-3"], [1, "space-y-5"], [1, "flex", "gap-2"], ["type", "search", "placeholder", "Filter by ID or question...", 1, "flex-1", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", 3, "formControl"], ["type", "button", 1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", "whitespace-nowrap", 3, "click"], [1, "rounded-xl", "border", "border-red-200", "dark:border-red-700", "bg-red-50", "dark:bg-red-950/30", "p-6", "text-center"], [1, "rounded-xl", "border", "border-dashed", "border-gray-300", "dark:border-gray-600", "p-8", "text-center"], [1, "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "overflow-hidden"], [1, "text-sm", "text-red-600", "dark:text-red-400"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "mb-3"], ["type", "button", 1, "px-4", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click"], [1, "px-4", "py-2", "bg-gray-50", "dark:bg-gray-800/60", "border-b", "border-gray-200", "dark:border-gray-700"], [1, "text-xs", "text-gray-500"], [1, "divide-y", "divide-gray-100", "dark:divide-gray-800"], [1, "px-4", "py-3", "bg-white", "dark:bg-gray-900", "hover:bg-gray-50", "dark:hover:bg-gray-800/40", "transition-colors"], [1, "flex", "items-start", "gap-3"], [1, "flex-1", "min-w-0"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "text-xs", "font-mono", "text-indigo-600", "dark:text-indigo-400"], [1, "text-xs", "bg-gray-100", "dark:bg-gray-800", "text-gray-500", "px-1.5", "py-0.5", "rounded"], [1, "text-xs", "bg-blue-100", "dark:bg-blue-900/30", "text-blue-600", "dark:text-blue-400", "px-1.5", "py-0.5", "rounded"], [1, "text-xs", "bg-amber-100", "dark:bg-amber-900/30", "text-amber-700", "dark:text-amber-300", "px-1.5", "py-0.5", "rounded"], [1, "text-sm", "text-gray-700", "dark:text-gray-300", "mt-1", "line-clamp-2"], [1, "flex", "gap-1.5", "shrink-0"], ["type", "button", 1, "px-2.5", "py-1.5", "text-xs", "font-medium", "rounded-lg", "bg-indigo-50", "hover:bg-indigo-100", "dark:bg-indigo-900/30", "dark:hover:bg-indigo-900/50", "text-indigo-600", "dark:text-indigo-400", "transition-colors", 3, "click"], ["type", "button", 1, "px-2.5", "py-1.5", "text-xs", "font-medium", "rounded-lg", "bg-red-50", "hover:bg-red-100", "dark:bg-red-900/30", "dark:hover:bg-red-900/50", "text-red-600", "dark:text-red-400", "transition-colors", 3, "click"], [1, "flex", "items-center", "gap-3", "pb-2", "border-b", "border-gray-200", "dark:border-gray-700"], ["type", "button", 1, "text-sm", "text-gray-500", "hover:text-gray-900", "dark:text-gray-400", "dark:hover:text-gray-100", "transition-colors", 3, "click"], [1, "text-sm", "font-semibold", "text-gray-700", "dark:text-gray-300", "ml-auto"], [3, "parsed"], [1, "space-y-4", 3, "formGroup"], [1, "block", "text-xs", "font-medium", "text-gray-600", "dark:text-gray-400", "mb-1"], [1, "flex", "items-center", "gap-2", "px-3", "py-2", "rounded-lg", "bg-indigo-50", "dark:bg-indigo-900/30", "border", "border-indigo-200", "dark:border-indigo-700"], [1, "mt-1", "text-xs", "text-red-500"], ["formControlName", "type", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], [1, "text-gray-400"], ["formControlName", "questionText", "rows", "2", "placeholder", "Enter the question text...", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-none"], ["formControlName", "answer", "rows", "2", "placeholder", "The expected answer...", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-none"], ["formControlName", "explanation", "rows", "2", "placeholder", "Explain the answer...", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-none"], ["formControlName", "difficulty", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], ["value", "beginner"], ["value", "intermediate"], [1, "flex", "items-center", "gap-3"], [1, "flex", "items-center", "gap-2", "cursor-pointer"], ["formControlName", "isPreviousYear", "type", "checkbox", 1, "accent-indigo-600", "h-4", "w-4", "rounded"], [1, "text-sm", "text-gray-700", "dark:text-gray-300"], ["formControlName", "year", "type", "number", "min", "1990", "max", "2030", "placeholder", "Year", 1, "w-24", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-1.5", "text-sm", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], [1, "rounded-lg", "bg-red-50", "dark:bg-red-950/30", "border", "border-red-200", "dark:border-red-700", "px-4", "py-3"], [1, "flex", "gap-2", "pt-2"], ["type", "button", 1, "flex-1", "py-2", "bg-indigo-600", "hover:bg-indigo-700", "disabled:opacity-40", "disabled:cursor-not-allowed", "text-white", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click", "disabled"], ["type", "button", 1, "px-4", "py-2", "bg-gray-100", "hover:bg-gray-200", "dark:bg-gray-800", "dark:hover:bg-gray-700", "text-gray-700", "dark:text-gray-300", "text-sm", "font-medium", "rounded-lg", "transition-colors", 3, "click"], [1, "text-xs", "font-mono", "text-indigo-700", "dark:text-indigo-300"], [1, "text-xs", "text-indigo-400", "ml-auto"], ["formControlName", "id", "type", "text", "placeholder", "auto-generated", 1, "flex-1", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "font-mono", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500"], ["type", "button", 1, "px-3", "py-2", "text-xs", "font-medium", "bg-gray-100", "hover:bg-gray-200", "dark:bg-gray-800", "dark:hover:bg-gray-700", "text-gray-700", "dark:text-gray-300", "rounded-lg", "transition-colors", 3, "click"], ["formControlName", "codeSnippet", "rows", "5", "placeholder", "x = 10\nprint(x)", 1, "w-full", "rounded-lg", "border", "border-gray-300", "dark:border-gray-600", "bg-white", "dark:bg-gray-800", "text-gray-900", "dark:text-gray-100", "px-3", "py-2", "text-sm", "font-mono", "focus:outline-none", "focus:ring-2", "focus:ring-indigo-500", "resize-y"], [1, "text-xs", "text-red-600", "dark:text-red-400"]], template: function PythonEditorComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "label", 1);
      \u0275\u0275text(3, "Content File");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "select", 2);
      \u0275\u0275listener("change", function PythonEditorComponent_Template_select_change_4_listener($event) {
        return ctx.onFileChange($event);
      });
      \u0275\u0275repeaterCreate(5, PythonEditorComponent_For_6_Template, 2, 2, "option", 3, _forTrack03);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(7, PythonEditorComponent_Conditional_7_Template, 8, 2, "div", 4)(8, PythonEditorComponent_Conditional_8_Template, 60, 11, "div", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("value", ctx.selectedFile());
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.pythonFiles);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.viewMode() === "list" ? 7 : 8);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, FormControlDirective, FormGroupDirective, FormControlName, OcrZoneComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PythonEditorComponent, [{
    type: Component,
    args: [{
      selector: "app-python-editor",
      standalone: true,
      imports: [ReactiveFormsModule, OcrZoneComponent],
      template: `
    <div class="space-y-4">
      <!-- File picker -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content File</label>
        <select [value]="selectedFile()" (change)="onFileChange($event)"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          @for (f of pythonFiles; track f.id) { <option [value]="f.id">{{ f.label }}</option> }
        </select>
      </div>

      @if (viewMode() === 'list') {
        <!-- LIST VIEW -->
        <div class="space-y-3">
          <div class="flex gap-2">
            <input [formControl]="filterCtrl" type="search" placeholder="Filter by ID or question..."
              class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <button type="button" (click)="startAdd()"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
              + Add Question
            </button>
          </div>

          @if (allItems() === null) {
            <div class="rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-6 text-center">
              <p class="text-sm text-red-600 dark:text-red-400">Could not load content. Ensure dev server is running.</p>
            </div>
          } @else if (allItems()!.length === 0) {
            <div class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">No questions yet.</p>
              <button type="button" (click)="startAdd()"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                + Add First Question
              </button>
            </div>
          } @else {
            <div class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="px-4 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <span class="text-xs text-gray-500">{{ filteredItems().length }} / {{ allItems()!.length }} questions</span>
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-800">
                @for (item of filteredItems(); track item.id) {
                  <div class="px-4 py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <div class="flex items-start gap-3">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-xs font-mono text-indigo-600 dark:text-indigo-400">{{ item.id }}</span>
                          <span class="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{{ item.type }}</span>
                          <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">{{ item.difficulty }}</span>
                          @if (item.isPreviousYear) {
                            <span class="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                              PYQ {{ item.year }}
                            </span>
                          }
                        </div>
                        <p class="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">{{ item.questionText ?? item.codeSnippet }}</p>
                      </div>
                      <div class="flex gap-1.5 shrink-0">
                        <button type="button" (click)="startEdit(item)"
                          class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100
                                 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 transition-colors">
                          Edit
                        </button>
                        <button type="button" (click)="deleteItem(item)"
                          class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-50 hover:bg-red-100
                                 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>

      } @else {
        <!-- FORM VIEW -->
        <div class="space-y-5">
          <div class="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <button type="button" (click)="backToList()"
              class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              &larr; Back to List
            </button>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-auto">
              {{ editMode() ? 'Editing: ' + editingOriginalId() : '+ New Python Question' }}
            </span>
          </div>

          <app-ocr-zone (parsed)="onOcrParsed($event)"></app-ocr-zone>

          <form [formGroup]="form" class="space-y-4">
            <!-- ID -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question ID</label>
              @if (editMode()) {
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                  <span class="text-xs font-mono text-indigo-700 dark:text-indigo-300">{{ form.get('id')!.value }}</span>
                  <span class="text-xs text-indigo-400 ml-auto">Editing existing</span>
                </div>
              } @else {
                <div class="flex gap-2">
                  <input formControlName="id" type="text"
                    class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                           text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="auto-generated">
                  <button type="button" (click)="generateId()"
                    class="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                           text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                    Auto
                  </button>
                </div>
              }
              @if (idCtrl.invalid && idCtrl.touched) { <p class="mt-1 text-xs text-red-500">ID is required</p> }
              @if (!idUnique()) { <p class="mt-1 text-xs text-red-500">ID already exists</p> }
            </div>

            <!-- Type -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question Type</label>
              <select formControlName="type"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                @for (t of pythonTypes; track t.value) { <option [value]="t.value">{{ t.label }}</option> }
              </select>
            </div>

            <!-- Question (optional for output-based) -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Question <span class="text-gray-400">(optional for output-based)</span></label>
              <textarea formControlName="questionText" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Enter the question text..."></textarea>
            </div>

            <!-- Code Snippet (only for output-based) -->
            @if (form.get('type')!.value === 'output-based') {
              <div>
                <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Code Snippet</label>
                <textarea formControlName="codeSnippet" rows="5"
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  placeholder="x = 10&#10;print(x)"></textarea>
                @if (form.get('codeSnippet')!.invalid && form.get('codeSnippet')!.touched) { <p class="mt-1 text-xs text-red-500">Required for output-based questions</p> }
              </div>
            }

            <!-- Answer -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Answer <span class="text-gray-400">(optional)</span></label>
              <textarea formControlName="answer" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="The expected answer..."></textarea>
            </div>

            <!-- Explanation -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Explanation</label>
              <textarea formControlName="explanation" rows="2"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Explain the answer..."></textarea>
              @if (form.get('explanation')!.invalid && form.get('explanation')!.touched) { <p class="mt-1 text-xs text-red-500">Required</p> }
            </div>

            <!-- Difficulty -->
            <div>
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Difficulty</label>
              <select formControlName="difficulty"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                       text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
              </select>
            </div>

            <!-- PYQ -->
            <div class="flex items-center gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input formControlName="isPreviousYear" type="checkbox" class="accent-indigo-600 h-4 w-4 rounded">
                <span class="text-sm text-gray-700 dark:text-gray-300">Previous Year Question</span>
              </label>
              @if (form.get('isPreviousYear')!.value) {
                <input formControlName="year" type="number" min="1990" max="2030"
                  class="w-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800
                         text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Year">
              }
            </div>

            @if (saveError()) {
              <div class="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-700 px-4 py-3">
                <p class="text-xs text-red-600 dark:text-red-400">{{ saveError() }}</p>
              </div>
            }

            <div class="flex gap-2 pt-2">
              <button type="button" (click)="onSubmit()"
                class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-medium rounded-lg transition-colors"
                [disabled]="form.invalid || !idUnique() || saving()">
                @if (saving()) { Saving\u2026 } @else { {{ editMode() ? 'Save Changes' : 'Add Question' }} }
              </button>
              <button type="button" (click)="backToList()"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
    }]
  }], null, { dirtyChange: [{ type: Output, args: ["dirtyChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PythonEditorComponent, { className: "PythonEditorComponent", filePath: "src/app/features/admin/python-editor/python-editor.ts", lineNumber: 257 });
})();

// src/app/features/admin/admin-shell/admin-shell.ts
var _forTrack04 = ($index, $item) => $item.id;
function AdminShellComponent_For_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function AdminShellComponent_For_11_Template_button_click_0_listener() {
      const tab_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.switchTab(tab_r2.id));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tab_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r2.tabClass(tab_r2.id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tab_r2.label, " ");
  }
}
function AdminShellComponent_Case_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-mcq-editor", 10);
    \u0275\u0275listener("dirtyChange", function AdminShellComponent_Case_13_Template_app_mcq_editor_dirtyChange_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.isDirty.set($event));
    });
    \u0275\u0275elementEnd();
  }
}
function AdminShellComponent_Case_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-sql-editor", 10);
    \u0275\u0275listener("dirtyChange", function AdminShellComponent_Case_14_Template_app_sql_editor_dirtyChange_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.isDirty.set($event));
    });
    \u0275\u0275elementEnd();
  }
}
function AdminShellComponent_Case_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-python-editor", 10);
    \u0275\u0275listener("dirtyChange", function AdminShellComponent_Case_15_Template_app_python_editor_dirtyChange_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.isDirty.set($event));
    });
    \u0275\u0275elementEnd();
  }
}
var AdminShellComponent = class _AdminShellComponent {
  activeTab = signal("mcq", ...ngDevMode ? [{ debugName: "activeTab" }] : (
    /* istanbul ignore next */
    []
  ));
  isDirty = signal(false, ...ngDevMode ? [{ debugName: "isDirty" }] : (
    /* istanbul ignore next */
    []
  ));
  tabs = [
    { id: "mcq", label: "\u{1F9E0} MCQ" },
    { id: "sql", label: "\u{1F5C4}\uFE0F SQL" },
    { id: "python", label: "\u{1F40D} Python" }
  ];
  tabClass(tab) {
    const base = "flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors";
    return this.activeTab() === tab ? `${base} border-indigo-500 text-indigo-600 dark:text-indigo-400` : `${base} border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200`;
  }
  switchTab(tab) {
    if (this.isDirty() && this.activeTab() !== tab) {
      if (!window.confirm("You have unsaved changes \u2014 switching tabs will clear the form. Continue?")) {
        return;
      }
      this.isDirty.set(false);
    }
    this.activeTab.set(tab);
  }
  static \u0275fac = function AdminShellComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminShellComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminShellComponent, selectors: [["app-admin-shell"]], features: [\u0275\u0275ProvidersFeature([AdminContentLoaderService, AdminIdGeneratorService])], decls: 16, vars: 1, consts: [[1, "min-h-screen", "bg-gray-50", "dark:bg-gray-950"], [1, "bg-amber-500", "text-amber-950", "text-center", "text-xs", "font-semibold", "py-1.5", "px-4"], [1, "bg-white", "dark:bg-gray-900", "border-b", "border-gray-200", "dark:border-gray-700", "px-4", "py-3"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-gray-100"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "bg-white", "dark:bg-gray-900", "border-b", "border-gray-200", "dark:border-gray-700"], [1, "flex"], ["type", "button", 3, "class"], [1, "p-4", "max-w-4xl", "mx-auto"], ["type", "button", 3, "click"], [3, "dirtyChange"]], template: function AdminShellComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275text(2, " \u26A0\uFE0F ADMIN PANEL \u2014 Development mode only. Not accessible in production. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "h1", 3);
      \u0275\u0275text(5, "Content Editor");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 4);
      \u0275\u0275text(7, "Create and export CBSE CS Hub content");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "div", 5)(9, "div", 6);
      \u0275\u0275repeaterCreate(10, AdminShellComponent_For_11_Template, 2, 3, "button", 7, _forTrack04);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "div", 8);
      \u0275\u0275conditionalCreate(13, AdminShellComponent_Case_13_Template, 1, 0, "app-mcq-editor")(14, AdminShellComponent_Case_14_Template, 1, 0, "app-sql-editor")(15, AdminShellComponent_Case_15_Template, 1, 0, "app-python-editor");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.tabs);
      \u0275\u0275advance(3);
      \u0275\u0275conditional((tmp_1_0 = ctx.activeTab()) === "mcq" ? 13 : tmp_1_0 === "sql" ? 14 : tmp_1_0 === "python" ? 15 : -1);
    }
  }, dependencies: [McqEditorComponent, SqlEditorComponent, PythonEditorComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminShellComponent, [{
    type: Component,
    args: [{
      selector: "app-admin-shell",
      standalone: true,
      imports: [McqEditorComponent, SqlEditorComponent, PythonEditorComponent],
      providers: [AdminContentLoaderService, AdminIdGeneratorService],
      template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      <!-- Dev-only banner -->
      <div class="bg-amber-500 text-amber-950 text-center text-xs font-semibold py-1.5 px-4">
        \u26A0\uFE0F ADMIN PANEL \u2014 Development mode only. Not accessible in production.
      </div>

      <!-- Header -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">Content Editor</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">Create and export CBSE CS Hub content</p>
      </div>

      <!-- Tab bar -->
      <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div class="flex">
          @for (tab of tabs; track tab.id) {
            <button
              (click)="switchTab(tab.id)"
              [class]="tabClass(tab.id)"
              type="button">
              {{ tab.label }}
            </button>
          }
        </div>
      </div>

      <!-- Content area -->
      <div class="p-4 max-w-4xl mx-auto">
        @switch (activeTab()) {
          @case ('mcq') {
            <app-mcq-editor (dirtyChange)="isDirty.set($event)"></app-mcq-editor>
          }
          @case ('sql') {
            <app-sql-editor (dirtyChange)="isDirty.set($event)"></app-sql-editor>
          }
          @case ('python') {
            <app-python-editor (dirtyChange)="isDirty.set($event)"></app-python-editor>
          }
        }
      </div>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminShellComponent, { className: "AdminShellComponent", filePath: "src/app/features/admin/admin-shell/admin-shell.ts", lineNumber: 59 });
})();
export {
  AdminShellComponent
};
//# sourceMappingURL=chunk-IQBW5NEG.js.map
