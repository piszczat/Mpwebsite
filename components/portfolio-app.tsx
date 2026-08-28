"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bell, Box, Boxes, Braces, Check, ChevronDown, ChevronRight, CircleDot,
  ExternalLink, FileCode2, Folder, FolderOpen, GitBranch, Mail, MapPin,
  Minus, Network, PanelBottom, Play, Search, Square, Terminal, X,
} from "lucide-react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem,
  CommandList, CommandShortcut,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Locale = "en" | "pl";
type PageId = "home" | "experience" | "homelab";
type HomeView = "about" | "projects" | "contact";
type BuildState = "idle" | "building" | "success";

const copy = {
  en: {
    search: "Search commands (Ctrl+K)", start: "Start", building: "Building...", built: "Build succeeded",
    palette: "Command Palette", explorer: "APPLICATION EXPLORER", searchExplorer: "Search Application Explorer",
    aot: "Application Object Tree (AOT)", classes: "Classes", integrations: "Integrations",
    tests: "Test Projects", web: "Web Modules", projectsNode: "Visual Studio Projects", properties: "PROPERTIES",
    file: "File Name", action: "Build Action", model: "Model", layer: "Layer", status: "Status", ready: "Ready",
    about: "About", projects: "Projects", experience: "Experience", contact: "Contact", homelab: "Homelab",
    aboutFile: "MarcinPiszczat.xpp", projectsFile: "CaseStudies.json", contactFile: "Contact.form",
    experienceFile: "Experience.md", homelabFile: "Homelab.architecture",
    eyebrow: "D365 F&O developer · Derby, UK", hero: "I make complicated F&O paths behave.",
    heroBody: "X++ extensions, integrations, posting flows and evidence-first diagnostics — designed for production, not only for the happy path.",
    inspect: "Inspect case studies", openExperience: "Open experience", cases: "Selected case studies",
    casesIntro: "Sanitised examples. No client names, production identifiers or confidential data.",
    problem: "Problem", solution: "Solution", effect: "Effect", resolved: "resolved",
    expHero: "D365 F&O engineering with production context.",
    expIntro: "A recruitment-focused overview of the technologies, platform areas and delivery habits I bring to Dynamics 365 Finance & Operations teams.",
    profile: "PROFILE", profileBody: "Microsoft Dynamics 365 Finance & Operations developer focused on maintainable X++, integrations, debugging and controlled delivery across real business processes.",
    tech: "CORE TECHNOLOGIES", areas: "D365 AREAS", achievements: "SELECTED ACHIEVEMENTS", style: "DELIVERY STYLE",
    cvNext: "CV download will be added next",
    labHero: "The infrastructure behind the developer.",
    labIntro: "A privacy-safe view of my home lab: virtualisation, containers, networking, monitoring and backups — without publishing private IP addresses.",
    architecture: "ARCHITECTURE", wiki: "Open ProxmoxWiki", wikiNote: "Public notes, build decisions and repeatable homelab procedures.",
    contactHero: "Let’s solve the complicated path.",
    contactIntro: "Send a short message about a D365 F&O role, integration or technical problem. The email address stays server-side.",
    name: "Name", email: "Email", company: "Company / team (optional)", message: "Message",
    send: "Send message", sending: "Sending...", sent: "Message sent. Thank you — I’ll reply soon.",
    pending: "The secure form is ready, but delivery needs the server-side email key before it can send.",
    sendError: "The message could not be sent. Please try LinkedIn for now.", location: "Location",
    output: "OUTPUT", problemsLabel: "PROBLEMS", terminal: "TERMINAL", analytics: "Analytics hook ready",
    commandTitle: "MarcinP Command Palette", commandDescription: "Navigate the portfolio or run a command",
    commandPlaceholder: "Type: about, projects, contact, github...", noCommand: "No matching portfolio command.",
    navigate: "Navigate", external: "External", run: "Run", buildSolution: "Build Portfolio Solution",
  },
  pl: {
    search: "Szukaj poleceń (Ctrl+K)", start: "Uruchom", building: "Kompilowanie...", built: "Build zakończony",
    palette: "Paleta poleceń", explorer: "APPLICATION EXPLORER", searchExplorer: "Przeszukaj Application Explorer",
    aot: "Application Object Tree (AOT)", classes: "Klasy", integrations: "Integracje",
    tests: "Projekty testowe", web: "Moduły webowe", projectsNode: "Projekty Visual Studio", properties: "WŁAŚCIWOŚCI",
    file: "Nazwa pliku", action: "Akcja build", model: "Model", layer: "Warstwa", status: "Status", ready: "Gotowy",
    about: "O mnie", projects: "Projekty", experience: "Doświadczenie", contact: "Kontakt", homelab: "Homelab",
    aboutFile: "MarcinPiszczat.xpp", projectsFile: "CaseStudies.json", contactFile: "Kontakt.form",
    experienceFile: "Doswiadczenie.md", homelabFile: "Homelab.architecture",
    eyebrow: "D365 F&O developer · Derby, UK", hero: "Sprawiam, że skomplikowane procesy F&O zaczynają działać.",
    heroBody: "Rozszerzenia X++, integracje, procesy księgowania i diagnostyka oparta na dowodach — projektowane pod produkcję, nie tylko happy path.",
    inspect: "Zobacz case studies", openExperience: "Otwórz doświadczenie", cases: "Wybrane case studies",
    casesIntro: "Przykłady są zanonimizowane — bez nazw klientów, identyfikatorów produkcyjnych i danych poufnych.",
    problem: "Problem", solution: "Rozwiązanie", effect: "Efekt", resolved: "rozwiązany",
    expHero: "D365 F&O engineering z kontekstem produkcyjnym.",
    expIntro: "Rekrutacyjny przegląd technologii, obszarów platformy i sposobu pracy, który wnoszę do zespołów Dynamics 365 Finance & Operations.",
    profile: "PROFIL", profileBody: "Microsoft Dynamics 365 Finance & Operations developer skoncentrowany na utrzymywalnym X++, integracjach, debugowaniu i kontrolowanym wdrażaniu rzeczywistych procesów biznesowych.",
    tech: "GŁÓWNE TECHNOLOGIE", areas: "OBSZARY D365", achievements: "WYBRANE OSIĄGNIĘCIA", style: "SPOSÓB PRACY",
    cvNext: "Pobieranie CV dodamy w kolejnym kroku",
    labHero: "Infrastruktura stojąca za developerem.",
    labIntro: "Bezpieczny widok mojego homelabu: wirtualizacja, kontenery, sieć, monitoring i backup — bez publikowania prywatnych adresów IP.",
    architecture: "ARCHITEKTURA", wiki: "Otwórz ProxmoxWiki", wikiNote: "Publiczne notatki, decyzje projektowe i powtarzalne procedury homelabowe.",
    contactHero: "Rozwiążmy skomplikowany proces.",
    contactIntro: "Napisz krótko o roli D365 F&O, integracji albo problemie technicznym. Adres e-mail pozostaje po stronie serwera.",
    name: "Imię i nazwisko", email: "E-mail", company: "Firma / zespół (opcjonalnie)", message: "Wiadomość",
    send: "Wyślij wiadomość", sending: "Wysyłanie...", sent: "Wiadomość wysłana. Dziękuję — odpiszę wkrótce.",
    pending: "Bezpieczny formularz jest gotowy, ale wysyłka wymaga jeszcze serwerowego klucza pocztowego.",
    sendError: "Nie udało się wysłać wiadomości. Na razie napisz przez LinkedIn.", location: "Lokalizacja",
    output: "OUTPUT", problemsLabel: "PROBLEMY", terminal: "TERMINAL", analytics: "Hook Analytics gotowy",
    commandTitle: "Paleta poleceń MarcinP", commandDescription: "Przejdź do sekcji lub uruchom polecenie",
    commandPlaceholder: "Wpisz: o mnie, projekty, kontakt, github...", noCommand: "Brak pasującego polecenia.",
    navigate: "Nawigacja", external: "Linki", run: "Uruchom", buildSolution: "Zbuduj Portfolio Solution",
  },
} as const;

