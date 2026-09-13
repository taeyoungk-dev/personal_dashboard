"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Cloud,
  Code2,
  Compass,
  Database,
  ExternalLink,
  Flame,
  GitBranch,
  FolderGit2,
  GraduationCap,
  Languages,
  LayoutDashboard,
  ListFilter,
  ListTodo,
  Menu,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  ServerCog,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TimerReset,
  Trash2,
  TrendingUp,
  Trophy,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type NavKey = "overview" | "today" | "study" | "career" | "finance";
type Area = "TOEFL" | "CS" | "Career" | "Mandarin";
type Priority = "high" | "medium" | "low";

type FocusTask = {
  id: number;
  title: string;
  meta: string;
  area: Area;
  priority: Priority;
  done: boolean;
  duration: string;
  due: string;
};

type Transaction = {
  id: number;
  title: string;
  category: string;
  type: "income" | "expense";
  amount: number;
  date: string;
};

const initialTasks: FocusTask[] = [
  { id: 1, title: "Academic Passage 오답 12문항 복기", meta: "Reading · Error Log", area: "TOEFL", priority: "high", done: false, duration: "50분", due: "오늘" },
  { id: 2, title: "자료구조 — 트리 순회 구현", meta: "CS 학사 · Java", area: "CS", priority: "high", done: false, duration: "80분", due: "오늘" },
  { id: 3, title: "Spring Security PR 설명 보강", meta: "Portfolio · GitHub", area: "Career", priority: "medium", done: true, duration: "35분", due: "오늘" },
  { id: 4, title: "Listening Academic Talk 쉐도잉", meta: "Listening · Shadowing", area: "TOEFL", priority: "medium", done: false, duration: "30분", due: "내일" },
  { id: 5, title: "선형대수 4강 연습문제", meta: "CS 학사 · Mathematics", area: "CS", priority: "medium", done: false, duration: "60분", due: "9월 15일" },
  { id: 6, title: "轉法輪 제1강 누적 복습", meta: "SRS · D14", area: "Mandarin", priority: "low", done: false, duration: "35분", due: "9월 15일" },
];

const initialTransactions: Transaction[] = [
  { id: 1, title: "급여", category: "소득", type: "income", amount: 3_800_000, date: "09.10" },
  { id: 2, title: "주거비", category: "고정비", type: "expense", amount: 920_000, date: "09.08" },
  { id: 3, title: "방통대 교재", category: "교육", type: "expense", amount: 148_000, date: "09.07" },
  { id: 4, title: "생활비", category: "생활", type: "expense", amount: 624_000, date: "09.05" },
  { id: 5, title: "클라우드 실습", category: "개발", type: "expense", amount: 58_000, date: "09.03" },
  { id: 6, title: "저축·투자", category: "미래", type: "expense", amount: 800_000, date: "09.01" },
];

const navItems = [
  { key: "overview" as const, label: "오늘", icon: LayoutDashboard },
  { key: "today" as const, label: "실행", icon: ListTodo },
  { key: "study" as const, label: "학습", icon: BookOpen },
  { key: "career" as const, label: "커리어", icon: BriefcaseBusiness },
  { key: "finance" as const, label: "재정", icon: WalletCards },
];

const goalProgress = [
  { label: "English", value: 69, detail: "TOEFL 3.8 → 5.5", icon: Languages, tone: "blue" },
  { label: "CS Degree", value: 24, detail: "GPA 목표 4.2 / 4.5", icon: GraduationCap, tone: "violet" },
  { label: "Engineering", value: 58, detail: "Backend → Cloud·AI", icon: Code2, tone: "cyan" },
  { label: "Mandarin", value: 18, detail: "누적 312 / 2,000자", icon: BookOpen, tone: "amber" },
];

const courses = [
  { name: "자료구조", semester: "1학기", weight: "핵심", progress: 42 },
  { name: "선형대수", semester: "1학기", weight: "핵심", progress: 28 },
  { name: "컴퓨터구조", semester: "1학기", weight: "핵심", progress: 35 },
  { name: "UNIX시스템", semester: "1학기", weight: "실무", progress: 24 },
  { name: "C프로그래밍", semester: "1학기", weight: "실무", progress: 31 },
  { name: "컴퓨터과학개론", semester: "1학기", weight: "기초", progress: 47 },
];

