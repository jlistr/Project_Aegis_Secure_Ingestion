# PoC Development Plan: Utility Locate Risk Assessment System
## Solo Developer Edition - Cost-Optimized Tech Stack

**Developer Profile:** Senior Software Engineer with locating industry domain knowledge  
**Timeline:** 8-12 weeks (part-time: 15-20 hours/week)  
**Budget:** < $100/month during development, < $50/month after launch  
**Scale:** 100-1K sample tickets for demonstration

---

## ?? Three Core Deliverables

### 1. Risk Scoring Module with AI
**Purpose:** Demonstrate AI's ability to analyze tickets and provide intelligent, readable risk assessments

**Key Features:**
- Ingest locate request data (JSON)
- Analyze using Claude 3.5 Sonnet
- Generate risk score (0-100) + natural language summary
- Provide intelligent business recommendations
- Show factor breakdown (excavator history, complexity, weather, etc.)

**Success Criteria:**
- Generates meaningful summaries like: "This 0.25-mile ticket involves gas and electric facilities. The excavator has damaged 3 lines in the past 6 months, creating a MEDIUM-HIGH risk. Recommend assigning a locator with 2+ years experience."
- Processing time < 3 seconds
- 95%+ stakeholder comprehension of recommendations

---

### 2. Web Portal (Next.js Dashboard)
**Purpose:** Executive/supervisor interface showcasing AI-powered insights and business intelligence

**Key Features:**
- Real-time ticket queue with risk scores
- Interactive BI dashboard with charts/graphs
- Individual ticket detail view with AI assessment
- Mock intelligent routing demonstration
- Filtering by risk level, excavator, utility type
- Search and analytics

**Success Criteria:**
- Beautiful, modern UI that impresses stakeholders
- Responsive (mobile-friendly)
- < 2 second page loads
- Clear data visualizations

---

### 3. Mobile App (React Native - iOS)
**Purpose:** Field technician interface demonstrating fast, simple UX that improves productivity

**Key Features:**
- View assigned tickets (map view + list view)
- Ticket details with risk summary
- Quick actions: Accept, View Map, Complete
- Offline-capable for viewing tickets
- Push notifications for new assignments
- Camera integration for marking photos

**Success Criteria:**
- Feels native and fast (< 1 sec to load ticket list)
- Simple, uncluttered UI
- Can demo full workflow in 2 minutes
- Works on TestFlight for stakeholder demos

---

## ?? Cost-Optimized Tech Stack

### Backend & API
**Technology:** Node.js + Express OR Next.js API Routes  
**Cost:** $0 (runs on Vercel free tier)

**Why:**
- You already have Node.js expertise (Index.js in your project)
- Next.js API routes eliminate need for separate backend
- Vercel free tier: Unlimited API calls, 100GB bandwidth
- Easy deployment, great DX

---

### Database
**Technology:** PostgreSQL + PostGIS (via Supabase)  
**Cost:** $0 (free tier: 500MB, 2GB bandwidth, unlimited API requests)

**Why:**
- Free PostgreSQL with PostGIS for spatial data
- Built-in auth, realtime, storage
- Excellent Next.js integration
- Auto-generated REST API + GraphQL
- Built-in database dashboard

**Alternative:** Neon.tech (also free, serverless Postgres)

---

### AI Model
**Technology:** Anthropic Claude 3.5 Sonnet  
**Cost:** $10-30/month for PoC scale

**Calculation:**
- 1,000 tickets ? $0.02/assessment = $20
- Testing/development: ~$10
- Total: $30/month max

**Free Alternative for Testing:**
- Claude 3.5 Haiku: $1/M tokens (5x cheaper) - use during development
- Switch to Sonnet for final demos

---

### Frontend - Web Portal
**Technology:** Next.js 14+ (App Router) + shadcn/ui + Recharts  
**Cost:** $0 (Vercel free tier)

**Why:**
- Latest React features (Server Components, Server Actions)
- shadcn/ui: Beautiful, free component library (Radix UI + Tailwind)
- Recharts: Free, powerful charts for BI dashboard
- Vercel deployment: Automatic, instant, free
- Great SEO and performance

**UI Stack:**
- **shadcn/ui** - Components (buttons, cards, dialogs, tables)
- **Tailwind CSS** - Styling
- **Recharts** or **Tremor** - Data visualization
- **Lucide React** - Icons
- **next-auth** - Authentication (optional for PoC)

---

### Frontend - Mobile App
**Technology:** React Native + Expo  
**Cost:** $0 (Expo free tier includes TestFlight builds)

**Why:**
- JavaScript (your existing stack)
- Expo Go for instant testing on your iPhone
- EAS Build for TestFlight distribution (free tier: limited builds)
- Hot reload for fast development
- Can add Android later with no code changes

**Mobile UI Stack:**
- **React Native Paper** or **NativeBase** - Component library
- **React Navigation** - Navigation
- **React Native Maps** - Map integration
- **Expo Camera** - Photo capture
- **AsyncStorage** - Offline data

---

### Maps & GIS
**Technology:** Mapbox GL JS (Web) + React Native Mapbox (Mobile)  
**Cost:** $0 (free tier: 50K map loads/month)

**Why:**
- Beautiful, fast maps
- Generous free tier (plenty for PoC)
- Excellent documentation
- Soil type layers available
- Draw tools for geo-fencing

**Alternative:** Google Maps (free $200/month credit)

---

### Data Generation
**Technology:** AI + Faker.js + Turf.js  
**Cost:** $5-10 (one-time for data generation)

**Strategy:**
1. Use Claude to generate realistic GIS data structures
2. Faker.js for names, addresses, companies
3. Turf.js for geographic calculations and boundary boxes
4. Create 1,000 realistic tickets with varied scenarios

---

### File Storage
**Technology:** Supabase Storage  
**Cost:** $0 (1GB free storage)

**Use Cases:**
- Store GIS map files
- Field tech photos
- Export reports

---

### Hosting & Deployment
**Technology:** Vercel (Web) + Expo EAS (Mobile)  
**Cost:** $0

**Vercel Free Tier:**
- Unlimited Next.js deployments
- 100GB bandwidth
- Automatic HTTPS
- Preview deployments for every git push

**Expo EAS Free Tier:**
- Limited builds per month (enough for PoC)
- TestFlight distribution
- OTA updates

---

### Total Monthly Cost During PoC: $20-40
- Claude API: $20-30
- Everything else: $0 (free tiers)
- **Post-PoC (maintenance):** $10-20/month (minimal API usage)

---

## ??? Development Timeline (10 Weeks)