const caseStudies = [
  {
    id: "CASE_01", area: "D365 F&O / Performance & debugging",
    title: { en: "The batch-path discrepancy", pl: "Różnica w ścieżce procesu batch" },
    problem: { en: "A recurring process produced different results than the same operation started manually, and the failure was not visible in the UI.", pl: "Proces cykliczny dawał inny wynik niż ta sama operacja uruchomiona ręcznie, a przyczyna nie była widoczna w interfejsie." },
    solution: { en: "I reproduced both paths, compared parameters and traced execution through framework classes and extension layers.", pl: "Odtworzyłem obie ścieżki, porównałem parametry i prześledziłem wykonanie przez klasy frameworka oraz warstwy rozszerzeń." },
    effect: { en: "A defensible root cause, controlled validation and a safer fix instead of a blind workaround.", pl: "Udokumentowana przyczyna, kontrolowana walidacja i bezpieczna poprawka zamiast obejścia w ciemno." },
  },
  {
    id: "CASE_02", area: "API / Payment portals / Adyen & Stripe",
    title: { en: "Payment portal integration", pl: "Integracja portali płatniczych" },
    problem: { en: "External payment events had to reach F&O reliably without duplicate postings or ambiguous transaction states.", pl: "Zdarzenia płatnicze musiały niezawodnie trafiać do F&O bez podwójnych księgowań i niejasnych statusów transakcji." },
    solution: { en: "I designed an API contract for Adyen and Stripe flows with signature validation, idempotency, explicit mappings and recoverable errors.", pl: "Zaprojektowałem kontrakt API dla Adyen i Stripe z walidacją podpisu, idempotencją, jawnym mapowaniem i obsługą błędów umożliwiającą wznowienie." },
    effect: { en: "Predictable status synchronisation, traceable failures and safe retries across system boundaries.", pl: "Przewidywalna synchronizacja statusów, śledzenie błędów i bezpieczne ponowienia między systemami." },
  },
  {
    id: "CASE_03", area: "Power Automate / Esker / Data integration",
    title: { en: "Automated e-invoicing hand-off", pl: "Automatyczny feed do e-invoicing" },
    problem: { en: "An e-invoicing platform needed a precise daily customer feed with a stable schema and no manual handling.", pl: "Platforma e-invoicing potrzebowała dokładnego, codziennego feedu klientów ze stałym schematem i bez ręcznej obsługi." },
    solution: { en: "I extended the data entity, defined the CSV contract and built an incremental Power Automate flow through SharePoint and secure delivery.", pl: "Rozszerzyłem data entity, zdefiniowałem kontrakt CSV i zbudowałem przyrostowy flow Power Automate przez SharePoint oraz bezpieczne dostarczenie." },
    effect: { en: "A repeatable, auditable integration ready for operational ownership and schema validation.", pl: "Powtarzalna, audytowalna integracja gotowa do utrzymania operacyjnego i kontroli schematu." },
  },
  {
    id: "CASE_04", area: "X++ / Extensibility / Posting",
    title: { en: "Standard-aware X++ extension", pl: "Rozszerzenie X++ zgodne ze standardem" },
    problem: { en: "A posting scenario failed after an inventory state changed, but bypassing standard posting would create long-term support risk.", pl: "Scenariusz księgowania przestawał działać po zmianie stanu magazynowego, lecz ominięcie standardu tworzyłoby ryzyko utrzymania." },
    solution: { en: "I placed a Chain of Command extension at the correct lifecycle point, restored the expected state and added an audit trail.", pl: "Umieściłem rozszerzenie Chain of Command we właściwym punkcie cyklu, przywróciłem oczekiwany stan i dodałem ślad audytowy." },
    effect: { en: "Reliable posting while preserving the standard process and making diagnostics easier.", pl: "Niezawodne księgowanie z zachowaniem procesu standardowego i prostszą diagnostyką." },
  },
  {
    id: "CASE_05", area: "Regression tests / Release confidence",
    title: { en: "Regression tests for critical flows", pl: "Testy regresywne procesów krytycznych" },
    problem: { en: "Posting and integration fixes touched complex paths where a small change could silently break another scenario.", pl: "Poprawki księgowań i integracji dotykały złożonych ścieżek, w których mała zmiana mogła po cichu zepsuć inny scenariusz." },
    solution: { en: "I built repeatable regression scenarios with deterministic test data, business-boundary assertions and release-focused execution.", pl: "Zbudowałem powtarzalne scenariusze regresyjne z deterministycznymi danymi, asercjami biznesowymi i wykonaniem pod release." },
    effect: { en: "Faster verification, clearer release evidence and less dependence on manual memory.", pl: "Szybsza weryfikacja, czytelne dowody przed wdrożeniem i mniejsza zależność od ręcznego pamiętania przypadków." },
  },
] as const;