const portfolioProjects = [
  { name: "Northstar Personal OS", type: "Flagship", description: "목표·실행·학습·재정을 하나의 데이터 흐름으로 통합한 개인 운영체제", stack: ["React 19", "TypeScript", "Cloudflare"], status: "Building", url: "https://github.com/taeyoungk-dev/personal_dashboard" },
  { name: "Daily Compass", type: "Cloud", description: "Azure Functions와 React로 설계한 개인 맞춤형 데일리 대시보드", stack: ["React", "Azure", "Cosmos DB"], status: "Merged", url: "https://github.com/taeyoungk-dev/daily-compass" },
  { name: "Household Account Book", type: "Java", description: "Builder 패턴과 파일 I/O를 적용한 Java Swing 가계부", stack: ["Java", "Swing", "Builder"], status: "Merged", url: "https://github.com/taeyoungk-dev/household-account-book" },
  { name: "Modern TODO", type: "Web", description: "상태 관리와 localStorage 영속성을 구현한 Vanilla JS 할 일 앱", stack: ["JavaScript", "CSS", "Web API"], status: "Merged", url: "https://github.com/taeyoungk-dev/todo-list-work" },
];

const stackGroups = [
  { label: "Backend", items: "Java · Spring Boot · REST · JPA", icon: ServerCog },
  { label: "Data", items: "PostgreSQL · Redis · Kafka · SQL", icon: Database },
  { label: "Cloud", items: "Azure · Cloudflare · Docker · CI/CD", icon: Cloud },
  { label: "Security", items: "Spring Security · OAuth2 · Network", icon: ShieldCheck },
];

const weekBars = [52, 68, 42, 84, 71, 36, 62];
const weekLabels = ["월", "화", "수", "목", "금", "토", "일"];
const currency = new Intl.NumberFormat("ko-KR");

