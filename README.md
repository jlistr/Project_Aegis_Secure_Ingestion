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

## 📚 Using Cursor Cloud Agents for SaaS Development

This repository includes comprehensive guides on leveraging Cursor Cloud Agents throughout your SaaS startup journey:

### Guides Available

1. **[Cursor Cloud Agents SaaS Guide](./docs/cursor-cloud-agents-saas-guide.md)**
   - Complete overview of using agents for planning, research, proposals, sales, and architecture
   - Best practices and workflow examples

2. **[Agent Prompt Templates](./docs/agent-prompt-templates.md)**
   - Ready-to-use prompt templates for different SaaS phases
   - Copy-paste templates you can customize

3. **[Example Workflows](./docs/example-workflows.md)**
   - Step-by-step workflows for common SaaS tasks
   - End-to-end examples from idea to implementation

4. **[Project Aegis SaaS Expansion Example](./docs/aegis-saas-expansion-example.md)**
   - Practical example showing how to transform this project into a SaaS platform
   - Real-world application of agent workflows

### Quick Start

Want to use Cursor Cloud Agents for your SaaS idea? Start here:

1. **Planning & Strategy**: Use the [planning templates](./docs/agent-prompt-templates.md#planning--strategy-templates) to define your MVP
2. **Market Research**: Use the [research templates](./docs/agent-prompt-templates.md#research--market-analysis-templates) to analyze competitors
3. **Architecture Design**: Use the [architecture templates](./docs/agent-prompt-templates.md#design--architecture-templates) to design your system
4. **Sales Strategy**: Use the [sales templates](./docs/agent-prompt-templates.md#sales-strategy-templates) to develop your go-to-market plan

See the [Aegis SaaS Expansion Example](./docs/aegis-saas-expansion-example.md) for a complete walkthrough applying these concepts to this project.

---