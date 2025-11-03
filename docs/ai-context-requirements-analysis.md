# AI Context Requirements Analysis
## Claude 3.5 Sonnet for Utility Locate Risk Assessment

**Purpose:** Define exactly what data, technologies, and assets are required for AI-powered risk assessment with human-in-the-loop decision support.

**Last Updated:** 2025-11-03

---

## ?? AI Capabilities Required

### 1. Risk Assessment & Scoring
**Capability:** Analyze all available data and calculate risk score (0-100)

**Output:**
- Numerical risk score
- Risk level classification (LOW/MEDIUM/HIGH/CRITICAL)
- Confidence score (how certain is the AI?)

### 2. Contextual Textual Summary
**Capability:** Generate human-readable explanation of WHY a ticket is risky

**Output Example:**
> "This 0.8-mile locate request involves high-pressure gas and primary electric lines in a congested urban corridor. QuickDig Construction has caused 4 utility damages in the past 6 months, including 2 gas line strikes within 3 miles of this location. The excavator's rapid excavation method and poor compliance history (58/100) create a HIGH risk scenario. Saturated soil conditions from recent heavy rain increase the likelihood of mechanical damage. **Immediate action required before excavation begins.**"

### 3. Human-in-the-Loop Triggers
**Capability:** Identify when supervisor intervention is needed

**Trigger Conditions:**
- Risk score ? 70 (HIGH or CRITICAL)
- Excavator with 3+ damages in 6 months
- Emergency tickets with gas utilities
- Low AI confidence (< 70%)
- Novel scenarios not seen in historical data
- Conflict between risk factors (e.g., low-risk excavator but complex ticket)

**Output:**
- Flag for supervisor review
- Recommended review timeline (immediate, within 1 hour, within 4 hours)
- Specific questions for supervisor to consider

### 4. Intelligent Recommendations
**Capability:** Provide actionable recommendations for supervisors

**Recommendation Types:**

#### A. Technician Assignment
- **Recommend specific technician** by name with reasoning
- **Alternative technicians** if first choice unavailable
- **Experience level required** (e.g., "3+ years with gas certification")
- **Why this technician:** "Sarah has 4.5 years experience, zero damages in past 2 years, and has successfully completed 12 similar tickets in this area"

#### B. Support & Supervision
- **Recommend supervision level:** None / Check-in at 50% / Full supervision
- **Specify supervisor actions:** "Supervisor should verify marks before excavation begins"
- **Communication plan:** "Schedule 30-minute pre-job conference call with excavator"

#### C. Equipment & Supplies
- **Additional equipment needed:**
  - Ground penetrating radar (GPR)
  - Vacuum excavation equipment
  - Extra marking paint (high-visibility)
  - Portable gas detector
  - High-accuracy locating equipment
- **Why needed:** Explain rationale for each item

#### D. Pre-Excavation Actions
- **Documentation requirements:**
  - "Photograph entire work area before excavation"
  - "Document all utility depths at test holes"
  - "Get written excavation plan from contractor"
- **Communication requirements:**
  - "Call CPS Energy gas ops before starting (512-555-0199)"
  - "Notify adjacent property owners"
  - "Request one-call refresh ticket if approaching expiration"
- **Verification requirements:**
  - "Verify gas line depths with utility owner records"
  - "Cross-reference GIS data with field conditions"

#### E. Confidence Level Assessment
- **Technician confidence gauge:** "After reviewing this assessment, do you feel confident proceeding? (Yes / Need Support / Reassign)"
- **Identify confidence gaps:** "This ticket involves fiber optic lines. Confirm technician has fiber locating certification."
- **Recommend confidence-building actions:** "Review historical photos from similar tickets in this area before starting"

### 5. Fallback & Graceful Degradation
**Capability:** Assess risk even with missing data, clearly stating limitations

**Fallback Behaviors:**
- Explicitly state what data is missing
- Estimate risk based on available data
- Increase recommended supervision level when uncertain
- Suggest data collection actions for future assessments

---

## ?? Required Data Context

### TIER 1: Critical Data (AI Cannot Function Without)

#### 1.1 Locate Request Data
**What AI Needs:**

```json
{
  "ticket_number": "TX-2025-123456",
  "type": "routine" | "emergency" | "non_compliant",
  "status": "pending" | "assigned" | "in_progress" | "completed",
  "requested_date": "2025-11-03T08:30:00Z",
  "due_date": "2025-11-05T16:00:00Z",
  
  "location": {
    "address": "1234 Main St, San Antonio, TX 78201",
    "coordinates": {
      "latitude": 29.4241,
      "longitude": -98.4936
    },
    "boundary_box": {
      "type": "Polygon",
      "coordinates": [[[lng, lat], [lng, lat], ...]]
    },
    "location_type": "residential" | "commercial" | "industrial" | "rural"
  },
  
  "scope": {
    "work_type": "excavation" | "boring" | "trenching" | "demolition",
    "depth": "in feet or 'unknown'",
    "distance_miles": 0.8,
    "estimated_linear_feet": 4224,
    "work_description": "Installing new water service line from main to building"
  },
  
  "utilities_in_scope": [
    {
      "type": "gas" | "electric" | "water" | "sewer" | "telecom" | "fiber" | "cable",
      "owner": "CPS Energy",
      "priority": "high" | "medium" | "low",
      "voltage_pressure": "high-pressure" | "primary" | "distribution" | "service"
    }
  ],
  
  "excavator": {
    "id": "uuid",
    "company_name": "ABC Construction",
    "contact": "John Doe",
    "phone": "210-555-0123"
  },
  
  "special_notes": "Near hospital, work during business hours only",
  "white_lined": true | false,
  "one_call_center_notes": "Multiple utilities in small area"
}
```

**Why Critical:** Cannot assess any risk without knowing what, where, and when.

**Fallback if Missing:**
- Cannot perform assessment
- Return error with specific missing fields
- Request manual review

