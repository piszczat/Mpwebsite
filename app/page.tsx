"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Box,
  Boxes,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  ExternalLink,
  FileCode2,
  Folder,
  FolderOpen,
  GitBranch,
  Mail,
  MapPin,
  Minus,
  Network,
  PanelBottom,
  Play,
  Search,
  Settings,
  Square,
  X,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type ViewId = "profile" | "work" | "toolkit" | "contact";
type BuildState = "idle" | "building" | "success";

const views: Array<{
  id: ViewId;
  label: string;
  filename: string;
  path: string;
  icon: "xpp" | "json" | "config" | "markdown";
}> = [
  {
    id: "profile",
    label: "Profile",
    filename: "MarcinPiszczat.xpp",
    path: "Portfolio / Source / MarcinPiszczat.xpp",
    icon: "xpp",
  },
  {
    id: "work",
    label: "Case files",
    filename: "CaseFiles.json",
    path: "Portfolio / Evidence / CaseFiles.json",
    icon: "json",
  },
  {
    id: "toolkit",
    label: "Toolkit",
    filename: "Skills.config",
    path: "Portfolio / Configuration / Skills.config",
    icon: "config",
  },
  {
    id: "contact",
    label: "Contact",
    filename: "Contact.md",
    path: "Portfolio / Contact.md",
    icon: "markdown",
  },
];

const caseFiles = [
  {
    id: "CASE_01",
    area: "Sales invoicing / batch",
    title: "The split-invoice mystery",
    summary:
      "A recurring batch behaved differently from the same process launched manually. I followed the parameter and grouping path until the hidden influence became reproducible.",
    path: ["SalesFormLetter", "Parm data", "Grouping model", "Extension layer"],
    result: "Defensible root cause + controlled validation plan",
  },
  {
    id: "CASE_02",
    area: "Inventory / fixed assets",
    title: "Posting path, restored",
    summary:
      "A serialized asset reached invoicing after its inventory position had changed. The fix restored the expected path at the correct lifecycle point and retained an audit trail.",
    path: ["Inventory movement", "Posting hook", "Controlled transfer", "Audit log"],
    result: "Predictable invoicing without bypassing standard posting",
  },
  {
    id: "CASE_03",
    area: "Data / automation",
    title: "A reliable daily hand-off",
    summary:
      "A customer feed needed exact mapping and hands-off delivery. I connected the entity layer to an incremental export and a dependable downstream document flow.",
    path: ["Data entity", "Incremental query", "CSV contract", "Automated delivery"],
    result: "Repeatable integration with an explicit data contract",
  },
];

const toolkit = [
  ["Application", "X++", "Advanced"],
  ["Extensibility", "Chain of Command", "Advanced"],
  ["Platform", "D365 Finance & Operations", "Daily"],
  ["Data", "Data entities / DMF", "Production"],
  ["Runtime", "Batch framework", "Production"],
  ["Diagnostics", "Trace Parser", "Evidence-first"],
  ["Data", "SQL diagnostics", "Investigation"],
  ["Automation", "Power Automate", "Integration"],
  ["Integration", "APIs / SharePoint", "Delivery"],
  ["Integration", "Dual-write", "Support"],
  ["Delivery", "Azure DevOps", "CI / ALM"],
  ["Operations", "Production support", "Calm under pressure"],
];

function FileGlyph({ type }: { type: string }) {
  if (type === "json") return <Braces className="file-glyph json-glyph" />;
  if (type === "config") return <Settings className="file-glyph config-glyph" />;
  if (type === "markdown") return <span className="markdown-glyph">M↓</span>;
  return <span className="xpp-glyph">X++</span>;
}

function CodeLine({
  number,
  children,
  active = false,
}: {
  number: number;
  children?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className={`code-line${active ? " current-line" : ""}`}>
      <span className="line-number">{number}</span>
      <code>{children}</code>
    </div>
  );
}