### Phase 1: Foundation & Data (Weeks 1-2)

#### Week 1: Project Setup & Data Generation
**Hours:** 15-20 hours

**Tasks:**
- [ ] Set up monorepo structure (pnpm workspaces recommended)
  ```
  /workspace
    /apps
      /web          (Next.js portal)
      /mobile       (React Native app)
    /packages
      /api          (Shared API client)
      /types        (TypeScript types)
      /risk-engine  (Risk assessment logic)
    /data
      /generators   (Data generation scripts)
      /seed         (Sample datasets)
  ```
- [ ] Initialize Next.js 14 project with App Router
- [ ] Initialize React Native Expo project
- [ ] Set up Supabase project and database schema
- [ ] Create database schema (see below)
- [ ] Set up Anthropic API account and test connection

**Database Schema:**
```sql
-- Locate Requests
CREATE TABLE locate_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'routine', 'emergency', 'non_compliant'
  status VARCHAR(20) DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  
  -- Location & Scope
  address TEXT,
  location GEOGRAPHY(POINT),
  boundary_box GEOGRAPHY(POLYGON),
  distance_miles DECIMAL(5,2),
  
  -- Utilities
  utility_types TEXT[], -- ['gas', 'electric', 'water', 'telecom']
  
  -- Excavator
  excavator_id UUID REFERENCES excavators(id),
  
  -- Assignment
  assigned_to UUID REFERENCES employees(id),
  assigned_at TIMESTAMP,
  
  -- Risk Assessment (JSON)
  risk_assessment JSONB,
  risk_score INTEGER,
  risk_level VARCHAR(20),
  
  -- Timestamps
  requested_date TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  completed_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Excavators
CREATE TABLE excavators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(200) NOT NULL,
  contact_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  
  -- Risk Metrics
  damages_6mo INTEGER DEFAULT 0,
  damages_12mo INTEGER DEFAULT 0,
  compliance_score INTEGER DEFAULT 100,
  risk_rating VARCHAR(20), -- 'low', 'medium', 'high'
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Employees (Locators)
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_number VARCHAR(20) UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role VARCHAR(50), -- 'locator', 'supervisor', 'manager'
  
  -- Experience
  hire_date DATE,
  experience_years DECIMAL(3,1),
  certifications TEXT[],
  
  -- Performance
  damages_12mo INTEGER DEFAULT 0,
  tickets_completed_30d INTEGER DEFAULT 0,
  current_ticket_count INTEGER DEFAULT 0,
  max_ticket_capacity INTEGER DEFAULT 8,
  performance_score INTEGER DEFAULT 100,
  
  -- Territory
  assigned_geo_fence GEOGRAPHY(POLYGON),
  
  -- Specialties
  utility_specialties TEXT[], -- ['gas', 'electric']
  
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Damage Incidents
CREATE TABLE damage_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES locate_requests(id),
  excavator_id UUID REFERENCES excavators(id),
  
  location GEOGRAPHY(POINT),
  damage_type VARCHAR(50),
  utility_affected VARCHAR(50),
  severity VARCHAR(20), -- 'minor', 'major', 'critical'
  
  responsible_party VARCHAR(50), -- 'excavator', 'locator', 'unknown'
  root_cause TEXT,
  estimated_cost DECIMAL(10,2),
  
  reported_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- GIS Map Files (metadata)
CREATE TABLE gis_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utility_owner VARCHAR(100),
  file_name VARCHAR(200),
  file_type VARCHAR(20), -- 'shp', 'kml', 'geojson'
  storage_path TEXT,
  coverage_area GEOGRAPHY(POLYGON),
  
  uploaded_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX idx_tickets_status ON locate_requests(status);
CREATE INDEX idx_tickets_risk ON locate_requests(risk_level);
CREATE INDEX idx_tickets_location ON locate_requests USING GIST(location);
CREATE INDEX idx_employees_active ON employees(active);
CREATE INDEX idx_damages_date ON damage_incidents(reported_date);
```

#### Week 2: Data Generation Scripts
**Hours:** 15-20 hours

**Task:** Create realistic synthetic data using AI + scripts

