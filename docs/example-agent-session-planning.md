# Example Agent Session: Planning Phase

This document demonstrates a real example of using Cursor Cloud Agents for the planning phase of Project Aegis.

---

## Scenario

You're planning Project Aegis (utility damage prevention ML SaaS) and need to create a comprehensive market analysis and business plan to present to potential investors or stakeholders.

---

## Session 1: Market Analysis

### Initial Prompt

```
I'm building Project Aegis - a SaaS product that uses machine learning 
to predict and prevent utility damage during excavation work. 

I need a comprehensive market analysis document that includes:

1. Total Addressable Market (TAM), Serviceable Addressable Market (SAM), 
   and Serviceable Obtainable Market (SOM) for utility damage prevention 
   software in North America

2. Target customer segments (utility companies, locate companies, 
   excavators, regulatory bodies)

3. Market trends and growth projections

4. Competitive landscape analysis

5. Pricing strategy recommendations based on market research

Reference my existing ML guide at docs/utility-damage-prevention-ml-guide.md 
for context on the solution.

Create this as a well-structured markdown document.
```

### What the Agent Would Generate

The agent would create a document like:

```markdown
# Market Analysis: Project Aegis - Utility Damage Prevention ML SaaS

## Executive Summary
[Market size, opportunity, key findings]

## Market Size Analysis

### Total Addressable Market (TAM)
- North American utility damage prevention market: $X billion
- Includes: Software, services, compliance tools
- Data sources: [Industry reports, market research]

### Serviceable Addressable Market (SAM)
- Target: Utility companies and locate companies
- Market size: $Y million
- Rationale: [Why this segment]

### Serviceable Obtainable Market (SOM)
- Year 1: $Z million (X% of SAM)
- Year 3: $W million (Y% of SAM)
- Assumptions: [Customer acquisition rates, market penetration]

## Target Customer Segments

### Primary: Utility Owner/Operators
- Size: ~3,000 companies in North America
- Pain points: [List]
- Budget: $X-$Y per year
- Decision makers: [Roles]

### Secondary: Locate Companies
- Size: ~200 companies
- Pain points: [List]
- Budget: $X-$Y per year

[... more segments]

## Competitive Landscape

### Direct Competitors
1. [Competitor A]
   - Products: [List]
   - Pricing: $X-$Y
   - Strengths: [List]
   - Weaknesses: [List]

[... more competitors]

### Competitive Differentiation
- ML-based risk prediction (unique)
- Real-time scoring
- Explainable AI for compliance
- [Other differentiators]

## Pricing Strategy Recommendations

### Option 1: Tiered SaaS Pricing
- Starter: $X/month (up to Y requests)
- Professional: $Z/month (up to W requests)
- Enterprise: Custom pricing

### Option 2: Usage-Based Pricing
- Base fee: $X/month
- Per locate request: $Y
- Volume discounts: [Tiers]

### Recommendation
[Chosen strategy with rationale]

## Market Trends
- Increasing regulatory requirements
- Growing adoption of predictive analytics
- [Other trends]

## Growth Projections
- Year 1: [Projections]
- Year 3: [Projections]
- Year 5: [Projections]
```

---

## Session 2: Refinement Based on Feedback

### Follow-Up Prompt

```
The market analysis you created is good, but I need:
1. More specific data sources and citations
2. Breakdown by geographic region (US vs Canada)
3. More detailed competitor pricing analysis
4. ROI calculator examples for customers
5. Regulatory compliance requirements section

Please refine the document with these additions.
```

### Agent Response

The agent would:
- Add citations and data sources
- Expand geographic analysis
- Deepen competitor research
- Create ROI calculator framework
- Add compliance section

---

## Session 3: Business Model Canvas

### Next Prompt

```
Based on the market analysis, create a Business Model Canvas for 
Project Aegis. Fill in all 9 sections with realistic assumptions 
based on the market research:

1. Value Propositions
2. Customer Segments
3. Channels
4. Customer Relationships
5. Revenue Streams
6. Key Resources
7. Key Activities
8. Key Partnerships
9. Cost Structure

Reference the market analysis document for context.
```

### Agent Output

The agent would create a structured Business Model Canvas with:
- Detailed value propositions mapped to customer segments
- Channel strategy
- Revenue model details
- Resource requirements
- Cost breakdown
- Partnership opportunities

---

## Session 4: Go-to-Market Plan

### Prompt

```
Create a 12-month go-to-market plan for Project Aegis that includes:

1. Pre-launch phase (Months 1-3)
   - Product development milestones
   - Beta customer acquisition
   - Marketing preparation

2. Launch phase (Months 4-6)
   - Public launch
   - Initial customer acquisition targets
   - Marketing campaigns

3. Growth phase (Months 7-12)
   - Customer expansion
   - Feature development
   - Market expansion

Include specific metrics, timelines, and resource requirements 
for each phase. Reference the Business Model Canvas and Market Analysis.
```

### Agent Output

The agent would generate:
- Detailed timeline with milestones
- Customer acquisition targets
- Marketing activities by phase
- Resource requirements (team, budget)
- Success metrics and KPIs
- Risk mitigation strategies

---

## Session 5: Financial Projections

### Prompt

```
Create a 3-year financial projection for Project Aegis including:

1. Revenue projections
   - By customer segment
   - By pricing tier
   - Growth assumptions

2. Cost structure
   - Development costs
   - Infrastructure costs
   - Sales and marketing
   - Operations

3. Unit economics
   - Customer acquisition cost (CAC)
   - Lifetime value (LTV)
   - LTV:CAC ratio
   - Payback period

4. Funding requirements
   - Initial capital needs
   - Runway projections
   - Funding milestones

Base assumptions on the market analysis and go-to-market plan.
```

### Agent Output

The agent would create:
- Revenue forecast tables
- Cost breakdown by category
- Unit economics calculations
- Cash flow projections
- Funding requirements analysis
- Scenario planning (best/base/worst case)

---

## Complete Deliverable Summary

After these 5 sessions, you would have:

? **Market Analysis Document**
- TAM/SAM/SOM breakdown
- Customer segmentation
- Competitive analysis
- Pricing strategy

? **Business Model Canvas**
- Complete 9-section canvas
- Value proposition mapping
- Revenue model details

? **Go-to-Market Plan**
- 12-month roadmap
- Phase-by-phase activities
- Metrics and KPIs

? **Financial Projections**
- 3-year forecast
- Unit economics
- Funding requirements

**Total Time:** ~2-3 hours of agent interaction  
**Your Effort:** Review, refine, and validate  
**Output Quality:** Professional, investor-ready documents

---

## Tips from This Example

1. **Start Broad**: Begin with market analysis to establish foundation
2. **Build Sequentially**: Each document references previous ones
3. **Iterate**: Refine based on feedback and new information
4. **Be Specific**: Include exact requirements and constraints
5. **Reference Context**: Always point to existing documents

---

## Next Steps After Planning

With these planning documents complete, you can:

1. **Research Phase**: Use agents to validate assumptions
2. **Proposal Phase**: Create investor pitch deck using these docs
3. **Sales Phase**: Develop sales playbook based on customer segments
4. **Architecture Phase**: Design system based on business requirements

---

*Example Session Guide v1.0 | Last updated: 2025-01-27*
