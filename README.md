# Interactive Data Science Portfolio Dashboard

Website dashboard animasi interaktif untuk portfolio Data Analyst dan Data Scientist.

## Feature

- Hero section dengan motion reveal.
- Benchmark chart runtime algoritma (DP, Branch and Bound, Greedy) dengan toggle interaktif.
- Skill radar chart.
- Cadence chart dengan slider jendela analisis.
- Project explorer dengan search, domain filter, dan detail panel.
- Layout responsif desktop dan mobile.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy ke Vercel

1. Push folder ini ke repository GitHub.
2. Di Vercel pilih New Project lalu import repository.
3. Set Root Directory ke `portfolio-dashboard`.
4. Gunakan setting default Vite: Build Command `npm run build`, Output Directory `dist`.
5. Deploy.