function AppTreeGroup({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="app-tree-group">
      <button
        className="tree-row aot-group-row"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <ChevronDown /> : <ChevronRight />}
        {open ? <FolderOpen /> : <Folder />}
        <span>{label}</span>
      </button>
      {open && <div className="tree-children">{children}</div>}
    </div>
  );
}

function AotLeaf({ code, label }: { code: string; label: string }) {
  return (
    <div className="tree-row aot-leaf">
      <span className="aot-object-icon">{code}</span>
      <span>{label}</span>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>("profile");
  const [activeCase, setActiveCase] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [buildState, setBuildState] = useState<BuildState>("idle");
  const [outputLines, setOutputLines] = useState([
    "Ready. Portfolio solution loaded.",
  ]);

  const activeFile = views.find((view) => view.id === activeView) ?? views[0];

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "p" || event.key === "q")) {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const openView = (view: ViewId) => {
    setActiveView(view);
    setPaletteOpen(false);
  };

  const runPortfolio = async () => {
    if (buildState === "building") return;
    setBuildState("building");
    setOutputLines([
      "------ Build started: Project: MarcinP.Portfolio, Configuration: Release Any CPU ------",
      "Restoring D365 F&O references...",
    ]);
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    setOutputLines((lines) => [
      ...lines,
      "Compiling X++ extensions and integration contracts...",
    ]);
    await new Promise((resolve) => window.setTimeout(resolve, 620));
    setOutputLines((lines) => [
      ...lines,
      "Validating case files: 3 passed.",
      "MarcinP.Portfolio -> /bin/Release/portfolio.deployablepackage",
      "========== Build: 1 succeeded, 0 failed, 0 skipped ==========",
    ]);
    setBuildState("success");
  };

  return (
    <main className="vs-shell">
      <header className="vs-titlebar">
        <div className="vs-app-mark" aria-hidden="true">
          <Box size={15} />
        </div>
        <span>MarcinP.com — Microsoft Visual Studio</span>
        <div className="window-actions" aria-hidden="true">
          <Minus />
          <Square />
          <X />
        </div>
      </header>

      <div className="vs-menubar">
        <div className="menu-items" aria-label="Application menu">
          {["File", "Edit", "View", "Git", "Project", "Build", "Debug", "Tools", "Extensions", "Help"].map(
            (item) => (
              <span key={item}>{item}</span>
            ),
          )}
        </div>
        <button
          className="ide-search"
          type="button"
          onClick={() => setPaletteOpen(true)}
        >
          <Search size={13} aria-hidden="true" />
          <span>Search (Ctrl+Q)</span>
        </button>
        <div className="user-chip" aria-label="Signed in as Marcin Piszczat">
          MP
        </div>
      </div>

      <div className="vs-toolbar">
        <button
          className={`run-button ${buildState}`}
          type="button"
          onClick={runPortfolio}
          disabled={buildState === "building"}
        >
          {buildState === "success" ? (
            <Check size={14} aria-hidden="true" />
          ) : (
            <Play size={14} fill="currentColor" aria-hidden="true" />
          )}
          {buildState === "building"
            ? "Building..."
            : buildState === "success"
              ? "Build succeeded"
              : "Start"}
        </button>
        <span className="toolbar-select">Debug <ChevronDown size={12} /></span>
        <span className="toolbar-select">Any CPU <ChevronDown size={12} /></span>
        <span className="toolbar-divider" />
        <button
          type="button"
          className="toolbar-command"
          onClick={() => setPaletteOpen(true)}
        >
          <Search size={14} /> Command Palette
        </button>
      </div>

      <div className="vs-workbench">
        <aside className="solution-panel">
          <div className="panel-title">
            <span>APPLICATION EXPLORER</span>
            <div className="panel-title-actions" aria-hidden="true">
              <span>↻</span>
              <span>▣</span>
              <span>−</span>
            </div>
          </div>
          <div className="solution-search">
            <Search aria-hidden="true" />
            <span>Search Application Explorer (Ctrl+;)</span>
          </div>
          <nav className="solution-tree application-tree" aria-label="D365 application objects">
            <div className="tree-row aot-root">
              <ChevronDown />
              <Boxes className="aot-root-icon" />
              <strong>Application Object Tree (AOT)</strong>
            </div>

            <AppTreeGroup label="Data Dictionary" defaultOpen>
              <AotLeaf code="BE" label="Base Enums" />
              <AotLeaf code="EDT" label="Extended Data Types" />
              <AotLeaf code="MP" label="Maps" />
              <AotLeaf code="TB" label="Tables" />
              <AotLeaf code="VW" label="Views" />
            </AppTreeGroup>

            <AppTreeGroup label="Classes" defaultOpen>
              <AotLeaf code="C" label="MarcinPiszczat" />
              <AotLeaf code="C" label="PortfolioCaseProvider" />
              <AotLeaf code="C" label="EvidenceFirstDiagnostic" />
            </AppTreeGroup>

            <AppTreeGroup label="Data Entities">
              <AotLeaf code="DE" label="PortfolioCaseEntity" />
              <AotLeaf code="DE" label="DeveloperSkillEntity" />
            </AppTreeGroup>

            <AppTreeGroup label="Forms">
              <AotLeaf code="F" label="MarcinPortfolioWorkspace" />
              <AotLeaf code="F" label="CaseFileDetails" />
            </AppTreeGroup>

            <AppTreeGroup label="Menus">
              <AotLeaf code="MN" label="PortfolioMainMenu" />
            </AppTreeGroup>

            <AppTreeGroup label="Menu Items">
              <AotLeaf code="A" label="Action" />
              <AotLeaf code="D" label="Display" />
              <AotLeaf code="O" label="Output" />
            </AppTreeGroup>

            <AppTreeGroup label="Queries">
              <AotLeaf code="Q" label="PortfolioCasesQuery" />
            </AppTreeGroup>

            <AppTreeGroup label="Security">
              <AotLeaf code="R" label="Roles" />
              <AotLeaf code="D" label="Duties" />
              <AotLeaf code="P" label="Privileges" />
            </AppTreeGroup>

            <AppTreeGroup label="Services">
              <AotLeaf code="S" label="PortfolioIntegrationService" />
            </AppTreeGroup>

            <AppTreeGroup label="Visual Studio Projects" defaultOpen>
              <div className="tree-row project-row">
                <ChevronDown />
                <Box className="project-icon" />
                <strong>MarcinP.Portfolio</strong>
              </div>
              {views.map((view) => (
                <button
                  key={view.id}
                  className={`tree-row file-row ${activeView === view.id ? "selected" : ""}`}
                  type="button"
                  onClick={() => openView(view.id)}
                >
                  <FileGlyph type={view.icon} />
                  <span>{view.filename}</span>
                </button>
              ))}
            </AppTreeGroup>
          </nav>

          <div className="properties-panel">
            <div className="panel-title">PROPERTIES</div>
            <dl>
              <div><dt>File Name</dt><dd>{activeFile.filename}</dd></div>
              <div><dt>Build Action</dt><dd>Compile</dd></div>
              <div><dt>Model</dt><dd>MarcinPPortfolio</dd></div>
              <div><dt>Layer</dt><dd>USR</dd></div>
              <div><dt>Status</dt><dd className="property-ok">Ready</dd></div>
            </dl>
          </div>
        </aside>

        <section className="editor-region" aria-label="Portfolio editor">
          <div className="document-path">
            <span>MarcinP.Portfolio</span>
            <ChevronRight />
            <span>{activeFile.path}</span>
          </div>

          <Tabs
            value={activeView}
            onValueChange={(value) => setActiveView(value as ViewId)}
            className="editor-tabs"
          >
            <TabsList className="document-tabs" aria-label="Open documents">
              {views.map((view) => (
                <TabsTrigger key={view.id} value={view.id} className="document-tab">
                  <FileGlyph type={view.icon} />
                  <span>{view.filename}</span>
                  <X className="tab-close" aria-hidden="true" />
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="editor-canvas">
              <TabsContent value="profile" className="editor-content profile-editor">
                <div className="code-viewport">
                  <CodeLine number={1}>
                    <span className="syntax-keyword">namespace</span>{" "}
                    <span className="syntax-name">MarcinP.Portfolio</span>
                  </CodeLine>
                  <CodeLine number={2}>{"{"}</CodeLine>
                  <CodeLine number={3}>
                    {"    "}<span className="syntax-attribute">[PortfolioRole</span>
                    <span className="syntax-punctuation">(</span>
                    <span className="syntax-string">&quot;D365 F&amp;O Developer&quot;</span>
                    <span className="syntax-punctuation">)]</span>
                  </CodeLine>
                  <CodeLine number={4} active>
                    {"    "}<span className="syntax-keyword">final class</span>{" "}
                    <span className="syntax-type">MarcinPiszczat</span>{" "}
                    <span className="syntax-keyword">extends</span>{" "}
                    <span className="syntax-type">Developer</span>
                  </CodeLine>
                  <CodeLine number={5}>{"    {"}</CodeLine>
                  <CodeLine number={6}>
                    {"        "}<span className="syntax-comment">/// &lt;summary&gt;</span>
                  </CodeLine>
                  <CodeLine number={7}>
                    {"        "}<span className="syntax-comment">/// Finds what the system is really doing.</span>
                  </CodeLine>
                  <CodeLine number={8}>
                    {"        "}<span className="syntax-comment">/// &lt;/summary&gt;</span>
                  </CodeLine>
                  <CodeLine number={9}>
                    {"        "}<span className="syntax-keyword">public</span>{" "}
                    <span className="syntax-type">str</span>{" "}
                    <span className="syntax-method">mission</span>()
                  </CodeLine>
                  <CodeLine number={10}>{"        {"}</CodeLine>
                  <CodeLine number={11}>
                    {"            "}<span className="syntax-keyword">return</span>{" "}
                    <span className="syntax-string">
                      &quot;Design. Diagnose. Deliver reliable F&amp;O solutions.&quot;
                    </span>;
                  </CodeLine>
                  <CodeLine number={12}>{"        }"}</CodeLine>
                  <CodeLine number={13} />
                  <CodeLine number={14}>
                    {"        "}<span className="syntax-keyword">public</span>{" "}
                    <span className="syntax-type">List</span>{" "}
                    <span className="syntax-method">operatingPrinciples</span>()
                  </CodeLine>
                  <CodeLine number={15}>{"        {"}</CodeLine>
                  <CodeLine number={16}>
                    {"            "}<span className="syntax-keyword">return</span>{" "}
                    [<span className="syntax-string">&quot;Evidence first&quot;</span>,{" "}
                    <span className="syntax-string">&quot;Standard-aware&quot;</span>,{" "}
                    <span className="syntax-string">&quot;Production-minded&quot;</span>];
                  </CodeLine>
                  <CodeLine number={17}>{"        }"}</CodeLine>
                  <CodeLine number={18}>{"    }"}</CodeLine>
                  <CodeLine number={19}>{"}"}</CodeLine>
                </div>

                <aside className="peek-definition">
                  <div className="peek-title">
                    <FileCode2 />
                    <span>MarcinPiszczat — definition</span>
                    <span className="peek-location">Derby, United Kingdom</span>
                  </div>
                  <div className="peek-body">
                    <div className="peek-signature">
                      <span className="syntax-keyword">class</span>{" "}
                      <strong>MarcinPiszczat</strong>{" "}
                      <span className="syntax-keyword">extends</span> Developer
                    </div>
                    <h1>I make complicated F&amp;O paths behave.</h1>
                    <p>
                      X++ extensions, posting flows, integrations and evidence-first
                      diagnostics — designed for the real world, not just the happy path.
                    </p>
                    <div className="peek-actions">
                      <button type="button" onClick={() => openView("work")}>
                        Go to case files <ChevronRight />
                      </button>
                      <button type="button" onClick={() => openView("contact")}>
                        Open contact <ChevronRight />
                      </button>
                    </div>
                  </div>
                </aside>
              </TabsContent>

              <TabsContent value="work" className="editor-content case-editor">
                <div className="case-selector" aria-label="Case file selector">
                  {caseFiles.map((caseFile, index) => (
                    <button
                      key={caseFile.id}
                      type="button"
                      className={activeCase === index ? "selected" : ""}
                      onClick={() => setActiveCase(index)}
                    >
                      <CircleDot />
                      <span>{caseFile.id}</span>
                      <strong>{caseFile.title}</strong>
                    </button>
                  ))}
                </div>
                <div className="json-document" aria-live="polite">
                  <div className="json-lines">
                    <CodeLine number={1}>{"{"}</CodeLine>
                    <CodeLine number={2}>
                      {"  "}<span className="json-key">&quot;id&quot;</span>:{" "}
                      <span className="syntax-string">&quot;{caseFiles[activeCase].id}&quot;</span>,
                    </CodeLine>
                    <CodeLine number={3}>
                      {"  "}<span className="json-key">&quot;area&quot;</span>:{" "}
                      <span className="syntax-string">&quot;{caseFiles[activeCase].area}&quot;</span>,
                    </CodeLine>
                    <CodeLine number={4}>
                      {"  "}<span className="json-key">&quot;title&quot;</span>:{" "}
                      <span className="syntax-string">&quot;{caseFiles[activeCase].title}&quot;</span>,
                    </CodeLine>
                    <CodeLine number={5}>
                      {"  "}<span className="json-key">&quot;status&quot;</span>:{" "}
                      <span className="syntax-string">&quot;resolved&quot;</span>,
                    </CodeLine>
                    <CodeLine number={6}>
                      {"  "}<span className="json-key">&quot;executionPath&quot;</span>: [
                    </CodeLine>
                    {caseFiles[activeCase].path.map((step, index) => (
                      <CodeLine key={step} number={index + 7}>
                        {"    "}<span className="syntax-string">&quot;{step}&quot;</span>
                        {index < caseFiles[activeCase].path.length - 1 ? "," : ""}
                      </CodeLine>
                    ))}
                    <CodeLine number={11}>{"  "}] ,</CodeLine>
                    <CodeLine number={12}>
                      {"  "}<span className="json-key">&quot;result&quot;</span>:{" "}
                      <span className="syntax-string">&quot;{caseFiles[activeCase].result}&quot;</span>
                    </CodeLine>
                    <CodeLine number={13}>{"}"}</CodeLine>
                  </div>
                  <aside className="case-inspector">
                    <span className="inspector-label">CASE INSPECTOR</span>
                    <h2>{caseFiles[activeCase].title}</h2>
                    <p>{caseFiles[activeCase].summary}</p>
                    <div className="debug-path">
                      {caseFiles[activeCase].path.map((step, index) => (
                        <div key={step}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{step}</strong>
                          {index < caseFiles[activeCase].path.length - 1 && <ChevronDown />}
                        </div>
                      ))}
                    </div>
                    <div className="watch-value">
                      <span>Result</span>
                      <strong>{caseFiles[activeCase].result}</strong>
                    </div>
                  </aside>
                </div>
              </TabsContent>

              <TabsContent value="toolkit" className="editor-content toolkit-editor">
                <div className="config-header">
                  <span>MarcinP.Portfolio / Skills.config</span>
                  <strong>12 capabilities loaded</strong>
                </div>
                <div className="config-table" role="table" aria-label="Technical toolkit">
                  <div className="config-row config-head" role="row">
                    <span role="columnheader">Scope</span>
                    <span role="columnheader">Capability</span>
                    <span role="columnheader">Usage</span>
                    <span role="columnheader">Status</span>
                  </div>
                  {toolkit.map(([scope, capability, usage], index) => (
                    <div className="config-row" role="row" key={capability}>
                      <span className="row-id">{String(index + 1).padStart(2, "0")}</span>
                      <span role="cell">{scope}</span>
                      <strong role="cell">{capability}</strong>
                      <span role="cell">{usage}</span>
                      <span className="loaded-status" role="cell"><Check /> Loaded</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="contact" className="editor-content contact-editor">
                <div className="markdown-gutter" aria-hidden="true">
                  {Array.from({ length: 18 }, (_, index) => (
                    <span key={index}>{index + 1}</span>
                  ))}
                </div>
                <article className="markdown-preview">
                  <span className="md-comment"># Contact.md — Preview</span>
                  <h1>Let&apos;s make the complicated path behave.</h1>
                  <p>
                    I&apos;m a Microsoft Dynamics 365 Finance &amp; Operations
                    developer based in Derby, United Kingdom.
                  </p>
                  <div className="contact-bindings">
                    <div>
                      <MapPin />
                      <span>Location</span>
                      <strong>Derby, United Kingdom</strong>
                    </div>
                    <a href="mailto:piszczat87@gmail.com">
                      <Mail />
                      <span>Email</span>
                      <strong>piszczat87@gmail.com</strong>
                      <ExternalLink className="binding-link-icon" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/marcin-piszczatowski/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Network />
                      <span>LinkedIn</span>
                      <strong>marcin-piszczatowski</strong>
                      <ExternalLink className="binding-link-icon" />
                    </a>
                    <div>
                      <Network />
                      <span>Website</span>
                      <strong>marcinp.com</strong>
                    </div>
                  </div>
                  <div className="contact-note">
                    <Check />
                    <p>
                      Contact bindings loaded successfully. The current mailbox
                      can be replaced with a marcinp.com address later.
                    </p>
                  </div>
                </article>
              </TabsContent>
            </div>
          </Tabs>

          <section className="output-panel" aria-label="Build output">
            <div className="output-tabs">
              <span>PROBLEMS <b>0</b></span>
              <span className="active">OUTPUT</span>
              <span>DEBUG CONSOLE</span>
              <span>TERMINAL</span>
              <PanelBottom />
            </div>
            <div className="output-console" aria-live="polite">
              <div className={`build-indicator ${buildState}`} />
              <div>
                {outputLines.map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}
              </div>
            </div>
          </section>
        </section>
      </div>

      <footer className="vs-statusbar">
        <div>
          <span className="status-brand">MP</span>
          <GitBranch />
          <span>main*</span>
          <span className="sync-icon">↻</span>
          <Check />
          <span>0</span>
          <X />
          <span>0</span>
        </div>
        <div>
          <span>Ln 28, Col 42</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>CRLF</span>
          <span>X++</span>
          <Bell />
        </div>
      </footer>

      <CommandDialog
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        title="MarcinP Command Palette"
        description="Open a portfolio file or run a command"
        className="vs-command-dialog"
      >
        <CommandInput placeholder="Type a command or file name..." />
        <CommandList>
          <CommandEmpty>No matching portfolio command.</CommandEmpty>
          <CommandGroup heading="Open file">
            {views.map((view) => (
              <CommandItem key={view.id} onSelect={() => openView(view.id)}>
                <FileGlyph type={view.icon} />
                <span>{view.filename}</span>
                <CommandShortcut>{view.label}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Run">
            <CommandItem
              onSelect={() => {
                setPaletteOpen(false);
                void runPortfolio();
              }}
            >
              <Play />
              <span>Build Portfolio Solution</span>
              <CommandShortcut>Ctrl+B</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </main>
  );
}