---

#### 1.2 Excavator Profile & History
**What AI Needs:**

```json
{
  "excavator_id": "uuid",
  "company_name": "QuickDig Construction",
  "years_in_business": 8,
  
  "compliance_metrics": {
    "compliance_score": 58,  // 0-100
    "one_call_tickets_filed": 450,
    "late_tickets": 45,
    "no_show_rate": 0.12,  // 12%
    "pre_mark_rate": 0.65   // White-lining rate
  },
  
  "damage_history": {
    "damages_6mo": 4,
    "damages_12mo": 7,
    "damages_24mo": 12,
    "damages_all_time": 28,
    
    "by_utility_type": {
      "gas": 8,
      "electric": 12,
      "water": 5,
      "telecom": 3
    },
    
    "by_severity": {
      "minor": 15,      // No service disruption
      "major": 10,      // Service disruption, no injury
      "critical": 3     // Injury, explosion, evacuation
    },
    
    "at_fault_rate": 0.85,  // 85% of damages were excavator's fault
    
    "recent_incidents": [
      {
        "date": "2024-10-15",
        "utility_type": "gas",
        "severity": "major",
        "location": "within 3 miles of current ticket",
        "root_cause": "excavated without valid ticket",
        "estimated_cost": 125000
      }
    ]
  },
  
  "equipment_profile": {
    "primary_equipment": ["backhoe", "excavator", "trencher"],
    "uses_vacuum_excavation": false,
    "uses_hydro_excavation": false,
    "excavation_method": "mechanical"  // vs "trenchless"
  },
  
  "risk_indicators": {
    "damage_trend": "increasing" | "stable" | "decreasing",
    "last_damage_days_ago": 18,
    "average_days_between_damages": 62,
    "repeat_offender": true | false
  },
  
  "certifications": ["OSHA 30", "Trench Safety"],
  "insurance_status": "active" | "lapsed",
  
  "project_history_in_area": {
    "tickets_within_5mi": 23,
    "damages_within_5mi": 2,
    "familiar_with_area": true
  }
}
```

**Why Critical:** Excavator history is the #1 predictor of future damages.

**Fallback if Missing:**
- Use conservative risk estimate
- Increase recommended supervision
- Flag as "limited excavator data"
- Recommend gathering excavator information for future tickets

---

#### 1.3 Available Technician Pool
**What AI Needs:**

```json
{
  "employees": [
    {
      "id": "uuid",
      "employee_number": "LOC-1042",
      "name": "Sarah Johnson",
      "role": "senior_locator" | "locator" | "trainee",
      
      "experience": {
        "hire_date": "2019-03-15",
        "years_experience": 5.7,
        "years_with_company": 5.7,
        "prior_industry_experience": 2.0,
        "total_tickets_completed": 4250
      },
      
      "certifications": [
        {
          "type": "OUPS" | "NULCA" | "Gas" | "Electric" | "Fiber",
          "level": "certified" | "advanced" | "master",
          "expiration_date": "2026-12-31"
        }
      ],
      
      "specialties": ["gas", "high-voltage", "fiber_optics"],
      
      "performance_metrics": {
        "accuracy_rate": 0.98,  // 98%
        "damages_12mo": 0,
        "at_fault_damages_ever": 0,
        "average_completion_time_hours": 2.8,
        "rework_rate": 0.02,  // 2% of tickets required remarking
        "customer_satisfaction": 4.8  // 1-5 scale
      },
      
      "current_workload": {
        "tickets_today": 4,
        "tickets_this_week": 18,
        "max_capacity_daily": 8,
        "current_utilization": 0.50,  // 50%
        
        "ticket_breakdown": {
          "routine": 15,
          "high_risk": 3,
          "emergency": 0
        },
        
        "high_risk_percentage": 0.17  // 17% of tickets are high-risk
      },
      
      "territory": {
        "assigned_geo_fence": {
          "type": "Polygon",
          "coordinates": [[[lng, lat], ...]]
        },
        "covers_ticket_location": true | false,
        "distance_from_ticket_miles": 2.3
      },
      
      "availability": {
        "status": "available" | "busy" | "off_shift" | "on_leave",
        "shift_start": "07:00",
        "shift_end": "16:00",
        "current_location": {
          "latitude": 29.4500,
          "longitude": -98.5000,
          "last_updated": "2025-11-03T10:15:00Z"
        },
        "estimated_available_time": "2025-11-03T12:30:00Z"
      },
      
      "training_history": [
        {
          "course": "Advanced Gas Line Locating",
          "date": "2024-08-15",
          "instructor": "CPS Energy"
        }
      ],
      
      "notable_experience": [
        "Completed 50+ tickets for hospital expansion project",
        "Handled 3 emergency gas leak locates without incident"
      ]
    }
  ]
}
```

**Why Critical:** Cannot recommend technician assignment without knowing who's available and qualified.

**Fallback if Missing:**
- Recommend experience level instead of specific person
- Suggest manual assignment
- Provide generic guidance: "Assign experienced locator"

---

### TIER 2: Highly Important Data (Significantly Improves AI Assessment)

#### 2.1 GIS / Utility Infrastructure Data
**What AI Needs:**

