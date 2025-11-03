# Project Aegis: SaaS Expansion Example

This document demonstrates how to use Cursor Cloud Agents to transform Project Aegis from a single-tenant webhook API into a multi-tenant SaaS platform.

---

## Current State Analysis

**Project Aegis** currently provides:
- Secure Express webhook API for Texas 811 locate requests
- HMAC signature verification
- Rate limiting and security middleware
- Test sender for simulation

**Goal**: Transform into a multi-tenant SaaS platform serving multiple 811 organizations, utilities, and construction companies.

---

## Workflow: End-to-End SaaS Planning

### Phase 1: Market Research & Competitive Analysis

#### Agent Prompt 1: Market Research
```
Research the utility damage prevention and "call before you dig" SaaS market:

1. Identify direct competitors (SaaS platforms in this space)
2. Identify indirect competitors (software solutions used by 811 organizations)
3. Market size estimation (TAM/SAM/SOM)
   - How many 811 organizations exist (US/worldwide)?
   - How many utility companies need these solutions?
   - How many construction firms interact with 811?
4. Common pricing models in this space
5. Key features offered by competitors
6. Technology trends being adopted

Output: Market research report with competitive analysis table.
```

**Expected Output**: Market research report identifying:
- Competitors: PelicanCorp, One-Call Systems, Clear Path, etc.
- Market size: 50+ 811 organizations in US, thousands of utility companies
- Pricing models: Per-ticket pricing, monthly subscriptions, enterprise contracts
- Key features: Ticket management, notification routing, analytics

**Save As**: `docs/research/utility-damage-prevention-market.md`

---

#### Agent Prompt 2: Competitive Feature Analysis
```
Based on the market research [reference file], create a detailed competitive feature comparison:

Compare Project Aegis' current capabilities against competitors:
- Webhook API capabilities
- Security features
- Scalability
- Analytics/reporting
- Integration options
- Pricing models

Identify:
1. Features we already have (competitive advantages)
2. Features we need to add
3. Differentiators we can leverage
4. Gaps in competitor offerings

Output: Feature comparison matrix and differentiation strategy.
```

**Expected Output**: Feature matrix showing:
- Project Aegis strengths: Security (HMAC), modern API design, rate limiting
- Missing features: Multi-tenant dashboard, analytics, ticket management UI
- Differentiation: Developer-friendly API, security-first approach

**Save As**: `docs/research/competitive-feature-analysis.md`

---

### Phase 2: Product Planning & MVP Definition

#### Agent Prompt 3: MVP Definition
```
Define the MVP for Project Aegis SaaS expansion:

Current capabilities: [list current features]
Market gaps identified: [reference competitive analysis]

Create an MVP feature set that includes:
1. Multi-tenant architecture (multiple 811 organizations)
2. Self-service tenant onboarding
3. Tenant-specific webhook endpoints
4. Basic analytics dashboard
5. API key management per tenant
6. Usage tracking and billing foundation

Prioritize features by:
- User value (high/medium/low)
- Technical complexity (high/medium/low)
- Development time (weeks/months)
- Dependency on other features

Output: Prioritized MVP feature list with justifications and dependencies.
```

**Expected Output**: MVP feature breakdown:
- **Must Have (MVP)**:
  1. Multi-tenant database schema (2 weeks)
  2. Tenant isolation in API (1 week)
  3. Basic admin dashboard for tenant management (3 weeks)
  4. API key generation per tenant (1 week)
  5. Usage tracking foundation (2 weeks)
  
- **Nice to Have (Post-MVP)**:
  1. Advanced analytics
  2. Custom webhook endpoints per tenant
  3. Billing integration
  4. White-label options

**Save As**: `docs/planning/aegis-mvp-definition.md`

---

#### Agent Prompt 4: Product Roadmap
```
Create a 12-month product roadmap for Project Aegis SaaS:

**MVP Phase (Months 1-3)**:
- Features: [reference MVP definition]
- Technical milestones
- User validation goals

**Post-MVP Phase 1 (Months 4-6)**:
- Launch features based on feedback
- Advanced analytics
- Billing integration
- Customer onboarding improvements

**Growth Phase (Months 7-9)**:
- White-label options
- Advanced integrations
- Mobile app (optional)
- Partnership opportunities

**Scale Phase (Months 10-12)**:
- Enterprise features
- Advanced security features
- Geographic expansion
- API marketplace

For each phase, include: deliverables, dependencies, resources needed, success metrics.

Output: 12-month roadmap with quarterly milestones.
```

