# Example Agent Workflows for SaaS Development

Step-by-step workflows demonstrating how to chain multiple agent interactions.

---

## Workflow 1: From Idea to Pitch Deck

**Goal**: Transform a SaaS idea into a comprehensive investor pitch deck.

### Step 1: Market Research
**Agent Prompt:**
```
I have a SaaS idea: [Your idea description]

Research the market opportunity:
- Identify direct and indirect competitors
- Estimate market size (TAM/SAM/SOM)
- Analyze competitor pricing models
- Identify market gaps and opportunities

Output: Market research report with competitive analysis.
```

**Save Output**: `docs/research/market-analysis.md`

### Step 2: Product Planning
**Agent Prompt:**
```
Based on this market research [reference file], help me plan the product:

1. Define the MVP feature set (prioritized)
2. Create a 6-month roadmap
3. Estimate resource requirements
4. Define success metrics

Focus on differentiation opportunities identified in research.
```

**Save Output**: `docs/planning/product-roadmap.md`

### Step 3: Architecture Design
**Agent Prompt:**
```
Design the technical architecture for [product] based on these MVP features:
[List key MVP features]

Requirements:
- Multi-tenant SaaS architecture
- Scalability to 10,000 users
- Modern tech stack (specify preferences)
- Cloud-native (AWS/GCP/Azure)

Output: Architecture document with diagrams and tech stack recommendations.
```

**Save Output**: `docs/architecture/system-design.md`

### Step 4: Business Model Development
**Agent Prompt:**
```
Develop a business model for [product]:

1. Revenue model (subscription, usage-based, etc.)
2. Pricing tiers with feature differentiation
3. Unit economics (CAC, LTV, payback period)
4. Revenue projections for 3 years
5. Key assumptions

Based on: [market research] and [competitive pricing analysis]
```

**Save Output**: `docs/planning/business-model.md`

### Step 5: Sales Strategy
**Agent Prompt:**
```
Create a go-to-market strategy for [product]:

1. Target customer personas
2. Sales process and channels
3. Marketing approach
4. Customer acquisition strategy
5. Sales targets for first year

Reference: [business model] and [target market from research]
```

**Save Output**: `docs/sales/go-to-market.md`

### Step 6: Investor Pitch Deck
**Agent Prompt:**
```
Create an investor pitch deck incorporating:
- Market research: [file reference]
- Product roadmap: [file reference]
- Architecture: [file reference]
- Business model: [file reference]
- Go-to-market: [file reference]

Include:
- Problem/solution fit
- Market opportunity
- Product and differentiation
- Traction (or launch plan)
- Team (if applicable)
- Financial projections
- Ask (funding amount and use)

Output: Complete pitch deck with slide content and talking points.
```

**Save Output**: `docs/proposals/investor-pitch.md`

---

## Workflow 2: Feature Development Cycle

**Goal**: Research, design, and plan implementation for a new feature.

### Step 1: Feature Research
**Agent Prompt:**
```
I want to add [feature name] to [SaaS product].

Research:
1. How do competitors implement similar features?
2. What are best practices?
3. Common user expectations?
4. Technical approaches used?

Output: Feature research with competitive analysis.
```

**Save Output**: `docs/research/feature-[name]-research.md`

### Step 2: Feature Specification
**Agent Prompt:**
```
Based on this research [file reference], create a detailed feature specification for [feature]:

1. User stories
2. Functional requirements
3. Non-functional requirements (performance, security)
4. User flow diagrams (text or mermaid format)
5. Success criteria

Output: Complete feature spec document.
```

**Save Output**: `docs/features/[feature-name]-spec.md`

### Step 3: Architecture Design
**Agent Prompt:**
```
Design the architecture for implementing [feature]:

Requirements:
- [Feature specification file reference]
- Must integrate with existing system: [system architecture file]
- Database changes needed
- API endpoints required
- Frontend components needed

Output: 
- Architecture changes document
- API endpoint specifications
- Database schema changes
- Component structure
```

**Save Output**: `docs/architecture/features/[feature-name]-architecture.md`

### Step 4: Implementation Plan
**Agent Prompt:**
```
Create an implementation plan for [feature]:

Based on:
- Feature spec: [file]
- Architecture: [file]

Include:
1. Development phases/tasks
2. Estimated effort per task
3. Dependencies
4. Testing approach
5. Deployment plan
6. Rollout strategy

Output: Implementation plan with task breakdown.
```

**Save Output**: `docs/features/[feature-name]-implementation.md`

---

## Workflow 3: Client Proposal Generation

**Goal**: Create a customized proposal for a potential enterprise client.

### Step 1: Client Research
**Agent Prompt:**
```
Research [Client Company Name]:
- Industry and business model
- Recent news and challenges
- Technology stack (if known)
- Company size and structure
- Potential pain points related to [your SaaS domain]

Output: Client research brief.
```

**Save Output**: `docs/proposals/clients/[client-name]-research.md`

### Step 2: Needs Analysis
**Agent Prompt:**
```
Based on client research [file] and our SaaS product [product description], analyze:

1. Client's likely needs related to our product
2. How our product solves their challenges
3. Relevant features for this client
4. Potential ROI for the client
5. Implementation considerations

Output: Needs analysis and solution fit document.
```

**Save Output**: `docs/proposals/clients/[client-name]-needs.md`

