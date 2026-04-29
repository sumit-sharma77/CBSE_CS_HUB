import {
  McqProgressService
} from "./chunk-7MFXBZF3.js";
import {
  RecentlyViewedService
} from "./chunk-4WECW4T2.js";
import {
  ActivatedRoute,
  Router,
  RouterLink
} from "./chunk-S2RS62IU.js";
import {
  HttpClient
} from "./chunk-BVJZPSLF.js";
import "./chunk-UZIXFQP3.js";
import {
  Component,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-XM2PN737.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-OCBFZOLU.js";

// src/app/features/mcq/quiz/quiz.ts
var _c0 = () => [1, 2, 3];
var _forTrack0 = ($index, $item) => $item.id;
function McqQuiz_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Quiz complete ");
  }
}
function McqQuiz_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate2(" ", ctx_r0.answeredCount(), "/", ctx_r0.questions().length, " answered ");
  }
}
function McqQuiz_Conditional_12_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 9);
  }
}
function McqQuiz_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275repeaterCreate(1, McqQuiz_Conditional_12_For_2_Template, 1, 0, "div", 9, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c0));
  }
}
function McqQuiz_Conditional_13_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r0.scoreColor());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.correctCount(), " correct (", ctx_r0.scorePercent(), "%) ");
  }
}
function McqQuiz_Conditional_13_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 21);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 22);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 23);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 24)(10, "a", 25);
    \u0275\u0275text(11, " \u2190 All Quizzes ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 26);
    \u0275\u0275listener("click", function McqQuiz_Conditional_13_Conditional_7_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.retakeQuiz());
    });
    \u0275\u0275text(13, " Retake Quiz ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r0.resultCardClass());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.resultEmoji());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r0.correctCount(), "/", ctx_r0.questions().length);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.resultLabel());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.scorePercent(), "% accuracy");
  }
}
function McqQuiz_Conditional_13_For_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 32);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const q_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u{1F4CB} ", q_r3.year, " Board ");
  }
}
function McqQuiz_Conditional_13_For_9_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const q_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.isCorrect(q_r3.id) ? "\u2705" : "\u274C");
  }
}
function McqQuiz_Conditional_13_For_9_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275listener("click", function McqQuiz_Conditional_13_For_9_For_12_Template_button_click_0_listener() {
      const \u0275$index_93_r5 = \u0275\u0275restoreView(_r4).$index;
      const q_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.selectOption(q_r3, \u0275$index_93_r5));
    });
    \u0275\u0275elementStart(1, "span", 39);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r6 = ctx.$implicit;
    const \u0275$index_93_r5 = ctx.$index;
    const q_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r0.getOptionClass(q_r3, \u0275$index_93_r5));
    \u0275\u0275property("disabled", ctx_r0.isAnswered(q_r3.id));
    \u0275\u0275attribute("aria-label", "Option " + (\u0275$index_93_r5 + 1) + ": " + option_r6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r0.optionLabel(\u0275$index_93_r5), ".");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", option_r6, " ");
  }
}
function McqQuiz_Conditional_13_For_9_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40)(1, "p", 41);
    \u0275\u0275text(2, "\u{1F4A1} Explanation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const q_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r0.explanationClass(q_r3.id));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(q_r3.explanation);
  }
}
function McqQuiz_Conditional_13_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 28)(2, "div", 29)(3, "div", 30)(4, "span", 31);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, McqQuiz_Conditional_13_For_9_Conditional_6_Template, 2, 1, "span", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, McqQuiz_Conditional_13_For_9_Conditional_7_Template, 2, 1, "span", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 34);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 35);
    \u0275\u0275repeaterCreate(11, McqQuiz_Conditional_13_For_9_For_12_Template, 4, 6, "button", 36, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, McqQuiz_Conditional_13_For_9_Conditional_13_Template, 5, 3, "div", 37);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const q_r3 = ctx.$implicit;
    const \u0275$index_68_r7 = ctx.$index;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(ctx_r0.questionCardBorderClass(q_r3.id));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1(" Q", \u0275$index_68_r7 + 1, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(q_r3.isPreviousYear && q_r3.year ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isAnswered(q_r3.id) ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(q_r3.question);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(q_r3.options);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.isAnswered(q_r3.id) ? 13 : -1);
  }
}
function McqQuiz_Conditional_13_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r0.questions().length - ctx_r0.answeredCount(), " question", ctx_r0.questions().length - ctx_r0.answeredCount() === 1 ? "" : "s", " remaining ");
  }
}
function McqQuiz_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, McqQuiz_Conditional_13_Conditional_4_Template, 2, 4, "span", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 13);
    \u0275\u0275element(6, "div", 14);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, McqQuiz_Conditional_13_Conditional_7_Template, 14, 7, "div", 15);
    \u0275\u0275repeaterCreate(8, McqQuiz_Conditional_13_For_9_Template, 14, 7, "div", 16, _forTrack0);
    \u0275\u0275conditionalCreate(10, McqQuiz_Conditional_13_Conditional_10_Template, 2, 2, "p", 17);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r0.answeredCount(), "/", ctx_r0.questions().length, " answered");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.answeredCount() > 0 ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", ctx_r0.progressPercent(), "%");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.allAnswered() ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.questions());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.allAnswered() && ctx_r0.answeredCount() > 0 ? 10 : -1);
  }
}
var McqQuiz = class _McqQuiz {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  mcqProgress = inject(McqProgressService);
  recentlyViewed = inject(RecentlyViewedService);
  setId = signal("", ...ngDevMode ? [{ debugName: "setId" }] : (
    /* istanbul ignore next */
    []
  ));
  title = signal("", ...ngDevMode ? [{ debugName: "title" }] : (
    /* istanbul ignore next */
    []
  ));
  classLevel = signal(12, ...ngDevMode ? [{ debugName: "classLevel" }] : (
    /* istanbul ignore next */
    []
  ));
  questions = signal([], ...ngDevMode ? [{ debugName: "questions" }] : (
    /* istanbul ignore next */
    []
  ));
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : (
    /* istanbul ignore next */
    []
  ));
  /** questionId → selected option index */
  answers = signal({}, ...ngDevMode ? [{ debugName: "answers" }] : (
    /* istanbul ignore next */
    []
  ));
  answeredCount = computed(() => Object.keys(this.answers()).length, ...ngDevMode ? [{ debugName: "answeredCount" }] : (
    /* istanbul ignore next */
    []
  ));
  correctCount = computed(() => this.questions().filter((q) => this.answers()[q.id] === q.correctIndex).length, ...ngDevMode ? [{ debugName: "correctCount" }] : (
    /* istanbul ignore next */
    []
  ));
  allAnswered = computed(() => this.questions().length > 0 && this.answeredCount() === this.questions().length, ...ngDevMode ? [{ debugName: "allAnswered" }] : (
    /* istanbul ignore next */
    []
  ));
  progressPercent = computed(() => {
    const total = this.questions().length;
    return total > 0 ? Math.round(this.answeredCount() / total * 100) : 0;
  }, ...ngDevMode ? [{ debugName: "progressPercent" }] : (
    /* istanbul ignore next */
    []
  ));
  scorePercent = computed(() => {
    const answered = this.answeredCount();
    return answered > 0 ? Math.round(this.correctCount() / answered * 100) : 0;
  }, ...ngDevMode ? [{ debugName: "scorePercent" }] : (
    /* istanbul ignore next */
    []
  ));
  scoreColor = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 75)
      return "text-green-600 dark:text-green-400";
    if (pct >= 50)
      return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  }, ...ngDevMode ? [{ debugName: "scoreColor" }] : (
    /* istanbul ignore next */
    []
  ));
  resultEmoji = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 90)
      return "\u{1F3C6}";
    if (pct >= 75)
      return "\u{1F389}";
    if (pct >= 50)
      return "\u{1F44D}";
    return "\u{1F4DA}";
  }, ...ngDevMode ? [{ debugName: "resultEmoji" }] : (
    /* istanbul ignore next */
    []
  ));
  resultLabel = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 90)
      return "Excellent! Outstanding performance!";
    if (pct >= 75)
      return "Great job! Well done!";
    if (pct >= 50)
      return "Good effort! Keep practising.";
    return "Keep studying \u2014 you'll improve!";
  }, ...ngDevMode ? [{ debugName: "resultLabel" }] : (
    /* istanbul ignore next */
    []
  ));
  resultCardClass = computed(() => {
    const pct = this.scorePercent();
    if (pct >= 75)
      return "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200";
    if (pct >= 50)
      return "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200";
    return "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
  }, ...ngDevMode ? [{ debugName: "resultCardClass" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("setId") ?? "";
    this.setId.set(id);
    this.http.get(`/CBSE_CS_HUB/assets/content/mcq/${id}.json`).subscribe({
      next: (set) => {
        this.title.set(set.topic);
        this.classLevel.set(set.classLevel);
        this.questions.set(set.questions);
        this.loading.set(false);
        const saved = this.mcqProgress.getSession(id);
        if (saved) {
          this.answers.set(__spreadValues({}, saved.answers));
        }
        this.recentlyViewed.track({
          itemId: `mcq-${id}`,
          title: set.topic,
          type: "mcq",
          routePath: `/mcq/${id}`
        });
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(["/mcq"]);
      }
    });
  }
  selectOption(question, optionIndex) {
    if (this.isAnswered(question.id))
      return;
    this.answers.update((a) => __spreadProps(__spreadValues({}, a), { [question.id]: optionIndex }));
    this.mcqProgress.saveAnswer(this.setId(), question.id, optionIndex, question.correctIndex);
    if (this.allAnswered()) {
      this.mcqProgress.markCompleted(this.setId(), this.questions().length);
    }
  }
  retakeQuiz() {
    this.mcqProgress.resetSet(this.setId());
    this.answers.set({});
  }
  isAnswered(questionId) {
    return this.answers()[questionId] !== void 0;
  }
  isCorrect(questionId) {
    const q = this.questions().find((q2) => q2.id === questionId);
    return q ? this.answers()[questionId] === q.correctIndex : false;
  }
  getOptionClass(question, optionIndex) {
    const answered = this.isAnswered(question.id);
    if (!answered) {
      return "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer";
    }
    if (optionIndex === question.correctIndex) {
      return "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 font-medium cursor-default";
    }
    if (optionIndex === this.answers()[question.id]) {
      return "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 cursor-default";
    }
    return "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-500 opacity-60 cursor-default";
  }
  questionCardBorderClass(questionId) {
    if (!this.isAnswered(questionId))
      return "border-gray-200 dark:border-gray-700";
    return this.isCorrect(questionId) ? "border-green-300 dark:border-green-800" : "border-red-300 dark:border-red-800";
  }
  explanationClass(questionId) {
    return this.isCorrect(questionId) ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800" : "bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800";
  }
  optionLabel(index) {
    return String.fromCharCode(65 + index);
  }
  static \u0275fac = function McqQuiz_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _McqQuiz)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _McqQuiz, selectors: [["app-mcq-quiz"]], decls: 14, vars: 4, consts: [[1, "space-y-4", "pb-24", "md:pb-8"], [1, "flex", "items-center", "gap-3"], ["routerLink", "/mcq", "aria-label", "Back to MCQ list", 1, "p-2", "rounded-lg", "hover:bg-gray-100", "dark:hover:bg-gray-800", "text-gray-600", "dark:text-gray-300"], ["fill", "none", "viewBox", "0 0 24 24", "stroke", "currentColor", 1, "h-5", "w-5"], ["stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M15 19l-7-7 7-7"], [1, "flex-1", "min-w-0"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-gray-100", "truncate"], [1, "text-xs", "text-gray-500", "dark:text-gray-400"], [1, "space-y-3"], [1, "h-48", "bg-gray-100", "dark:bg-gray-800", "rounded-xl", "animate-pulse"], [1, "sticky", "top-[3.5rem]", "z-20", "bg-white", "dark:bg-gray-900", "rounded-xl", "border", "border-gray-200", "dark:border-gray-700", "p-3", "shadow-sm", "space-y-2"], [1, "flex", "justify-between", "text-xs", "text-gray-600", "dark:text-gray-400"], [1, "font-semibold", 3, "class"], [1, "h-2", "bg-gray-200", "dark:bg-gray-700", "rounded-full", "overflow-hidden"], [1, "h-full", "bg-indigo-500", "dark:bg-indigo-400", "rounded-full", "transition-all", "duration-500"], [1, "rounded-xl", "border-2", "p-5", "text-center", "space-y-2", 3, "class"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "transition-colors", 3, "class"], [1, "text-center", "text-sm", "text-gray-400", "dark:text-gray-500", "pb-2"], [1, "font-semibold"], [1, "rounded-xl", "border-2", "p-5", "text-center", "space-y-2"], [1, "text-4xl"], [1, "text-xl", "font-bold"], [1, "font-semibold", "text-lg"], [1, "text-sm", "opacity-80"], [1, "flex", "gap-3", "justify-center", "mt-3"], ["routerLink", "/mcq", 1, "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "bg-white", "dark:bg-gray-800", "border", "border-gray-300", "dark:border-gray-600", "text-gray-700", "dark:text-gray-200", "hover:bg-gray-50", "dark:hover:bg-gray-700", "transition-colors"], [1, "px-4", "py-2", "rounded-lg", "text-sm", "font-medium", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "transition-colors", 3, "click"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "transition-colors"], [1, "p-4", "space-y-4"], [1, "flex", "items-start", "justify-between", "gap-2"], [1, "flex", "items-center", "gap-2", "flex-wrap"], [1, "text-xs", "font-bold", "text-indigo-600", "dark:text-indigo-400", "bg-indigo-50", "dark:bg-indigo-900/30", "px-2", "py-0.5", "rounded-full"], [1, "text-xs", "bg-amber-100", "dark:bg-amber-900/40", "text-amber-700", "dark:text-amber-300", "px-2", "py-0.5", "rounded-full", "font-medium"], [1, "text-lg", "shrink-0"], [1, "text-sm", "text-gray-800", "dark:text-gray-200", "leading-relaxed", "whitespace-pre-wrap", "font-sans"], [1, "space-y-2"], [1, "w-full", "text-left", "px-4", "py-3", "rounded-lg", "border", "text-sm", "transition-all", 3, "disabled", "class"], [1, "rounded-lg", "p-3", "text-sm", "leading-relaxed", 3, "class"], [1, "w-full", "text-left", "px-4", "py-3", "rounded-lg", "border", "text-sm", "transition-all", 3, "click", "disabled"], [1, "font-semibold", "mr-2"], [1, "rounded-lg", "p-3", "text-sm", "leading-relaxed"], [1, "font-semibold", "mb-1"]], template: function McqQuiz_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "a", 2);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(3, "svg", 3);
      \u0275\u0275element(4, "path", 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(5, "div", 5)(6, "h1", 6);
      \u0275\u0275text(7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "p", 7);
      \u0275\u0275text(9);
      \u0275\u0275conditionalCreate(10, McqQuiz_Conditional_10_Template, 1, 0)(11, McqQuiz_Conditional_11_Template, 1, 2);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(12, McqQuiz_Conditional_12_Template, 3, 1, "div", 8)(13, McqQuiz_Conditional_13_Template, 11, 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate(ctx.title());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" Class ", ctx.classLevel(), " \xB7 ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.allAnswered() ? 10 : 11);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 12 : 13);
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(McqQuiz, [{
    type: Component,
    args: [{
      selector: "app-mcq-quiz",
      standalone: true,
      imports: [RouterLink],
      template: `
    <div class="space-y-4 pb-24 md:pb-8">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <a routerLink="/mcq"
           class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
           aria-label="Back to MCQ list">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </a>
        <div class="flex-1 min-w-0">
          <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{{ title() }}</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Class {{ classLevel() }} \xB7
            @if (allAnswered()) {
              Quiz complete
            } @else {
              {{ answeredCount() }}/{{ questions().length }} answered
            }
          </p>
        </div>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3]; track i) {
            <div class="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          }
        </div>
      } @else {

        <!-- Sticky progress bar + score -->
        <div class="sticky top-[3.5rem] z-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm space-y-2">
          <div class="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{{ answeredCount() }}/{{ questions().length }} answered</span>
            @if (answeredCount() > 0) {
              <span class="font-semibold"
                    [class]="scoreColor()">
                {{ correctCount() }} correct ({{ scorePercent() }}%)
              </span>
            }
          </div>
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-500"
                 [style.width.%]="progressPercent()"></div>
          </div>
        </div>

        <!-- Result card (shown when all answered) -->
        @if (allAnswered()) {
          <div class="rounded-xl border-2 p-5 text-center space-y-2"
               [class]="resultCardClass()">
            <div class="text-4xl">{{ resultEmoji() }}</div>
            <p class="text-xl font-bold">{{ correctCount() }}/{{ questions().length }}</p>
            <p class="font-semibold text-lg">{{ resultLabel() }}</p>
            <p class="text-sm opacity-80">{{ scorePercent() }}% accuracy</p>
            <div class="flex gap-3 justify-center mt-3">
              <a routerLink="/mcq"
                 class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                \u2190 All Quizzes
              </a>
              <button (click)="retakeQuiz()"
                      class="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                Retake Quiz
              </button>
            </div>
          </div>
        }

        <!-- Question cards -->
        @for (q of questions(); track q.id; let idx = $index) {
          <div class="bg-white dark:bg-gray-800 rounded-xl border transition-colors"
               [class]="questionCardBorderClass(q.id)">
            <div class="p-4 space-y-4">
              <!-- Question header -->
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                    Q{{ idx + 1 }}
                  </span>
                  @if (q.isPreviousYear && q.year) {
                    <span class="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                      \u{1F4CB} {{ q.year }} Board
                    </span>
                  }
                </div>
                @if (isAnswered(q.id)) {
                  <span class="text-lg shrink-0">{{ isCorrect(q.id) ? '\u2705' : '\u274C' }}</span>
                }
              </div>

              <!-- Question text (supports multi-line with code) -->
              <div class="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">{{ q.question }}</div>

              <!-- Options -->
              <div class="space-y-2">
                @for (option of q.options; track option; let optIdx = $index) {
                  <button
                    (click)="selectOption(q, optIdx)"
                    [disabled]="isAnswered(q.id)"
                    class="w-full text-left px-4 py-3 rounded-lg border text-sm transition-all"
                    [class]="getOptionClass(q, optIdx)"
                    [attr.aria-label]="'Option ' + (optIdx + 1) + ': ' + option">
                    <span class="font-semibold mr-2">{{ optionLabel(optIdx) }}.</span>{{ option }}
                  </button>
                }
              </div>

              <!-- Explanation (revealed after answering) -->
              @if (isAnswered(q.id)) {
                <div class="rounded-lg p-3 text-sm leading-relaxed"
                     [class]="explanationClass(q.id)">
                  <p class="font-semibold mb-1">\u{1F4A1} Explanation</p>
                  <p>{{ q.explanation }}</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- Bottom CTA if not completed -->
        @if (!allAnswered() && answeredCount() > 0) {
          <p class="text-center text-sm text-gray-400 dark:text-gray-500 pb-2">
            {{ questions().length - answeredCount() }} question{{ questions().length - answeredCount() === 1 ? '' : 's' }} remaining
          </p>
        }
      }
    </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(McqQuiz, { className: "McqQuiz", filePath: "src/app/features/mcq/quiz/quiz.ts", lineNumber: 160 });
})();
export {
  McqQuiz
};
//# sourceMappingURL=chunk-IK267DWH.js.map
