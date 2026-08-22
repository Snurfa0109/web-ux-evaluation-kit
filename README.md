# 🚀 UX Eval Suite — Modern Web UX Research & Usability Testing Platform

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-5A67D8?logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Compatible-4479A1?logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A full-stack, 3-phase research platform designed for Usability & User Experience (UX) evaluation of web portals, interactive prototypes, and public digital services. Built with Next.js 16 (App Router), TypeScript, Prisma ORM, and NextAuth.js.

---

## 🎯 Research Methodology & Supported Instruments

The platform organizes usability testing into three standardized research phases:

1. **Phase 01 — System Usability Scale (SUS)**
   - 10-item benchmark Likert scale (0–100 formula).
   - Baseline usability measurement for existing live websites.
   - Qualitative feedback items for identifying feature friction.

2. **Phase 02 — User Experience Questionnaire (UEQ)**
   - 26-item semantic differential scale measuring 6 UX dimensions:
     - *Attractiveness*, *Perspicuity*, *Efficiency*, *Dependability*, *Stimulation*, and *Novelty*.
   - Evaluates interactive redesign prototypes (Figma / Web embeds).
   - **Automated Schrepp UEQ Benchmark Classification** (*Excellent*, *Good*, *Above Average*, *Below Average*, *Bad*).

3. **Phase 03 — User Acceptance Testing (UAT)**
   - Scenario-based task completion rate (%) and **Time-on-Task (seconds)** tracking.
   - 5-item overall system acceptance evaluation & final qualitative feedback.

---

## ✨ Key Features

- 💻 **Split-View Testing Workspace**: Test target websites or prototypes inside an interactive iframe side-by-side with task scenario cards and embedded questionnaires.
- ⏱️ **Time-on-Task Stopwatch**: Automated background measurement of task completion duration for ISO 9241-11 efficiency analysis.
- 📊 **Research Admin Dashboard**: Live tracking of participant completion status, longitudinal analytics, qualitative feedback summaries, and Excel dataset export (.xlsx).
- 📲 **QR Code & Share Utilities**: Instant QR code generation and WhatsApp share invitation links for quick participant onboarding.
- 📱 **Mobile-Responsive UI**: Touch-optimized rating buttons, responsive scale grids, and mobile navigation drawer.
- 🔐 **Admin Security & Data Control**: NextAuth session protection, spam participant deletion, and one-click clean-slate data reset.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database ORM**: Prisma (MySQL / SQLite compatible)
- **Authentication**: NextAuth.js
- **Exporting**: ExcelJS (Spreadsheet export)
- **Styling**: Modern Vanilla CSS Design Tokens (Responsive, Glassmorphism, Micro-animations)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MySQL Database**: Local (XAMPP / MySQL Workbench) or Cloud (TiDB / Aiven / Railway)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Snurfa0109/web-ux-evaluation-kit.git
   cd web-ux-evaluation-kit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/web_evaluasi"
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Netlify Deployment Guide

1. Push your repository to GitHub.
2. Connect your repository on [Netlify](https://app.netlify.com/).
3. Set **Build Settings**:
   - **Build Command**: `npx prisma generate && next build`
   - **Publish Directory**: `.next`
4. Add **Environment Variables** in Netlify Site Settings:
   - `DATABASE_URL`: Your production Cloud MySQL connection string.
   - `NEXTAUTH_SECRET`: Random 32+ character secret string.
   - `NEXTAUTH_URL`: Your deployed Netlify site URL (e.g. `https://your-app.netlify.app`).

---

## 📜 License

This project is licensed under the MIT License — feel free to use it for research, academic, or commercial projects.
