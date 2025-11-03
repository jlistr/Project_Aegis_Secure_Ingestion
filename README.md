# Project Aegis – Secure Locate Request Ingestion (Node.js + GitHub Codespaces)

## 🧠 Overview
This package provides:
- Secure **Express webhook API** for Texas 811 locate requests.
- **Test sender** that simulates Texas 811.
- **Codespaces isolation script** for scanning npm packages before use.
- **GitHub Actions workflow** for behavioral scanning (Socket.dev), vulnerability scanning (Snyk), and publishing safe packages to **GitHub Packages**.

---

## 🔐 Secrets & Tokens – What, Where, and When

| Name | Where to Create | When to Create | Purpose | Example Command |
|------|-----------------|----------------|----------|----------------|
| **WEBHOOK_SECRET** | Codespaces environment variable | Before starting the API | Shared HMAC key between API and TX811 test sender | `export WEBHOOK_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")` |
| **SNYK_TOKEN** | GitHub → Repo → Settings → Secrets → Actions | Before running workflow | Enables Snyk CVE scans | Obtain from Snyk Dashboard |
| **SOCKET_API_KEY** | GitHub → Repo → Settings → Secrets → Actions | Before running workflow | Enables Socket.dev behavioral scan | Get from Socket.dev |
| **GITHUB_PACKAGES_TOKEN** | GitHub → Settings → Developer settings → PAT | After workflow passes | Allows Codespaces to `npm install` from GitHub Packages | Scopes: `read:packages`, `repo` |

> `GITHUB_TOKEN` is built into GitHub Actions — no need to create it manually.

---

## 🧩 Step-by-Step: Running in GitHub Codespaces

### 1️⃣ Open in Codespaces
- Go to your repo → **Code → Codespaces → Create codespace on main**.

### 2️⃣ Generate a development secret
```bash
export WEBHOOK_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

### 3️⃣ Isolate & scan npm package (safe local scan)
```bash
chmod +x scripts/isolate_and_scan.sh
./scripts/isolate_and_scan.sh express
```

### 4️⃣ Commit and push workflow
```bash
git add .github/workflows/scan_and_publish_express.yml scripts/isolate_and_scan.sh
git commit -m "Add scan workflow and isolation script"
git push
```

### 5️⃣ Add repository secrets
In GitHub → **Settings → Secrets and variables → Actions**:
- Add `SNYK_TOKEN`
- Add `SOCKET_API_KEY`

### 6️⃣ Run GitHub Action
Go to **Actions → Scan (Socket.dev + Snyk) and Publish Express → Run workflow**.

### 7️⃣ Configure Codespaces to use GitHub Packages
```bash
export GITHUB_PACKAGES_TOKEN=<your_pat_here>
echo "//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}" >> ~/.npmrc
npm config set @<OWNER>:registry https://npm.pkg.github.com/
```

### 8️⃣ Install approved package
```bash
npm install @<OWNER>/express
WEBHOOK_SECRET=$WEBHOOK_SECRET npm start
```

### 9️⃣ Simulate TX811 webhook
```bash
WEBHOOK_SECRET=$WEBHOOK_SECRET node src/tests/send_test_locate.js
```
✅ Expected result:
```
Status: 200
Response: {"success":true,"ticket":"TX811-POC-001"}
```

---

## 🛡️ Best Practices
- Never commit secrets or tokens to git.
- Rotate all tokens regularly.
- Always use `--ignore-scripts` during isolation.
- Socket.dev = behavioral scan; Snyk = CVE scan.
- GitHub Packages = trusted internal registry.

---

## 🤖 SaaS Development with Cursor Cloud Agents

**NEW!** Comprehensive guides for building your SaaS startup with AI assistance:

### 📚 Documentation

1. **[Complete Lifecycle Guide](docs/cursor-cloud-agents-saas-startup-guide.md)** (65+ pages)
   - Phase 1: Market Research & Planning
   - Phase 2: Business Proposals & Pitch Creation
   - Phase 3: Sales Strategy Development
   - Phase 4: System Architecture & Design
   - Phase 5: Implementation & Development

2. **[Practical Workflows](docs/example-workflows.md)** (30+ pages)
   - Scenario 1: Investor Meeting Prep (4 hours)
   - Scenario 2: MVP Development (2 weeks)
   - Scenario 3: First Sales Call (3 hours)
   - Scenario 4: Emergency Bug Fix (30 minutes)
   - Scenario 5: Scaling Strategy (Next Quarter)

3. **[Quick Start Summary](CURSOR-AGENTS-SUMMARY.md)**
   - Overview of all capabilities
   - Example commands to get started
   - Recommended next steps

### 🚀 What You'll Learn

Using **Project Aegis** as a real-world example, these guides show you how to:
- ✅ Research markets and validate SaaS ideas (days → hours)
- ✅ Create investor pitch decks and proposals (weeks → minutes)
- ✅ Develop sales strategies and GTM plans (instant)
- ✅ Design scalable technical architectures (automated)
- ✅ Accelerate feature development (50-70% faster)

### 💡 Quick Examples

**For Business Development:**
```
"Create an investor pitch deck for Project Aegis"
"Generate 20 cold email templates for utility companies"
"Build an ROI calculator for customers"
```

**For Technical Implementation:**
```
"Implement the risk calculation API with ML integration"
"Create a Next.js dashboard showing risk scores"
"Design multi-tenant SaaS architecture for AWS"
```

**For Strategic Planning:**
```
"Create a 12-week MVP development roadmap"
"Design infrastructure scaling plan for 100K requests/month"
"Develop customer onboarding process"
```

### 🎯 Market Opportunity

**Project Aegis** addresses a $12B market:
- 80M+ locate requests annually in the US
- 500K+ damage incidents per year
- Average damage cost: $75,000
- Total industry damage costs: $37.5B/year

**Target customers:** Utility companies, locate service providers, excavation companies

**Competitive advantage:** First ML-powered predictive damage prevention platform

---

## 📖 Additional Resources

- **ML Guide**: [Utility Damage Prevention ML System](docs/utility-damage-prevention-ml-guide.md)
- **Original Documentation**: Technical setup and security practices (above)
- **Cursor Agents Guides**: Business and development acceleration (new!)

---