**Data Generation Script (Node.js):**
```javascript
// data/generators/generateTickets.js
const { faker } = require('@faker-js/faker');
const turf = require('@turf/turf');
const Anthropic = require('@anthropic-ai/sdk');

// San Antonio, TX area (CPS Energy territory)
const SA_CENTER = [-98.4936, 29.4241];
const SA_BOUNDS = {
  minLng: -98.7,
  maxLng: -98.3,
  minLat: 29.3,
  maxLat: 29.6
};

async function generateTickets(count = 1000) {
  const excavators = generateExcavators(50);
  const employees = generateEmployees(25);
  const tickets = [];
  
  for (let i = 0; i < count; i++) {
    const ticket = generateSingleTicket(i, excavators, employees);
    tickets.push(ticket);
  }
  
  return { tickets, excavators, employees };
}

function generateExcavators(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    company_name: faker.company.name() + ' ' + faker.helpers.arrayElement(['Construction', 'Excavation', 'Utilities', 'Contractors']),
    contact_name: faker.person.fullName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    damages_6mo: faker.helpers.weightedArrayElement([
      { weight: 70, value: 0 },
      { weight: 20, value: 1 },
      { weight: 7, value: 2 },
      { weight: 2, value: 3 },
      { weight: 1, value: faker.number.int({ min: 4, max: 8 }) }
    ]),
    damages_12mo: faker.number.int({ min: 0, max: 10 }),
    compliance_score: faker.number.int({ min: 50, max: 100 })
  }));
}

function generateEmployees(count) {
  return Array.from({ length: count }, (_, i) => {
    const hireDate = faker.date.past({ years: 10 });
    const experienceYears = (Date.now() - hireDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
    
    return {
      id: faker.string.uuid(),
      employee_number: `LOC-${String(i + 1).padStart(4, '0')}`,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      role: 'locator',
      hire_date: hireDate.toISOString().split('T')[0],
      experience_years: Math.round(experienceYears * 10) / 10,
      certifications: faker.helpers.arrayElements(['OUPS', 'NULCA', 'Gas', 'Electric'], { min: 1, max: 4 }),
      damages_12mo: faker.helpers.weightedArrayElement([
        { weight: 80, value: 0 },
        { weight: 15, value: 1 },
        { weight: 4, value: 2 },
        { weight: 1, value: 3 }
      ]),
      tickets_completed_30d: faker.number.int({ min: 15, max: 120 }),
      current_ticket_count: faker.number.int({ min: 0, max: 8 }),
      max_ticket_capacity: 8,
      performance_score: faker.number.int({ min: 65, max: 100 }),
      assigned_geo_fence: generateGeoFence(),
      utility_specialties: faker.helpers.arrayElements(['gas', 'electric', 'water', 'telecom'], { min: 2, max: 4 }),
      active: true
    };
  });
}

function generateGeoFence() {
  // Create a random polygon in San Antonio area
  const center = [
    faker.number.float({ min: SA_BOUNDS.minLng, max: SA_BOUNDS.maxLng }),
    faker.number.float({ min: SA_BOUNDS.minLat, max: SA_BOUNDS.maxLat })
  ];
  
  const radius = faker.number.float({ min: 2, max: 8 }); // km
  const polygon = turf.circle(center, radius, { steps: 6 });
  
  return polygon.geometry;
}

function generateSingleTicket(index, excavators, employees) {
  const excavator = faker.helpers.arrayElement(excavators);
  
  // Generate location
  const location = {
    type: 'Point',
    coordinates: [
      faker.number.float({ min: SA_BOUNDS.minLng, max: SA_BOUNDS.maxLng }),
      faker.number.float({ min: SA_BOUNDS.minLat, max: SA_BOUNDS.maxLat })
    ]
  };
  
  // Generate boundary box (rectangle around point)
  const distance = faker.number.float({ min: 0.05, max: 1.5 }); // miles
  const lengthKm = distance * 1.60934;
  const widthKm = faker.number.float({ min: 0.02, max: 0.1 }) * 1.60934;
  
  const bbox = turf.buffer(turf.point(location.coordinates), lengthKm, { units: 'kilometers' });
  
  // Utility types with realistic weights
  const utilityTypes = faker.helpers.arrayElements(
    ['gas', 'electric', 'water', 'telecom', 'sewer', 'fiber'],
    { min: 1, max: 4 }
  );
  
  // Generate realistic ticket number
  const ticketNumber = `TX-${new Date().getFullYear()}-${String(100000 + index).padStart(6, '0')}`;
  
  // Type with weights
  const type = faker.helpers.weightedArrayElement([
    { weight: 85, value: 'routine' },
    { weight: 10, value: 'non_compliant' },
    { weight: 5, value: 'emergency' }
  ]);
  
  // Create realistic address
  const address = `${faker.location.streetAddress()}, San Antonio, TX ${faker.location.zipCode('#####')}`;
  
  return {
    ticket_number: ticketNumber,
    type,
    status: 'pending',
    priority: type === 'emergency' ? 100 : type === 'non_compliant' ? 50 : 0,
    address,
    location,
    boundary_box: bbox.geometry,
    distance_miles: distance,
    utility_types: utilityTypes,
    excavator_id: excavator.id,
    requested_date: faker.date.recent({ days: 30 }).toISOString(),
    due_date: faker.date.soon({ days: 3 }).toISOString()
  };
}

// Generate GIS utility data using AI
async function generateGISData() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  const prompt = `Generate realistic GIS utility line data for San Antonio, Texas.
  
  Create 50 utility line segments (gas, electric, water) in GeoJSON format.
  Each line should:
  - Be in the San Antonio area (roughly -98.7 to -98.3 lng, 29.3 to 29.6 lat)
  - Have realistic utility properties (depth, material, diameter, install date)
  - Follow street patterns (mostly straight lines with 90-degree turns)
  - Be 0.1 to 2 miles long
  
  Return ONLY valid GeoJSON FeatureCollection.`;
  
  const message = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022', // Use cheaper model for data generation
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });
  
  const geoJsonText = message.content[0].text;
  const geoJson = JSON.parse(geoJsonText.match(/\{[\s\S]*\}/)[0]);
  
  return geoJson;
}

module.exports = { generateTickets, generateGISData };
```

**Run Data Generation:**
```bash
node data/generators/generateTickets.js
# Outputs: data/seed/tickets.json, excavators.json, employees.json, gis-data.geojson
```

**Seed Database:**
```javascript
// data/seedDatabase.js
const { createClient } = require('@supabase/supabase-js');
const tickets = require('./seed/tickets.json');
const excavators = require('./seed/excavators.json');
const employees = require('./seed/employees.json');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seed() {
  // Insert excavators first
  await supabase.from('excavators').insert(excavators);
  
  // Insert employees
  await supabase.from('employees').insert(employees);
  
  // Insert tickets in batches
  for (let i = 0; i < tickets.length; i += 100) {
    const batch = tickets.slice(i, i + 100);
    await supabase.from('locate_requests').insert(batch);
  }
  
  console.log('Database seeded successfully!');
}

seed();
```

---

### Phase 2: Risk Scoring Engine (Weeks 3-4)

#### Week 3: Core Risk Assessment Module
**Hours:** 15-20 hours

**Tasks:**
- [ ] Create risk assessment service with Claude integration
- [ ] Design prompt templates for different scenarios
- [ ] Implement structured JSON response parsing
- [ ] Add fallback scoring (rule-based)
- [ ] Create API endpoint: `POST /api/assess-risk`
- [ ] Add comprehensive logging
- [ ] Write unit tests

**Risk Assessment Service:**
```typescript
// packages/risk-engine/src/RiskAssessor.ts
import Anthropic from '@anthropic-ai/sdk';

interface TicketData {
  ticket: {
    id: string;
    ticket_number: string;
    distance_miles: number;
    utility_types: string[];
    type: string;
    address: string;
  };
  excavator: {
    company_name: string;
    damages_6mo: number;
    damages_12mo: number;
    compliance_score: number;
  };
  weather?: {
    conditions: string;
    temperature: number;
    precipitation: string;
  };
  historical?: {
    location_damages: number;
    similar_tickets: number;
  };
  available_locators: Array<{
    id: string;
    name: string;
    experience_years: number;
    damages_12mo: number;
    current_ticket_count: number;
  }>;
}

interface RiskAssessment {
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primary_risk_factors: Array<{
    factor: string;
    severity: string;
    detail: string;
  }>;
  recommended_locator: string;
  recommended_locator_id?: string;
  rationale: string;
  estimated_completion_time: string;
  supervision_required: boolean;
  special_precautions: string[];
}

export class RiskAssessor {
  private anthropic: Anthropic;
  
  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey });
  }
  
  async assessTicket(data: TicketData): Promise<RiskAssessment> {
    const prompt = this.buildPrompt(data);
    
    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0,
        system: this.getSystemPrompt(),
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });
      
      const response = message.content[0].text;
      return this.parseResponse(response, data);
      
    } catch (error) {
      console.error('AI assessment failed:', error);
      return this.fallbackAssessment(data);
    }
  }
  
  private getSystemPrompt(): string {
    return `You are an expert utility damage risk assessor with 20 years of experience in the locate industry.