```json
{
  "utility_lines": [
    {
      "id": "uuid",
      "utility_type": "gas",
      "owner": "CPS Energy",
      "material": "steel" | "plastic" | "cast_iron" | "copper",
      "diameter_inches": 6,
      "pressure": "high-pressure" | "medium-pressure" | "low-pressure",
      "voltage": null,  // for electric only
      
      "installation_date": "1985-06-20",
      "age_years": 39,
      "condition": "good" | "fair" | "poor" | "unknown",
      
      "depth": {
        "average_feet": 4.5,
        "min_feet": 3.0,
        "max_feet": 6.0,
        "verified": true | false,
        "last_verified_date": "2023-04-12"
      },
      
      "geometry": {
        "type": "LineString",
        "coordinates": [[lng, lat], [lng, lat], ...]
      },
      
      "criticality": "critical" | "high" | "medium" | "low",
      "service_count": 450,  // homes/businesses served by this line
      
      "last_maintained": "2023-09-08",
      "maintenance_history": [
        {
          "date": "2023-09-08",
          "type": "inspection",
          "notes": "No issues found"
        }
      ],
      
      "intersects_ticket": true | false,
      "distance_from_ticket_feet": 0,  // 0 = inside boundary
      
      "nearby_infrastructure": {
        "valves": 2,
        "manholes": 1,
        "pedestals": 0,
        "markers": 3
      }
    }
  ],
  
  "utility_density": {
    "total_lines_in_scope": 7,
    "types_in_scope": ["gas", "electric", "water", "telecom"],
    "congestion_level": "high" | "medium" | "low",
    "crossing_points": 3,  // where utilities cross each other
    "parallel_runs": 2  // utilities running parallel
  },
  
  "known_conflicts": [
    {
      "type": "inaccurate_records",
      "description": "GIS shows line 2 feet east of actual location per field notes",
      "reported_date": "2024-07-22"
    }
  ]
}
```

**Why Highly Important:**
- Shows exact utility locations vs ticket scope
- Identifies high-consequence utilities (high-pressure gas, high-voltage electric)
- Reveals utility congestion and complexity
- Highlights aged infrastructure more prone to damage

**Fallback if Missing:**
- Use utility types from ticket (less precise)
- Assume worst-case scenario (all utilities are high-consequence)
- Recommend GIS data review before excavation
- Increase risk score by 15-20 points for lack of data
- Flag: "?? No utility location data available - recommend on-site utility location verification"

---

#### 2.2 Historical Damage Incidents (Location-Based)
**What AI Needs:**

```json
{
  "damages_at_location": [
    {
      "incident_id": "uuid",
      "date": "2023-05-12",
      "location": {
        "latitude": 29.4241,
        "longitude": -98.4936,
        "address": "1230 Main St, San Antonio, TX",
        "distance_from_current_ticket_feet": 150
      },
      
      "utility_affected": {
        "type": "gas",
        "owner": "CPS Energy",
        "line_id": "uuid"
      },
      
      "severity": "major",
      "damage_type": "strike" | "nick" | "scrape" | "complete_break",
      
      "responsible_party": "excavator" | "locator" | "utility_owner" | "unknown",
      "excavator_company": "XYZ Contractors",
      "locator_company": "ULS Locating",
      
      "root_cause": "excavated without valid ticket" | "locator_error" | "inaccurate_records" | "equipment_failure" | "other",
      "detailed_cause": "Excavator did not wait for locates to be completed before digging",
      
      "consequences": {
        "service_disruption": true,
        "customers_affected": 127,
        "outage_duration_hours": 6,
        "evacuation_required": false,
        "injuries": 0,
        "property_damage": true
      },
      
      "costs": {
        "repair": 35000,
        "regulatory_fines": 50000,
        "service_credits": 5000,
        "total": 90000
      },
      
      "lessons_learned": "Utility was shallower than GIS records indicated. Records have been updated.",
      
      "corrective_actions": [
        "Updated GIS depth data",
        "Added warning flag for future tickets"
      ]
    }
  ],
  
  "damages_in_area": {
    "within_500ft": 1,
    "within_1000ft": 3,
    "within_1mi": 12,
    "in_zip_code": 45
  },
  
  "area_risk_indicators": {
    "damage_hotspot": true | false,
    "common_root_causes": ["shallow utilities", "congested corridor"],
    "seasonal_patterns": "More damages in wet season due to soft soil"
  }
}
```

**Why Highly Important:**
- Past damages at location indicate systemic issues (bad records, shallow utilities, etc.)
- Shows patterns and common failure modes
- Validates or contradicts GIS accuracy

**Fallback if Missing:**
- Use general damage statistics
- Cannot identify location-specific risks
- Recommend extra caution at unfamiliar locations
- Flag: "No historical damage data for this location"

---

#### 2.3 Weather & Environmental Data
**What AI Needs:**

```json
{
  "current_conditions": {
    "temperature_f": 72,
    "conditions": "partly cloudy" | "clear" | "rainy" | "stormy" | "foggy",
    "visibility_miles": 10,
    "wind_speed_mph": 8,
    "precipitation_today_inches": 0
  },
  
  "recent_weather": {
    "precipitation_48hrs_inches": 2.5,
    "precipitation_7days_inches": 4.0,
    "temperature_trend": "warming" | "cooling" | "stable",
    "days_since_last_rain": 0
  },
  
  "soil_conditions": {
    "soil_type": "clay" | "sand" | "loam" | "rock" | "mixed",
    "moisture_level": "saturated" | "wet" | "moist" | "dry" | "very_dry",
    "frost_depth_inches": 0,
    "ground_frozen": false
  },
  
  "work_impact": {
    "affects_locating": true | false,
    "affects_excavation": true | false,
    "impact_description": "Saturated clay soil increases mechanical damage risk and reduces locate signal quality",
    "recommended_adjustments": [
      "Use ground penetrating radar in addition to electromagnetic locating",
      "Increase tolerance markings to 24 inches",
      "Recommend hand-digging for utility exposure"
    ]
  },
  
  "forecast": {
    "next_48hrs": "Heavy rain expected, 2-3 inches",
    "excavation_recommendation": "Consider delaying excavation until ground conditions improve"
  }
}
```

**Why Highly Important:**
- Weather affects both locating accuracy and excavation safety
- Wet soil increases damage risk
- Frozen ground requires different techniques

**Fallback if Missing:**
- Use "unknown weather conditions"
- Recommend checking weather before starting
- Cannot factor weather into risk score (assume moderate)
- Flag: "Weather data unavailable - recommend on-site assessment"

---

### TIER 3: Valuable Data (Enhances AI Recommendations)