**Expected Output**: Roadmap with phases, milestones, and success metrics.

**Save As**: `docs/planning/aegis-product-roadmap.md`

---

### Phase 3: Technical Architecture Design

#### Agent Prompt 5: Multi-Tenant Architecture
```
Design a multi-tenant architecture for Project Aegis SaaS:

**Requirements:**
- Current stack: Node.js, Express, PostgreSQL (assumed)
- Target: 1000+ tenants (811 organizations, utilities, construction firms)
- Each tenant: 100-10,000 webhook requests/day
- Need: Tenant isolation, performance, scalability

**Architecture Should Include:**
1. **Tenant Isolation Strategy**:
   - Options: Database-per-tenant vs schema-per-tenant vs row-level
   - Recommendation with justification
   
2. **High-Level Architecture Diagram**:
   - Components: API gateway, tenant service, webhook handler, database
   - Data flow for multi-tenant requests
   - Authentication/authorization per tenant

3. **Database Schema Changes**:
   - Tenant table structure
   - Modified locate_request table (add tenant_id)
   - Tenant-specific configuration tables
   - Indexes for performance

4. **API Design**:
   - Tenant-specific webhook endpoints (/api/v1/{tenant-id}/webhook)
   - Admin API for tenant management
   - Authentication strategy (API keys per tenant)

5. **Scalability Considerations**:
   - Horizontal scaling strategy
   - Database replication strategy
   - Caching strategy (Redis for tenant configs)
   - Load balancing

6. **Security Architecture**:
   - Tenant data isolation
   - API key management
   - Rate limiting per tenant
   - Audit logging per tenant

Output: Complete architecture document with diagrams, schema, and implementation plan.
```

**Expected Output**: Architecture document including:
- Recommendation: Row-level isolation (tenant_id) - simpler, easier to scale
- Database schema: tenants table, modified locate_requests table
- API design: `/api/v1/tenants/{tenant_id}/webhooks/locate-request`
- Security: Per-tenant API keys, rate limiting, audit logs

**Save As**: `docs/architecture/aegis-multi-tenant-architecture.md`

---

#### Agent Prompt 6: Database Schema Design
```
Design the database schema for multi-tenant Project Aegis:

**Current Schema:**
- locate_requests table (ticket_number, excavator, address, coordinates, received_at)

**Requirements:**
- Multi-tenancy with row-level isolation
- Tenant management
- API key management per tenant
- Usage tracking per tenant
- Analytics support

Create:
1. ERD showing all tables and relationships
2. Table definitions with columns, types, constraints
3. Indexes for performance (with justification)
4. Migration plan from current schema to new schema

Output: Complete database schema with ERD and migration scripts.
```

**Expected Output**: Database schema with:
- `tenants` table (id, name, slug, api_key, status, created_at)
- `tenant_configs` table (tenant_id, webhook_secret, rate_limit, settings)
- Modified `locate_requests` table (add tenant_id, indexes)
- `usage_logs` table (tenant_id, request_count, date)
- Migration script for existing data

**Save As**: `docs/architecture/aegis-database-schema.md`

---

#### Agent Prompt 7: API Specification
```
Design the API specification for multi-tenant Project Aegis:

**Current API:**
POST /api/locate-request (single tenant, uses WEBHOOK_SECRET env var)

**New Requirements:**
1. Multi-tenant webhook endpoints
2. Tenant-specific authentication (API keys)
3. Admin API for tenant management
4. Analytics API for usage data

**API Endpoints Needed:**
- Tenant webhook endpoints (tenant-specific)
- Tenant management (CRUD)
- API key management
- Usage/analytics endpoints

For each endpoint, specify:
- HTTP method and path
- Request/response schemas (JSON)
- Authentication requirements
- Rate limiting
- Example requests/responses

Output: Complete API specification in OpenAPI/Swagger format.
```

**Expected Output**: API specification with endpoints:
- `POST /api/v1/tenants/{tenant_id}/webhooks/locate-request` - Tenant webhook
- `GET /api/v1/admin/tenants` - List tenants
- `POST /api/v1/admin/tenants` - Create tenant
- `GET /api/v1/admin/tenants/{tenant_id}/usage` - Usage stats
- etc.

