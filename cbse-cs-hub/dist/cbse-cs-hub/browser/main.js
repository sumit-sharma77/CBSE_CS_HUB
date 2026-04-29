import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  bootstrapApplication,
  provideRouter
} from "./chunk-S2RS62IU.js";
import {
  provideHttpClient,
  withFetch
} from "./chunk-BVJZPSLF.js";
import {
  StorageService
} from "./chunk-UZIXFQP3.js";
import {
  ApplicationRef,
  Component,
  Injectable,
  InjectionToken,
  Injector,
  NEVER,
  NgModule,
  NgZone,
  Observable,
  RuntimeError,
  Subject,
  effect,
  filter,
  formatRuntimeError,
  inject,
  isDevMode,
  makeEnvironmentProviders,
  map,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  setClassMetadata,
  signal,
  switchMap,
  take,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-XM2PN737.js";
import {
  __spreadValues
} from "./chunk-OCBFZOLU.js";

// node_modules/@angular/service-worker/fesm2022/service-worker.mjs
/**
 * @license Angular v21.2.10
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */
var ERR_SW_NOT_SUPPORTED = "Service workers are disabled or not supported by this browser";
var NgswCommChannel = class {
  serviceWorker;
  worker;
  registration;
  events;
  constructor(serviceWorker, injector) {
    this.serviceWorker = serviceWorker;
    if (!serviceWorker) {
      this.worker = this.events = this.registration = new Observable((subscriber) => subscriber.error(new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED)));
    } else {
      let currentWorker = null;
      const workerSubject = new Subject();
      this.worker = new Observable((subscriber) => {
        if (currentWorker !== null) {
          subscriber.next(currentWorker);
        }
        return workerSubject.subscribe((v) => subscriber.next(v));
      });
      const updateController = () => {
        const {
          controller
        } = serviceWorker;
        if (controller === null) {
          return;
        }
        currentWorker = controller;
        workerSubject.next(currentWorker);
      };
      serviceWorker.addEventListener("controllerchange", updateController);
      updateController();
      this.registration = this.worker.pipe(switchMap(() => serviceWorker.getRegistration().then((registration) => {
        if (!registration) {
          throw new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED);
        }
        return registration;
      })));
      const _events = new Subject();
      this.events = _events.asObservable();
      const messageListener = (event) => {
        const {
          data
        } = event;
        if (data?.type) {
          _events.next(data);
        }
      };
      serviceWorker.addEventListener("message", messageListener);
      const appRef = injector?.get(ApplicationRef, null, {
        optional: true
      });
      appRef?.onDestroy(() => {
        serviceWorker.removeEventListener("controllerchange", updateController);
        serviceWorker.removeEventListener("message", messageListener);
      });
    }
  }
  postMessage(action, payload) {
    return new Promise((resolve) => {
      this.worker.pipe(take(1)).subscribe((sw) => {
        sw.postMessage(__spreadValues({
          action
        }, payload));
        resolve();
      });
    });
  }
  postMessageWithOperation(type, payload, operationNonce) {
    const waitForOperationCompleted = this.waitForOperationCompleted(operationNonce);
    const postMessage = this.postMessage(type, payload);
    return Promise.all([postMessage, waitForOperationCompleted]).then(([, result]) => result);
  }
  generateNonce() {
    return Math.round(Math.random() * 1e7);
  }
  eventsOfType(type) {
    let filterFn;
    if (typeof type === "string") {
      filterFn = (event) => event.type === type;
    } else {
      filterFn = (event) => type.includes(event.type);
    }
    return this.events.pipe(filter(filterFn));
  }
  nextEventOfType(type) {
    return this.eventsOfType(type).pipe(take(1));
  }
  waitForOperationCompleted(nonce) {
    return new Promise((resolve, reject) => {
      this.eventsOfType("OPERATION_COMPLETED").pipe(filter((event) => event.nonce === nonce), take(1), map((event) => {
        if (event.result !== void 0) {
          return event.result;
        }
        throw new Error(event.error);
      })).subscribe({
        next: resolve,
        error: reject
      });
    });
  }
  get isEnabled() {
    return !!this.serviceWorker;
  }
};
var SwPush = class _SwPush {
  sw;
  messages;
  notificationClicks;
  notificationCloses;
  pushSubscriptionChanges;
  subscription;
  get isEnabled() {
    return this.sw.isEnabled;
  }
  pushManager = null;
  subscriptionChanges = new Subject();
  constructor(sw) {
    this.sw = sw;
    if (!sw.isEnabled) {
      this.messages = NEVER;
      this.notificationClicks = NEVER;
      this.notificationCloses = NEVER;
      this.pushSubscriptionChanges = NEVER;
      this.subscription = NEVER;
      return;
    }
    this.messages = this.sw.eventsOfType("PUSH").pipe(map((message) => message.data));
    this.notificationClicks = this.sw.eventsOfType("NOTIFICATION_CLICK").pipe(map((message) => message.data));
    this.notificationCloses = this.sw.eventsOfType("NOTIFICATION_CLOSE").pipe(map((message) => message.data));
    this.pushSubscriptionChanges = this.sw.eventsOfType("PUSH_SUBSCRIPTION_CHANGE").pipe(map((message) => message.data));
    this.pushManager = this.sw.registration.pipe(map((registration) => registration.pushManager));
    const workerDrivenSubscriptions = this.pushManager.pipe(switchMap((pm) => pm.getSubscription()));
    this.subscription = new Observable((subscriber) => {
      const workerDrivenSubscription = workerDrivenSubscriptions.subscribe(subscriber);
      const subscriptionChanges = this.subscriptionChanges.subscribe(subscriber);
      return () => {
        workerDrivenSubscription.unsubscribe();
        subscriptionChanges.unsubscribe();
      };
    });
  }
  requestSubscription(options) {
    if (!this.sw.isEnabled || this.pushManager === null) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const pushOptions = {
      userVisibleOnly: true
    };
    let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, "/").replace(/-/g, "+"));
    let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
    for (let i = 0; i < key.length; i++) {
      applicationServerKey[i] = key.charCodeAt(i);
    }
    pushOptions.applicationServerKey = applicationServerKey;
    return new Promise((resolve, reject) => {
      this.pushManager.pipe(switchMap((pm) => pm.subscribe(pushOptions)), take(1)).subscribe({
        next: (sub) => {
          this.subscriptionChanges.next(sub);
          resolve(sub);
        },
        error: reject
      });
    });
  }
  unsubscribe() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const doUnsubscribe = (sub) => {
      if (sub === null) {
        throw new RuntimeError(5602, (typeof ngDevMode === "undefined" || ngDevMode) && "Not subscribed to push notifications.");
      }
      return sub.unsubscribe().then((success) => {
        if (!success) {
          throw new RuntimeError(5603, (typeof ngDevMode === "undefined" || ngDevMode) && "Unsubscribe failed!");
        }
        this.subscriptionChanges.next(null);
      });
    };
    return new Promise((resolve, reject) => {
      this.subscription.pipe(take(1), switchMap(doUnsubscribe)).subscribe({
        next: resolve,
        error: reject
      });
    });
  }
  decodeBase64(input) {
    return atob(input);
  }
  static \u0275fac = function SwPush_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SwPush)(\u0275\u0275inject(NgswCommChannel));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _SwPush,
    factory: _SwPush.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SwPush, [{
    type: Injectable
  }], () => [{
    type: NgswCommChannel
  }], null);
})();
var SwUpdate = class _SwUpdate {
  sw;
  versionUpdates;
  unrecoverable;
  get isEnabled() {
    return this.sw.isEnabled;
  }
  ongoingCheckForUpdate = null;
  constructor(sw) {
    this.sw = sw;
    if (!sw.isEnabled) {
      this.versionUpdates = NEVER;
      this.unrecoverable = NEVER;
      return;
    }
    this.versionUpdates = this.sw.eventsOfType(["VERSION_DETECTED", "VERSION_INSTALLATION_FAILED", "VERSION_READY", "NO_NEW_VERSION_DETECTED"]);
    this.unrecoverable = this.sw.eventsOfType("UNRECOVERABLE_STATE");
  }
  checkForUpdate() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    if (this.ongoingCheckForUpdate) {
      return this.ongoingCheckForUpdate;
    }
    const nonce = this.sw.generateNonce();
    this.ongoingCheckForUpdate = this.sw.postMessageWithOperation("CHECK_FOR_UPDATES", {
      nonce
    }, nonce).finally(() => {
      this.ongoingCheckForUpdate = null;
    });
    return this.ongoingCheckForUpdate;
  }
  activateUpdate() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED));
    }
    const nonce = this.sw.generateNonce();
    return this.sw.postMessageWithOperation("ACTIVATE_UPDATE", {
      nonce
    }, nonce);
  }
  static \u0275fac = function SwUpdate_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SwUpdate)(\u0275\u0275inject(NgswCommChannel));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _SwUpdate,
    factory: _SwUpdate.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SwUpdate, [{
    type: Injectable
  }], () => [{
    type: NgswCommChannel
  }], null);
})();
var SCRIPT = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGSW_REGISTER_SCRIPT" : "");
function ngswAppInitializer() {
  if (false) {
    return;
  }
  const options = inject(SwRegistrationOptions);
  if (!("serviceWorker" in navigator && options.enabled !== false)) {
    return;
  }
  const script = inject(SCRIPT);
  const ngZone = inject(NgZone);
  const appRef = inject(ApplicationRef);
  ngZone.runOutsideAngular(() => {
    const sw = navigator.serviceWorker;
    const onControllerChange = () => sw.controller?.postMessage({
      action: "INITIALIZE"
    });
    sw.addEventListener("controllerchange", onControllerChange);
    appRef.onDestroy(() => {
      sw.removeEventListener("controllerchange", onControllerChange);
    });
  });
  ngZone.runOutsideAngular(() => {
    let readyToRegister;
    const {
      registrationStrategy
    } = options;
    if (typeof registrationStrategy === "function") {
      readyToRegister = new Promise((resolve) => registrationStrategy().subscribe(() => resolve()));
    } else {
      const [strategy, ...args] = (registrationStrategy || "registerWhenStable:30000").split(":");
      switch (strategy) {
        case "registerImmediately":
          readyToRegister = Promise.resolve();
          break;
        case "registerWithDelay":
          readyToRegister = delayWithTimeout(+args[0] || 0);
          break;
        case "registerWhenStable":
          readyToRegister = Promise.race([appRef.whenStable(), delayWithTimeout(+args[0])]);
          break;
        default:
          throw new RuntimeError(5600, (typeof ngDevMode === "undefined" || ngDevMode) && `Unknown ServiceWorker registration strategy: ${options.registrationStrategy}`);
      }
    }
    readyToRegister.then(() => {
      if (appRef.destroyed) {
        return;
      }
      navigator.serviceWorker.register(script, {
        scope: options.scope,
        updateViaCache: options.updateViaCache,
        type: options.type
      }).catch((err) => console.error(formatRuntimeError(5604, (typeof ngDevMode === "undefined" || ngDevMode) && "Service worker registration failed with: " + err)));
    });
  });
}
function delayWithTimeout(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
function ngswCommChannelFactory() {
  const opts = inject(SwRegistrationOptions);
  const injector = inject(Injector);
  const isBrowser = true;
  return new NgswCommChannel(isBrowser && opts.enabled !== false ? navigator.serviceWorker : void 0, injector);
}
var SwRegistrationOptions = class {
  enabled;
  updateViaCache;
  type;
  scope;
  registrationStrategy;
};
function provideServiceWorker(script, options = {}) {
  return makeEnvironmentProviders([SwPush, SwUpdate, {
    provide: SCRIPT,
    useValue: script
  }, {
    provide: SwRegistrationOptions,
    useValue: options
  }, {
    provide: NgswCommChannel,
    useFactory: ngswCommChannelFactory
  }, provideAppInitializer(ngswAppInitializer)]);
}
var ServiceWorkerModule = class _ServiceWorkerModule {
  static register(script, options = {}) {
    return {
      ngModule: _ServiceWorkerModule,
      providers: [provideServiceWorker(script, options)]
    };
  }
  static \u0275fac = function ServiceWorkerModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ServiceWorkerModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ServiceWorkerModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: [SwPush, SwUpdate]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ServiceWorkerModule, [{
    type: NgModule,
    args: [{
      providers: [SwPush, SwUpdate]
    }]
  }], null, null);
})();

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    loadComponent: () => import("./chunk-6KNLZ5IT.js").then((m) => m.Home)
  },
  {
    path: "study-notes",
    loadComponent: () => import("./chunk-JPIKWIRE.js").then((m) => m.ChapterList)
  },
  {
    path: "study-notes/:chapterId",
    loadComponent: () => import("./chunk-K5MQIZQR.js").then((m) => m.ChapterViewer)
  },
  {
    path: "notes",
    loadComponent: () => import("./chunk-JF5F2WQ5.js").then((m) => m.Notes)
  },
  {
    path: "sql",
    loadComponent: () => import("./chunk-IGT763FP.js").then((m) => m.SqlCategoryList)
  },
  {
    path: "sql/:category",
    loadComponent: () => import("./chunk-M6EQTURX.js").then((m) => m.SqlQuestionList)
  },
  {
    path: "python",
    loadComponent: () => import("./chunk-7B3ZYC2A.js").then((m) => m.PythonTopicList)
  },
  {
    path: "python/:topic",
    loadComponent: () => import("./chunk-TMFDZRB4.js").then((m) => m.PythonExerciseList)
  },
  {
    path: "mcq",
    loadComponent: () => import("./chunk-DRE3D6YN.js").then((m) => m.McqCategoryList)
  },
  {
    path: "mcq/:setId",
    loadComponent: () => import("./chunk-IK267DWH.js").then((m) => m.McqQuiz)
  },
  {
    path: "bookmarks",
    loadComponent: () => import("./chunk-5LSGFSE3.js").then((m) => m.Bookmarks)
  },
  {
    path: "progress",
    loadComponent: () => import("./chunk-65NP5IES.js").then((m) => m.Progress)
  },
  {
    path: "search",
    loadComponent: () => import("./chunk-A6WOALE6.js").then((m) => m.SearchResults)
  },
  {
    path: "403",
    loadComponent: () => import("./chunk-KZSIBSTD.js").then((m) => m.ForbiddenComponent)
  },
  {
    path: "admin",
    loadComponent: () => import("./chunk-IQBW5NEG.js").then((m) => m.AdminShellComponent),
    canActivate: [() => isDevMode()]
  },
  {
    path: "**",
    redirectTo: ""
  }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000"
    })
  ]
};