#### 3.1 Similar Ticket History (Pattern Recognition)
**What AI Needs:**

```json
{
  "similar_tickets": [
    {
      "ticket_number": "TX-2024-098234",
      "similarity_score": 0.92,  // 0-1, how similar to current ticket
      
      "similar_attributes": [
        "same_excavator",
        "same_utility_types",
        "similar_distance",
        "same_area"
      ],
      
      "outcome": "completed_successfully" | "damage_occurred" | "cancelled",
      
      "assigned_technician": {
        "name": "Mike Chen",
        "experience_at_time": 5.2
      },
      
      "completion_time_hours": 3.5,
      "issues_encountered": "Utility deeper than expected, required additional time",
      
      "notes": "Locator used GPR to verify depths before marking. Excavator was cooperative."
    }
  ],
  
  "pattern_insights": {
    "success_factors": [
      "Using GPR verification increased success rate by 40%",
      "Pre-job meetings with this excavator reduce damage risk"
    ],
    "risk_factors": [
      "This excavator's damage rate is 3x higher when working with gas utilities"
    ]
  }
}
```

**Why Valuable:**
- Learn from past successes and failures
- Identify patterns not obvious from raw data
- Calibrate time estimates

**Fallback if Missing:**
- Use general guidelines
- Cannot provide pattern-based insights
- Rely on general risk factors only

---

#### 3.2 Technician Performance by Scenario
**What AI Needs:**

```json
{
  "technician_id": "uuid",
  "performance_by_scenario": {
    "high_risk_tickets": {
      "count": 45,
      "success_rate": 1.00,  // 100%
      "average_time_hours": 4.2
    },
    "gas_utility_tickets": {
      "count": 320,
      "success_rate": 0.99,
      "average_time_hours": 3.1
    },
    "urban_congested_areas": {
      "count": 180,
      "success_rate": 0.97,
      "average_time_hours": 3.8
    },
    "difficult_excavators": {
      "count": 12,
      "success_rate": 1.00,
      "notes": "Excellent communication skills, de-escalates conflicts"
    }
  },
  
  "confidence_indicators": {
    "comfortable_with_gas": true,
    "comfortable_with_high_voltage": true,
    "comfortable_with_fiber": false,
    "comfortable_with_difficult_excavators": true
  }
}
```

**Why Valuable:**
- Match technician strengths to ticket requirements
- Identify confidence gaps
- Optimize assignment quality

**Fallback if Missing:**
- Use general experience level
- Cannot optimize for specific scenarios

---

#### 3.3 Real-Time Field Conditions
**What AI Needs:**

```json
{
  "traffic_conditions": "heavy" | "moderate" | "light",
  "travel_time_to_site_minutes": 15,
  
  "site_access": {
    "access_restrictions": "requires escort" | "gated community" | "open",
    "parking_available": true,
    "equipment_access": "full" | "limited" | "difficult"
  },
  
  "nearby_hazards": [
    "active_construction",
    "school_zone",
    "hospital_access_road"
  ],
  
  "time_constraints": {
    "restricted_hours": "8am-5pm only",
    "reason": "residential area noise ordinance"
  }
}
```

**Why Valuable:**
- Adjust time estimates for logistics
- Identify coordination requirements
- Flag special conditions

**Fallback if Missing:**
- Use standard time estimates
- Cannot account for logistics

---

## ??? Required Technologies

### 1. Primary Database: PostgreSQL with PostGIS
**Why PostgreSQL with PostGIS:**
- ? Spatial queries (find utilities intersecting ticket boundary)
- ? Full-text search (search ticket notes, addresses)
- ? JSONB for flexible data (risk assessments, metadata)
- ? Strong consistency and ACID compliance
- ? Excellent performance at scale
- ? Free and open-source

**Key PostGIS Functions Needed:**
```sql
-- Find utilities within ticket boundary
SELECT * FROM utility_lines 
WHERE ST_Intersects(geometry, ticket_boundary_box);

-- Find damages within 500 feet of ticket
SELECT * FROM damage_incidents
WHERE ST_DWithin(location::geography, ticket_location::geography, 152.4);  -- 500 feet in meters

-- Find technicians whose territory covers ticket
SELECT * FROM employees
WHERE ST_Contains(assigned_geo_fence, ticket_location);

-- Calculate distance from technician to ticket
SELECT *, ST_Distance(current_location::geography, ticket_location::geography) as distance_meters
FROM employees;
```

**Schema Design:**
- Use `GEOGRAPHY` type for lat/lng (handles earth curvature)
- Use `GEOMETRY` type for local projections (faster queries)
- Index all spatial columns with GiST indexes
- Partition damage_incidents by date for performance

---

### 2. Object Storage: S3-Compatible Storage
**Why Needed:**
- Store GIS files (shapefiles, KML, GeoJSON)
- Store field photos
- Store generated reports and documentation

**Options:**
- **Supabase Storage** (free tier: 1GB)
- **AWS S3** (pay-as-you-go)
- **Cloudflare R2** (no egress fees)

**PoC Recommendation:** Supabase Storage (integrated with database)

---

### 3. Vector Database (Optional but Powerful): Supabase + pgvector
**Why Useful:**
- Semantic similarity search for tickets
- "Find tickets similar to this one" using embeddings
- Pattern recognition across unstructured data

**How It Works:**
1. Generate embeddings for ticket descriptions using OpenAI/Anthropic
2. Store embeddings in pgvector
3. Query for similar tickets using cosine similarity

```sql
-- Find similar tickets
SELECT ticket_number, description, 
       1 - (embedding <=> query_embedding) as similarity
FROM locate_requests
ORDER BY embedding <=> query_embedding
LIMIT 10;
```

**PoC Recommendation:** Skip for Phase 1, add in Phase 2 for enhanced pattern recognition

---

### 4. Real-Time Communication: Supabase Realtime
**Why Needed:**
- Push notifications to supervisors when high-risk ticket detected
- Real-time dashboard updates
- Technician location tracking