const tech = ["X++", "Chain of Command", "D365 F&O", "REST APIs", "OData / Data entities", "Power Automate", "Azure DevOps", "SQL diagnostics", "Trace Parser", "Dual-write", "SharePoint", "Git / CI"];
const areas = ["Sales & invoicing", "Accounts receivable / payable", "Inventory & fixed assets", "Batch framework", "Integrations & DMF", "Security & number sequences", "Posting diagnostics", "Production support"];
const achievements = {
  en: ["Diagnosed framework and extension differences visible only in batch execution.", "Delivered standard-aware X++ extensions for sensitive posting paths.", "Built API and automation integrations with explicit contracts, retry behaviour and traceability.", "Turned complex incidents into reproducible evidence and controlled validation plans.", "Created regression coverage around high-risk processes and integration boundaries."],
  pl: ["Diagnozowanie różnic framework/extension widocznych wyłącznie w batch.", "Dostarczanie rozszerzeń X++ zgodnych ze standardem dla wrażliwych procesów.", "Budowanie integracji API i automatyzacji z kontraktami, retry i pełnym śledzeniem.", "Zamiana złożonych incydentów w odtwarzalne dowody i kontrolowane plany walidacji.", "Tworzenie pokrycia regresyjnego procesów wysokiego ryzyka i granic integracyjnych."],
} as const;
const styles = { en: ["Evidence first", "Standard-aware", "Production-minded", "Clear handover"], pl: ["Najpierw dowody", "Zgodność ze standardem", "Myślenie produkcyjne", "Jasny handover"] } as const;

