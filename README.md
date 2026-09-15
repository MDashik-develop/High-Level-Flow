# 🚀 HighLevel Flow — AI-Powered Agency OS & CRM Automation Platform

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 13" />
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Node.js-Microservice-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js AI Service" />
</p>

---

## 📌 Overview

**HighLevel Flow** is an all-in-one AI-driven Agency Automation, Lead Intelligence, and CRM Platform (inspired by GoHighLevel). It empowers digital marketing agencies, consultants, and SaaS businesses to crawl prospective client websites, perform 2026 AI conversion audits, generate personalized cold outreach pitches, convert audit leads directly into CRM deals, build visual marketing funnels, and automate customer conversations.

---

## 🔥 Key Modules & Features

### 🌐 1. Website Intelligence & Deep AI 2026 Audit
* **Automated Web Crawler**: Scrapes target domain HTML, page titles, meta descriptions, detected services, tech stack, and contact emails/phones/socials.
* **3-Point Agency Assessment**:
  * **১. কি কি কম আছে (Website Gaps)**: Identifies conversion bottlenecks (e.g., missing 24/7 AI Receptionist, floating CTA, SMS auto-responders).
  * **২. কি কি আরো Add করা যাবে (Growth Additions)**: Lists high-ROI agency upsells tailored to the client's niche.
  * **৩. Redesign Feasibility & Funnel Blueprint**: Provides a 4-step conversion-focused redesign roadmap.
* **AI Cold Outreach Pitch Generator**: Generates high-converting, personalized cold email/SMS scripts with support for custom prompt instructions and quick preset chips.
* **1-Click Lead Conversion**: Automatically converts crawled audit data into a CRM contact with an estimated deal value (e.g., $1,500).
* **Export & JSON Data**: Copy or download structured JSON audit reports with one click.

---

### 🤖 2. Multi-Provider AI Architecture
HighLevel Flow includes a flexible AI architecture featuring **direct HTTP 200 OK JSON API endpoints** (eliminating 302/303 browser redirects):

* **🤗 Hugging Face Inference Engine**: Connects via Hugging Face Serverless Router API with support for models like `meta-llama/Llama-3.1-8B-Instruct`. Features robust header preservation across load-balancer redirects.
* **⚡ OpenAI Integration**: Native support for `gpt-4o` and `gpt-3.5-turbo` models.
* **🟢 Standalone Node.js Microservice**: Standalone Express.js AI microservice located in `ai-service/server.js` listening on port `3001` for direct JavaScript/React calls.
* **🛡️ Local Simulator Fallback**: Built-in simulator mode to ensure full system functionality even when offline or without external API tokens.

---

### 👥 3. CRM & Contact Management
* Comprehensive contact records with contact details, company information, lead scores, tags, and notes.
* Instant conversion from website audit crawler into active CRM contacts.

---

### 📈 4. Opportunity Pipelines & Kanban Board
* Visual drag-and-drop Kanban board for managing deals across sales pipeline stages.
* Deal tracking with revenue projection, status updates, and stage transition triggers.

---

### 💬 5. Unified Conversations
* Centralized inbox consolidating SMS, Email, WhatsApp, and AI Chatbot conversations into a single timeline.

---

### ⚡ 6. Visual Workflow & Automation Builder
* Node-based visual automation workflow editor powered by `@xyflow/react`.
* Create triggers, conditional branching, automated SMS/Email sequences, and AI voice concierge routing.

---

### 🎨 7. Funnel & Page Builder
* Drag-and-drop landing page and sales funnel builder powered by GrapesJS.
* Build high-converting agency templates, lead capture pages, and appointment booking funnels.

---

### ⚙️ 8. Integration & AI Settings
* Manage provider credentials, select default AI models, set sandbox/production modes, and run real-time API connection tests.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | PHP 8.4+, Laravel 13.x |
| **Frontend SPA** | Inertia.js 2.0 (React 19 + TypeScript) |
| **Styling & UI** | Tailwind CSS v4, Lucide React, Clsx, Tailwind Merge |
| **Data Visualizations** | Chart.js, React-ChartJS-2 |
| **Workflow Builder** | `@xyflow/react` (React Flow) |
| **Funnel Builder** | GrapesJS |
| **AI Microservice** | Node.js, Express.js, Axios |
| **Web Scraping** | Symfony DOM Crawler |
| **Code Formatter & Quality** | Laravel Pint, PHPUnit, Laravel Boost |

---

## 🚀 Getting Started

### Prerequisites
* **PHP**: 8.3 or 8.4+
* **Composer**: 2.x+
* **Node.js**: 20.x+
* **Database**: SQLite (default) or MySQL / PostgreSQL

---

### 💻 Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MDashik-develop/High-Level-Flow.git
   cd High-Level-Flow
   ```

2. **Install PHP Dependencies**:
   ```bash
   composer install
   ```

3. **Install Node.js Dependencies**:
   ```bash
   npm install
   ```

4. **Set Up Environment**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Run Database Migrations & Seeders**:
   ```bash
   php artisan migrate --seed
   ```

6. **Build Frontend Assets**:
   ```bash
   npm run build
   ```

7. **Start Application**:
   * Option A (Laravel Dev Server + Vite):
     ```bash
     composer run dev
     ```
   * Option B (Manual background processes):
     ```bash
     php artisan serve
     npm run dev
     ```

8. **(Optional) Start Standalone Node.js AI Service**:
   ```bash
   node ai-service/server.js
   ```

Access the platform in your browser at: `http://127.0.0.1:8000`

---

## 📡 Key API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/ai/test-connection` | `POST` | Tests connection to active AI provider (Hugging Face, OpenAI, or Simulator). Returns `200 OK` JSON. |
| `/api/ai/generate-pitch` | `POST` | Generates personalized cold outreach pitch for a given audit ID and custom prompt. Returns `200 OK` JSON. |
| `/api/ai/run-audit` | `POST` | Executes 2026 Deep AI Audit and updates redesign assessment data live. Returns `200 OK` JSON. |
| `http://localhost:3001/api/ai/generate` | `POST` | Standalone Node.js AI microservice endpoint for external AI completions. |

---

## 🎨 Code Style & Quality

* **PHP Formatting**: Standardized using Laravel Pint.
  ```bash
  vendor/bin/pint
  ```
* **Testing**: Run test suites using PHPUnit.
  ```bash
  php artisan test
  ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