**Alternative:** Firebase Cloud Messaging, Pusher, or WebSockets

**PoC Recommendation:** Supabase Realtime (included free)

---

### 5. Weather API: OpenWeatherMap or Weather.gov
**Why Needed:**
- Fetch current and forecast weather
- Assess environmental risk factors

**Options:**
- **OpenWeatherMap** (free tier: 1000 calls/day)
- **Weather.gov API** (free, US only)
- **WeatherAPI.com** (free tier: 1M calls/month)

**PoC Recommendation:** Weather.gov (free, no API key required)

---

### 6. Background Job Processing: Node.js with BullMQ
**Why Needed:**
- Async risk assessment (don't block ticket creation)
- Batch processing of tickets
- Scheduled jobs (re-assess tickets daily)
- Retry failed AI calls

**Technology Stack:**
- **BullMQ** + **Redis** for job queues
- **Node.js** workers

**PoC Recommendation:** Keep it simple - use Next.js API routes with async/await. Add job queue only if needed.

---

### 7. Monitoring & Logging: Sentry + Axiom
**Why Needed:**
- Track AI assessment failures
- Monitor API latency
- Debug production issues
- Track costs

**Options:**
- **Sentry** (error tracking, free tier: 5K events/mo)
- **Axiom** (log aggregation, free tier: 500MB/mo)
- **Datadog** (comprehensive but expensive)

**PoC Recommendation:** Sentry for error tracking, console.log for development

---

### 8. Caching: Redis (via Upstash)
**Why Needed:**
- Cache AI assessments for similar tickets
- Cache expensive database queries
- Store session data

**Options:**
- **Upstash Redis** (serverless, free tier: 10K commands/day)
- **Redis Cloud** (free tier: 30MB)

**PoC Recommendation:** Upstash Redis (serverless, no server management)

---

## ?? Data Assets to Generate for PoC

### Asset 1: Mock Excavators (50 companies)
**Data Fields:**
```json
{
  "company_name": "Generated using Faker.js + construction-related terms",
  "damages_6mo": "Weighted distribution (70% have 0, 20% have 1, 7% have 2, 3% have 3+)",
  "damages_12mo": "Proportional to 6mo",
  "compliance_score": "Normal distribution around 75-85, with outliers at 50-60 and 95-100",
  "years_in_business": "Random 1-30 years",
  "equipment_profile": "Realistic combinations",
  "certifications": "Appropriate for company size"
}
```

**Generation Strategy:**
1. Use Faker.js for company names and contact info
2. Use weighted random for damage history (most have 0-1, few have many)
3. Create 5-10 "problem excavators" with 3+ damages for demo
4. Create 5-10 "excellent excavators" with 0 damages and high compliance

**File Output:** `excavators.json` (50 records)

---

### Asset 2: Mock Employees / Locators (20-30 people)
**Data Fields:**
```json
{
  "name": "Faker.js generated",
  "employee_number": "LOC-0001 through LOC-0030",
  "experience_years": "Distribution: 30% novice (0-2 yrs), 50% experienced (2-5 yrs), 20% senior (5+ yrs)",
  "damages_12mo": "Weighted: 80% have 0, 15% have 1, 5% have 2",
  "certifications": "Appropriate for experience level",
  "specialties": "Random combination of utility types",
  "current_ticket_count": "Random 0-7",
  "assigned_geo_fence": "Divide San Antonio into ~20 zones, assign one per technician"
}
```

**Generation Strategy:**
1. Use realistic name distribution
2. Hire dates spanning past 10 years
3. Performance metrics correlated with experience
4. Create distinct personas:
   - "Rock star" locator: 8 years, 0 damages, high performance
   - "Solid" locators: 3-5 years, 0-1 damages
   - "Trainee" locators: <1 year, limited certifications
   - "Problem" locator: 1 damage, lower performance (edge case testing)

**Geo-Fencing Strategy:**
```javascript
// Divide San Antonio into grid
const sanAntonioCenter = [-98.4936, 29.4241];
const gridSize = 0.1; // ~7 miles

function generateGeoFence(row, col) {
  return turf.bboxPolygon([
    sanAntonioCenter[0] + (col * gridSize),
    sanAntonioCenter[1] + (row * gridSize),
    sanAntonioCenter[0] + ((col + 1) * gridSize),
    sanAntonioCenter[1] + ((row + 1) * gridSize)
  ]);
}
```

**File Output:** `employees.json` (25 records)

---

### Asset 3: Mock Locate Requests (1000 tickets)
**Data Fields - Match Texas 811 Format:**
```json
{
  "ticket_number": "TX-2025-NNNNNN (sequential)",
  "type": "Weighted: 85% routine, 10% non_compliant, 5% emergency",
  "work_to_begin": "Random date within next 7 days",
  "work_duration": "Random 1-30 days",
  
  "excavator_id": "Reference to excavators.json",
  "caller_name": "Faker.js person name",
  "caller_phone": "Faker.js phone",
  
  "work_site_address": "Real San Antonio addresses or generated",
  "nearest_intersection": "Generated cross-streets",
  "location": "Coordinates within San Antonio bounds",
  "county": "Bexar",
  
  "work_type": "Weighted distribution of realistic types",
  "work_extent": "Random 50-5000 linear feet",
  "work_description": "Template-based descriptions",
  
  "excavation_method": "Weighted: 60% mechanical, 20% boring, 15% trenching, 5% hand",
  "excavation_depth": "Random 1-10 feet, some 'unknown'",
  
  "white_lined": "70% true, 30% false",
  "marking_instructions": "Template-based",
  
  "utilities_affected": "Random 1-4 utility types, weighted by real-world frequency",
  
  "facility_owner_notified": ["CPS Energy", "AT&T", "SAWS", etc.],
  
  "remarks": "Generated or empty for most"
}
```

**Texas 811 Specific Fields:**
- Work Type Codes: "NEW INSTALL", "REPAIR", "MAINTENANCE", "DEMOLITION"
- County: Always "BEXAR" for San Antonio
- Response Required By: 48 hours for routine, immediate for emergency

**Generation Strategy:**
1. Use real San Antonio street addresses (scrape or use dataset)
2. Create realistic distribution of work types
3. Correlate ticket complexity with excavator risk profile for interesting demos
4. Generate 100 tickets with known interesting scenarios:
   - High-risk excavator + gas utility + congested area (10 tickets)
   - Low-risk excavator + simple work (30 tickets)
   - Emergency tickets with varying risk factors (10 tickets)
   - Multi-utility complex tickets (20 tickets)
   - Novel scenarios for AI confidence testing (10 tickets)

**Use Claude to Generate Realistic Work Descriptions:**
```javascript
const prompt = `Generate 20 realistic excavation work descriptions for utility locate tickets in San Antonio, Texas. Include:
- New water service installations
- Gas line repairs
- Telecom conduit boring
- Foundation excavation
- Landscaping projects
Each 1-2 sentences.`;
```

**File Output:** `locate_requests.json` (1000 records)

---

### Asset 4: Mock GIS / Utility Data
**What to Generate:**
- Utility line geometries covering San Antonio
- Mix of gas, electric, water, telecom, sewer

**Data Structure:**
```geojson
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [[-98.4936, 29.4241], [-98.4930, 29.4245], ...]
      },
      "properties": {
        "utility_type": "gas",
        "owner": "CPS Energy",
        "material": "steel",
        "diameter_inches": 6,
        "pressure": "high-pressure",
        "installation_year": 1985,
        "depth_feet": 4.5,
        "criticality": "high",
        "service_count": 450
      }
    }
  ]
}
```

**Generation Strategy:**

**Option 1: AI-Generated (Recommended for PoC)**
```javascript
// Use Claude to generate realistic utility networks
const prompt = `Generate a GeoJSON FeatureCollection representing a realistic utility network for a 2-mile x 2-mile area in San Antonio, Texas (centered at -98.4936, 29.4241).

Include:
- 30 gas lines (mix of high-pressure transmission and distribution)
- 40 electric lines (mix of primary and secondary)
- 25 water lines (mix of mains and services)
- 30 telecom lines (mix of fiber and copper)
- 15 sewer lines

Requirements:
- Lines should follow realistic street grid patterns (mostly straight with 90-degree turns)
- Each line segment should be 0.1 to 0.5 miles long
- Include realistic property data (material, depth, age, etc.)
- Some lines should run parallel (in same utility corridor)
- Some lines should cross each other
- Use realistic San Antonio geography

Return ONLY valid GeoJSON, no explanation.`;
```

**Option 2: Procedural Generation**
```javascript
// Generate grid-based utility network
function generateUtilityNetwork(center, gridSize) {
  const streets = generateStreetGrid(center, gridSize);
  
  // Place utilities along streets
  const gasLines = streets.map(street => ({
    geometry: street,
    properties: {
      utility_type: 'gas',
      depth_feet: faker.number.float({ min: 3, max: 6 }),
      // ... other properties
    }
  }));
  
  return {
    type: 'FeatureCollection',
    features: [...gasLines, ...electricLines, ...]
  };
}
```

**File Output:** `utility_network.geojson` (500+ utility line features)

---

### Asset 5: Mock Damage Incidents (100 historical damages)
**Data Fields:**
```json
{
  "incident_id": "uuid",
  "date": "Random date in past 24 months",
  "location": "Random location in San Antonio",
  "ticket_id": "Reference to locate_requests.json (for some incidents)",
  
  "utility_type": "Weighted by real-world damage frequency",
  "owner": "CPS Energy, AT&T, SAWS, etc.",
  "severity": "Weighted: 60% minor, 30% major, 10% critical",
  "damage_type": "strike, nick, scrape, break",
  
  "excavator_id": "Reference to excavators.json",
  "locator_company": "ULS Locating",
  "responsible_party": "Weighted: 70% excavator, 20% locator, 10% utility_owner",
  
  "root_cause": "Weighted distribution of realistic causes",
  "detailed_description": "Template-based descriptions",
  
  "consequences": {
    "service_disruption": "Boolean",
    "customers_affected": "Random 0-500",
    "outage_duration_hours": "Random 1-48",
    "evacuation_required": "Boolean (rare)",
    "injuries": "Number (usually 0)"
  },
  
  "costs": {
    "repair": "Random $5K-$200K",
    "fines": "Random $0-$100K for critical incidents",
    "total": "Sum"
  },
  
  "lessons_learned": "Template-based insights",
  "corrective_actions": "Array of actions taken"
}
```

**Generation Strategy:**
1. Cluster some damages around specific locations (create "hotspots")
2. Associate damages with problem excavators from excavators.json
3. Create realistic cause distributions based on industry data:
   - 40% excavated without waiting for locates
   - 20% locator error or missed utility
   - 15% inaccurate utility records
   - 15% excavator ignored markings
   - 10% other causes
4. Generate timestamps ensuring some recent damages (last 30-90 days)

**File Output:** `damage_incidents.json` (100 records)

---

### Asset 6: Mock Weather Data (Current + Historical)
**Data Fields:**
```json
{
  "date": "2025-11-03",
  "location": "San Antonio, TX",
  "current": {
    "temperature_f": 72,
    "conditions": "partly cloudy",
    "humidity": 65,
    "wind_mph": 8,
    "visibility_miles": 10
  },
  "precipitation": {
    "today": 0,
    "past_24hrs": 0.5,
    "past_48hrs": 2.5,
    "past_7days": 4.0
  },
  "soil_conditions": {
    "moisture": "saturated",
    "type": "clay"
  },
  "forecast_48hrs": "Heavy rain expected tomorrow"
}
```

**Generation Strategy:**
1. Use real San Antonio climate data patterns
2. Create variations for different demo scenarios:
   - Dry conditions (low risk)
   - Recent heavy rain (elevated risk)
   - Extreme weather (high risk)
3. Store as JSON file or integrate with free weather API

**PoC Approach:** Create 10 weather scenarios, randomly assign to tickets, OR integrate with real weather API

**File Output:** `weather_scenarios.json` (10 scenarios) OR use live API

---

### Asset 7: Mock Soil Type Data (GeoJSON)
**Data Fields:**
```geojson
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-98.50, 29.40], ...]]
      },
      "properties": {
        "soil_type": "clay",
        "drainage": "poor",
        "excavation_difficulty": "moderate",
        "usda_classification": "Houston Black Clay"
      }
    }
  ]
}
```

**Generation Strategy:**
1. **Use real USDA soil data** (free, public domain)
   - Web Soil Survey: https://websoilsurvey.nrcs.usda.gov/
   - Download GeoJSON for Bexar County, TX
2. OR simplify: Divide San Antonio into 5-10 zones with different soil types

**PoC Approach:** Use USDA real data (adds credibility) or simplified zones

**File Output:** `soil_types.geojson` OR integrate with USDA API

---

### Asset 8: AI Prompt Templates
**Templates for Different Scenarios:**

```javascript
const promptTemplates = {
  standard: `[Full detailed prompt as shown in code examples]`,
  
  high_risk: `You are assessing a HIGH-RISK utility locate request. Be extra thorough in your analysis. This ticket has been flagged because: {flags}. Provide detailed pre-excavation recommendations.`,
  
  emergency: `This is an EMERGENCY locate request. Time is critical. Provide immediate risk assessment and recommend the most experienced available technician regardless of current workload.`,
  
  missing_data: `Some critical data is missing for this assessment: {missing_fields}. Perform the best risk assessment possible with available data, but clearly state limitations and recommend data collection actions.`,
  
  novel_scenario: `This ticket presents an unusual scenario we haven't seen before: {novel_aspects}. Apply general risk assessment principles and provide your confidence level.`,
  
  second_opinion: `A supervisor has requested a second-opinion AI assessment. Initial assessment: Risk={initial_risk}, Recommended={initial_recommendation}. Review all data and provide an independent assessment.`
};
```

**File Output:** `prompt_templates.json`

---

### Asset 9: Demo Scenario Definitions
**High-Impact Demo Tickets:**

```json
{
  "demo_scenarios": [
    {
      "name": "Critical Risk - Problem Excavator",
      "ticket_id": "TX-2025-999001",
      "setup": "Emergency gas leak repair with excavator who has 4 damages in 6 months",
      "expected_ai_output": {
        "risk_score": "85-95",
        "risk_level": "CRITICAL",
        "key_recommendations": [
          "Assign most experienced gas-certified locator",
          "Require supervisor on-site during excavation",
          "Pre-excavation meeting mandatory",
          "Use GPR verification"
        ]
      },
      "demo_talking_points": [
        "AI immediately flags excavator's poor history",
        "Recommends specific experienced technician by name",
        "Provides actionable pre-work requirements",
        "Natural language explanation easy for non-technical supervisor to understand"
      ]
    },
    
    {
      "name": "Low Risk - Routine Work",
      "ticket_id": "TX-2025-500123",
      "setup": "Simple telecom line for reputable excavator, 0.15 miles",
      "expected_ai_output": {
        "risk_score": "15-25",
        "risk_level": "LOW",
        "key_recommendations": [
          "Any available qualified locator acceptable",
          "Standard procedures sufficient",
          "Estimated 1.5 hour completion"
        ]
      },
      "demo_talking_points": [
        "AI recognizes low-risk scenario",
        "Doesn't over-recommend resources",
        "Quick completion time estimate",
        "Allows assignment to less experienced but competent locator"
      ]
    },
    
    {
      "name": "Complex Multi-Utility",
      "ticket_id": "TX-2025-750456",
      "setup": "1.2 miles with 5 utility types in congested urban area",
      "expected_ai_output": {
        "risk_score": "60-70",
        "risk_level": "MEDIUM-HIGH",
        "key_recommendations": [
          "Experienced locator required",
          "Extended time needed: 4-5 hours",
          "Coordination with multiple utility owners",
          "Consider splitting into multiple locate assignments"
        ]
      },
      "demo_talking_points": [
        "AI recognizes complexity beyond just excavator history",
        "Accounts for utility congestion and coordination needs",
        "Realistic time estimate helps scheduling",
        "Suggests practical solutions (split assignment)"
      ]
    }
  ]
}
```

**File Output:** `demo_scenarios.json`

---

## ?? Fallback Strategies When Data is Missing

### Fallback Matrix

| Missing Data | AI Impact | Fallback Strategy | Risk Score Adjustment |
|--------------|-----------|-------------------|----------------------|
| **Excavator history** | CRITICAL | Use industry average (assume moderate risk) | +20 points |
| **GIS utility data** | CRITICAL | Assume worst-case (all utilities present are high-consequence) | +25 points |
| **Technician availability** | HIGH | Recommend experience level instead of specific person | None |
| **Weather data** | MEDIUM | Assume moderate conditions | +10 points |
| **Historical damages** | MEDIUM | Cannot identify location-specific risks | +15 points |
| **Soil type** | LOW | Use regional default | +5 points |
| **Ticket work description** | CRITICAL | Cannot assess - require human review | Cannot assess |

### Fallback Prompt Template

```
CRITICAL DATA MISSING: {missing_data_fields}