### Step 3: Customized Proposal
**Agent Prompt:**
```
Create a customized proposal for [Client Name]:

Based on:
- Client research: [file]
- Needs analysis: [file]
- Our standard offering: [product details]

Include:
- Executive summary
- Client-specific problem statement
- Proposed solution tailored to their needs
- Implementation plan
- ROI analysis
- Pricing (reference our pricing strategy)
- Timeline
- Next steps

Tone: Professional, consultative, value-focused.
```

**Save Output**: `docs/proposals/clients/[client-name]-proposal.md`

### Step 4: Sales Presentation Prep
**Agent Prompt:**
```
Create sales presentation talking points for [Client Name] based on this proposal [file]:

1. Opening hook (grab attention)
2. Problem statement (their pain)
3. Solution overview (how we solve it)
4. Key benefits (tailored to them)
5. Social proof (relevant case studies)
6. ROI demonstration
7. Implementation overview
8. Call to action

Include: Anticipated questions and answers, objection handling.
```

**Save Output**: `docs/sales/presentations/[client-name]-talking-points.md`

---

## Workflow 4: Technical Architecture Review

**Goal**: Review and optimize existing system architecture.

### Step 1: Current State Analysis
**Agent Prompt:**
```
Analyze our current system architecture [reference files]:
- Architecture diagram: [file]
- API documentation: [file]
- Database schema: [file]

Identify:
1. Scalability bottlenecks
2. Security concerns
3. Performance issues
4. Technical debt areas
5. Maintenance challenges

Output: Current state analysis with issues prioritized.
```

**Save Output**: `docs/architecture/reviews/current-state-analysis.md`

### Step 2: Optimization Recommendations
**Agent Prompt:**
```
Based on current state analysis [file] and these requirements:
- [Future growth projections]
- [New feature requirements]
- [Performance targets]
- [Budget constraints]

Provide:
1. Optimization recommendations (prioritized)
2. Architecture improvements
3. Technology upgrades
4. Migration strategies
5. Cost-benefit analysis

Output: Architecture optimization plan.
```

**Save Output**: `docs/architecture/reviews/optimization-plan.md`

### Step 3: Implementation Roadmap
**Agent Prompt:**
```
Create an implementation roadmap for these optimizations [file reference]:

Include:
- Phases with milestones
- Estimated effort and timeline
- Risk assessment
- Rollback plans
- Success criteria

Prioritize based on impact and effort.
```

**Save Output**: `docs/architecture/reviews/implementation-roadmap.md`

---

## Workflow 5: Launch Planning

**Goal**: Plan a comprehensive product launch.

### Step 1: Launch Strategy
**Agent Prompt:**
```
Create a launch strategy for [SaaS product]:

Product details: [product description]
Target market: [target market]
Launch date: [date]

Include:
1. Pre-launch activities (30 days before)
2. Launch day activities
3. Post-launch activities (first 30 days)
4. Marketing channels and tactics
5. PR strategy
6. Community building
7. Metrics to track

Output: Comprehensive launch plan.
```

**Save Output**: `docs/planning/launch-strategy.md`

### Step 2: Marketing Materials
**Agent Prompt:**
```
Create marketing materials for launch based on launch strategy [file reference]:

1. Press release draft
2. Blog post (announcement)
3. Social media content (for each platform)
4. Email campaign (welcome sequence)
5. Landing page copy
6. Product announcement email

Tone: Exciting, professional, customer-focused.
```

**Save Output**: `docs/marketing/launch-materials.md`

### Step 3: Launch Checklist
**Agent Prompt:**
```
Create a detailed launch checklist based on launch strategy [file]:

Include:
- Technical checklist (infrastructure, monitoring, etc.)
- Marketing checklist (content, campaigns, etc.)
- Legal/compliance checklist
- Support preparation
- Documentation
- Training materials

Format as actionable checklist with owners and deadlines.
```

**Save Output**: `docs/planning/launch-checklist.md`

---

## Best Practices for Workflows

### 1. **Document Iterations**
- Save all agent outputs
- Version important documents
- Track decisions and rationale

### 2. **Reference Previous Outputs**
- Always reference prior agent outputs in subsequent prompts
- Build on previous insights
- Maintain context across interactions

### 3. **Human Review**
- Review agent outputs before using
- Refine based on expertise
- Combine agent insights with domain knowledge

### 4. **Iterate**
- Don't expect perfect outputs from first try
- Refine prompts based on results
- Ask follow-up questions

### 5. **Organize Outputs**
- Use consistent file naming
- Organize by topic/phase
- Create index/README files

---

## Workflow Automation Ideas

### Template Workflows
Create reusable workflow templates for common tasks:
- New feature development
- Client onboarding
- Architecture reviews
- Pricing updates

### Prompt Chaining
Save successful prompt chains for reuse:
```json
{
  "workflow": "Feature Development",
  "steps": [
    {"step": 1, "prompt": "...", "output": "research.md"},
    {"step": 2, "prompt": "...", "output": "spec.md", "references": ["research.md"]}
  ]
}
```

### Validation Prompts
After each step, use validation prompts:
```
"Review this [document type] for completeness, accuracy, and alignment with [requirements]. Identify gaps or issues."
```

---

*These workflows are templates. Customize them for your specific SaaS needs and iterate based on results.*