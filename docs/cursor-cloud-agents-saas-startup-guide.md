# Using Cursor Cloud Agents for SaaS Startup Lifecycle

## Overview

This guide demonstrates how to leverage Cursor Cloud Agents (background agents) to accelerate your SaaS startup journey across planning, research, proposal creation, sales strategy, and technical architecture.

**Your Current Context:** Project Aegis - Utility Locate Damage Prevention ML System

---

## Table of Contents

1. [Agent Capabilities Overview](#agent-capabilities-overview)
2. [Phase 1: Planning & Ideation](#phase-1-planning--ideation)
3. [Phase 2: Market Research & Validation](#phase-2-market-research--validation)
4. [Phase 3: Proposal & Pitch Creation](#phase-3-proposal--pitch-creation)
5. [Phase 4: Sales Strategy Development](#phase-4-sales-strategy-development)
6. [Phase 5: Technical Architecture & Design](#phase-5-technical-architecture--design)
7. [Best Practices & Workflows](#best-practices--workflows)
8. [Example Prompts by Phase](#example-prompts-by-phase)

---

## Agent Capabilities Overview

### What Cursor Cloud Agents Can Do

? **Code Generation & Refactoring**
- Generate complete implementations from specifications
- Refactor existing code for better architecture
- Create tests, documentation, and API designs

? **Research & Analysis**
- Analyze codebases and dependencies
- Research best practices and patterns
- Compare technology options

? **Documentation & Communication**
- Write technical documentation
- Create proposals and pitches
- Generate diagrams and specifications

? **Architecture & Design**
- Design system architectures
- Create component specifications
- Plan data models and API contracts

? **Multi-Step Execution**
- Break down complex tasks into steps
- Execute multiple file changes atomically
- Manage dependencies between changes

### How Agents Work Best

1. **Provide Context**: Open relevant files, share domain knowledge
2. **Be Specific**: Clearly define goals and constraints
3. **Iterate**: Build incrementally, refine based on results
4. **Review**: Agents generate code/docs, you validate and adjust

---

## Phase 1: Planning & Ideation

### Use Case: Market Opportunity Analysis

**Agent Prompt Example:**
```
I'm building a SaaS product for utility damage prevention using ML. 
Help me create a comprehensive market analysis document that includes:
1. Target market size (TAM/SAM/SOM)
2. Competitor analysis
3. Pricing strategy options
4. Go-to-market timeline
5. Risk assessment

Base this on the utility locating industry in North America, 
focusing on the damage prevention use case I've documented.
```

**What the Agent Will Do:**
- Research industry data and statistics
- Create structured analysis documents
- Generate competitor comparison tables
- Propose pricing models based on market research
- Create planning templates

**Deliverables:**
- `docs/market-analysis.md`
- `docs/competitor-analysis.md`
- `docs/pricing-strategy.md`
- `docs/go-to-market-plan.md`

### Use Case: Product Roadmap Planning

**Agent Prompt Example:**
```
Create a product roadmap for Project Aegis that covers:
- MVP features (3 months)
- Growth features (6-12 months)
- Scale features (12+ months)

Include technical dependencies, user value, and 
business impact for each feature. Reference my existing 
ML guide and current API implementation.
```

**What the Agent Will Do:**
- Analyze existing codebase and documentation
- Create prioritized feature lists
- Generate timeline estimates
- Identify technical dependencies
- Create roadmap visualizations (markdown tables/diagrams)

---

## Phase 2: Market Research & Validation

### Use Case: Customer Research & Personas

**Agent Prompt Example:**
```
Based on Project Aegis (utility damage prevention ML system),
create detailed customer personas including:
1. Utility owner/operators
2. Locate companies
3. Excavators
4. Regulatory bodies

For each persona, include:
- Pain points our solution addresses
- Decision-making criteria
- Budget considerations
- Technical requirements
- Communication preferences
```

**What the Agent Will Do:**
- Research industry roles and responsibilities
- Create persona templates with realistic profiles
- Map pain points to solution features
- Generate interview question templates
- Create validation survey questions

**Deliverables:**
- `docs/customer-personas.md`
- `docs/customer-interview-guide.md`
- `docs/validation-survey.md`

### Use Case: Technical Feasibility Research

**Agent Prompt Example:**
```
Research and compare technology options for Project Aegis:
1. ML model deployment options (SageMaker, Vertex AI, custom)
2. Real-time API architectures (serverless vs containers)
3. Data pipeline tools (Airflow, Prefect, custom)
4. Database options for time-series risk data

Create a comparison matrix with pros/cons, costs, 
and recommendations for each option.
```

**What the Agent Will Do:**
- Research and compare technologies
- Create comparison matrices
- Provide cost estimates
- Generate architecture recommendations
- Create proof-of-concept code examples

---

## Phase 3: Proposal & Pitch Creation

### Use Case: Investor Pitch Deck

**Agent Prompt Example:**
```
Create an investor pitch deck outline for Project Aegis.
Include slides for:
1. Problem statement
2. Solution overview
3. Market opportunity
4. Business model
5. Go-to-market strategy
6. Traction/milestones
7. Financial projections
8. Team & ask

Reference my ML guide and existing technical documentation.
Make it compelling and data-driven.
```

**What the Agent Will Do:**
- Structure comprehensive pitch deck
- Generate slide content with talking points
- Create financial projection templates
- Generate visual content descriptions
- Provide presentation tips

**Deliverables:**
- `docs/investor-pitch-deck.md`
- `docs/financial-projections.md`
- `docs/pitch-presentation-guide.md`

### Use Case: Customer Proposal Template

**Agent Prompt Example:**
```
Create a customer proposal template for Project Aegis 
targeting utility companies. Include:
1. Executive summary
2. Problem statement specific to their industry
3. Solution overview with ROI calculator
4. Implementation timeline
5. Pricing options
6. Success metrics and KPIs
7. Next steps

Make it customizable with placeholders for company-specific data.
```

**What the Agent Will Do:**
- Create professional proposal structure
- Generate ROI calculation examples
- Create customizable templates
- Generate case study frameworks
- Provide sales enablement content

**Deliverables:**
- `docs/customer-proposal-template.md`
- `docs/roi-calculator-guide.md`
- `docs/case-study-template.md`

---

## Phase 4: Sales Strategy Development

### Use Case: Sales Playbook Creation

**Agent Prompt Example:**
```
Create a comprehensive sales playbook for Project Aegis that includes:
1. Ideal customer profile (ICP)
2. Lead qualification framework (BANT or similar)
3. Discovery questions by persona
4. Objection handling guide
5. Demo script and flow
6. Closing strategies
7. Pricing negotiation tactics

Reference my technical documentation and customer personas.
```

**What the Agent Will Do:**
- Create structured sales documentation
- Generate qualification frameworks
- Create objection handling scripts
- Design demo flows
- Generate email templates

**Deliverables:**
- `docs/sales-playbook.md`
- `docs/demo-script.md`
- `docs/objection-handling.md`
- `docs/sales-email-templates.md`

### Use Case: Pricing Strategy Development

**Agent Prompt Example:**
```
Develop a comprehensive pricing strategy for Project Aegis:
1. Analyze value-based pricing vs cost-plus vs competitive
2. Create tiered pricing models (Starter/Pro/Enterprise)
3. Design usage-based pricing options
4. Calculate unit economics and margins
5. Create pricing decision framework
6. Generate customer-facing pricing pages

Consider the B2B SaaS model targeting utility companies.
```

**What the Agent Will Do:**
- Research pricing strategies
- Create pricing model calculations
- Generate pricing page content
- Create negotiation frameworks
- Provide pricing psychology insights

---

## Phase 5: Technical Architecture & Design

### Use Case: System Architecture Design

**Agent Prompt Example:**
```
Design the complete system architecture for Project Aegis production deployment:
1. High-level system diagram
2. Component breakdown (API, ML service, data pipeline, storage)
3. Data flow architecture
4. Security architecture
5. Scalability and reliability patterns
6. Infrastructure as code (Terraform/CloudFormation)
7. CI/CD pipeline design

Reference my existing Express API and ML guide. 
Design for AWS/Azure/GCP deployment.
```

**What the Agent Will Do:**
- Generate architecture diagrams (mermaid/text-based)
- Create component specifications
- Design data models and schemas
- Generate infrastructure code
- Create deployment guides

**Deliverables:**
- `docs/system-architecture.md`
- `docs/data-models.md`
- `infrastructure/terraform/` or `infrastructure/cloudformation/`
- `docs/deployment-guide.md`

### Use Case: API Design & Documentation

**Agent Prompt Example:**
```
Design and document a complete REST API for Project Aegis:
1. API endpoints for risk scoring, data ingestion, reporting
2. Request/response schemas
3. Authentication and authorization
4. Rate limiting and quotas
5. Error handling
6. Versioning strategy
7. OpenAPI/Swagger specification

Extend my existing Express API to support the full ML workflow.
```

**What the Agent Will Do:**
- Design API endpoints
- Generate OpenAPI specifications
- Create request/response examples
- Generate API client libraries
- Create integration guides

**Deliverables:**
- `docs/api-specification.md`
- `api/openapi.yaml`
- `docs/api-integration-guide.md`
- `clients/` (SDK examples)

### Use Case: Database Schema Design

**Agent Prompt Example:**
```
Design database schemas for Project Aegis covering:
1. Locate requests and metadata
2. ML model predictions and scores
3. Damage incidents and outcomes
4. User accounts and organizations
5. Audit logs and analytics
6. Feature stores for ML

Create ER diagrams, migration scripts, and query optimization strategies.
Consider PostgreSQL as the primary database.
```

**What the Agent Will Do:**
- Design normalized schemas
- Generate ER diagrams
- Create migration scripts
- Design indexes and optimizations
- Generate data access layer code

**Deliverables:**
- `docs/database-schema.md`
- `database/migrations/`
- `database/seeds/`
- `src/models/` (data access layer)

### Use Case: Frontend Architecture

**Agent Prompt Example:**
```
Design the frontend architecture for Project Aegis dashboard:
1. Component structure and hierarchy
2. State management approach
3. Routing and navigation
4. API integration layer
5. Real-time updates (WebSockets/polling)
6. Responsive design system
7. Accessibility considerations

Choose modern React/Next.js stack. Create component specifications.
```

**What the Agent Will Do:**
- Design component architecture
- Generate component specifications
- Create routing structures
- Design state management patterns
- Generate starter code and templates

**Deliverables:**
- `docs/frontend-architecture.md`
- `frontend/src/components/` (specifications)
- `frontend/src/routes/`
- `docs/design-system.md`

---

## Best Practices & Workflows

### Effective Agent Collaboration Patterns

#### 1. Iterative Refinement
```
Round 1: "Create initial architecture proposal"
Round 2: "Refine based on these constraints: [specific requirements]"
Round 3: "Optimize for these performance targets: [metrics]"
```

#### 2. Context-Rich Prompts
**Good:**
```
"I need a scalable ML API architecture. Here's my current Express.js API 
[reference file], my ML guide [reference file], and my requirements:
- Handle 1000 requests/minute
- 99.9% uptime
- Cost-effective for startup
- Easy to deploy and maintain"
```

**Less Effective:**
```
"Design an API"
```

#### 3. Phased Execution
Break large tasks into phases:
```
Phase 1: "Create high-level architecture proposal"
Phase 2: "Design core API endpoints"
Phase 3: "Create database schemas"
Phase 4: "Generate infrastructure code"
```

#### 4. Documentation-First Approach
Ask agents to create documentation before implementation:
```
"First, create a detailed technical specification document for [feature].
Then, implement it according to the spec."
```

### Workflow Templates

#### Planning Session Workflow
1. **Open relevant files** ? Share context with agent
2. **Define goals** ? "Create [deliverable] for [purpose]"
3. **Review output** ? Validate and provide feedback
4. **Iterate** ? Refine based on requirements
5. **Finalize** ? Commit and share with team

#### Research Workflow
1. **Question formulation** ? "Research [topic] comparing [options]"
2. **Analysis request** ? "Create comparison matrix with pros/cons"
3. **Recommendation** ? "Based on research, recommend [decision]"
4. **Documentation** ? "Create decision document with rationale"

#### Architecture Design Workflow
1. **Requirements gathering** ? "Design [system] with requirements: [list]"
2. **Component breakdown** ? "Break down into components: [list]"
3. **Implementation planning** ? "Create implementation plan for [component]"
4. **Code generation** ? "Generate code for [component] following [spec]"

---

## Example Prompts by Phase

### Planning Phase Prompts

```
"Create a business model canvas for Project Aegis based on my 
utility damage prevention ML solution. Fill in all sections 
with realistic assumptions."
```

```
"Generate a SWOT analysis for Project Aegis in the utility 
damage prevention market. Reference my ML guide and consider 
competitors, market conditions, and technical capabilities."
```

```
"Create a 12-month execution plan with quarterly milestones 
for Project Aegis. Include product development, sales, marketing, 
and operations milestones."
```

### Research Phase Prompts

```
"Research the top 5 competitors in utility damage prevention 
software. Create a comparison table with features, pricing, 
target customers, and differentiators."
```

```
"Analyze the regulatory landscape for utility damage prevention 
in North America. Identify compliance requirements and 
certifications needed for Project Aegis."
```

```
"Research best practices for ML model deployment in production 
B2B SaaS applications. Create a guide comparing approaches 
for real-time inference at scale."
```

### Proposal Phase Prompts

```
"Create a one-page executive summary for Project Aegis targeting 
C-level executives at utility companies. Focus on ROI and 
risk reduction."
```

```
"Generate a technical proposal for Project Aegis integration 
with existing locate management systems. Include API specifications, 
security requirements, and implementation timeline."
```

```
"Create a demo script for Project Aegis that shows the ML risk 
scoring in action. Include talking points, demo data scenarios, 
and handling of common questions."
```

### Sales Strategy Prompts

```
"Create a lead scoring model for Project Aegis that identifies 
high-value prospects. Include scoring criteria, weights, and 
qualification thresholds."
```

```
"Develop a sales objection handling guide for Project Aegis 
covering common concerns: cost, implementation complexity, 
data security, and ROI uncertainty."
```

```
"Create email sequences for Project Aegis sales outreach: 
cold outreach, follow-up, demo invitation, and proposal follow-up. 
Personalize for utility company personas."
```

### Architecture Phase Prompts

```
"Design a microservices architecture for Project Aegis with 
separate services for: API gateway, risk scoring, data ingestion, 
reporting, and user management. Include service communication patterns."
```

```
"Create a data pipeline architecture for Project Aegis that 
processes locate requests, runs ML inference, stores results, 
and updates dashboards in real-time. Include error handling 
and monitoring."
```

```
"Design a security architecture for Project Aegis covering: 
authentication (OAuth2/SAML), data encryption (at rest and 
in transit), API security, and compliance (SOC2, HIPAA if needed)."
```

---

## Quick Start: Your First Agent Session

### Step 1: Set Up Context
Open or create files that represent your current state:
- Your ML guide (`docs/utility-damage-prevention-ml-guide.md`)
- Your API code (`src/Index.js`)
- Your project README

### Step 2: Choose Your Phase
Pick one phase to start:
- **Planning?** ? Ask for market analysis or roadmap
- **Research?** ? Ask for competitor analysis or technical comparison
- **Proposal?** ? Ask for pitch deck or customer proposal
- **Sales?** ? Ask for sales playbook or pricing strategy
- **Architecture?** ? Ask for system design or API specification

### Step 3: Craft Your Prompt
Use this template:
```
[Context: Reference your files]
[Goal: What you want to create]
[Requirements: Specific constraints or preferences]
[Output format: Document, code, diagram, etc.]
```

### Step 4: Iterate
Review the agent's output and refine:
- "Add more detail on [topic]"
- "Adjust for [constraint]"
- "Create a visual diagram for [concept]"
- "Generate code implementation for [component]"

---

## Advanced Techniques

### Multi-Agent Coordination

You can use agents sequentially to build comprehensive deliverables:

```
Session 1: "Create market research document"
Session 2: "Based on market research, create product roadmap"
Session 3: "Based on roadmap, design technical architecture"
Session 4: "Based on architecture, create implementation plan"
```

### Reference-Driven Development

Keep agents aligned with your vision:

```
"Reference the architecture document I created earlier 
[link to doc] and generate the API implementation code."
```

### Validation & Review

Ask agents to review their own work:

```
"Review this architecture design [content] and identify 
potential issues, missing components, or optimization opportunities."
```

---

## Tips for Maximum Effectiveness

### ? Do's

- **Provide full context**: Open relevant files before asking questions
- **Be specific**: Include constraints, requirements, and preferences
- **Break down complex tasks**: Divide into smaller, manageable prompts
- **Reference previous work**: Link to earlier agent outputs
- **Iterate**: Refine outputs through multiple rounds
- **Validate**: Review and test agent-generated code/docs

### ? Don'ts

- **Don't assume context**: Explicitly reference files and knowledge
- **Don't ask for everything at once**: Break complex requests into phases
- **Don't skip review**: Always validate agent outputs
- **Don't ignore errors**: Fix issues before building on top
- **Don't skip documentation**: Document decisions and rationale

---

## Next Steps

1. **Choose your starting phase** (Planning, Research, Proposal, Sales, or Architecture)
2. **Prepare your context** (open relevant files, gather requirements)
3. **Craft your first prompt** using the templates above
4. **Iterate and refine** based on results
5. **Build incrementally** toward your SaaS launch

---

## Example: Complete Workflow

Here's how you might use agents for Project Aegis:

### Week 1: Planning
```
Prompt: "Create a comprehensive market analysis for Project Aegis 
targeting utility damage prevention. Include TAM/SAM/SOM, competitor 
analysis, and pricing strategy recommendations."
```

### Week 2: Research
```
Prompt: "Research ML deployment platforms (SageMaker, Vertex AI, 
custom) and create a comparison for Project Aegis. Consider cost, 
scalability, and integration complexity."
```

### Week 3: Proposal
```
Prompt: "Create an investor pitch deck for Project Aegis. Reference 
my market analysis and ML guide. Include 10 slides with talking points."
```

### Week 4: Sales Strategy
```
Prompt: "Develop a sales playbook for Project Aegis targeting utility 
companies. Include ICP, qualification framework, discovery questions, 
and objection handling."
```

### Week 5: Architecture
```
Prompt: "Design the production system architecture for Project Aegis. 
Include API design, ML service architecture, data pipeline, and 
infrastructure. Generate Terraform code for AWS deployment."
```

---

*Document created: 2025-01-27*
*Last updated: 2025-01-27*
*Version: 1.0*