function FileGlyph({ type }: { type: "xpp" | "json" | "form" | "md" | "arch" }) {
  if (type === "json") return <Braces className="file-glyph json-glyph" />;
  if (type === "form") return <Mail className="file-glyph config-glyph" />;
  if (type === "arch") return <Network className="file-glyph config-glyph" />;
  if (type === "md") return <span className="markdown-glyph">M↓</span>;
  return <span className="xpp-glyph">X++</span>;
}

function CodeLine({ number, children, active = false }: { number: number; children?: React.ReactNode; active?: boolean }) {
  return <div className={`code-line${active ? " current-line" : ""}`}><span className="line-number">{number}</span><code>{children}</code></div>;
}

function TreeGroup({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return <div className="app-tree-group"><button className="tree-row aot-group-row" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <ChevronDown /> : <ChevronRight />}{open ? <FolderOpen /> : <Folder />}<span>{label}</span></button>{open && <div className="tree-children">{children}</div>}</div>;
}

function Leaf({ code, label }: { code: string; label: string }) {
  return <div className="tree-row aot-leaf"><span className="aot-object-icon">{code}</span><span>{label}</span></div>;
}

function About({ locale, go }: { locale: Locale; go: (view: HomeView) => void }) {
  const t = copy[locale];
  return <div className="editor-content profile-editor">
    <div className="code-viewport">
      <CodeLine number={1}><span className="syntax-keyword">namespace</span> <span className="syntax-name">MarcinP.Portfolio</span></CodeLine>
      <CodeLine number={2}>{"{"}</CodeLine>
      <CodeLine number={3}>    <span className="syntax-attribute">[PortfolioRole</span>(<span className="syntax-string">&quot;D365 F&amp;O Developer&quot;</span>)]</CodeLine>
      <CodeLine number={4} active>    <span className="syntax-keyword">final class</span> <span className="syntax-type">MarcinPiszczat</span> <span className="syntax-keyword">extends</span> <span className="syntax-type">Developer</span></CodeLine>
      <CodeLine number={5}>    {"{"}</CodeLine><CodeLine number={6}>        <span className="syntax-comment">{"/// Evidence before assumptions."}</span></CodeLine>
      <CodeLine number={7}>        <span className="syntax-keyword">public</span> <span className="syntax-type">str</span> <span className="syntax-method">mission</span>()</CodeLine>
      <CodeLine number={8}>        {"{"}</CodeLine><CodeLine number={9}>            <span className="syntax-keyword">return</span> <span className="syntax-string">&quot;Design. Diagnose. Deliver.&quot;</span>;</CodeLine>
      <CodeLine number={10}>        {"}"}</CodeLine><CodeLine number={11} />
      <CodeLine number={12}>        <span className="syntax-keyword">public</span> <span className="syntax-type">List</span> <span className="syntax-method">specialisms</span>()</CodeLine>
      <CodeLine number={13}>        {"{"}</CodeLine><CodeLine number={14}>            <span className="syntax-keyword">return</span> [<span className="syntax-string">&quot;X++&quot;</span>, <span className="syntax-string">&quot;APIs&quot;</span>, <span className="syntax-string">&quot;Diagnostics&quot;</span>];</CodeLine>
      <CodeLine number={15}>        {"}"}</CodeLine><CodeLine number={16}>    {"}"}</CodeLine><CodeLine number={17}>{"}"}</CodeLine>
    </div>
    <aside className="peek-definition"><div className="peek-title"><FileCode2 /><span>MarcinPiszczat — definition</span><span className="peek-location">{t.eyebrow}</span></div><div className="peek-body"><div className="peek-signature"><span className="syntax-keyword">class</span> <strong>MarcinPiszczat</strong> <span className="syntax-keyword">extends</span> Developer</div><h1>{t.hero}</h1><p>{t.heroBody}</p><div className="peek-actions"><button type="button" onClick={() => go("projects")}>{t.inspect} <ChevronRight /></button><a href="/experience">{t.openExperience} <ChevronRight /></a></div></div></aside>
  </div>;
}