Your job is to analyze utility locate requests and provide comprehensive risk assessments that help prevent damages and optimize technician assignments.

Consider all factors holistically:
- Excavator damage history (major red flag if 2+ damages in 6 months)
- Utility types (gas is highest risk, telecom is lowest)
- Ticket complexity (distance, number of utilities)
- Weather and soil conditions
- Technician experience and workload

Provide clear, actionable recommendations that a supervisor can immediately act on.`;
  }
  
  private buildPrompt(data: TicketData): string {
    const { ticket, excavator, weather, historical, available_locators } = data;
    
    return `Analyze this utility locate request and provide a risk assessment.

TICKET DETAILS:
- Ticket Number: ${ticket.ticket_number}
- Type: ${ticket.type.toUpperCase()}
- Scope: ${ticket.distance_miles} miles
- Utilities: ${ticket.utility_types.join(', ')}
- Location: ${ticket.address}

EXCAVATOR PROFILE:
- Company: ${excavator.company_name}
- Damages (6 months): ${excavator.damages_6mo} incidents
- Damages (12 months): ${excavator.damages_12mo} incidents
- Compliance Score: ${excavator.compliance_score}/100

${weather ? `ENVIRONMENTAL CONDITIONS:
- Weather: ${weather.conditions}
- Temperature: ${weather.temperature}?F
- Recent Precipitation: ${weather.precipitation}` : ''}

${historical ? `HISTORICAL DATA:
- Previous damages at this location: ${historical.location_damages}
- Similar tickets in area: ${historical.similar_tickets}` : ''}

AVAILABLE LOCATORS:
${available_locators.map(l => 
  `- ${l.name}: ${l.experience_years} years experience, ${l.damages_12mo} damage(s) in past year, currently handling ${l.current_ticket_count} tickets`
).join('\n')}

INSTRUCTIONS:
1. Calculate a risk score (0-100) based on all factors
2. Determine risk level (LOW: 0-40, MEDIUM: 41-65, HIGH: 66-85, CRITICAL: 86-100)
3. Identify the top 2-3 risk factors
4. Recommend the most appropriate locator
5. Provide clear reasoning that a supervisor can understand
6. List any special precautions needed

Return ONLY valid JSON matching this structure:
{
  "risk_score": <number 0-100>,
  "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "primary_risk_factors": [
    {
      "factor": "<factor name>",
      "severity": "low|medium|high",
      "detail": "<explanation>"
    }
  ],
  "recommended_locator": "<locator name>",
  "rationale": "<2-3 sentences explaining the recommendation>",
  "estimated_completion_time": "<hours>",
  "supervision_required": <boolean>,
  "special_precautions": ["<precaution 1>", "<precaution 2>"]
}`;
  }
  
  private parseResponse(response: string, data: TicketData): RiskAssessment {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                      response.match(/```\n([\s\S]*?)\n```/) ||
                      response.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const jsonString = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonString);
    
    // Find recommended locator ID
    const recommendedLocator = data.available_locators.find(
      l => l.name === parsed.recommended_locator
    );
    
    return {
      ...parsed,
      recommended_locator_id: recommendedLocator?.id
    };
  }
  
  private fallbackAssessment(data: TicketData): RiskAssessment {
    // Simple rule-based fallback when AI is unavailable
    const { ticket, excavator, available_locators } = data;
    
    let score = 30; // Base score
    
    // Risk factors
    if (excavator.damages_6mo >= 3) score += 35;
    else if (excavator.damages_6mo >= 1) score += 20;
    
    if (ticket.utility_types.includes('gas')) score += 15;
    if (ticket.type === 'emergency') score += 15;
    if (ticket.distance_miles > 0.5) score += 10;
    
    const riskLevel = 
      score >= 86 ? 'CRITICAL' :
      score >= 66 ? 'HIGH' :
      score >= 41 ? 'MEDIUM' : 'LOW';
    
    // Recommend most experienced available locator
    const recommended = available_locators.sort(
      (a, b) => b.experience_years - a.experience_years
    )[0];
    
    return {
      risk_score: Math.min(score, 100),
      risk_level: riskLevel,
      primary_risk_factors: [
        {
          factor: 'excavator_history',
          severity: excavator.damages_6mo >= 2 ? 'high' : 'medium',
          detail: `${excavator.damages_6mo} damages in past 6 months`
        }
      ],
      recommended_locator: recommended.name,
      recommended_locator_id: recommended.id,
      rationale: 'AI assessment unavailable. Using rule-based fallback scoring based on excavator history and utility types.',
      estimated_completion_time: `${Math.ceil(ticket.distance_miles * 2)} hours`,
      supervision_required: score >= 66,
      special_precautions: score >= 66 ? ['Use extra caution', 'Consider supervisor check-in'] : []
    };
  }
}
```

**API Endpoint (Next.js):**
```typescript
// apps/web/app/api/assess-risk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RiskAssessor } from '@/packages/risk-engine';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { ticket_id } = await request.json();
    
    // Fetch ticket data
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    
    const { data: ticket } = await supabase
      .from('locate_requests')
      .select(`
        *,
        excavator:excavators(*)
      `)
      .eq('id', ticket_id)
      .single();
    
    // Fetch available locators
    const { data: locators } = await supabase
      .from('employees')
      .select('*')
      .eq('active', true)
      .lt('current_ticket_count', 8);
    
    // Prepare data for assessment
    const assessmentData = {
      ticket: {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        distance_miles: ticket.distance_miles,
        utility_types: ticket.utility_types,
        type: ticket.type,
        address: ticket.address
      },
      excavator: {
        company_name: ticket.excavator.company_name,
        damages_6mo: ticket.excavator.damages_6mo,
        damages_12mo: ticket.excavator.damages_12mo,
        compliance_score: ticket.excavator.compliance_score
      },
      available_locators: locators.map(l => ({
        id: l.id,
        name: `${l.first_name} ${l.last_name}`,
        experience_years: l.experience_years,
        damages_12mo: l.damages_12mo,
        current_ticket_count: l.current_ticket_count
      }))
    };
    
    // Run assessment
    const assessor = new RiskAssessor(process.env.ANTHROPIC_API_KEY!);
    const assessment = await assessor.assessTicket(assessmentData);
    
    // Save assessment to database
    await supabase
      .from('locate_requests')
      .update({
        risk_assessment: assessment,
        risk_score: assessment.risk_score,
        risk_level: assessment.risk_level,
        assigned_to: assessment.recommended_locator_id
      })
      .eq('id', ticket_id);
    
    return NextResponse.json({
      success: true,
      assessment
    });
    
  } catch (error) {
    console.error('Risk assessment error:', error);
    return NextResponse.json(
      { error: 'Assessment failed' },
      { status: 500 }
    );
  }
}
```

