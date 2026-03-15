import { useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  DatabaseZap,
  Filter,
  Search,
  Sparkles,
} from "lucide-react";
import "./App.css";

const benchmarkData = [
  { inputSize: 10, dp: 0.028, bb: 0.00012, greedy: 0.000009 },
  { inputSize: 100, dp: 0.28, bb: 0.0028, greedy: 0.00005 },
  { inputSize: 1000, dp: 4.5, bb: 0.27, greedy: 0.00087 },
  { inputSize: 5000, dp: 16.5, bb: 1.12, greedy: 0.0042 },
  { inputSize: 10000, dp: 35.2, bb: 1.11, greedy: 0.0047 },
];

const releaseCadence = [
  { month: "Jan", experiments: 7, dashboards: 2 },
  { month: "Feb", experiments: 9, dashboards: 3 },
  { month: "Mar", experiments: 11, dashboards: 4 },
  { month: "Apr", experiments: 10, dashboards: 4 },
  { month: "Mei", experiments: 13, dashboards: 5 },
  { month: "Jun", experiments: 12, dashboards: 5 },
  { month: "Jul", experiments: 14, dashboards: 6 },
  { month: "Agu", experiments: 16, dashboards: 6 },
  { month: "Sep", experiments: 15, dashboards: 7 },
  { month: "Okt", experiments: 18, dashboards: 8 },
  { month: "Nov", experiments: 20, dashboards: 8 },
  { month: "Des", experiments: 19, dashboards: 9 },
];

const skillRadar = [
  { skill: "Python", score: 92 },
  { skill: "SQL", score: 89 },
  { skill: "ML Ops", score: 80 },
  { skill: "Statistik", score: 88 },
  { skill: "Storytelling", score: 90 },
  { skill: "Dashboarding", score: 86 },
];

const projects = [
  {
    id: 1,
    title: "Demand Forecasting Retail Nasional",
    domain: "forecasting",
    year: 2025,
    accuracy: 91.6,
    impactBillion: 1.8,
    summary:
      "Model forecasting mingguan untuk 240 SKU dengan penurunan stockout signifikan.",
    stack: ["Python", "XGBoost", "Power BI"],
    outcomes: ["Stockout turun 28%", "Lead time planning turun 2 hari"],
  },
  {
    id: 2,
    title: "Customer Churn Early Warning",
    domain: "classification",
    year: 2024,
    accuracy: 88.4,
    impactBillion: 1.1,
    summary:
      "Pipeline klasifikasi churn untuk subscription service dengan notifikasi otomatis tim CRM.",
    stack: ["Scikit-learn", "FastAPI", "PostgreSQL"],
    outcomes: ["Retensi naik 14%", "Precision alert 0.82"],
  },
  {
    id: 3,
    title: "NLP Ticket Prioritization Engine",
    domain: "nlp",
    year: 2025,
    accuracy: 90.1,
    impactBillion: 0.9,
    summary:
      "Klasifikasi tiket customer support berbasis NLP agar SLA kritikal lebih stabil.",
    stack: ["Transformers", "PyTorch", "Streamlit"],
    outcomes: ["SLA kritikal naik 21%", "Waktu triage turun 37%"],
  },
  {
    id: 4,
    title: "Computer Vision QC Detection",
    domain: "vision",
    year: 2024,
    accuracy: 93.2,
    impactBillion: 2.4,
    summary:
      "Deteksi cacat produk real-time pada lini manufaktur menggunakan vision model.",
    stack: ["OpenCV", "TensorFlow", "Kafka"],
    outcomes: ["Defect leakage turun 33%", "Reject manual turun 40%"],
  },
  {
    id: 5,
    title: "Knapsack Optimization Benchmark",
    domain: "optimization",
    year: 2026,
    accuracy: 95.0,
    impactBillion: 0.7,
    summary:
      "Eksperimen perbandingan Dynamic Programming, Branch and Bound, dan Greedy untuk kapasitas besar.",
    stack: ["Pandas", "Matplotlib", "Jupyter"],
    outcomes: [
      "Profil performa lengkap 5 skala input",
      "Insight trade-off runtime vs optimalitas",
    ],
  },
  {
    id: 6,
    title: "Executive KPI Command Board",
    domain: "dashboard",
    year: 2026,
    accuracy: 87.5,
    impactBillion: 1.3,
    summary:
      "Dashboard lintas divisi dengan drilldown granular untuk monitoring bisnis harian.",
    stack: ["dbt", "BigQuery", "Looker Studio"],
    outcomes: [
      "Waktu analisis bulanan turun 46%",
      "Adopsi dashboard 4 divisi inti",
    ],
  },
];