Perform risk assessment with following limitations:
- Missing: {list}
- Available: {list}
- Assumptions: {list}

Provide:
1. Risk assessment based on available data
2. Confidence level: LOW/MEDIUM/HIGH
3. Specific data collection actions required before excavation
4. Recommended approach: "Proceed with extra caution" OR "Delay until data available"

IMPORTANT: Clearly state assessment limitations in your rationale.
```

### Example Fallback Output

```json
{
  "risk_score": 65,
  "risk_level": "MEDIUM-HIGH",
  "confidence": "LOW",
  "data_quality": "POOR",
  
  "limitations": [
    "No excavator damage history available",
    "No GIS utility location data available",
    "Weather data unavailable"
  ],
  
  "assumptions": [
    "Assumed excavator has average risk profile",
    "Assumed all utilities in ticket are high-consequence",
    "Assumed moderate weather conditions"
  ],
  
  "rationale": "?? LIMITED DATA ASSESSMENT: This risk score is based on incomplete information and may not accurately reflect true risk. Due to missing excavator history and utility location data, a conservative HIGH-MEDIUM risk rating is recommended. This ticket should receive supervisor review and field verification before excavation proceeds.",
  
  "recommended_actions": {
    "immediate": [
      "Contact excavator to obtain damage history",
      "Request GIS utility maps from CPS Energy",
      "Assign experienced locator who can verify field conditions"
    ],
    "before_excavation": [
      "Verify all utility locations with utility owners",
      "Conduct pre-excavation meeting with excavator",
      "Document all assumptions and field conditions"
    ]
  },
  
  "supervision_required": true,
  "supervision_note": "Due to limited data, supervisor should review this ticket before assignment and approve excavation plan."
}
```

---

## ?? Data Generation Implementation Plan

### Phase 1: Core Data (Week 1)
1. **Generate Excavators** (2 hours)
   - Script using Faker.js
   - Weighted distributions for damages
   - Output: `excavators.json`

2. **Generate Employees** (3 hours)
   - Script using Faker.js
   - Geo-fence generation using Turf.js
   - Output: `employees.json`

3. **Generate Locate Requests** (4 hours)
   - Complex script with templates
   - Use Claude to generate work descriptions
   - Output: `locate_requests.json`

### Phase 2: Spatial Data (Week 2)
4. **Generate Utility Network** (4 hours)
   - Use Claude API to generate realistic GeoJSON
   - Manual refinement if needed
   - Output: `utility_network.geojson`

5. **Download Soil Data** (1 hour)
   - USDA Web Soil Survey
   - Crop to San Antonio area
   - Output: `soil_types.geojson`

### Phase 3: Historical Data (Week 2)
6. **Generate Damage Incidents** (2 hours)
   - Script with templates
   - Link to excavators and locations
   - Output: `damage_incidents.json`

7. **Create Weather Scenarios** (1 hour)
   - 10 predefined scenarios OR integrate API
   - Output: `weather_scenarios.json`

### Phase 4: Demo Assets (Week 2)
8. **Create Demo Scenarios** (2 hours)
   - Define 5-10 high-impact scenarios
   - Expected outputs documented
   - Output: `demo_scenarios.json`

9. **Create Prompt Templates** (1 hour)
   - Standard, high-risk, emergency, missing data
   - Output: `prompt_templates.json`

### Phase 5: Database Seeding (Week 2)
10. **Seed Script** (3 hours)
    - Load all JSON into Supabase
    - Verify relationships
    - Test spatial queries

**Total Time:** ~23 hours (Week 1-2)

---

## ?? Testing the AI with Generated Data

### Test Scenarios

**Test 1: High-Risk Detection**
- Input: Ticket with problem excavator (4 damages) + gas utility
- Expected: Risk score 80+, recommend experienced locator, require supervision

**Test 2: Low-Risk Recognition**
- Input: Ticket with excellent excavator (0 damages) + telecom only
- Expected: Risk score <30, any qualified locator acceptable

**Test 3: Missing Data Fallback**
- Input: Ticket with no excavator history
- Expected: Conservative risk score, flag missing data, recommend caution

**Test 4: Complex Multi-Factor**
- Input: Moderate excavator (1 damage) + congested area + wet weather + gas
- Expected: Risk score 65-75, experienced locator, GPR recommended

**Test 5: Novel Scenario**
- Input: Unusual combination not in historical data
- Expected: AI applies general principles, states low confidence

---

## ? Final Data Asset Checklist

- [ ] `excavators.json` - 50 mock companies with varied damage histories
- [ ] `employees.json` - 25 mock locators with geo-fences and performance data
- [ ] `locate_requests.json` - 1000 mock tickets in TX 811 format
- [ ] `utility_network.geojson` - 500+ utility lines covering San Antonio
- [ ] `soil_types.geojson` - Soil type polygons for San Antonio (USDA data)
- [ ] `damage_incidents.json` - 100 historical damage records
- [ ] `weather_scenarios.json` - 10 weather condition scenarios
- [ ] `demo_scenarios.json` - 5-10 high-impact demo tickets with expected outcomes
- [ ] `prompt_templates.json` - Prompt variations for different scenarios
- [ ] Database seed script - Loads all data into PostgreSQL with PostGIS

---

## ?? Summary: Minimum Viable Context for AI

**AI CAN perform basic risk assessment with:**
- ? Locate request details (location, utilities, scope)
- ? Excavator basic info (even without damage history)
- ? List of available technicians with experience levels

**AI performs WELL with:**
- ? All of the above PLUS:
- ? Excavator damage history (6-12 months)
- ? Technician performance metrics
- ? GIS utility location data

**AI performs EXCELLENTLY with:**
- ? All of the above PLUS:
- ? Historical damage incidents (location-based)
- ? Weather and soil conditions
- ? Similar ticket history
- ? Technician scenario-specific performance

---

**Next Steps:**
1. Review this requirements document
2. Prioritize data generation (start with Tier 1 critical data)
3. Begin Week 1-2 data generation scripts
4. Test AI with progressive data availability (baseline ? enhanced ? optimal)

---

**Document Status:** Complete Technical Requirements
**Ready for:** Data Generation Phase
**Estimated Data Generation Time:** 20-25 hours (Week 1-2)