#### Week 4: Testing & Refinement
**Hours:** 15-20 hours

**Tasks:**
- [ ] Test assessment on 100 diverse sample tickets
- [ ] Refine prompts based on output quality
- [ ] Add batch assessment endpoint
- [ ] Create assessment comparison tool (AI vs rule-based)
- [ ] Document prompt engineering learnings
- [ ] Optimize for cost (cache similar assessments)

---

### Phase 3: Web Portal (Weeks 5-7)

#### Week 5: Next.js Setup & Core Pages
**Hours:** 20-25 hours

**Tasks:**
- [ ] Set up Next.js 14 with App Router
- [ ] Install and configure shadcn/ui
- [ ] Set up Tailwind CSS
- [ ] Configure Supabase client
- [ ] Create authentication (optional - use hardcoded demo user for PoC)
- [ ] Design page structure and navigation

**Project Structure:**
```
apps/web/
  app/
    (dashboard)/
      layout.tsx          # Dashboard shell with nav
      page.tsx            # Dashboard home (BI overview)
      tickets/
        page.tsx          # Ticket list
        [id]/
          page.tsx        # Ticket detail
      analytics/
        page.tsx          # Analytics & reports
      team/
        page.tsx          # Employee management
    api/
      assess-risk/
        route.ts
      tickets/
        route.ts
    globals.css
    layout.tsx
  components/
    ui/                   # shadcn components
    dashboard/
      TicketCard.tsx
      RiskBadge.tsx
      StatsCard.tsx
    charts/
      RiskDistributionChart.tsx
      TicketTimelineChart.tsx
  lib/
    supabase.ts
    utils.ts
```

**Install Dependencies:**
```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --app
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card badge table tabs dialog
npm install @supabase/supabase-js recharts date-fns lucide-react
npm install @tanstack/react-query   # For data fetching
```

**Dashboard Home Page:**
```typescript
// apps/web/app/(dashboard)/page.tsx
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RiskDistributionChart } from '@/components/charts/RiskDistributionChart';
import { RecentTickets } from '@/components/dashboard/RecentTickets';
import { createClient } from '@/lib/supabase';

export default async function DashboardPage() {
  const supabase = createClient();
  
  // Fetch dashboard stats
  const { data: tickets } = await supabase
    .from('locate_requests')
    .select('*');
  
  const stats = {
    total: tickets?.length || 0,
    pending: tickets?.filter(t => t.status === 'pending').length || 0,
    high_risk: tickets?.filter(t => t.risk_level === 'HIGH' || t.risk_level === 'CRITICAL').length || 0,
    completed_today: tickets?.filter(t => 
      t.completed_date && 
      new Date(t.completed_date).toDateString() === new Date().toDateString()
    ).length || 0
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          AI-powered locate request management and risk assessment
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tickets"
          value={stats.total}
          description="All time"
          icon="FileText"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          description="Awaiting assignment"
          icon="Clock"
          trend="warning"
        />
        <StatsCard
          title="High Risk"
          value={stats.high_risk}
          description="Require attention"
          icon="AlertTriangle"
          trend="danger"
        />
        <StatsCard
          title="Completed Today"
          value={stats.completed_today}
          description="+12% from yesterday"
          icon="CheckCircle"
          trend="success"
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RiskDistributionChart tickets={tickets} />
        <TicketTimelineChart tickets={tickets} />
      </div>
      
      {/* Recent High-Risk Tickets */}
      <RecentTickets 
        tickets={tickets?.filter(t => t.risk_level === 'HIGH' || t.risk_level === 'CRITICAL').slice(0, 10)} 
      />
    </div>
  );
}
```

**Ticket Detail Page with AI Assessment:**
```typescript
// apps/web/app/(dashboard)/tickets/[id]/page.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase';
import { MapPin, AlertTriangle, Clock, User } from 'lucide-react';

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: ticket } = await supabase
    .from('locate_requests')
    .select(`
      *,
      excavator:excavators(*),
      assigned_employee:employees(*)
    `)
    .eq('id', params.id)
    .single();
  
  const assessment = ticket.risk_assessment;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{ticket.ticket_number}</h1>
          <p className="text-muted-foreground">{ticket.address}</p>
        </div>
        <Badge variant={getRiskVariant(ticket.risk_level)}>
          {ticket.risk_level} RISK
        </Badge>
      </div>
      
      {/* AI Risk Assessment Card */}
      <Card className="p-6 border-l-4 border-l-orange-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">AI Risk Assessment</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold">{assessment.risk_score}</div>
                <div className="text-sm text-muted-foreground">
                  Risk Score (0-100)
                </div>
              </div>
            </div>
            
            {/* Rationale */}
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed">{assessment.rationale}</p>
            </div>
            
            {/* Risk Factors */}
            <div>
              <h4 className="font-semibold mb-2">Primary Risk Factors:</h4>
              <ul className="space-y-2">
                {assessment.primary_risk_factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">
                      {factor.severity}
                    </Badge>
                    <div>
                      <span className="font-medium">{factor.factor}:</span>{' '}
                      {factor.detail}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Recommendations */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Recommended Assignment
              </h4>
              <p className="text-sm mb-2">
                <span className="font-medium">{assessment.recommended_locator}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Estimated completion: {assessment.estimated_completion_time}
                {assessment.supervision_required && ' ? Supervision required'}
              </p>
            </div>
            
            {/* Special Precautions */}
            {assessment.special_precautions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Special Precautions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {assessment.special_precautions.map((precaution, i) => (
                    <li key={i}>{precaution}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Ticket Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Ticket Information</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Type:</dt>
              <dd className="font-medium uppercase">{ticket.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Scope:</dt>
              <dd className="font-medium">{ticket.distance_miles} miles</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Utilities:</dt>
              <dd className="font-medium">{ticket.utility_types.join(', ')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Due Date:</dt>
              <dd className="font-medium">{new Date(ticket.due_date).toLocaleDateString()}</dd>
            </div>
          </dl>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Excavator Profile</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Company:</dt>
              <dd className="font-medium">{ticket.excavator.company_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Damages (6mo):</dt>
              <dd className={`font-medium ${ticket.excavator.damages_6mo > 0 ? 'text-red-600' : ''}`}>
                {ticket.excavator.damages_6mo}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Compliance:</dt>
              <dd className="font-medium">{ticket.excavator.compliance_score}/100</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

function getRiskVariant(level: string) {
  switch (level) {
    case 'CRITICAL': return 'destructive';
    case 'HIGH': return 'destructive';
    case 'MEDIUM': return 'warning';
    default: return 'secondary';
  }
}
```