// src/app/core/services/theme.service.ts
var ThemeService = class _ThemeService {
  storage = inject(StorageService);
  theme = signal(this.storage.getString("cbse-theme") ?? "light", ...ngDevMode ? [{ debugName: "theme" }] : (
    /* istanbul ignore next */
    []
  ));
  constructor() {
    effect(() => {
      const t = this.theme();
      if (t === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      this.storage.setString("cbse-theme", t);
    });
  }
  toggle() {
    this.theme.set(this.theme() === "dark" ? "light" : "dark");
  }
  static \u0275fac = function ThemeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ThemeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ThemeService, factory: _ThemeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/shared/components/header/header.ts
function Header_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 6);
    \u0275\u0275element(1, "path", 9);
    \u0275\u0275elementEnd();
  }
}
function Header_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 6);
    \u0275\u0275element(1, "path", 10);
    \u0275\u0275elementEnd();
  }
}
var Header = class _Header {
  themeService = inject(ThemeService);
  static \u0275fac = function Header_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Header)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Header, selectors: [["app-header"]], decls: 14, vars: 1, consts: [[1, "sticky", "top-0", "z-50", "bg-white", "dark:bg-gray-900", "border-b", "border-gray-200", "dark:border-gray-700", "shadow-sm"], [1, "flex", "items-center", "justify-between", "px-4", "h-14", "max-w-5xl", "mx-auto"], ["routerLink", "/", 1, "flex", "items-center", "gap-2", "font-bold", "text-lg", "text-indigo-600", "dark:text-indigo-400"], [1, "text-xl"], [1, "flex", "items-center", "gap-3"], ["routerLink", "/search", "aria-label", "Search", 1, "p-2", "rounded-full", "hover:bg-gray-100", "dark:hover:bg-gray-800", "text-gray-600", "dark:text-gray-300"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "h-5", "w-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"], ["aria-label", "Toggle theme", 1, "p-2", "rounded-full", "hover:bg-gray-100", "dark:hover:bg-gray-800", "text-gray-600", "dark:text-gray-300", 3, "click"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"]], template: function Header_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "div", 1)(2, "a", 2)(3, "span", 3);
      \u0275\u0275text(4, "\u{1F4DA}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "span");
      \u0275\u0275text(6, "CBSE CS Hub");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 4)(8, "a", 5);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(9, "svg", 6);
      \u0275\u0275element(10, "path", 7);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(11, "button", 8);
      \u0275\u0275listener("click", function Header_Template_button_click_11_listener() {
        return ctx.themeService.toggle();
      });
      \u0275\u0275conditionalCreate(12, Header_Conditional_12_Template, 2, 0, ":svg:svg", 6)(13, Header_Conditional_13_Template, 2, 0, ":svg:svg", 6);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(12);
      \u0275\u0275conditional(ctx.themeService.theme() === "dark" ? 12 : 13);
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Header, [{
    type: Component,
    args: [{
      selector: "app-header",
      standalone: true,
      imports: [RouterLink],
      template: `
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto">
        <a routerLink="/" class="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400">
          <span class="text-xl">\u{1F4DA}</span>
          <span>CBSE CS Hub</span>
        </a>
        <div class="flex items-center gap-3">
          <a routerLink="/search" aria-label="Search"
             class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          </a>
          <button (click)="themeService.toggle()" aria-label="Toggle theme"
                  class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
            @if (themeService.theme() === 'dark') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
              </svg>
            }
          </button>
        </div>
      </div>
    </header>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Header, { className: "Header", filePath: "src/app/shared/components/header/header.ts", lineNumber: 43 });
})();

// src/app/shared/components/bottom-nav/bottom-nav.ts
var _c0 = (a0) => ({ exact: a0 });
var _forTrack0 = ($index, $item) => $item.route;
function BottomNav_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 2)(1, "a", 3)(2, "span", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 5);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r1.route)("routerLinkActiveOptions", \u0275\u0275pureFunction1(5, _c0, item_r1.route === "/"));
    \u0275\u0275attribute("aria-label", item_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
function BottomNav_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 2)(1, "a", 6)(2, "span", 4);
    \u0275\u0275text(3, "\u2699\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Admin");
    \u0275\u0275elementEnd()()();
  }
}
var BottomNav = class _BottomNav {
  showAdmin = isDevMode();
  navItems = [
    { label: "Study", route: "/study-notes", icon: "\u{1F4D6}" },
    { label: "MCQ", route: "/mcq", icon: "\u{1F9E0}" },
    { label: "SQL", route: "/sql", icon: "\u{1F5C4}\uFE0F" },
    { label: "Python", route: "/python", icon: "\u{1F40D}" },
    { label: "Progress", route: "/progress", icon: "\u{1F4CA}" },
    { label: "Notes", route: "/notes", icon: "\u{1F4DD}" }
  ];
  static \u0275fac = function BottomNav_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BottomNav)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BottomNav, selectors: [["app-bottom-nav"]], decls: 5, vars: 1, consts: [[1, "fixed", "bottom-0", "left-0", "right-0", "z-50", "bg-white", "dark:bg-gray-900", "border-t", "border-gray-200", "dark:border-gray-700", "md:hidden"], [1, "flex", "justify-around", "items-center", "h-16"], [1, "flex-1"], ["routerLinkActive", "text-indigo-600 dark:text-indigo-400", 1, "flex", "flex-col", "items-center", "justify-center", "h-full", "text-gray-500", "dark:text-gray-400", "text-xs", "gap-1", 3, "routerLink", "routerLinkActiveOptions"], [1, "text-lg", "leading-none"], [1, "truncate", "max-w-[4rem]"], ["routerLink", "/admin", "routerLinkActive", "text-amber-600 dark:text-amber-400", "aria-label", "Admin", 1, "flex", "flex-col", "items-center", "justify-center", "h-full", "text-amber-500", "dark:text-amber-400", "text-xs", "gap-1"]], template: function BottomNav_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "ul", 1);
      \u0275\u0275repeaterCreate(2, BottomNav_For_3_Template, 6, 7, "li", 2, _forTrack0);
      \u0275\u0275conditionalCreate(4, BottomNav_Conditional_4_Template, 6, 0, "li", 2);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.navItems);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showAdmin ? 4 : -1);
    }
  }, dependencies: [RouterLink, RouterLinkActive], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BottomNav, [{
    type: Component,
    args: [{
      selector: "app-bottom-nav",
      standalone: true,
      imports: [RouterLink, RouterLinkActive],
      template: `
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <ul class="flex justify-around items-center h-16">
        @for (item of navItems; track item.route) {
          <li class="flex-1">
            <a [routerLink]="item.route" routerLinkActive="text-indigo-600 dark:text-indigo-400"
               [routerLinkActiveOptions]="{ exact: item.route === '/' }"
               class="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 text-xs gap-1"
               [attr.aria-label]="item.label">
              <span class="text-lg leading-none">{{ item.icon }}</span>
              <span class="truncate max-w-[4rem]">{{ item.label }}</span>
            </a>
          </li>
        }
        @if (showAdmin) {
          <li class="flex-1">
            <a routerLink="/admin" routerLinkActive="text-amber-600 dark:text-amber-400"
               class="flex flex-col items-center justify-center h-full text-amber-500 dark:text-amber-400 text-xs gap-1"
               aria-label="Admin">
              <span class="text-lg leading-none">\u2699\uFE0F</span>
              <span>Admin</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BottomNav, { className: "BottomNav", filePath: "src/app/shared/components/bottom-nav/bottom-nav.ts", lineNumber: 42 });
})();

// src/app/shared/components/side-nav/side-nav.ts
var _c02 = (a0) => ({ exact: a0 });
var _forTrack02 = ($index, $item) => $item.route;
function SideNav_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "a", 3)(2, "span", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r1.route)("routerLinkActiveOptions", \u0275\u0275pureFunction1(5, _c02, item_r1.route === "/"));
    \u0275\u0275attribute("aria-label", item_r1.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.label);
  }
}
function SideNav_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 2)(1, "a", 5)(2, "span", 4);
    \u0275\u0275text(3, "\u2699\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "Admin Editor");
    \u0275\u0275elementEnd()()();
  }
}
var SideNav = class _SideNav {
  showAdmin = isDevMode();
  navItems = [
    { label: "Study Notes", route: "/study-notes", icon: "\u{1F4D6}" },
    { label: "MCQ Quiz", route: "/mcq", icon: "\u{1F9E0}" },
    { label: "SQL Practice", route: "/sql", icon: "\u{1F5C4}\uFE0F" },
    { label: "Python Practice", route: "/python", icon: "\u{1F40D}" },
    { label: "My Notes", route: "/notes", icon: "\u{1F4DD}" },
    { label: "Progress", route: "/progress", icon: "\u{1F4CA}" },
    { label: "Search", route: "/search", icon: "\u{1F50D}" }
  ];
  static \u0275fac = function SideNav_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SideNav)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SideNav, selectors: [["app-side-nav"]], decls: 5, vars: 1, consts: [[1, "hidden", "md:flex", "flex-col", "w-56", "min-h-screen", "border-r", "border-gray-200", "dark:border-gray-700", "bg-white", "dark:bg-gray-900", "py-6", "px-3", "shrink-0"], [1, "space-y-1"], [1, "mt-4", "pt-4", "border-t", "border-gray-200", "dark:border-gray-700"], ["routerLinkActive", "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold", 1, "flex", "items-center", "gap-3", "px-3", "py-2", "rounded-lg", "text-gray-700", "dark:text-gray-300", "hover:bg-gray-100", "dark:hover:bg-gray-800", "transition-colors", 3, "routerLink", "routerLinkActiveOptions"], [1, "text-lg"], ["routerLink", "/admin", "routerLinkActive", "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold", "aria-label", "Admin Editor", 1, "flex", "items-center", "gap-3", "px-3", "py-2", "rounded-lg", "text-amber-600", "dark:text-amber-400", "hover:bg-amber-50", "dark:hover:bg-amber-900/20", "transition-colors"]], template: function SideNav_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "ul", 1);
      \u0275\u0275repeaterCreate(2, SideNav_For_3_Template, 6, 7, "li", null, _forTrack02);
      \u0275\u0275conditionalCreate(4, SideNav_Conditional_4_Template, 6, 0, "li", 2);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.navItems);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showAdmin ? 4 : -1);
    }
  }, dependencies: [RouterLink, RouterLinkActive], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SideNav, [{
    type: Component,
    args: [{
      selector: "app-side-nav",
      standalone: true,
      imports: [RouterLink, RouterLinkActive],
      template: `
    <nav class="hidden md:flex flex-col w-56 min-h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-6 px-3 shrink-0">
      <ul class="space-y-1">
        @for (item of navItems; track item.route) {
          <li>
            <a [routerLink]="item.route" routerLinkActive="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold"
               [routerLinkActiveOptions]="{ exact: item.route === '/' }"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
               [attr.aria-label]="item.label">
              <span class="text-lg">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          </li>
        }
        @if (showAdmin) {
          <li class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a routerLink="/admin" routerLinkActive="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold"
               class="flex items-center gap-3 px-3 py-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
               aria-label="Admin Editor">
              <span class="text-lg">\u2699\uFE0F</span>
              <span>Admin Editor</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SideNav, { className: "SideNav", filePath: "src/app/shared/components/side-nav/side-nav.ts", lineNumber: 42 });
})();

// src/app/app.ts
var App = class _App {
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 7, vars: 0, consts: [[1, "min-h-screen", "bg-gray-50", "dark:bg-gray-950", "flex", "flex-col"], [1, "flex", "flex-1"], [1, "flex-1", "min-w-0", "px-4", "py-6", "pb-20", "md:pb-6", "max-w-3xl", "mx-auto", "w-full"]], template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "app-header");
      \u0275\u0275elementStart(2, "div", 1);
      \u0275\u0275element(3, "app-side-nav");
      \u0275\u0275elementStart(4, "main", 2);
      \u0275\u0275element(5, "router-outlet");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(6, "app-bottom-nav");
      \u0275\u0275elementEnd();
    }
  }, dependencies: [RouterOutlet, Header, BottomNav, SideNav], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{
      selector: "app-root",
      standalone: true,
      imports: [RouterOutlet, Header, BottomNav, SideNav],
      template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <app-header></app-header>
      <div class="flex flex-1">
        <app-side-nav></app-side-nav>
        <main class="flex-1 min-w-0 px-4 py-6 pb-20 md:pb-6 max-w-3xl mx-auto w-full">
          <router-outlet></router-outlet>
        </main>
      </div>
      <app-bottom-nav></app-bottom-nav>
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 24 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