function Projects({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0); const t = copy[locale]; const item = caseStudies[active];
  return <div className="editor-content projects-editor"><div className="case-list"><div className="case-list-heading"><span>{t.cases}</span><small>{t.casesIntro}</small></div>{caseStudies.map((entry, index) => <button key={entry.id} type="button" className={active === index ? "selected" : ""} onClick={() => setActive(index)}><CircleDot /><span>{entry.id}</span><strong>{entry.title[locale]}</strong><small>{entry.area}</small></button>)}</div><article className="case-detail"><div className="case-detail-header"><div><span>{item.id}</span><strong>{item.area}</strong></div><em><Check /> {t.resolved}</em></div><h1>{item.title[locale]}</h1><div className="case-flow"><section><span>01</span><h2>{t.problem}</h2><p>{item.problem[locale]}</p></section><ChevronRight /><section><span>02</span><h2>{t.solution}</h2><p>{item.solution[locale]}</p></section><ChevronRight /><section className="case-effect"><span>03</span><h2>{t.effect}</h2><p>{item.effect[locale]}</p></section></div><div className="case-code-signature"><span className="syntax-keyword">public</span> <span className="syntax-type">CaseResult</span> <span className="syntax-method">resolve</span>(Evidence _evidence) → <span className="syntax-string">&quot;{t.resolved}&quot;</span></div></article></div>;
}

function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale]; const [ready, setReady] = useState<boolean | null>(null); const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle"); const [startedAt, setStartedAt] = useState(0);
  useEffect(() => { let live = true; fetch("/api/contact/status").then((r) => r.json()).then((x) => { if (live) setReady(Boolean(x.configured)); }).catch(() => { if (live) setReady(false); }); return () => { live = false; }; }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!ready) return; setState("sending"); const form = event.currentTarget; try { const body = { ...Object.fromEntries(new FormData(form).entries()), startedAt }; const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); if (!response.ok) throw new Error(); form.reset(); setState("success"); } catch { setState("error"); } };
  return <div className="editor-content contact-workspace"><article className="contact-copy"><span className="md-comment"># Contact.form — secure endpoint</span><h1>{t.contactHero}</h1><p>{t.contactIntro}</p><div className="contact-links"><div><MapPin /><span>{t.location}</span><strong>Derby, United Kingdom</strong></div><a href="https://www.linkedin.com/in/marcin-piszczatowski/" target="_blank" rel="noreferrer"><Network /><span>LinkedIn</span><strong>marcin-piszczatowski</strong><ExternalLink /></a><a href="https://github.com/piszczat" target="_blank" rel="noreferrer"><GitBranch /><span>GitHub</span><strong>@piszczat</strong><ExternalLink /></a></div></article><form className="contact-form" onFocus={() => { if (!startedAt) setStartedAt(Date.now()); }} onSubmit={submit}><div className="form-title"><Terminal /><span>POST /api/contact</span><em>{ready ? "200 ready" : "configuration pending"}</em></div><label><span>{t.name}</span><input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label><label><span>{t.email}</span><input name="email" type="email" required maxLength={160} autoComplete="email" /></label><label><span>{t.company}</span><input name="company" maxLength={120} autoComplete="organization" /></label><label><span>{t.message}</span><textarea name="message" required minLength={20} maxLength={4000} rows={7} /></label><label className="honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label><button type="submit" disabled={!ready || state === "sending"}>{state === "sending" ? t.sending : t.send} <ChevronRight /></button>{!ready && <p className="form-note pending">{t.pending}</p>}{state === "success" && <p className="form-note success">{t.sent}</p>}{state === "error" && <p className="form-note error">{t.sendError}</p>}</form></div>;
}