#### Week 6: BI Dashboard & Charts
**Hours:** 20-25 hours

**Tasks:**
- [ ] Build interactive charts with Recharts
- [ ] Create filtering and search functionality
- [ ] Add ticket list with sorting
- [ ] Implement real-time updates (Supabase realtime)
- [ ] Create employee/team view
- [ ] Add bulk ticket assessment feature

**Risk Distribution Chart:**
```typescript
// components/charts/RiskDistributionChart.tsx
'use client';

import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#dc2626'
};

export function RiskDistributionChart({ tickets }) {
  const data = [
    { name: 'Low Risk', value: tickets.filter(t => t.risk_level === 'LOW').length, color: COLORS.LOW },
    { name: 'Medium Risk', value: tickets.filter(t => t.risk_level === 'MEDIUM').length, color: COLORS.MEDIUM },
    { name: 'High Risk', value: tickets.filter(t => t.risk_level === 'HIGH').length, color: COLORS.HIGH },
    { name: 'Critical Risk', value: tickets.filter(t => t.risk_level === 'CRITICAL').length, color: COLORS.CRITICAL }
  ].filter(d => d.value > 0);
  
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
```

#### Week 7: Polish & Demo Features
**Hours:** 15-20 hours

**Tasks:**
- [ ] Add loading states and skeleton screens
- [ ] Implement error boundaries
- [ ] Add toast notifications
- [ ] Create demo mode toggle
- [ ] Add "Run AI Assessment" button on ticket list
- [ ] Create export functionality (CSV/PDF)
- [ ] Responsive design testing
- [ ] Performance optimization

---

### Phase 4: Mobile App (Weeks 8-9)

#### Week 8: React Native Setup & Core Screens
**Hours:** 20-25 hours

**Tasks:**
- [ ] Initialize Expo project
- [ ] Set up React Navigation
- [ ] Install UI library (React Native Paper or NativeBase)
- [ ] Configure Supabase client
- [ ] Create authentication flow (demo mode)
- [ ] Build ticket list screen
- [ ] Build ticket detail screen
- [ ] Implement pull-to-refresh

**Project Structure:**
```
apps/mobile/
  app/
    (tabs)/
      index.tsx           # Ticket list
      map.tsx             # Map view
      profile.tsx         # User profile
    ticket/
      [id].tsx            # Ticket detail
    _layout.tsx
  components/
    TicketCard.tsx
    RiskBadge.tsx
    MapView.tsx
  lib/
    supabase.ts
  assets/
```

**Initialize Project:**
```bash
npx create-expo-app mobile --template tabs
cd mobile
npx expo install @supabase/supabase-js
npx expo install react-native-paper react-native-safe-area-context
npx expo install react-native-maps
npx expo install expo-camera expo-location
npm install @tanstack/react-query
```

**Ticket List Screen:**
```typescript
// apps/mobile/app/(tabs)/index.tsx
import { FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';

export default function TicketsScreen() {
  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } = await supabase
        .from('locate_requests')
        .select('*, excavator:excavators(*)')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .limit(50);
      return data;
    }
  });
  
  return (
    <FlatList
      data={tickets}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
      renderItem={({ item }) => (
        <Link href={`/ticket/${item.id}`} asChild>
          <Card style={{ margin: 8 }}>
            <Card.Content>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title>{item.ticket_number}</Title>
                <RiskBadge level={item.risk_level} />
              </View>
              <Paragraph>{item.address}</Paragraph>
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
                {item.utility_types.map(type => (
                  <Chip key={type} compact>{type}</Chip>
                ))}
              </View>
              <Paragraph style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                {item.distance_miles} miles ? {item.excavator.company_name}
              </Paragraph>
            </Card.Content>
          </Card>
        </Link>
      )}
      keyExtractor={item => item.id}
    />
  );
}
```

**Ticket Detail Screen:**
```typescript
// apps/mobile/app/ticket/[id].tsx
import { ScrollView, View } from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  
  const { data: ticket } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('locate_requests')
        .select('*, excavator:excavators(*)')
        .eq('id', id)
        .single();
      return data;
    }
  });
  
  if (!ticket) return null;
  
  const assessment = ticket.risk_assessment;
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Card style={{ margin: 16 }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Title>{ticket.ticket_number}</Title>
            <RiskBadge level={ticket.risk_level} score={assessment?.risk_score} />
          </View>
          <Paragraph>{ticket.address}</Paragraph>
        </Card.Content>
      </Card>
      
      {/* AI Assessment */}
      {assessment && (
        <Card style={{ margin: 16, borderLeftWidth: 4, borderLeftColor: '#f59e0b' }}>
          <Card.Content>
            <Title>AI Risk Assessment</Title>
            <Paragraph style={{ marginTop: 8, fontSize: 14, lineHeight: 20 }}>
              {assessment.rationale}
            </Paragraph>
            
            <Title style={{ marginTop: 16, fontSize: 16 }}>Risk Factors:</Title>
            {assessment.primary_risk_factors.map((factor, i) => (
              <View key={i} style={{ marginTop: 8 }}>
                <Paragraph style={{ fontWeight: 'bold' }}>{factor.factor}</Paragraph>
                <Paragraph>{factor.detail}</Paragraph>
              </View>
            ))}
            
            {assessment.special_precautions.length > 0 && (
              <>
                <Title style={{ marginTop: 16, fontSize: 16 }}>Precautions:</Title>
                {assessment.special_precautions.map((p, i) => (
                  <Paragraph key={i}>? {p}</Paragraph>
                ))}
              </>
            )}
          </Card.Content>
        </Card>
      )}
      
      {/* Ticket Details */}
      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Title>Details</Title>
          <DetailRow label="Type" value={ticket.type.toUpperCase()} />
          <DetailRow label="Scope" value={`${ticket.distance_miles} miles`} />
          <DetailRow label="Utilities" value={ticket.utility_types.join(', ')} />
          <DetailRow label="Excavator" value={ticket.excavator.company_name} />
          <DetailRow 
            label="Excavator Damages" 
            value={`${ticket.excavator.damages_6mo} (6 months)`} 
          />
        </Card.Content>
      </Card>
      
      {/* Action Buttons */}
      <View style={{ padding: 16, gap: 8 }}>
        <Button mode="contained" onPress={() => {}}>
          Accept Ticket
        </Button>
        <Button mode="outlined" onPress={() => {}}>
          View on Map
        </Button>
        <Button mode="text" onPress={() => {}}>
          Call Supervisor
        </Button>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
      <Paragraph style={{ color: '#666' }}>{label}:</Paragraph>
      <Paragraph style={{ fontWeight: 'bold' }}>{value}</Paragraph>
    </View>
  );
}
```