**Save As**: `docs/architecture/aegis-api-specification.md`

---

### Phase 4: Business Model & Pricing

#### Agent Prompt 8: Pricing Strategy
```
Develop a pricing strategy for Project Aegis SaaS:

**Market Research:**
- Competitor pricing: [reference market research]
- Industry benchmarks: Per-ticket pricing, monthly subscriptions

**Product Capabilities:**
- Webhook API
- Analytics dashboard
- Usage tracking
- API key management

**Target Customers:**
1. Small 811 organizations (< 1000 tickets/month)
2. Medium 811 organizations (1K-10K tickets/month)
3. Large 811 organizations (> 10K tickets/month)
4. Utility companies
5. Construction firms

Create:
1. Pricing tiers (3-4 tiers)
2. Feature differentiation per tier
3. Pricing model (per-ticket vs subscription vs hybrid)
4. Enterprise pricing strategy
5. Justification for pricing levels

Output: Pricing strategy document with tier comparison matrix.
```

**Expected Output**: Pricing tiers:
- **Starter**: $99/month, up to 1K tickets/month, basic analytics
- **Professional**: $299/month, up to 10K tickets/month, advanced analytics
- **Enterprise**: Custom pricing, unlimited tickets, white-label, SLA

**Save As**: `docs/planning/aegis-pricing-strategy.md`

---

#### Agent Prompt 9: Business Model
```
Develop a business model for Project Aegis SaaS:

**Pricing Strategy:** [reference pricing file]

Create:
1. Revenue model breakdown
2. Unit economics:
   - Customer Acquisition Cost (CAC)
   - Lifetime Value (LTV)
   - Payback period
3. Revenue projections (3 years):
   - Month 1: 0 customers, $0 MRR
   - Month 3: 10 customers, $2K MRR
   - Month 6: 50 customers, $15K MRR
   - Year 1: 200 customers, $60K MRR
   - Year 2: 500 customers, $150K MRR
   - Year 3: 1,000 customers, $300K MRR
4. Key assumptions:
   - Average customer size
   - Churn rate (monthly/annual)
   - Growth rate
5. Cost structure:
   - Infrastructure costs
   - Development costs
   - Marketing/sales costs
   - Support costs

Output: Business model with financial projections and assumptions.
```

**Expected Output**: Business model with:
- Revenue projections
- CAC/LTV calculations
- Break-even analysis
- Growth assumptions

**Save As**: `docs/planning/aegis-business-model.md`

---

### Phase 5: Sales & Go-to-Market Strategy

#### Agent Prompt 10: Customer Personas
```
Develop customer personas for Project Aegis SaaS:

**Target Segments:**
1. 811 Organization (One-Call Center)
2. Utility Company
3. Construction Firm
4. Government Agency

For each persona, create:
- Role and responsibilities
- Company size and type
- Pain points related to locate requests
- Goals and motivations
- Budget authority
- Buying process
- Technology comfort level

Output: Detailed personas with pain points and buying behavior.
```

**Expected Output**: Personas like:
- **811 Manager**: Manages ticket processing, needs API integration, budget: $500-2000/month
- **Utility Operations Manager**: Coordinates with 811, needs reliability, budget: $1000-5000/month

**Save As**: `docs/sales/aegis-customer-personas.md`

---

#### Agent Prompt 11: Go-to-Market Strategy
```
Create a go-to-market strategy for Project Aegis SaaS:

**Product:** Multi-tenant webhook API for utility damage prevention
**Target Market:** 811 organizations, utilities, construction firms
**Pricing:** [reference pricing strategy]

Include:
1. **Launch Plan:**
   - Pre-launch activities (30 days before)
   - Launch activities
   - Post-launch activities (30 days after)

2. **Customer Acquisition Strategy:**
   - Primary channels (direct sales, partnerships, etc.)
   - Content marketing approach
   - Community building
   - Referral program

3. **Sales Process:**
   - Discovery phase
   - Demo phase
   - Proposal phase
   - Onboarding phase

4. **Marketing Channels:**
   - Website/landing pages
   - Content (blog, case studies)
   - Social media
   - Industry events/conferences

5. **Partnership Opportunities:**
   - Integration partnerships
   - Reseller partnerships
   - Technology partnerships

6. **Success Metrics:**
   - First 100 customers target
   - MRR targets by month
   - Customer acquisition targets

Output: Comprehensive go-to-market plan.
```

