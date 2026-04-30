import {
  roleGuard
} from "./chunk-PDQ3N44P.js";
import {
  AuthService
} from "./chunk-365GLUEY.js";
import {
  SubscriptionService
} from "./chunk-6G5WCKMG.js";
import {
  PreloadAllModules,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  bootstrapApplication,
  provideRouter,
  withPreloading
} from "./chunk-FD4ICAJB.js";
import {
  CommonModule,
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
  catchError,
  inject,
  provideBrowserGlobalErrorListeners,
  provideHttpClient,
  setClassMetadata,
  signal,
  switchMap,
  throwError,
  withInterceptors,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-LVJD5TEN.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/core/auth/auth.guard.ts
var authGuard = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.currentUser()) {
    return true;
  }
  const returnUrl = route.url.map((s) => s.path).join("/");
  router.navigate(["/login"], { queryParams: { returnUrl: `/${returnUrl}` } });
  return false;
};

// src/app/app.routes.ts
var routes = [
  { path: "", loadComponent: () => import("./chunk-SWJA27EB.js").then((m) => m.HomeComponent) },
  { path: "login", loadComponent: () => import("./chunk-WDLZ27EK.js").then((m) => m.LoginComponent) },
  { path: "register", loadComponent: () => import("./chunk-Y7L22AL4.js").then((m) => m.RegisterComponent) },
  { path: "forgot-password", loadComponent: () => import("./chunk-ALFFXVBI.js").then((m) => m.PasswordResetComponent) },
  { path: "reset-password", loadComponent: () => import("./chunk-ALFFXVBI.js").then((m) => m.PasswordResetComponent) },
  { path: "plans", loadComponent: () => import("./chunk-6QOMPTJA.js").then((m) => m.PlansComponent) },
  { path: "practice", canActivate: [authGuard], loadChildren: () => import("./chunk-HSYYVAKI.js").then((m) => m.practiceRoutes) },
  { path: "leaderboard", canActivate: [authGuard], loadComponent: () => import("./chunk-HFK44EXY.js").then((m) => m.LeaderboardComponent) },
  { path: "profile", canActivate: [authGuard], loadComponent: () => import("./chunk-CBQ367CU.js").then((m) => m.ProfileComponent) },
  { path: "admin", canActivate: [authGuard, roleGuard("ADMIN")], loadChildren: () => import("./chunk-N4KLGCKK.js").then((m) => m.adminRoutes) },
  { path: "**", redirectTo: "" }
];

// src/app/core/interceptors/credentials.interceptor.ts
var credentialsInterceptor = (req, next) => {
  const withCreds = req.clone({ withCredentials: true });
  return next(withCreds);
};

// src/app/core/interceptors/error.interceptor.ts
var errorInterceptor = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(catchError((err) => {
    if (err.status === 401 && !req.url.includes("/auth/login") && !req.url.includes("/auth/refresh") && !req.url.includes("/auth/register")) {
      return auth.refreshToken().pipe(switchMap(() => next(req.clone({ withCredentials: true }))), catchError((refreshErr) => {
        auth.clearSession();
        return throwError(() => refreshErr);
      }));
    }
    return throwError(() => err);
  }));
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([credentialsInterceptor, errorInterceptor]))
  ]
};