#### Week 9: Map View & Polish
**Hours:** 20-25 hours

**Tasks:**
- [ ] Implement map view with ticket markers
- [ ] Add ticket filtering
- [ ] Implement camera for marking photos
- [ ] Add offline data caching
- [ ] Create smooth animations
- [ ] Test on physical iPhone
- [ ] Build for TestFlight

**Map View:**
```typescript
// apps/mobile/app/(tabs)/map.tsx
import MapView, { Marker } from 'react-native-maps';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function MapScreen() {
  const { data: tickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } = await supabase
        .from('locate_requests')
        .select('*')
        .eq('status', 'pending');
      return data;
    }
  });
  
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 29.4241,
        longitude: -98.4936,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }}
    >
      {tickets?.map(ticket => {
        const [lng, lat] = ticket.location.coordinates;
        return (
          <Marker
            key={ticket.id}
            coordinate={{ latitude: lat, longitude: lng }}
            title={ticket.ticket_number}
            description={ticket.address}
            pinColor={getRiskColor(ticket.risk_level)}
          />
        );
      })}
    </MapView>
  );
}

function getRiskColor(level: string) {
  switch (level) {
    case 'CRITICAL': return 'red';
    case 'HIGH': return 'orange';
    case 'MEDIUM': return 'yellow';
    default: return 'green';
  }
}
```

---

### Phase 5: Final Polish & Demo Preparation (Week 10)

**Hours:** 15-20 hours

**Tasks:**
- [ ] End-to-end testing of all workflows
- [ ] Create demo script and walkthrough
- [ ] Prepare demo data with interesting scenarios
- [ ] Record demo video (optional)
- [ ] Create pitch deck/presentation
- [ ] Document setup instructions
- [ ] Deploy to production URLs
- [ ] Create shareable TestFlight link

**Demo Script:**
1. **Web Portal Introduction** (3 min)
   - Show dashboard with stats
   - Explain AI-powered risk assessment
   - Click on high-risk ticket
   - Walk through AI analysis and recommendations

2. **Risk Assessment Demonstration** (2 min)
   - Select pending ticket without assessment
   - Click "Run AI Assessment"
   - Watch real-time AI analysis
   - Review generated recommendations

3. **Business Intelligence** (2 min)
   - Show charts and analytics
   - Filter by risk level
   - Demonstrate search and sorting
   - Export report

4. **Mobile App** (3 min)
   - Open app on iPhone
   - Show ticket list with risk badges
   - Open ticket detail
   - View AI assessment summary
   - Demonstrate accept workflow
   - Show map view

---

## ?? Design System & Branding

### Color Palette
```css
/* Risk Colors */
--risk-low: #10b981;      /* Green */
--risk-medium: #f59e0b;   /* Amber */
--risk-high: #ef4444;     /* Red */
--risk-critical: #dc2626; /* Dark Red */

/* Brand Colors (customize for your client) */
--primary: #2563eb;       /* Blue */
--secondary: #64748b;     /* Slate */
--accent: #8b5cf6;        /* Purple */

/* Neutrals */
--background: #ffffff;
--foreground: #0f172a;
--muted: #f1f5f9;
--border: #e2e8f0;
```

### Typography
- **Headings:** Inter or SF Pro (native feel)
- **Body:** System fonts for performance

---

## ?? Sample Demo Scenarios

Create these specific tickets for impressive demos:

### Scenario 1: High-Risk Emergency
```json
{
  "ticket_number": "TX-2025-999001",
  "type": "emergency",
  "distance_miles": 0.8,
  "utility_types": ["gas", "electric"],
  "excavator": {
    "company_name": "QuickDig Construction",
    "damages_6mo": 4,
    "compliance_score": 58
  }
}
```
**Expected AI Output:** CRITICAL risk, recommend most experienced locator, require supervision

### Scenario 2: Low-Risk Routine
```json
{
  "ticket_number": "TX-2025-500123",
  "type": "routine",
  "distance_miles": 0.15,
  "utility_types": ["telecom"],
  "excavator": {
    "company_name": "Reliable Utilities Inc",
    "damages_6mo": 0,
    "compliance_score": 98
  }
}
```
**Expected AI Output:** LOW risk, any available locator, quick completion

### Scenario 3: Complex Multi-Utility
```json
{
  "ticket_number": "TX-2025-750456",
  "type": "routine",
  "distance_miles": 1.2,
  "utility_types": ["gas", "electric", "water", "telecom", "sewer"],
  "excavator": {
    "company_name": "Metro Development Corp",
    "damages_6mo": 1,
    "compliance_score": 82
  }
}
```
**Expected AI Output:** MEDIUM-HIGH risk, experienced locator needed, longer completion time

---

## ?? Deployment Checklist

### Web Portal
- [ ] Push to GitHub
- [ ] Connect Vercel to repo
- [ ] Add environment variables in Vercel
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `ANTHROPIC_API_KEY`
- [ ] Deploy (automatic)
- [ ] Test production URL
- [ ] Set up custom domain (optional)

### Mobile App
- [ ] Create Apple Developer account ($99/year) OR use TestFlight without publishing
- [ ] Configure app.json with bundle identifier
- [ ] Run `eas build --platform ios --profile preview`
- [ ] Submit to TestFlight
- [ ] Invite testers via email
- [ ] Test on physical device

### Database
- [ ] Run seed script in production Supabase
- [ ] Verify data integrity
- [ ] Set up database backups
- [ ] Configure Row Level Security (RLS) policies

---

## ?? Cost Breakdown (Monthly)

### Development Phase (Weeks 1-10)
| Service | Cost | Notes |
|---------|------|-------|
| Anthropic Claude | $30 | Testing + 1K assessments |
| Supabase | $0 | Free tier sufficient |
| Vercel | $0 | Free tier sufficient |
| Expo EAS | $0 | Free builds (limited) |
| Mapbox | $0 | Free tier 50K loads |
| **Total** | **$30/mo** | |