**Expected Output**: Go-to-market plan with channels, tactics, and metrics.

**Save As**: `docs/sales/aegis-go-to-market.md`

---

#### Agent Prompt 12: Sales Playbook
```
Create a sales playbook for Project Aegis SaaS:

Based on:
- Customer personas: [file reference]
- Go-to-market strategy: [file reference]
- Pricing strategy: [file reference]

Include:
1. **Sales Process Stages:**
   - Discovery (questions to ask)
   - Demo (what to show, how to demo)
   - Proposal (how to present pricing)
   - Close (objection handling)
   - Onboarding (success plan)

2. **Value Propositions by Persona:**
   - Customized messaging for each persona
   - Key benefits that resonate
   - ROI calculations

3. **Objection Handling:**
   - Common objections (pricing, security, migration)
   - Responses and rebuttals
   - Supporting materials

4. **Sales Collateral:**
   - One-pager
   - Case studies (when available)
   - ROI calculator
   - Demo script

5. **Email Templates:**
   - Cold outreach
   - Follow-up sequences
   - Proposal emails

Output: Complete sales playbook.
```

**Expected Output**: Sales playbook with processes, templates, and scripts.

**Save As**: `docs/sales/aegis-sales-playbook.md`

---

### Phase 6: Implementation Planning

#### Agent Prompt 13: Implementation Roadmap
```
Create a detailed implementation roadmap for Project Aegis SaaS MVP:

**MVP Features:** [reference MVP definition]
**Architecture:** [reference architecture documents]

Break down into:
1. **Sprints/Tasks:**
   - Database migration (multi-tenant schema)
   - API updates (tenant isolation)
   - Admin dashboard (tenant management)
   - API key generation
   - Usage tracking
   - Testing
   - Deployment

2. **Dependencies:**
   - What must be done first
   - What can be parallelized

3. **Estimated Effort:**
   - Time per task
   - Resource requirements

4. **Timeline:**
   - Week-by-week plan for 3 months
   - Milestones and deliverables

5. **Risk Assessment:**
   - Technical risks
   - Timeline risks
   - Mitigation strategies

Output: Detailed implementation plan with timeline.
```

**Expected Output**: Implementation plan with tasks, estimates, and timeline.

**Save As**: `docs/planning/aegis-implementation-roadmap.md`

---

## Summary of Agent-Generated Documentation

After running all these workflows, you'll have:

### Research
- `market-research.md` - Market analysis and competitive landscape
- `competitive-feature-analysis.md` - Feature comparison and differentiation

### Planning
- `mvp-definition.md` - Prioritized MVP features
- `product-roadmap.md` - 12-month roadmap
- `pricing-strategy.md` - Pricing tiers and model
- `business-model.md` - Financial projections
- `implementation-roadmap.md` - Development plan

### Architecture
- `multi-tenant-architecture.md` - System design
- `database-schema.md` - Database design and migrations
- `api-specification.md` - API endpoints and specs

### Sales
- `customer-personas.md` - Target customer profiles
- `go-to-market.md` - Launch and acquisition strategy
- `sales-playbook.md` - Sales process and materials

---

## Next Steps

1. **Review Generated Documents**: Validate agent outputs with domain expertise
2. **Refine Based on Feedback**: Iterate on prompts and outputs
3. **Prioritize**: Decide what to implement first
4. **Start Implementation**: Use architecture documents to begin development
5. **Iterate**: Use agents for ongoing feature development and improvements

---

## Tips for Success

1. **Reference Previous Outputs**: Always reference earlier agent outputs in subsequent prompts
2. **Be Specific**: Include requirements, constraints, and preferences in prompts
3. **Iterate**: Don't expect perfect outputs - refine based on results
4. **Validate**: Combine agent insights with domain knowledge and expertise
5. **Organize**: Keep documentation well-organized and version-controlled

---

*This example demonstrates the power of Cursor Cloud Agents for comprehensive SaaS planning. Adapt these workflows to your specific needs and iterate based on results.*