function daysUntilTarget() {
  return Math.max(0, Math.ceil((new Date("2027-04-30T23:59:59+09:00").getTime() - Date.now()) / 86_400_000));
}

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavKey>("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [tasks, setTasks] = useState<FocusTask[]>(initialTasks);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [studyMinutes, setStudyMinutes] = useState(860);
  const [taskDialog, setTaskDialog] = useState(false);
  const [moneyDialog, setMoneyDialog] = useState(false);
  const [searchDialog, setSearchDialog] = useState(false);
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const tasksRef = useRef(initialTasks);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedTasks = window.localStorage.getItem("northstar-tasks");
        const savedTransactions = window.localStorage.getItem("northstar-transactions");
        const savedStudy = window.localStorage.getItem("northstar-study-minutes");
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        if (savedStudy) setStudyMinutes(Number(savedStudy));
        setDark(window.localStorage.getItem("northstar-theme") === "dark");
      } catch {
        // Corrupted local data falls back to the curated sample dataset.
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    if (!hydrated || !document.modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    const register = document.modelContext.registerTool.bind(document.modelContext);
    const report = (error: unknown) => console.warn("WebMCP tool registration failed", error);

    void Promise.resolve(register({
      name: "list_open_actions",
      title: "열린 실행 조회",
      description: "완료되지 않은 개인 목표 실행 목록을 조회합니다.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        return tasksRef.current.filter((task) => !task.done).map(({ id, title, area, priority, duration, due }) => ({ id, title, area, priority, duration, due }));
      },
    }, { signal: lifecycle.signal })).catch(report);

    void Promise.resolve(register({
      name: "complete_action",
      title: "실행 완료",
      description: "지정한 실행을 완료 처리하고 화면의 진행률을 갱신합니다.",
      inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const id = typeof input === "object" && input !== null && "id" in input ? Number((input as { id: unknown }).id) : NaN;
        if (!Number.isFinite(id) || !tasksRef.current.some((task) => task.id === id)) throw new Error("존재하는 실행 ID가 필요합니다.");
        setTasks((current) => current.map((task) => task.id === id ? { ...task, done: true } : task));
        return { id, status: "completed" };
      },
    }, { signal: lifecycle.signal })).catch(report);

    void Promise.resolve(register({
      name: "log_study_session",
      title: "학습 세션 기록",
      description: "완료한 학습 시간을 분 단위로 주간 학습 기록에 추가합니다.",
      inputSchema: { type: "object", properties: { minutes: { type: "number", minimum: 1, maximum: 480 } }, required: ["minutes"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const minutes = typeof input === "object" && input !== null && "minutes" in input ? Number((input as { minutes: unknown }).minutes) : NaN;
        if (!Number.isFinite(minutes) || minutes < 1 || minutes > 480) throw new Error("학습 시간은 1~480분이어야 합니다.");
        setStudyMinutes((current) => current + minutes);
        return { minutesAdded: minutes, status: "recorded" };
      },
    }, { signal: lifecycle.signal })).catch(report);

    return () => lifecycle.abort();
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("northstar-tasks", JSON.stringify(tasks));
    window.localStorage.setItem("northstar-transactions", JSON.stringify(transactions));
    window.localStorage.setItem("northstar-study-minutes", String(studyMinutes));
    window.localStorage.setItem("northstar-theme", dark ? "dark" : "light");
  }, [tasks, transactions, studyMinutes, dark, hydrated]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchDialog(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const todayTasks = tasks.filter((task) => task.due === "오늘");
  const completed = todayTasks.filter((task) => task.done).length;
  const dayProgress = Math.round((completed / Math.max(todayTasks.length, 1)) * 100);
  const dDay = useMemo(() => daysUntilTarget(), []);
  const currentLabel = navItems.find((item) => item.key === activeNav)?.label ?? "오늘";

  const totals = useMemo(() => {
    const income = transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
    const expense = transactions.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function deleteTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function addTask(form: FormData) {
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;
    const area = String(form.get("area") ?? "TOEFL") as Area;
    const priority = String(form.get("priority") ?? "medium") as Priority;
    const duration = String(form.get("duration") ?? "30").trim();
    setTasks((current) => [
      { id: Date.now(), title, area, priority, duration: `${duration || 30}분`, done: false, due: "오늘", meta: `${area} · 직접 추가` },
      ...current,
    ]);
    setTaskDialog(false);
  }

  function addTransaction(form: FormData) {
    const title = String(form.get("title") ?? "").trim();
    const amount = Number(form.get("amount"));
    if (!title || !Number.isFinite(amount) || amount <= 0) return;
    const type = String(form.get("type") ?? "expense") as "income" | "expense";
    setTransactions((current) => [
      { id: Date.now(), title, amount, type, category: String(form.get("category") ?? "생활"), date: new Intl.DateTimeFormat("ko-KR", { month: "2-digit", day: "2-digit" }).format(new Date()).replace(". ", ".").replace(".", "") },
      ...current,
    ]);
    setMoneyDialog(false);
  }

  const viewProps = { tasks, toggleTask, deleteTask, setTaskDialog };

  return (
    <div className={dark ? "theme-dark" : ""}>
      <main className="dashboard-shell">
        <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
          <div className="brand-lockup">
            <div className="brand-mark" aria-hidden="true"><Compass size={20} strokeWidth={2.4} /></div>
            <div><strong>Northstar</strong><span>Personal OS</span></div>
            <Button type="button" variant="ghost" size="icon-sm" className="mobile-close" aria-label="메뉴 닫기" onClick={() => setMobileMenu(false)}><X /></Button>
          </div>

          <nav className="primary-nav" aria-label="주요 메뉴">
            <p className="nav-caption">Workspace</p>
            {navItems.map(({ key, label, icon: Icon }) => (
              <button key={key} type="button" className={activeNav === key ? "nav-item active" : "nav-item"} onClick={() => { setActiveNav(key); setMobileMenu(false); }}>
                <Icon size={18} /><span>{label}</span>{key === "today" && <span className="nav-count">{tasks.filter((task) => !task.done).length}</span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-divider" />
          <div className="mission-block">
            <div className="mission-title"><span>2027 MISSION</span><Badge className="mission-badge">ACTIVE</Badge></div>
            <p>Global Software Engineer</p>
            <div className="mission-progress-row"><Progress value={46} className="mission-progress" aria-label="2027 목표 진척도 46%" /><span>46%</span></div>
            <span className="mission-dday">D−{dDay} · TOEFL 목표일</span>
          </div>

          <div className="sidebar-bottom">
            <button type="button" className="nav-item" onClick={() => setDark((value) => !value)}><Settings2 size={18} /><span>화면 설정</span></button>
            <div className="profile-chip"><div className="profile-avatar">TK</div><div><strong>김태영</strong><span>Building in public</span></div><MoreHorizontal size={17} /></div>
          </div>
        </aside>

        {mobileMenu && <button type="button" aria-label="메뉴 닫기" className="sidebar-scrim" onClick={() => setMobileMenu(false)} />}

        <section className="workspace">
          <header className="topbar">
            <div className="topbar-left">
              <Button type="button" variant="ghost" size="icon" className="menu-trigger" aria-label="메뉴 열기" onClick={() => setMobileMenu(true)}><Menu /></Button>
              <div className="breadcrumb"><span>Northstar</span><ChevronRight size={14} /><strong>{currentLabel}</strong></div>
            </div>
            <div className="topbar-actions">
              <button className="search-box" type="button" aria-label="빠른 검색 열기" onClick={() => setSearchDialog(true)}><Search size={17} /><span>빠른 검색</span><kbd>⌘ K</kbd></button>
              <Button type="button" variant="ghost" size="icon" className="icon-button" aria-label={dark ? "라이트 모드" : "다크 모드"} onClick={() => setDark((value) => !value)}>{dark ? <Sun /> : <Moon />}</Button>
              <div className="top-avatar">TK</div>
            </div>
          </header>

          <div className="content-wrap">
            {activeNav === "overview" && <OverviewView tasks={todayTasks} dayProgress={dayProgress} totals={totals} toggleTask={toggleTask} onAddTask={() => setTaskDialog(true)} onNavigate={setActiveNav} />}
            {activeNav === "today" && <TasksView {...viewProps} filter={taskFilter} setFilter={setTaskFilter} />}
            {activeNav === "study" && <StudyView studyMinutes={studyMinutes} onLog={() => setStudyMinutes((minutes) => minutes + 25)} />}
            {activeNav === "career" && <CareerView />}
            {activeNav === "finance" && <FinanceView transactions={transactions} totals={totals} onAdd={() => setMoneyDialog(true)} />}
          </div>
        </section>
      </main>

      <TaskDialog open={taskDialog} onOpenChange={setTaskDialog} onSubmit={addTask} />
      <TransactionDialog open={moneyDialog} onOpenChange={setMoneyDialog} onSubmit={addTransaction} />
      <SearchDialog open={searchDialog} onOpenChange={setSearchDialog} query={searchQuery} setQuery={setSearchQuery} tasks={tasks} onSelect={(id) => { setActiveNav("today"); setSearchDialog(false); document.querySelector(`[data-task-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }} />
    </div>
  );
}

function PageIntro({ kicker, title, description, children }: { kicker: string; title: string; description: string; children?: React.ReactNode }) {
  return (
    <section className="welcome-row page-intro">
      <div><span className="eyebrow"><span className="live-dot" /> {kicker}</span><h1>{title}</h1><p>{description}</p></div>
      {children && <div className="welcome-actions">{children}</div>}
    </section>
  );
}

function OverviewView({ tasks, dayProgress, totals, toggleTask, onAddTask, onNavigate }: { tasks: FocusTask[]; dayProgress: number; totals: { income: number; expense: number; balance: number }; toggleTask: (id: number) => void; onAddTask: () => void; onNavigate: (nav: NavKey) => void }) {
  const completed = tasks.filter((task) => task.done).length;
  return (
    <>
      <PageIntro kicker="일요일 · WEEK 37" title="오늘의 방향을 선명하게." description="긴 목표를 작게 실행하고, 매일의 증거를 남깁니다.">
        <Button variant="outline" className="quiet-button" onClick={() => onNavigate("study")}><CalendarDays /> 주간 리뷰</Button>
        <Button className="primary-action" onClick={onAddTask}><Plus /> 새 실행 추가</Button>
      </PageIntro>

      <section className="overview-grid">
        <article className="card momentum-card">
          <div className="card-heading"><div><span className="section-kicker">TODAY&apos;S MOMENTUM</span><h2>하루 실행률</h2></div><span className="signal-chip"><Flame size={14} /> 12일 연속</span></div>
          <div className="momentum-body">
            <div className="progress-orbit" style={{ "--progress": `${dayProgress * 3.6}deg` } as React.CSSProperties}><div><strong>{dayProgress}%</strong><span>{completed}/{tasks.length} 완료</span></div></div>
            <div className="momentum-copy">
              <div className="momentum-headline"><Sparkles size={18} /><p><strong>{dayProgress >= 67 ? "좋은 흐름이에요." : "가장 중요한 것부터."}</strong><br />핵심 학습 2개에 집중하면 됩니다.</p></div>
              <div className="metric-strip"><div><span>집중 시간</span><strong>2h 45m</strong></div><div><span>이번 주</span><strong>14h 20m</strong></div><div><span>목표 대비</span><strong>82%</strong></div></div>
            </div>
          </div>
        </article>

        <article className="card focus-card">
          <div className="card-heading"><div><span className="section-kicker">NEXT ACTION</span><h2>오늘의 포커스</h2></div><Button variant="ghost" size="sm" className="link-button" onClick={() => onNavigate("today")}>전체 보기 <ArrowUpRight /></Button></div>
          <div className="focus-list">
            {tasks.map((task) => (
              <label className={task.done ? "focus-item completed" : "focus-item"} key={task.id}>
                <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task.id)} aria-label={`${task.title} 완료 상태 변경`} />
                <span className={`area-dot ${task.area.toLowerCase()}`} /><span className="focus-text"><strong>{task.title}</strong><small>{task.meta}</small></span><span className="duration"><TimerReset size={14} />{task.duration}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="card trajectory-card">
          <div className="card-heading"><div><span className="section-kicker">WEEKLY TRAJECTORY</span><h2>주간 집중도</h2></div><span className="delta">+18%</span></div>
          <div className="chart-area" aria-label="요일별 집중도 막대 차트">{weekBars.map((height, index) => <div className="bar-column" key={weekLabels[index]}><div className="bar-track"><span style={{ height: `${height}%` }} /></div><small>{weekLabels[index]}</small></div>)}</div>
          <p className="chart-note"><Trophy size={15} /> 목요일에 가장 깊게 몰입했어요.</p>
        </article>
      </section>

      <section className="section-block">
        <div className="section-title-row"><div><span className="section-kicker">NORTHSTAR MAP</span><h2>목표 레이더</h2></div><Button variant="ghost" size="sm" className="link-button" onClick={() => onNavigate("study")}>로드맵 열기 <ArrowUpRight /></Button></div>
        <div className="goal-grid">{goalProgress.map(({ label, value, detail, icon: Icon, tone }) => <article className={`goal-card tone-${tone}`} key={label}><div className="goal-card-top"><div className="goal-icon"><Icon /></div><span>{value}%</span></div><h3>{label}</h3><p>{detail}</p><Progress value={value} className="goal-progress" aria-label={`${label} 목표 진척도 ${value}%`} /></article>)}</div>
      </section>

      <section className="bottom-grid">
        <article className="card roadmap-card">
          <div className="card-heading"><div><span className="section-kicker">LONG GAME</span><h2>커리어 플라이트 플랜</h2></div><Target size={20} /></div>
          <div className="flight-path"><div className="flight-line" /><div className="flight-stop active"><span>NOW</span><strong>기반 강화</strong><small>English · CS</small></div><div className="flight-stop"><span>2027</span><strong>Backend Engineer</strong><small>Java · Spring</small></div><div className="flight-stop"><span>2029</span><strong>OMSCS</strong><small>Georgia Tech</small></div><div className="flight-stop"><span>2031+</span><strong>Global Talent</strong><small>Cloud · AI · Data</small></div></div>
        </article>
        <article className="card money-card">
          <div className="card-heading"><div><span className="section-kicker">RUNWAY</span><h2>이번 달 현금흐름</h2></div><CircleDollarSign size={20} /></div>
          <div className="money-total"><strong>₩{currency.format(totals.balance)}</strong><span>저축 가능</span></div><div className="cashflow-bar"><span style={{ width: `${Math.min(100, Math.round((totals.income - totals.expense) / Math.max(totals.income, 1) * 100) + 50)}%` }} /></div><div className="cashflow-labels"><span><i className="income-dot" /> 수입 ₩{(totals.income / 1_000_000).toFixed(1)}M</span><span><i className="expense-dot" /> 지출 ₩{(totals.expense / 1_000_000).toFixed(2)}M</span></div>
        </article>
      </section>
    </>
  );
}

function TasksView({ tasks, toggleTask, deleteTask, setTaskDialog, filter, setFilter }: { tasks: FocusTask[]; toggleTask: (id: number) => void; deleteTask: (id: number) => void; setTaskDialog: (open: boolean) => void; filter: string; setFilter: (filter: string) => void }) {
  const visible = tasks.filter((task) => filter === "all" || (filter === "active" ? !task.done : task.done));
  const grouped = ["오늘", "내일", "9월 15일"].map((due) => ({ due, tasks: visible.filter((task) => task.due === due) })).filter((group) => group.tasks.length);
  return (
    <>
      <PageIntro kicker="EXECUTION SYSTEM" title="다음 행동만 남깁니다." description="우선순위와 에너지에 맞춰 오늘 끝낼 수 있는 크기로 관리합니다.">
        <Button className="primary-action" onClick={() => setTaskDialog(true)}><Plus /> 실행 추가</Button>
      </PageIntro>
      <section className="task-stats-grid">
        <MetricCard label="열린 실행" value={String(tasks.filter((task) => !task.done).length)} note="지금 처리할 항목" icon={Zap} />
        <MetricCard label="완료율" value={`${Math.round(tasks.filter((task) => task.done).length / Math.max(tasks.length, 1) * 100)}%`} note="최근 7일 기준" icon={CheckCircle2} />
        <MetricCard label="예정 시간" value={`${Math.round(tasks.filter((task) => !task.done).reduce((sum, task) => sum + Number(task.duration.replace("분", "")), 0) / 60 * 10) / 10}h`} note="남은 집중 블록" icon={Clock3} />
      </section>
      <section className="card task-board">
        <div className="task-board-toolbar">
          <Tabs value={filter} onValueChange={setFilter}><TabsList><TabsTrigger value="all">전체</TabsTrigger><TabsTrigger value="active">진행 중</TabsTrigger><TabsTrigger value="done">완료</TabsTrigger></TabsList></Tabs>
          <span className="filter-label"><ListFilter size={15} /> 우선순위순</span>
        </div>
        {grouped.length ? grouped.map((group) => (
          <div className="task-group" key={group.due}><div className="task-group-title"><span>{group.due}</span><small>{group.tasks.length}개</small></div>
            {group.tasks.map((task) => (
              <div className={task.done ? "board-task completed" : "board-task"} key={task.id} data-task-id={task.id}>
                <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task.id)} aria-label={`${task.title} 완료 상태 변경`} />
                <span className={`priority-line ${task.priority}`} /><div className="board-task-main"><strong>{task.title}</strong><span>{task.meta}</span></div>
                <Badge variant="secondary" className={`area-badge area-${task.area.toLowerCase()}`}>{task.area}</Badge><span className="task-duration">{task.duration}</span>
                <Button variant="ghost" size="icon-sm" className="delete-button" aria-label={`${task.title} 삭제`} onClick={() => deleteTask(task.id)}><Trash2 /></Button>
              </div>
            ))}
          </div>
        )) : <div className="empty-state"><CheckCircle2 /><strong>이 목록은 비어 있어요.</strong><span>새 실행을 추가하거나 다른 필터를 선택하세요.</span></div>}
      </section>
    </>
  );
}

function StudyView({ studyMinutes, onLog }: { studyMinutes: number; onLog: () => void }) {
  return (
    <>
      <PageIntro kicker="LEARNING LOOP" title="입력보다 회상을 측정합니다." description="TOEFL, CS, 중국어를 하나의 Active Recall 시스템으로 운영합니다.">
        <Button className="primary-action" onClick={onLog}><TimerReset /> 25분 기록</Button>
      </PageIntro>
      <section className="study-hero-grid">
        <article className="card study-score-card"><span className="section-kicker">THIS WEEK</span><div className="study-time"><strong>{Math.floor(studyMinutes / 60)}</strong><span>h {studyMinutes % 60}m</span></div><p>주간 목표 18시간 중 {Math.round(studyMinutes / 1080 * 100)}%</p><Progress value={studyMinutes / 1080 * 100} className="study-progress" /></article>
        <article className="card toefl-card"><div className="card-heading"><div><span className="section-kicker">NEW TOEFL iBT</span><h2>Overall 5.5+</h2></div><span className="score-chip">APR 2027</span></div><div className="score-grid">{[["Reading", "4.0"], ["Listening", "3.8"], ["Speaking", "3.5"], ["Writing", "4.0"]].map(([label, score]) => <div key={label}><span>{label}</span><strong>{score}</strong></div>)}</div></article>
        <article className="card recall-card"><div className="card-heading"><div><span className="section-kicker">RECALL HEALTH</span><h2>SRS 복습</h2></div><Flame size={19} /></div><div className="recall-number">87<small>%</small></div><p>기억 유지율 · 지난주 대비 +4%</p></article>
      </section>
      <section className="learning-grid">
        <article className="card course-card"><div className="card-heading"><div><span className="section-kicker">KNOU CS · SEMESTER 1</span><h2>교과 진행도</h2></div><Badge variant="outline">GPA 4.2 목표</Badge></div><div className="course-list">{courses.map((course) => <div className="course-row" key={course.name}><div><strong>{course.name}</strong><span>{course.weight}</span></div><Progress value={course.progress} /><small>{course.progress}%</small></div>)}</div></article>
        <article className="card method-card"><span className="section-kicker">DAILY PROTOCOL</span><h2>학습 루프</h2><div className="protocol-list">{[["01", "Input", "문제풀이 · 정독 · 무자막"], ["02", "Analyze", "어휘 · 구문 · 오답 분류"], ["03", "Recall", "재풀이 · 즉답 · 백지 복습"], ["04", "Ship", "요약 · 기록 · 코드 커밋"]].map(([index, title, copy]) => <div key={index}><span>{index}</span><p><strong>{title}</strong><small>{copy}</small></p></div>)}</div></article>
      </section>
      <section className="card semester-roadmap"><div className="card-heading"><div><span className="section-kicker">4-SEMESTER PLAN</span><h2>CS 학위 로드맵</h2></div><GraduationCap /></div><div className="semester-grid">{[["1학기", "자료구조 · 선형대수 · 컴퓨터구조", "진행 중"], ["2학기", "알고리즘 · OS · DB · 이산수학", "예정"], ["3학기", "ML · Cloud · Compiler · DL", "예정"], ["4학기", "Network · SE · Security · AI", "예정"]].map(([term, subjects, status], index) => <div className={index === 0 ? "semester active" : "semester"} key={term}><span>{term}</span><strong>{subjects}</strong><small>{status}</small></div>)}</div></section>
    </>
  );
}

function CareerView() {
  return (
    <>
      <PageIntro kicker="PROOF OF WORK" title="경험을 증거로 바꿉니다." description="코드, 설계 결정, 운영 지표로 글로벌 백엔드 엔지니어 역량을 보여줍니다.">
        <Button variant="outline" className="quiet-button" asChild><a href="https://github.com/taeyoungk-dev" target="_blank" rel="noreferrer"><FolderGit2 /> GitHub</a></Button>
      </PageIntro>
      <section className="career-metrics"><MetricCard label="공개 프로젝트" value="04" note="3개 프로젝트 통합" icon={FolderGit2} /><MetricCard label="핵심 역량" value="12" note="Backend · Cloud · Data" icon={Code2} /><MetricCard label="다음 마일스톤" value="MVP" note="API·DB 전환" icon={GitBranch} /></section>
      <section className="portfolio-grid">{portfolioProjects.map((project, index) => <article className={index === 0 ? "card project-card featured" : "card project-card"} key={project.name}><div className="project-top"><Badge className="project-type">{project.type}</Badge><span className={`project-status ${project.status.toLowerCase()}`}>{project.status}</span></div><h2>{project.name}</h2><p>{project.description}</p><div className="stack-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><a href={project.url} target="_blank" rel="noreferrer">저장소 보기 <ExternalLink size={14} /></a></article>)}</section>
      <section className="career-bottom-grid"><article className="card stack-card"><div className="card-heading"><div><span className="section-kicker">TARGET STACK</span><h2>역량 확장 지도</h2></div><Code2 /></div><div className="stack-list">{stackGroups.map(({ label, items, icon: Icon }) => <div key={label}><span><Icon /></span><p><strong>{label}</strong><small>{items}</small></p></div>)}</div></article><article className="card evidence-card"><span className="section-kicker">NEXT EVIDENCE</span><h2>다음 90일</h2>{[["01", "Spring Boot API 분리", "할 일·거래 CRUD"], ["02", "PostgreSQL 전환", "Migration · Index"], ["03", "CI/CD + Observability", "Test · Metrics · Logs"]].map(([number, title, copy]) => <div className="evidence-row" key={number}><span>{number}</span><p><strong>{title}</strong><small>{copy}</small></p><ChevronRight /></div>)}</article></section>
    </>
  );
}

function FinanceView({ transactions, totals, onAdd }: { transactions: Transaction[]; totals: { income: number; expense: number; balance: number }; onAdd: () => void }) {
  const categories = [
    { label: "주거", amount: 920_000, color: "#2864dc" },
    { label: "미래", amount: 800_000, color: "#7a56d8" },
    { label: "생활", amount: 624_000, color: "#14a4af" },
    { label: "교육·개발", amount: 206_000, color: "#e59a20" },
  ];
  return (
    <>
      <PageIntro kicker="FINANCIAL RUNWAY" title="돈에도 목적지를 부여합니다." description="생활을 안정시키고 학업·커리어 투자 여력을 확보합니다."><Button className="primary-action" onClick={onAdd}><Plus /> 거래 추가</Button></PageIntro>
      <section className="finance-summary"><MetricCard label="수입" value={`₩${currency.format(totals.income)}`} note="이번 달" icon={ArrowDownLeft} tone="positive" /><MetricCard label="지출" value={`₩${currency.format(totals.expense)}`} note="예산의 72%" icon={ArrowUpRight} tone="negative" /><MetricCard label="남은 런웨이" value={`₩${currency.format(totals.balance)}`} note="저축률 33%" icon={TrendingUp} /></section>
      <section className="finance-grid"><article className="card budget-card"><div className="card-heading"><div><span className="section-kicker">SPENDING MAP</span><h2>카테고리별 지출</h2></div><BarChart3 /></div><div className="budget-list">{categories.map((category) => <div key={category.label}><div><span>{category.label}</span><strong>₩{currency.format(category.amount)}</strong></div><div className="budget-bar"><span style={{ width: `${category.amount / 9200}%`, background: category.color }} /></div></div>)}</div></article><article className="card runway-card"><span className="section-kicker">CAREER FUND</span><h2>교육 투자 여력</h2><div className="runway-orbit"><strong>68%</strong><span>목표 대비</span></div><p>OMSCS·시험·클라우드 실습 예산</p><strong className="fund-total">₩4,820,000</strong></article></section>
      <section className="card transaction-card"><div className="card-heading"><div><span className="section-kicker">LEDGER</span><h2>최근 거래</h2></div><Badge variant="outline">{transactions.length}건</Badge></div><div className="transaction-list">{transactions.map((item) => <div className="transaction-row" key={item.id}><span className={`transaction-icon ${item.type}`}>{item.type === "income" ? <ArrowDownLeft /> : <ArrowUpRight />}</span><p><strong>{item.title}</strong><small>{item.category} · {item.date}</small></p><strong className={item.type}>{item.type === "income" ? "+" : "−"} ₩{currency.format(item.amount)}</strong></div>)}</div></section>
    </>
  );
}

function MetricCard({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: React.ElementType; tone?: string }) {
  return <article className={`card metric-card ${tone ?? ""}`}><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div><span className="metric-icon"><Icon /></span></article>;
}

function TaskDialog({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (form: FormData) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>새 실행 추가</DialogTitle><DialogDescription>오늘 끝낼 수 있는 크기로 적어주세요.</DialogDescription></DialogHeader><form action={onSubmit} className="form-stack"><label>실행 이름<Input name="title" placeholder="예: 알고리즘 3강 복습" autoFocus required /></label><div className="form-grid"><label>영역<Select name="area" defaultValue="TOEFL"><SelectTrigger className="form-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TOEFL">TOEFL</SelectItem><SelectItem value="CS">CS</SelectItem><SelectItem value="Career">Career</SelectItem><SelectItem value="Mandarin">Mandarin</SelectItem></SelectContent></Select></label><label>우선순위<Select name="priority" defaultValue="medium"><SelectTrigger className="form-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="high">높음</SelectItem><SelectItem value="medium">보통</SelectItem><SelectItem value="low">낮음</SelectItem></SelectContent></Select></label></div><label>예상 시간 (분)<Input name="duration" type="number" min="5" step="5" defaultValue="30" /></label><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button><Button type="submit">추가하기</Button></DialogFooter></form></DialogContent></Dialog>;
}

function TransactionDialog({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (form: FormData) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>거래 추가</DialogTitle><DialogDescription>목표를 지지하는 현금흐름을 기록합니다.</DialogDescription></DialogHeader><form action={onSubmit} className="form-stack"><label>거래 이름<Input name="title" placeholder="예: TOEFL 응시료" autoFocus required /></label><div className="form-grid"><label>구분<Select name="type" defaultValue="expense"><SelectTrigger className="form-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="expense">지출</SelectItem><SelectItem value="income">수입</SelectItem></SelectContent></Select></label><label>카테고리<Select name="category" defaultValue="교육"><SelectTrigger className="form-select"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="교육">교육</SelectItem><SelectItem value="개발">개발</SelectItem><SelectItem value="생활">생활</SelectItem><SelectItem value="고정비">고정비</SelectItem><SelectItem value="소득">소득</SelectItem></SelectContent></Select></label></div><label>금액<Input name="amount" type="number" min="1" placeholder="0" required /></label><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button><Button type="submit">기록하기</Button></DialogFooter></form></DialogContent></Dialog>;
}

function SearchDialog({ open, onOpenChange, query, setQuery, tasks, onSelect }: { open: boolean; onOpenChange: (open: boolean) => void; query: string; setQuery: (query: string) => void; tasks: FocusTask[]; onSelect: (id: number) => void }) {
  const results = tasks.filter((task) => `${task.title} ${task.meta} ${task.area}`.toLowerCase().includes(query.toLowerCase()));
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="search-dialog"><DialogHeader><DialogTitle>빠른 검색</DialogTitle><DialogDescription>실행과 학습 기록을 바로 찾습니다.</DialogDescription></DialogHeader><div className="search-input-wrap"><Search /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="검색어 입력" autoFocus /></div><div className="search-results">{results.slice(0, 6).map((task) => <button type="button" key={task.id} onClick={() => onSelect(task.id)}><span className={`area-dot ${task.area.toLowerCase()}`} /><p><strong>{task.title}</strong><small>{task.meta}</small></p><ChevronRight /></button>)}{results.length === 0 && <div className="empty-state compact"><Search /><strong>검색 결과가 없습니다.</strong></div>}</div></DialogContent></Dialog>;
}