// src/app/shared/ui/navbar/navbar.component.ts
function NavbarComponent_Conditional_8_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 10);
    \u0275\u0275text(1, "\u2699\uFE0F Admin");
    \u0275\u0275elementEnd();
  }
}
function NavbarComponent_Conditional_8_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 14);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r1.subscriptionService.currentPlan().planName === "Free" ? "bg-gray-100 text-gray-600" : "bg-brand-100 text-brand-700");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.subscriptionService.currentPlan().planName, " ");
  }
}
function NavbarComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "a", 7);
    \u0275\u0275text(2, "Practice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 8);
    \u0275\u0275text(4, "Leaderboard");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "a", 9);
    \u0275\u0275text(6, "Plans");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, NavbarComponent_Conditional_8_Conditional_7_Template, 2, 0, "a", 10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 5);
    \u0275\u0275conditionalCreate(9, NavbarComponent_Conditional_8_Conditional_9_Template, 2, 3, "span", 11);
    \u0275\u0275elementStart(10, "a", 12);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 13);
    \u0275\u0275listener("click", function NavbarComponent_Conditional_8_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275text(13, " Logout ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275conditional(((tmp_1_0 = ctx_r1.authService.currentUser()) == null ? null : tmp_1_0.role) === "ADMIN" ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.subscriptionService.currentPlan() ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.authService.currentUser().displayName || ctx_r1.authService.currentUser().email, " ");
  }
}
function NavbarComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "a", 15);
    \u0275\u0275text(2, "Login");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 16);
    \u0275\u0275text(4, " Get Started ");
    \u0275\u0275elementEnd()();
  }
}
var NavbarComponent = class _NavbarComponent {
  authService = inject(AuthService);
  subscriptionService = inject(SubscriptionService);
  logout() {
    this.authService.logout().subscribe();
  }
  static \u0275fac = function NavbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavbarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarComponent, selectors: [["app-navbar"]], decls: 10, vars: 1, consts: [[1, "sticky", "top-0", "z-50", "bg-white", "border-b", "border-gray-200", "shadow-sm"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8"], [1, "flex", "justify-between", "items-center", "h-16"], ["routerLink", "/", 1, "flex", "items-center", "gap-2", "font-bold", "text-xl", "text-brand-700"], [1, "text-2xl"], [1, "flex", "items-center", "gap-3"], [1, "hidden", "sm:flex", "items-center", "gap-6", "text-sm", "font-medium", "text-gray-600"], ["routerLink", "/practice", "routerLinkActive", "text-brand-700 font-semibold", 1, "hover:text-brand-700", "transition-colors"], ["routerLink", "/leaderboard", "routerLinkActive", "text-brand-700 font-semibold", 1, "hover:text-brand-700", "transition-colors"], ["routerLink", "/plans", "routerLinkActive", "text-brand-700 font-semibold", 1, "hover:text-brand-700", "transition-colors"], ["routerLink", "/admin", "routerLinkActive", "text-brand-700 font-semibold", 1, "hover:text-brand-700", "transition-colors", "font-semibold", "text-brand-600"], [1, "text-xs", "px-2", "py-1", "rounded-full", "font-semibold", 3, "class"], ["routerLink", "/profile", 1, "text-sm", "text-gray-700", "hover:text-brand-700"], [1, "text-sm", "text-gray-500", "hover:text-red-600", "transition-colors", 3, "click"], [1, "text-xs", "px-2", "py-1", "rounded-full", "font-semibold"], ["routerLink", "/login", 1, "text-sm", "font-medium", "text-gray-600", "hover:text-brand-700"], ["routerLink", "/register", 1, "text-sm", "font-semibold", "px-4", "py-2", "rounded-lg", "bg-brand-600", "text-white", "hover:bg-brand-700", "transition-colors"]], template: function NavbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "nav", 0)(1, "div", 1)(2, "div", 2)(3, "a", 3)(4, "span", 4);
      \u0275\u0275text(5, "\u{1F393}");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "span");
      \u0275\u0275text(7, "CBSE CS Hub");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(8, NavbarComponent_Conditional_8_Template, 14, 3)(9, NavbarComponent_Conditional_9_Template, 5, 0, "div", 5);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(8);
      \u0275\u0275conditional(ctx.authService.currentUser() ? 8 : 9);
    }
  }, dependencies: [CommonModule, RouterLink, RouterLinkActive], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarComponent, [{
    type: Component,
    args: [{
      selector: "app-navbar",
      standalone: true,
      imports: [CommonModule, RouterLink, RouterLinkActive],
      template: `
    <nav class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 font-bold text-xl text-brand-700">
            <span class="text-2xl">\u{1F393}</span>
            <span>CBSE CS Hub</span>
          </a>

          <!-- Nav links (authenticated) -->
          @if (authService.currentUser()) {
            <div class="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
              <a routerLink="/practice" routerLinkActive="text-brand-700 font-semibold"
                 class="hover:text-brand-700 transition-colors">Practice</a>
              <a routerLink="/leaderboard" routerLinkActive="text-brand-700 font-semibold"
                 class="hover:text-brand-700 transition-colors">Leaderboard</a>
              <a routerLink="/plans" routerLinkActive="text-brand-700 font-semibold"
                 class="hover:text-brand-700 transition-colors">Plans</a>
              @if (authService.currentUser()?.role === 'ADMIN') {
                <a routerLink="/admin" routerLinkActive="text-brand-700 font-semibold"
                   class="hover:text-brand-700 transition-colors font-semibold text-brand-600">\u2699\uFE0F Admin</a>
              }
            </div>

            <div class="flex items-center gap-3">
              <!-- Subscription badge -->
              @if (subscriptionService.currentPlan()) {
                <span class="text-xs px-2 py-1 rounded-full font-semibold"
                  [class]="subscriptionService.currentPlan()!.planName === 'Free' ? 'bg-gray-100 text-gray-600' : 'bg-brand-100 text-brand-700'">
                  {{ subscriptionService.currentPlan()!.planName }}
                </span>
              }
              <!-- User avatar + logout -->
              <a routerLink="/profile" class="text-sm text-gray-700 hover:text-brand-700">
                {{ authService.currentUser()!.displayName || authService.currentUser()!.email }}
              </a>
              <button (click)="logout()"
                class="text-sm text-gray-500 hover:text-red-600 transition-colors">
                Logout
              </button>
            </div>
          } @else {
            <div class="flex items-center gap-3">
              <a routerLink="/login" class="text-sm font-medium text-gray-600 hover:text-brand-700">Login</a>
              <a routerLink="/register"
                 class="text-sm font-semibold px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors">
                Get Started
              </a>
            </div>
          }
        </div>
      </div>
    </nav>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarComponent, { className: "NavbarComponent", filePath: "src/app/shared/ui/navbar/navbar.component.ts", lineNumber: 68 });
})();

// src/app/shared/ui/toast/toast.service.ts
var _id = 0;
var ToastService = class _ToastService {
  toasts = signal([], ...ngDevMode ? [{ debugName: "toasts" }] : (
    /* istanbul ignore next */
    []
  ));
  show(toast) {
    const id = ++_id;
    this.toasts.update((list) => [...list, __spreadProps(__spreadValues({}, toast), { id })]);
    return id;
  }
  success(message, duration = 4e3) {
    return this.show({ message, variant: "success", duration });
  }
  error(message, duration = 6e3) {
    return this.show({ message, variant: "error", duration });
  }
  info(message, duration = 4e3) {
    return this.show({ message, variant: "info", duration });
  }
  warning(message, duration = 5e3) {
    return this.show({ message, variant: "warning", duration });
  }
  dismiss(id) {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
  static \u0275fac = function ToastService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/shared/ui/toast/toast.component.ts
var ToastComponent = class _ToastComponent {
  message = "";
  variant = "info";
  duration = 4e3;
  dismissed = new EventEmitter();
  ngOnInit() {
    if (this.duration > 0) {
      setTimeout(() => this.dismiss(), this.duration);
    }
  }
  dismiss() {
    this.dismissed.emit();
  }
  get toastClasses() {
    const base = "flex items-center justify-between px-4 py-3 rounded-lg shadow-lg text-white pointer-events-auto";
    const variants = {
      success: "bg-success-600",
      error: "bg-danger-600",
      warning: "bg-warning-500",
      info: "bg-info-600"
    };
    return `${base} ${variants[this.variant]}`;
  }
  static \u0275fac = function ToastComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ToastComponent, selectors: [["app-toast"]], inputs: { message: "message", variant: "variant", duration: "duration" }, outputs: { dismissed: "dismissed" }, decls: 5, vars: 3, consts: [["role", "alert"], [1, "text-sm", "font-medium"], ["type", "button", "aria-label", "Dismiss", 1, "ml-4", "text-current", "opacity-70", "hover:opacity-100", 3, "click"]], template: function ToastComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "span", 1);
      \u0275\u0275text(2);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "button", 2);
      \u0275\u0275domListener("click", function ToastComponent_Template_button_click_3_listener() {
        return ctx.dismiss();
      });
      \u0275\u0275text(4, "\u2715");
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275classMap(ctx.toastClasses);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.message);
    }
  }, dependencies: [CommonModule], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastComponent, [{
    type: Component,
    args: [{
      selector: "app-toast",
      standalone: true,
      imports: [CommonModule],
      template: `
    <div
      role="alert"
      [class]="toastClasses"
    >
      <span class="text-sm font-medium">{{ message }}</span>
      <button
        type="button"
        class="ml-4 text-current opacity-70 hover:opacity-100"
        (click)="dismiss()"
        aria-label="Dismiss"
      >\u2715</button>
    </div>
  `
    }]
  }], null, { message: [{
    type: Input
  }], variant: [{
    type: Input
  }], duration: [{
    type: Input
  }], dismissed: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ToastComponent, { className: "ToastComponent", filePath: "src/app/shared/ui/toast/toast.component.ts", lineNumber: 31 });
})();

// src/app/app.ts
var _forTrack0 = ($index, $item) => $item.id;
function App_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-toast", 1);
    \u0275\u0275listener("dismissed", function App_For_4_Template_app_toast_dismissed_0_listener() {
      const toast_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toastService.dismiss(toast_r2.id));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const toast_r2 = ctx.$implicit;
    \u0275\u0275property("message", toast_r2.message)("variant", toast_r2.variant)("duration", toast_r2.duration ?? 4e3);
  }
}
var App = class _App {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  ngOnInit() {
    this.authService.init();
  }
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 5, vars: 0, consts: [[3, "message", "variant", "duration"], [3, "dismissed", "message", "variant", "duration"]], template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "app-navbar");
      \u0275\u0275elementStart(1, "main");
      \u0275\u0275element(2, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(3, App_For_4_Template, 1, 3, "app-toast", 0, _forTrack0);
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.toastService.toasts());
    }
  }, dependencies: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{
      selector: "app-root",
      standalone: true,
      imports: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent],
      template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <!-- Toast overlay -->
    @for (toast of toastService.toasts(); track toast.id) {
      <app-toast
        [message]="toast.message"
        [variant]="toast.variant"
        [duration]="toast.duration ?? 4000"
        (dismissed)="toastService.dismiss(toast.id)" />
    }
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 28 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