function Experience({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <div className="editor-content experience-editor"><header className="page-hero"><span>D365F&O://EXPERIENCE</span><h1>{t.expHero}</h1><p>{t.expIntro}</p></header><div className="experience-grid"><section className="experience-profile"><span>{t.profile}</span><h2>Marcin Piszczatowski</h2><strong>Microsoft Dynamics 365 F&O Developer</strong><p>{t.profileBody}</p><div><MapPin /> Derby, United Kingdom</div></section><section className="experience-card tech-card"><span>{t.tech}</span><div className="tag-cloud">{tech.map((x) => <b key={x}>{x}</b>)}</div></section><section className="experience-card areas-card"><span>{t.areas}</span><ul>{areas.map((x) => <li key={x}><Check />{x}</li>)}</ul></section><section className="experience-card achievement-card"><span>{t.achievements}</span><ol>{achievements[locale].map((x, i) => <li key={x}><b>{String(i + 1).padStart(2, "0")}</b><p>{x}</p></li>)}</ol></section><section className="experience-card style-card"><span>{t.style}</span><div>{styles[locale].map((x) => <strong key={x}>{x}</strong>)}</div><small>{t.cvNext}</small></section></div></div>;
}

function Homelab({ locale }: { locale: Locale }) {
  const t = copy[locale]; const nodes = locale === "pl" ? [["EDGE", "Router + segmentacja", "VPN · VLAN · DNS · Wi-Fi"], ["COMPUTE", "Klaster Proxmox", "VM · LXC · automatyzacja"], ["SERVICES", "Usługi self-hosted", "monitoring · proxy · DNS"], ["STORAGE", "NAS + backup", "snapshoty · kopie · media"], ["CLIENTS", "Dom + lab", "stacje · urządzenia · testy"]] : [["EDGE", "Router & segmentation", "VPN · VLAN · DNS · Wi-Fi"], ["COMPUTE", "Proxmox cluster", "VM · LXC · automation"], ["SERVICES", "Self-hosted services", "monitoring · proxy · DNS"], ["STORAGE", "NAS & backup", "snapshots · copies · media"], ["CLIENTS", "Home & lab", "workstations · devices · testing"]];
  return <div className="editor-content homelab-editor"><header className="page-hero"><span>INFRA://HOMELAB</span><h1>{t.labHero}</h1><p>{t.labIntro}</p></header><div className="architecture-panel"><div className="architecture-heading"><span>{t.architecture}</span><em>private addresses: redacted</em></div><div className="architecture-flow">{nodes.map(([code, title, detail], i) => <div className="architecture-step" key={code}><article><span>{code}</span><h2>{title}</h2><p>{detail}</p></article>{i < nodes.length - 1 && <div className="flow-line"><i /></div>}</div>)}</div></div><a className="wiki-card" href="https://github.com/piszczat/ProxmoxWiki" target="_blank" rel="noreferrer"><div><Boxes /><span>PUBLIC REPOSITORY</span></div><h2>piszczat/ProxmoxWiki</h2><p>{t.wikiNote}</p><strong>{t.wiki} <ExternalLink /></strong></a></div>;
}

export function PortfolioApp({ page }: { page: PageId }) {
  const [locale, setLocale] = useState<Locale>("en"); const [view, setView] = useState<HomeView>("about"); const [paletteOpen, setPaletteOpen] = useState(false); const [build, setBuild] = useState<BuildState>("idle"); const [output, setOutput] = useState(["Ready. MarcinP.Portfolio solution loaded."]); const t = copy[locale];
  const docs = useMemo(() => [{ id: "about" as const, label: t.about, filename: t.aboutFile, icon: "xpp" as const }, { id: "projects" as const, label: t.projects, filename: t.projectsFile, icon: "json" as const }, { id: "contact" as const, label: t.contact, filename: t.contactFile, icon: "form" as const }], [t]);
  const activeFile = page === "experience" ? t.experienceFile : page === "homelab" ? t.homelabFile : docs.find((x) => x.id === view)?.filename ?? t.aboutFile;
  useEffect(() => { const saved = localStorage.getItem("marcinp-locale"); const q = page === "home" ? new URLSearchParams(window.location.search).get("view") : null; const timer = window.setTimeout(() => { if (saved === "pl" || saved === "en") setLocale(saved); if (q === "about" || q === "projects" || q === "contact") setView(q); }, 0); return () => window.clearTimeout(timer); }, [page]);
  const runBuild = async () => { if (build === "building") return; setBuild("building"); setOutput(["------ Build started: MarcinP.Portfolio / Release ------", "Restoring D365 F&O references..."]); await new Promise((r) => setTimeout(r, 420)); setOutput((x) => [...x, "Compiling X++, API contracts and regression tests..."]); await new Promise((r) => setTimeout(r, 520)); setOutput((x) => [...x, "Regression suite: 5 scenarios passed.", "========== Build: 1 succeeded, 0 failed =========="]); setBuild("success"); };
  useEffect(() => { const key = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); } if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") { e.preventDefault(); void runBuild(); } }; addEventListener("keydown", key); return () => removeEventListener("keydown", key); });
  const setLanguage = (x: Locale) => { setLocale(x); localStorage.setItem("marcinp-locale", x); document.documentElement.lang = x; };
  const goHome = (x: HomeView) => { setPaletteOpen(false); if (page === "home") { setView(x); window.history.replaceState({}, "", `/?view=${x}`); } else window.location.assign(`/?view=${x}`); };
  const go = (path: string) => { setPaletteOpen(false); window.location.assign(path); };
  return <main className="vs-shell">
    <header className="vs-titlebar"><div className="vs-app-mark"><Box size={15} /></div><span>MarcinP.com — Microsoft Visual Studio</span><div className="window-actions"><Minus /><Square /><X /></div></header>
    <div className="vs-menubar"><div className="menu-items">{["File", "Edit", "View", "Git", "Project", "Build", "Debug", "Tools", "Extensions", "Help"].map((x) => <span key={x}>{x}</span>)}</div><button className="ide-search" type="button" onClick={() => setPaletteOpen(true)}><Search size={13} /><span>{t.search}</span></button><div className="locale-switch"><button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button><button type="button" className={locale === "pl" ? "active" : ""} onClick={() => setLanguage("pl")}>PL</button></div></div>
    <div className="vs-toolbar"><button className={`run-button ${build}`} type="button" onClick={() => void runBuild()} disabled={build === "building"}>{build === "success" ? <Check size={14} /> : <Play size={14} fill="currentColor" />}{build === "building" ? t.building : build === "success" ? t.built : t.start}</button><span className="toolbar-select">Release <ChevronDown size={12} /></span><span className="toolbar-select">Any CPU <ChevronDown size={12} /></span><span className="toolbar-divider" /><button type="button" className="toolbar-command" onClick={() => setPaletteOpen(true)}><Terminal size={14} /> {t.palette}</button><span className="analytics-chip"><CircleDot /> {t.analytics}</span></div>
    <div className="vs-workbench"><aside className="solution-panel"><div className="panel-title"><span>{t.explorer}</span><div className="panel-title-actions"><span>↻</span><span>▣</span><span>−</span></div></div><div className="solution-search"><Search /><span>{t.searchExplorer}</span></div><nav className="solution-tree application-tree"><div className="tree-row aot-root"><ChevronDown /><Boxes className="aot-root-icon" /><strong>{t.aot}</strong></div><TreeGroup label={t.classes} defaultOpen><Leaf code="C" label="MarcinPiszczat" /><Leaf code="C" label="EvidenceFirstDiagnostic" /><Leaf code="C" label="PaymentPortalService" /></TreeGroup><TreeGroup label={t.integrations} defaultOpen><Leaf code="API" label="AdyenPaymentContract" /><Leaf code="API" label="StripeWebhookContract" /><Leaf code="PA" label="EskerCustomerFlow" /></TreeGroup><TreeGroup label={t.tests}><Leaf code="T" label="PostingRegressionSuite" /><Leaf code="T" label="IntegrationContractTests" /></TreeGroup><TreeGroup label={t.web}><Leaf code="W" label="ContactEndpoint" /><Leaf code="W" label="AnalyticsLoader" /></TreeGroup><TreeGroup label={t.projectsNode} defaultOpen><div className="tree-row project-row"><ChevronDown /><Box className="project-icon" /><strong>MarcinP.Portfolio</strong></div>{docs.map((doc) => <button key={doc.id} className={`tree-row file-row ${page === "home" && view === doc.id ? "selected" : ""}`} type="button" onClick={() => goHome(doc.id)}><FileGlyph type={doc.icon} /><span>{doc.filename}</span></button>)}<a className={`tree-row file-row ${page === "experience" ? "selected" : ""}`} href="/experience"><FileGlyph type="md" /><span>{t.experienceFile}</span></a><a className={`tree-row file-row ${page === "homelab" ? "selected" : ""}`} href="/homelab"><FileGlyph type="arch" /><span>{t.homelabFile}</span></a></TreeGroup></nav><div className="properties-panel"><div className="panel-title">{t.properties}</div><dl><div><dt>{t.file}</dt><dd>{activeFile}</dd></div><div><dt>{t.action}</dt><dd>Compile</dd></div><div><dt>{t.model}</dt><dd>MarcinPPortfolio</dd></div><div><dt>{t.layer}</dt><dd>USR</dd></div><div><dt>{t.status}</dt><dd className="property-ok">{t.ready}</dd></div></dl></div></aside>
      <section className="editor-region"><div className="document-path"><span>MarcinP.Portfolio</span><ChevronRight /><span>{page === "home" ? `Portfolio / ${activeFile}` : `${page} / ${activeFile}`}</span></div>{page === "home" ? <Tabs value={view} onValueChange={(x) => goHome(x as HomeView)} className="editor-tabs"><TabsList className="document-tabs">{docs.map((doc) => <TabsTrigger key={doc.id} value={doc.id} className="document-tab"><FileGlyph type={doc.icon} /><span>{doc.filename}</span><X className="tab-close" /></TabsTrigger>)}</TabsList><div className="editor-canvas"><TabsContent value="about" className="editor-content-wrap"><About locale={locale} go={goHome} /></TabsContent><TabsContent value="projects" className="editor-content-wrap"><Projects locale={locale} /></TabsContent><TabsContent value="contact" className="editor-content-wrap"><Contact locale={locale} /></TabsContent></div></Tabs> : <div className="editor-tabs single-document"><div className="document-tabs"><div className="document-tab static active"><FileGlyph type={page === "experience" ? "md" : "arch"} /><span>{activeFile}</span><X className="tab-close" /></div></div><div className="editor-canvas">{page === "experience" ? <Experience locale={locale} /> : <Homelab locale={locale} />}</div></div>}<section className="output-panel"><div className="output-tabs"><span>{t.problemsLabel} <b>0</b></span><span className="active">{t.output}</span><span>DEBUG CONSOLE</span><span>{t.terminal}</span><PanelBottom /></div><div className="output-console"><div className={`build-indicator ${build}`} /><div>{output.map((line, i) => <p key={`${line}-${i}`}>{line}</p>)}</div></div></section></section>
    </div>
    <footer className="vs-statusbar"><div><span className="status-brand">MP</span><GitBranch /><span>main</span><span className="sync-icon">↻</span><Check /><span>0</span><X /><span>0</span></div><div><span>{locale.toUpperCase()}</span><span>UTF-8</span><span>CRLF</span><span>X++</span><Bell /></div></footer>
    <CommandDialog open={paletteOpen} onOpenChange={setPaletteOpen} title={t.commandTitle} description={t.commandDescription} className="vs-command-dialog"><CommandInput placeholder={t.commandPlaceholder} /><CommandList><CommandEmpty>{t.noCommand}</CommandEmpty><CommandGroup heading={t.navigate}><CommandItem onSelect={() => goHome("about")}><FileGlyph type="xpp" /><span>about — {t.about}</span><CommandShortcut>ABOUT</CommandShortcut></CommandItem><CommandItem onSelect={() => goHome("projects")}><FileGlyph type="json" /><span>projects — {t.projects}</span><CommandShortcut>PROJECTS</CommandShortcut></CommandItem><CommandItem onSelect={() => go("/experience")}><FileGlyph type="md" /><span>experience — {t.experience}</span><CommandShortcut>CV</CommandShortcut></CommandItem><CommandItem onSelect={() => goHome("contact")}><FileGlyph type="form" /><span>contact — {t.contact}</span><CommandShortcut>CONTACT</CommandShortcut></CommandItem><CommandItem onSelect={() => go("/homelab")}><FileGlyph type="arch" /><span>homelab — {t.homelab}</span><CommandShortcut>LAB</CommandShortcut></CommandItem></CommandGroup><CommandGroup heading={t.external}><CommandItem onSelect={() => window.open("https://github.com/piszczat/Mpwebsite", "_blank", "noopener,noreferrer")}><GitBranch /><span>github — Mpwebsite</span><CommandShortcut>GITHUB</CommandShortcut></CommandItem><CommandItem onSelect={() => window.open("https://www.linkedin.com/in/marcin-piszczatowski/", "_blank", "noopener,noreferrer")}><Network /><span>linkedin — Marcin Piszczatowski</span><CommandShortcut>LINKEDIN</CommandShortcut></CommandItem></CommandGroup><CommandGroup heading={t.run}><CommandItem onSelect={() => { setPaletteOpen(false); void runBuild(); }}><Play /><span>{t.buildSolution}</span><CommandShortcut>Ctrl+B</CommandShortcut></CommandItem></CommandGroup></CommandList></CommandDialog>
  </main>;
}