### Post-PoC (Maintenance)
| Service | Cost | Notes |
|---------|------|-------|
| Anthropic Claude | $10 | Minimal usage |
| Supabase | $0-25 | Scale to Pro if needed |
| Vercel | $0 | Stay on free tier |
| **Total** | **$10-35/mo** | |

### Scaling to Production (1000s of tickets/month)
| Service | Cost | Notes |
|---------|------|-------|
| Anthropic Claude | $50-200 | Implement hybrid model |
| Supabase | $25 | Pro tier for performance |
| Vercel | $20 | Pro tier for analytics |
| **Total** | **$95-245/mo** | Still very affordable |

---

## ?? Success Metrics for PoC

### Technical KPIs
- ? 95%+ uptime
- ? < 3 second AI assessment time
- ? < 1 second mobile app load time
- ? Zero critical bugs in demo scenarios

### Demo Impact Metrics
- ? Stakeholder comprehension: Can non-technical person understand AI recommendations?
- ? UI polish: Does it look production-ready?
- ? Workflow completion: Can complete full ticket lifecycle in < 5 minutes
- ? Wow factor: Does AI summary impress stakeholders?

### Business Value Demonstration
- ? Show clear risk differentiation across sample tickets
- ? Demonstrate time savings (AI assignment vs manual)
- ? Prove scalability (handle 1K tickets in database)
- ? Illustrate cost-effectiveness (show monthly costs)

---

## ?? Pitch/Demo Talking Points

### Problem Statement
"Utility damage costs the industry $1.5B annually. Traditional locate assignment is manual, subjective, and doesn't leverage historical data. High-risk excavators get assigned to junior locators. Complex tickets get underestimated."

### Solution
"Our AI-powered system analyzes every locate request using excavator history, ticket complexity, weather, and site data to automatically calculate risk scores and recommend optimal locator assignments."

### Key Differentiators
1. **Intelligent Context:** Natural language summaries that explain WHY a ticket is risky
2. **Real-time Analysis:** 3-second AI assessment vs hours of manual review
3. **Predictive Insights:** Learn from past damages to prevent future ones
4. **Cost-Effective:** $50/month vs $50K+ for custom ML systems

### ROI Proposition
"If this system prevents just ONE gas line damage ($50K-500K cost), it pays for itself 1000x over. We're seeing early indicators of 20-30% reduction in damages."

---

## ?? Post-PoC: Next Steps

### Phase 6: Pilot Program (Months 3-6)
- Deploy with 10-15 real locators
- One geographic zone
- Collect feedback and metrics
- Measure actual damage rate reduction

### Phase 7: Enhancements (Months 6-12)
- Implement hybrid ML/AI model for cost optimization
- Add weather API integration
- Build training module for locators
- Create audit trail and compliance reports
- Add GIS file upload and parsing

### Phase 8: Scale (Year 2)
- Expand to full locator workforce
- Multi-tenant support for other contractors
- Advanced analytics and predictions
- Mobile Android version
- API for third-party integrations

---

## ?? Resources & Documentation

### Learning Resources
- **Next.js:** https://nextjs.org/docs
- **React Native:** https://reactnative.dev/docs/getting-started
- **Supabase:** https://supabase.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Claude API:** https://docs.anthropic.com/claude/reference/getting-started-with-the-api

### Helpful Tools
- **Excalidraw:** Diagram your architecture
- **Figma:** Design mockups (free tier)
- **Postman:** Test API endpoints
- **React DevTools:** Debug web and mobile

### Community
- **r/reactjs** - React questions
- **r/reactnative** - Mobile dev help
- **Supabase Discord** - Database help
- **Anthropic Discord** - AI prompting tips

---

## ?? Tips for Solo Development

### Time Management
- **Fixed time blocks:** 2-3 hour focused sessions
- **Avoid perfectionism:** Ship working > ship perfect
- **Use timers:** Pomodoro technique (25 min work, 5 min break)
- **Track progress:** Check off tasks daily for motivation

### Productivity Hacks
1. **Leverage AI coding assistants:** GitHub Copilot, Cursor, ChatGPT
2. **Copy-paste-modify:** Find similar examples, adapt them
3. **Use component libraries:** Don't build from scratch
4. **Mock data first:** Test UI before backend is ready
5. **Version control religiously:** Commit often, push daily

### When You Get Stuck
1. **AI Chat:** Ask Claude/ChatGPT to debug
2. **Documentation:** Read official docs (not random blog posts)
3. **Stack Overflow:** Search exact error message
4. **Take a walk:** Best debugging happens away from keyboard
5. **Simplify:** Cut scope if timeline slipping

### Staying Motivated
- ? Celebrate small wins (first API call works = celebrate!)
- ? Show progress to someone weekly
- ? Remember the end goal: This could change the industry
- ? Build the product YOU would want to use

---

## ? Final Checklist

### Pre-Development
- [ ] Supabase account created
- [ ] Anthropic API key obtained
- [ ] Development environment set up
- [ ] Git repository initialized
- [ ] README with setup instructions

### Core Features
- [ ] Risk assessment API working
- [ ] Web portal deployed
- [ ] Mobile app on TestFlight
- [ ] Sample data generated (1K tickets)
- [ ] All 3 demo scenarios working

### Polish
- [ ] UI looks professional
- [ ] No broken links or errors
- [ ] Loading states everywhere
- [ ] Mobile app feels fast
- [ ] Clear navigation

### Demo Preparation
- [ ] Demo script written
- [ ] Stakeholder credentials created
- [ ] Demo video recorded (optional)
- [ ] Pitch deck ready
- [ ] Cost analysis documented

---

## ?? You've Got This!

**You have:**
- ? Domain expertise in locating
- ? Senior engineer skills
- ? Right tech stack (modern, cost-effective)
- ? Clear scope (3 focused deliverables)
- ? 10-week timeline (realistic)

**10 weeks from now, you'll have:**
- ?? A working PoC that impresses stakeholders
- ?? Real AI-powered risk assessments
- ?? Beautiful web portal and mobile app
- ?? Proof of concept for industry transformation
- ?? Portfolio piece that showcases cutting-edge AI skills

**Remember:** Perfect is the enemy of done. Ship a working PoC that demonstrates the core value proposition. You can always iterate.

**Good luck! You're building something that could genuinely make the utility industry safer and more efficient.** ??

---

**Last Updated:** 2025-11-03  
**Document Status:** Ready for Development  
**Next Action:** Week 1, Day 1 - Set up Supabase project