const domainOptions = [
  { id: "all", label: "Semua Domain" },
  { id: "forecasting", label: "Forecasting" },
  { id: "classification", label: "Classification" },
  { id: "nlp", label: "NLP" },
  { id: "vision", label: "Vision" },
  { id: "optimization", label: "Optimization" },
  { id: "dashboard", label: "Dashboard" },
];

const domainLabel = {
  forecasting: "Forecasting",
  classification: "Classification",
  nlp: "Natural Language Processing",
  vision: "Computer Vision",
  optimization: "Optimization",
  dashboard: "Business Dashboard",
};

const algorithmConfig = {
  dp: { label: "Dynamic Programming", color: "#0f766e" },
  bb: { label: "Branch and Bound", color: "#f97316" },
  greedy: { label: "Greedy", color: "#1d4ed8" },
};

const panelReveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const decimalFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const intFormatter = new Intl.NumberFormat("id-ID");

function formatSeconds(value) {
  if (value >= 1) {
    return `${value.toFixed(2)} s`;
  }

  if (value >= 0.01) {
    return `${value.toFixed(3)} s`;
  }

  return `${value.toExponential(1)} s`;
}

function App() {
  const [activeDomain, setActiveDomain] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [activeAlgorithms, setActiveAlgorithms] = useState([
    "dp",
    "bb",
    "greedy",
  ]);
  const [yAxisScale, setYAxisScale] = useState("log");
  const [timelineWindow, setTimelineWindow] = useState(6);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);

  const filteredProjects = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();

    return projects.filter((project) => {
      const matchDomain =
        activeDomain === "all" || project.domain === activeDomain;
      const haystack =
        `${project.title} ${project.summary} ${project.stack.join(" ")}`.toLowerCase();
      const matchSearch = !normalized || haystack.includes(normalized);
      return matchDomain && matchSearch;
    });
  }, [activeDomain, searchValue]);

  const selectedProject = useMemo(() => {
    return (
      filteredProjects.find((project) => project.id === selectedProjectId) ??
      filteredProjects[0] ??
      null
    );
  }, [filteredProjects, selectedProjectId]);

  const visibleCadence = useMemo(() => {
    return releaseCadence.slice(-timelineWindow);
  }, [timelineWindow]);

  const impactData = useMemo(() => {
    return filteredProjects.map((project) => ({
      name: project.title.split(" ").slice(0, 2).join(" "),
      impact: project.impactBillion,
    }));
  }, [filteredProjects]);

  const totalImpact = useMemo(() => {
    return filteredProjects.reduce(
      (sum, project) => sum + project.impactBillion,
      0,
    );
  }, [filteredProjects]);

  const averageAccuracy = useMemo(() => {
    if (filteredProjects.length === 0) {
      return 0;
    }

    const sum = filteredProjects.reduce(
      (acc, project) => acc + project.accuracy,
      0,
    );
    return sum / filteredProjects.length;
  }, [filteredProjects]);

  const experimentCount = useMemo(() => {
    return visibleCadence.reduce((sum, item) => sum + item.experiments, 0);
  }, [visibleCadence]);

  const statCards = [
    {
      title: "Project Aktif",
      value: intFormatter.format(filteredProjects.length),
      note: "Project yang cocok dengan filter saat ini",
      icon: DatabaseZap,
    },
    {
      title: "Rata-rata Akurasi",
      value: `${decimalFormatter.format(averageAccuracy)}%`,
      note: "Rata-rata metrik akurasi dari project terpilih",
      icon: BrainCircuit,
    },
    {
      title: "Estimasi Dampak",
      value: `Rp ${decimalFormatter.format(totalImpact)}B`,
      note: "Estimasi kontribusi dampak bisnis kumulatif",
      icon: BarChart3,
    },
    {
      title: "Eksperimen",
      value: intFormatter.format(experimentCount),
      note: `Total eksperimen dalam ${timelineWindow} bulan terakhir`,
      icon: Activity,
    },
  ];

  const toggleAlgorithm = (algorithm) => {
    setActiveAlgorithms((current) => {
      if (current.includes(algorithm)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((item) => item !== algorithm);
      }

      return [...current, algorithm];
    });
  };

  return (
    <div className="page-shell">
      <div className="mesh mesh-a" aria-hidden="true"></div>
      <div className="mesh mesh-b" aria-hidden="true"></div>

      <Motion.header
        className="hero-block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="eyebrow">
          <Sparkles size={16} />
          Tugas Akhir · Strategi Algoritma
        </p>
        <h1>Optimasi Pengiriman Logistik pada E-Commerce</h1>
        <p className="hero-subtitle">
          Menggunakan Algoritma Dynamic Programming, Branch and Bound, dan
          Greedy
        </p>
        <p className="hero-copy">
          Perbandingan performa tiga pendekatan algoritma optimasi dalam
          memecahkan masalah pengiriman logistik e-commerce — diukur dari waktu
          eksekusi, akurasi solusi, dan skalabilitas dataset.
        </p>
        <div className="hero-meta">
          <span>
            <BrainCircuit size={16} />
            Dynamic Programming · Branch and Bound · Greedy
          </span>
        </div>
      </Motion.header>

      <Motion.section
        className="stats-grid"
        variants={panelReveal}
        initial="hidden"
        animate="show"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Motion.article
              key={stat.title}
              className="stat-card"
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="stat-head">
                <Icon size={18} />
                <p>{stat.title}</p>
              </div>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-note">{stat.note}</p>
            </Motion.article>
          );
        })}
      </Motion.section>

      <Motion.section
        className="panel"
        variants={panelReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="panel-header">
          <div>
            <h2>Benchmark Runtime Knapsack</h2>
            <p>
              Bandingkan Dynamic Programming, Branch and Bound, dan Greedy pada
              berbagai ukuran input.
            </p>
          </div>
          <div
            className="scale-toggle"
            role="group"
            aria-label="Pilih skala sumbu Y"
          >
            <button
              type="button"
              className={yAxisScale === "log" ? "active" : ""}
              onClick={() => setYAxisScale("log")}
            >
              Log Scale
            </button>
            <button
              type="button"
              className={yAxisScale === "linear" ? "active" : ""}
              onClick={() => setYAxisScale("linear")}
            >
              Linear Scale
            </button>
          </div>
        </div>

        <div className="algorithm-toggle-row">
          {Object.entries(algorithmConfig).map(([key, value]) => (
            <button
              key={key}
              type="button"
              className={
                activeAlgorithms.includes(key) ? "chip active" : "chip"
              }
              onClick={() => toggleAlgorithm(key)}
            >
              <span
                className="chip-dot"
                style={{ backgroundColor: value.color }}
              ></span>
              {value.label}
            </button>
          ))}
        </div>

        <div className="chart-wrap chart-tall">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={benchmarkData}
              margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(148, 163, 184, 0.32)"
              />
              <XAxis
                dataKey="inputSize"
                tick={{ fill: "#334155", fontSize: 12 }}
              />
              <YAxis
                type="number"
                scale={yAxisScale}
                domain={yAxisScale === "log" ? [0.000001, "auto"] : [0, "auto"]}
                tick={{ fill: "#334155", fontSize: 12 }}
                tickFormatter={(value) =>
                  yAxisScale === "log"
                    ? `${Number(value).toExponential(0)}`
                    : `${Number(value).toFixed(2)}`
                }
              />
              <Tooltip
                formatter={(value, name) => [
                  formatSeconds(Number(value)),
                  name,
                ]}
                labelFormatter={(label) =>
                  `Input size: ${intFormatter.format(label)}`
                }
              />
              <Legend />
              {activeAlgorithms.includes("dp") && (
                <Line
                  type="monotone"
                  dataKey="dp"
                  name={algorithmConfig.dp.label}
                  stroke={algorithmConfig.dp.color}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )}
              {activeAlgorithms.includes("bb") && (
                <Line
                  type="monotone"
                  dataKey="bb"
                  name={algorithmConfig.bb.label}
                  stroke={algorithmConfig.bb.color}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )}
              {activeAlgorithms.includes("greedy") && (
                <Line
                  type="monotone"
                  dataKey="greedy"
                  name={algorithmConfig.greedy.label}
                  stroke={algorithmConfig.greedy.color}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Motion.section>

      <div className="split-grid">
        <Motion.section
          className="panel"
          variants={panelReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="panel-header">
            <div>
              <h2>Skill Matrix</h2>
              <p>
                Visualisasi kekuatan teknis utama untuk role Data Analyst dan
                Data Scientist.
              </p>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="rgba(148, 163, 184, 0.45)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#334155", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  tick={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Radar
                  dataKey="score"
                  name="Skill Score"
                  stroke="#0f766e"
                  fill="#14b8a6"
                  fillOpacity={0.35}
                />
                <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Motion.section>

        <Motion.section
          className="panel"
          variants={panelReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="panel-header">
            <div>
              <h2>Cadence Eksperimen</h2>
              <p>
                Lihat ritme eksperimen dan rilis dashboard dari waktu ke waktu.
              </p>
            </div>
          </div>
          <label className="range-label" htmlFor="windowRange">
            Jendela analisis: {timelineWindow} bulan terakhir
          </label>
          <input
            id="windowRange"
            type="range"
            min="3"
            max="12"
            value={timelineWindow}
            onChange={(event) => setTimelineWindow(Number(event.target.value))}
          />

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visibleCadence}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="experimentFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#0891b2" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="dashboardFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="rgba(148, 163, 184, 0.3)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#334155", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#334155", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="experiments"
                  name="Eksperimen"
                  stroke="#0891b2"
                  fill="url(#experimentFill)"
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  dataKey="dashboards"
                  name="Dashboard Publish"
                  stroke="#f97316"
                  fill="url(#dashboardFill)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Motion.section>
      </div>

      <Motion.section
        className="panel"
        variants={panelReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="panel-header">
          <div>
            <h2>Project Explorer</h2>
            <p>
              Pilih domain dan cari keyword untuk memfilter project secara
              real-time.
            </p>
          </div>
        </div>

        <div className="toolbar">
          <label className="search-box" htmlFor="projectSearch">
            <Search size={16} />
            <input
              id="projectSearch"
              type="text"
              placeholder="Cari project, tools, atau insight..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <div
            className="domain-filter"
            role="group"
            aria-label="Filter domain project"
          >
            <span>
              <Filter size={15} />
              Filter:
            </span>
            {domainOptions.map((domain) => (
              <button
                key={domain.id}
                type="button"
                className={
                  activeDomain === domain.id
                    ? "domain-chip active"
                    : "domain-chip"
                }
                onClick={() => setActiveDomain(domain.id)}
              >
                {domain.label}
              </button>
            ))}
          </div>
        </div>

        <div className="project-layout">
          <div
            className="project-list"
            role="listbox"
            aria-label="Daftar project"
          >
            {filteredProjects.length === 0 && (
              <p className="empty-state">
                Tidak ada project yang cocok. Coba ubah filter atau kata kunci.
              </p>
            )}

            {filteredProjects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={
                  selectedProject?.id === project.id
                    ? "project-card active"
                    : "project-card"
                }
                onClick={() => setSelectedProjectId(project.id)}
              >
                <div className="project-top">
                  <p>{domainLabel[project.domain]}</p>
                  <span>{project.year}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
                <div className="project-metrics">
                  <span>
                    Accuracy {decimalFormatter.format(project.accuracy)}%
                  </span>
                  <span>
                    Impact Rp {decimalFormatter.format(project.impactBillion)}B
                  </span>
                </div>
              </button>
            ))}
          </div>

          <aside className="project-detail">
            {selectedProject ? (
              <>
                <p className="detail-tag">Project Highlight</p>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.summary}</p>

                <div className="stack-row">
                  {selectedProject.stack.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>

                <div className="outcome-list">
                  {selectedProject.outcomes.map((outcome) => (
                    <p key={outcome}>- {outcome}</p>
                  ))}
                </div>

                <div className="chart-wrap chart-short">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={impactData}
                      margin={{ top: 10, right: 6, left: 0, bottom: 22 }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="rgba(148, 163, 184, 0.3)"
                      />
                      <XAxis
                        dataKey="name"
                        angle={-20}
                        height={44}
                        textAnchor="end"
                        tick={{ fill: "#334155", fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: "#334155", fontSize: 12 }} />
                      <Tooltip
                        formatter={(value) => [`Rp ${value}B`, "Impact"]}
                      />
                      <Bar
                        dataKey="impact"
                        fill="#0f766e"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="empty-state">
                Belum ada project untuk ditampilkan.
              </p>
            )}
          </aside>
        </div>
      </Motion.section>
    </div>
  );
}

export default App;
