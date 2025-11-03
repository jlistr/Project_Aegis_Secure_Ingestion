# Texas 811 Locate Request Management System - PoC Design & Planning Document

**Status:** Planning & Design Phase  
**Date:** 2025-01-27  
**Project:** SaaS PoC for ULS Locating Service (CPS Energy Contract)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Design](#architecture-design)
4. [Core Components](#core-components)
5. [Data Models & Database Schema](#data-models--database-schema)
6. [API Design](#api-design)
7. [Integration Points](#integration-points)
8. [Frontend Applications](#frontend-applications)
9. [Business Logic & Script Templates](#business-logic--script-templates)
10. [Risk Assessment & Auto-Assignment Logic](#risk-assessment--auto-assignment-logic)
11. [Technology Stack Recommendations](#technology-stack-recommendations)
12. [Security & Compliance](#security--compliance)
13. [Scalability & Performance](#scalability--performance)
14. [Implementation Phases](#implementation-phases)
15. [Success Metrics](#success-metrics)

---

## Executive Summary

This document outlines the design for a comprehensive SaaS PoC system to manage Texas 811 locate requests for ULS Locating Service under their 3-year contract with CPS Energy. The system will integrate Texas 811 notifications, auto-assign technicians based on geo-fencing, process GIS data, calculate risk factors, and provide analytics dashboards for stakeholders.

**Key Capabilities:**
- Real-time Texas 811 notification ingestion (Routine, Non-Compliant, Emergency)
- Intelligent auto-assignment based on geo-fenced territories
- GIS file storage and processing
- Risk assessment using multiple data sources (weather, excavator history, facility types)
- Mobile app for field technicians (React Native iOS)
- Web portal for supervisors/auditors (React/Next.js)
- Predictive analytics and executive dashboards

---

## System Overview

### High-Level Flow

```
Texas 811 Notification
    ?
API Endpoint (Express/Node.js)
    ?
Data Validation & Enrichment
    ?
Risk Assessment Engine
    ?
Auto-Assignment Engine (Geo-fencing)
    ?
Database Storage (PostgreSQL)
    ?
Mobile App (React Native) ?? Web Portal (Next.js)
    ?
Field Operations ?? Management/Analytics
```

### Key Stakeholders

1. **Field Personnel**
   - Utility Locators (field technicians)
   - Field Supervisors

2. **Office Personnel**
   - Supervisors
   - Auditors
   - Trainers
   - Managers

3. **External Systems**
   - Texas 811
   - CPS Energy (utility owner/operator)
   - Weather APIs
   - GIS data providers

---

## Architecture Design

### System Architecture Pattern

**Microservices-Oriented Monolith (PoC Phase)**
- Start as modular monolith for faster development
- Separate concerns into logical modules
- Prepare for future microservices extraction if needed

### Component Architecture

```
???????????????????????????????????????????????????????????????
?                     Frontend Layer                           ?
???????????????????????????????????????????????????????????????
?  React Native iOS App    ?   Next.js Web Portal             ?
?  (Field Personnel)       ?   (Supervisors/Managers)         ?
???????????????????????????????????????????????????????????????
               ?                          ?
               ? REST API / WebSocket     ?
               ?                          ?
???????????????????????????????????????????????????????????????
?                    API Gateway Layer                         ?
?  - Authentication & Authorization                           ?
?  - Rate Limiting                                            ?
?  - Request Routing                                          ?
????????????????????????????????????????????????????????????????
               ?
????????????????????????????????????????????????????????????????
?                  Business Logic Layer                        ?
????????????????????????????????????????????????????????????????
?  ? Locate Request Processor                                  ?
?  ? Risk Assessment Engine                                    ?
?  ? Auto-Assignment Engine                                    ?
?  ? GIS Data Processor                                        ?
?  ? Weather Data Collector                                    ?
?  ? Damage Report Analyzer                                    ?
?  ? Script Template Executor                                  ?
????????????????????????????????????????????????????????????????
               ?
????????????????????????????????????????????????????????????????
?                    Data Layer                                 ?
????????????????????????????????????????????????????????????????
?  ? PostgreSQL (Relational Data)                              ?
?  ? PostGIS (Geospatial Data)                                 ?
?  ? Object Storage (S3/MinIO) - GIS Files                     ?
?  ? Redis (Caching & Real-time)                               ?
????????????????????????????????????????????????????????????????
               ?
????????????????????????????????????????????????????????????????
?                External Integrations                          ?
????????????????????????????????????????????????????????????????
?  ? Texas 811 Webhook                                         ?
?  ? Weather APIs (OpenWeatherMap, NOAA)                       ?
?  ? Map APIs (Mapbox, Google Maps)                            ?
?  ? CPS Energy Systems                                        ?
????????????????????????????????????????????????????????????????
```

---

## Core Components

### 1. Texas 811 Notification Ingestion Service

**Purpose:** Receive and process locate requests from Texas 811

**Key Features:**
- Webhook endpoint for Texas 811 notifications
- Support for Routine, Non-Compliant, and Emergency request types
- HMAC signature verification (already implemented)
- Data validation and normalization
- Asynchronous processing queue

**Request Types:**
- **Routine:** Standard locate requests with standard SLA
- **Non-Compliant:** Requests requiring additional attention
- **Emergency:** Urgent requests requiring immediate response

### 2. User Management System

**Purpose:** Track all ULS Locating Service employees

**Key Data Points:**
- Employee ID, name, role, contact info
- **Locating experience level** (years of experience)
- **At-fault damages** (rolling 12-month count)
- **Assigned geo-fenced area** (polygon coordinates)
- **Current ticket load balance** (active tickets)
- Certification status, training records
- Performance metrics

**Employee Roles:**
- Utility Locator (field technician)
- Field Supervisor
- Supervisor
- Auditor
- Trainer
- Manager

### 3. Geo-Fencing & Auto-Assignment Engine

**Purpose:** Automatically assign locate requests to technicians based on geographic territories

**Logic:**
1. Extract location from locate request (lat/lng or address)
2. Query geo-fenced areas (PostGIS polygons)
3. Find technicians assigned to matching geo-fence
4. Apply load balancing (consider current ticket count)
5. Consider experience level and availability
6. Assign ticket to optimal technician

**Assignment Priority:**
1. Geo-fence match
2. Load balance (distribute evenly)
3. Experience level (match complexity to skill)
4. Availability status

### 4. GIS File Management System

**Purpose:** Accept and store GIS print/map files from utility owners/operators

**Key Features:**
- File upload endpoint (accept common GIS formats: Shapefile, GeoJSON, KML, PDF maps)
- Store in object storage (S3/MinIO)
- Extract and index facility locations
- Link GIS files to specific tickets/areas
- Version control for updated maps

**Supported Formats:**
- Shapefile (.shp, .shx, .dbf)
- GeoJSON (.geojson)
- KML/KMZ (.kml, .kmz)
- PDF maps (with georeferencing)
- GeoTIFF

### 5. Map API Integration Service

**Purpose:** Calculate distances, provide base layers, and display soil types

**Key Capabilities:**
- Calculate locate distances using bounding box GPS coordinates
- Provide base map layers (satellite, street, terrain)
- Overlay soil type data
- Display utility facilities
- Generate printable maps

**Recommended SDKs:**
- **Mapbox GL JS** (web) - Modern, powerful, good pricing
- **Mapbox React Native** (mobile) - Consistent with web
- **Google Maps API** (alternative) - More expensive but familiar

**Soil Type Data Sources:**
- USDA Web Soil Survey API
- NRCS Soil Data Access
- Custom soil type shapefiles from CPS Energy

### 6. Weather Data Collection Service

**Purpose:** Collect and correlate weather data with locate requests

**Data Points:**
- Current conditions (temperature, precipitation, wind)
- Historical data (precipitation in last 24-48 hours)
- Forecast data (for scheduling)
- Severe weather alerts

**API Sources:**
- OpenWeatherMap API (comprehensive, paid)
- NOAA Weather API (free, US-focused)
- Weather.gov (free, government)

**Use Cases:**
- Risk assessment (heavy rain = soil instability)
- Scheduling optimization (avoid bad weather)
- Damage correlation (weather at time of incident)

### 7. Damage Report Collection & Analysis

**Purpose:** Collect and analyze reports on damaged facilities

**Data Collection:**
- Damage incident reports (date, location, cause)
- Severity/cost of damage
- Facility type affected
- Root cause analysis
- Excavator/locator involved
- Weather conditions at time

**Analysis Capabilities:**
- Trend analysis (damage rates over time)
- Geographic hotspots
- Root cause patterns
- Correlation with weather, excavator history, etc.

### 8. Script Template System

**Purpose:** Define domain logic and calculate factors from collected data

**Template Structure:**
- Input variables (ticket data, employee data, weather, etc.)
- Calculation logic (risk factors, distances, etc.)
- Output format (readable summaries)

**Example Template Logic:**
```javascript
// Pseudo-code example
function generateRiskSummary(ticket) {
  const distance = calculateDistance(ticket.boundingBox);
  const facilities = getFacilitiesInArea(ticket.area);
  const damages = getHistoricalDamages(ticket.location, 6);
  const excavatorHistory = getExcavatorDamages(ticket.excavatorId, 6);
  
  const riskLevel = calculateRiskLevel({
    distance,
    facilityTypes: facilities,
    historicalDamages: damages.length,
    excavatorDamages: excavatorHistory.length
  });
  
  const recommendedExperience = getRecommendedExperience(riskLevel);
  
  return {
    summary: `This locate request is ${distance} miles and there are ${facilities} facilities buried in the scope of the ticket. There have been ${damages.length} reported damages at this site but the excavator has damaged ${excavatorHistory.length} gas lines in the past 6 months according to our records. The chances of a utility damage is ${riskLevel}-risk due to the excavator's damage history. Assigning a locator with at least ${recommendedExperience} year(s) of experience is highly recommended.`,
    riskLevel,
    factors: {
      distance,
      facilityCount: facilities.length,
      historicalDamages: damages.length,
      excavatorDamages: excavatorHistory.length
    }
  };
}
```

### 9. Executive Dashboard & Predictive Analytics

**Purpose:** Provide insights and predictions for management

**Dashboard Sections:**
1. **Real-time Metrics**
   - Active tickets by status
   - Technician utilization
   - Response time averages
   - Daily/weekly/monthly trends

2. **Risk Analytics**
   - High-risk ticket identification
   - Risk score distribution
   - Contributing risk factors

3. **Performance Metrics**
   - Technician performance
   - Assignment efficiency
   - Damage prevention rate
   - SLA compliance

4. **Predictive Analytics**
   - Forecasted ticket volume
   - Expected damage risk trends
   - Resource planning recommendations
   - Seasonal patterns

5. **Damage Prevention**
   - Damage incident trends
   - Root cause analysis
   - Prevention effectiveness
   - Cost savings estimation

**Visualization Types:**
- Time series charts
- Geographic heat maps
- Risk score distributions
- Comparison charts
- Predictive trend lines

---

## Data Models & Database Schema

### Core Tables

#### `locate_requests`
```sql
CREATE TABLE locate_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    request_type VARCHAR(20) NOT NULL, -- 'ROUTINE', 'NON_COMPLIANT', 'EMERGENCY'
    excavator_id VARCHAR(100),
    excavator_name VARCHAR(255),
    address TEXT NOT NULL,
    coordinates POINT NOT NULL, -- PostGIS POINT
    bounding_box BOX, -- PostGIS BOX for area
    received_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    assigned_to UUID REFERENCES employees(id),
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP,
    risk_score DECIMAL(5,2), -- 0-100
    risk_level VARCHAR(10), -- 'LOW', 'MEDIUM', 'HIGH'
    risk_summary TEXT,
    distance_miles DECIMAL(10,4),
    facility_types TEXT[], -- ['gas', 'electric', 'water']
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_locate_requests_coordinates ON locate_requests USING GIST(coordinates);
CREATE INDEX idx_locate_requests_status ON locate_requests(status);
CREATE INDEX idx_locate_requests_assigned_to ON locate_requests(assigned_to);
CREATE INDEX idx_locate_requests_received_at ON locate_requests(received_at);
```

#### `employees`
```sql
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL, -- 'LOCATOR', 'FIELD_SUPERVISOR', 'SUPERVISOR', 'AUDITOR', 'TRAINER', 'MANAGER'
    locating_experience_years INTEGER DEFAULT 0,
    at_fault_damages_12mo INTEGER DEFAULT 0, -- Rolling 12-month count
    current_ticket_load INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    availability_status VARCHAR(20) DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'BUSY', 'OFF_DUTY', 'ON_LEAVE'
    geo_fence_id UUID REFERENCES geo_fences(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_employees_geo_fence ON employees(geo_fence_id);
CREATE INDEX idx_employees_active ON employees(is_active);
```

#### `geo_fences`
```sql
CREATE TABLE geo_fences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    boundary POLYGON NOT NULL, -- PostGIS POLYGON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_geo_fences_boundary ON geo_fences USING GIST(boundary);
```

#### `gis_files`
```sql
CREATE TABLE gis_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'SHAPEFILE', 'GEOJSON', 'KML', 'PDF', 'GEOTIFF'
    file_path TEXT NOT NULL, -- S3/MinIO path
    file_size BIGINT,
    uploaded_by UUID REFERENCES employees(id),
    utility_owner VARCHAR(100), -- 'CPS_ENERGY', etc.
    area_coverage BOX, -- PostGIS BOX
    uploaded_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB -- Additional file metadata
);

CREATE INDEX idx_gis_files_area ON gis_files USING GIST(area_coverage);
CREATE INDEX idx_gis_files_utility ON gis_files(utility_owner);
```

#### `facilities`
```sql
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_type VARCHAR(50) NOT NULL, -- 'gas', 'electric', 'water', 'telecom', 'sewer'
    utility_owner VARCHAR(100) NOT NULL,
    location POINT NOT NULL, -- PostGIS POINT
    line_segment LINESTRING, -- PostGIS LINESTRING for lines
    depth_feet DECIMAL(5,2),
    pressure_level VARCHAR(50), -- For gas: 'low', 'medium', 'high'
    material VARCHAR(50), -- 'PVC', 'steel', 'cast_iron', 'copper'
    age_years INTEGER,
    condition_rating VARCHAR(20),
    gis_file_id UUID REFERENCES gis_files(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_facilities_location ON facilities USING GIST(location);
CREATE INDEX idx_facilities_type ON facilities(facility_type);
CREATE INDEX idx_facilities_utility ON facilities(utility_owner);
```

#### `weather_data`
```sql
CREATE TABLE weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location POINT NOT NULL, -- PostGIS POINT
    recorded_at TIMESTAMP NOT NULL,
    temperature_f DECIMAL(5,2),
    precipitation_inches DECIMAL(5,2),
    precipitation_24h DECIMAL(5,2), -- Last 24 hours
    precipitation_48h DECIMAL(5,2), -- Last 48 hours
    wind_speed_mph DECIMAL(5,2),
    conditions VARCHAR(50), -- 'clear', 'rain', 'snow', 'frozen_ground'
    data_source VARCHAR(50), -- 'OPENWEATHER', 'NOAA', 'WEATHER_GOV'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weather_location ON weather_data USING GIST(location);
CREATE INDEX idx_weather_recorded_at ON weather_data(recorded_at);
```

#### `damage_reports`
```sql
CREATE TABLE damage_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_number VARCHAR(50) UNIQUE NOT NULL,
    ticket_id UUID REFERENCES locate_requests(id),
    occurred_at TIMESTAMP NOT NULL,
    location POINT NOT NULL, -- PostGIS POINT
    facility_type VARCHAR(50) NOT NULL,
    facility_id UUID REFERENCES facilities(id),
    severity VARCHAR(20), -- 'MINOR', 'MODERATE', 'MAJOR', 'CRITICAL'
    estimated_cost DECIMAL(10,2),
    root_cause VARCHAR(50), -- 'EXCAVATOR_ERROR', 'LOCATOR_ERROR', 'WEATHER', 'EQUIPMENT_FAILURE', 'OTHER'
    excavator_id VARCHAR(100),
    locator_id UUID REFERENCES employees(id),
    weather_conditions JSONB, -- Snapshot of weather at time of incident
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_damage_reports_location ON damage_reports USING GIST(location);
CREATE INDEX idx_damage_reports_occurred_at ON damage_reports(occurred_at);
CREATE INDEX idx_damage_reports_facility_type ON damage_reports(facility_type);
CREATE INDEX idx_damage_reports_root_cause ON damage_reports(root_cause);
```

#### `excavators`
```sql
CREATE TABLE excavators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    excavator_id VARCHAR(100) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    contact_info JSONB,
    violation_count INTEGER DEFAULT 0,
    damage_count_12mo INTEGER DEFAULT 0, -- Rolling 12-month count
    damage_count_6mo INTEGER DEFAULT 0, -- Rolling 6-month count
    experience_years INTEGER,
    safety_rating VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_excavators_id ON excavators(excavator_id);
```

#### `risk_assessments`
```sql
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES locate_requests(id) UNIQUE NOT NULL,
    risk_score DECIMAL(5,2) NOT NULL, -- 0-100
    risk_level VARCHAR(10) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
    summary TEXT NOT NULL,
    contributing_factors JSONB NOT NULL, -- Array of factor objects
    calculated_at TIMESTAMP DEFAULT NOW(),
    model_version VARCHAR(50) -- Track which version of risk model was used
);

CREATE INDEX idx_risk_assessments_ticket ON risk_assessments(ticket_id);
CREATE INDEX idx_risk_assessments_score ON risk_assessments(risk_score);
```

#### `assignment_history`
```sql
CREATE TABLE assignment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES locate_requests(id) NOT NULL,
    assigned_to UUID REFERENCES employees(id) NOT NULL,
    assigned_by UUID REFERENCES employees(id), -- Who made the assignment
    assignment_method VARCHAR(20) NOT NULL, -- 'AUTO', 'MANUAL', 'OVERRIDE'
    assignment_reason TEXT,
    assigned_at TIMESTAMP DEFAULT NOW(),
    unassigned_at TIMESTAMP
);

CREATE INDEX idx_assignment_history_ticket ON assignment_history(ticket_id);
CREATE INDEX idx_assignment_history_assigned_to ON assignment_history(assigned_to);
```

---

## API Design

### Base URL
```
https://api.uls-locate-service.com/v1
```

### Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- API keys for external integrations (Texas 811)

### Endpoints

#### Texas 811 Integration

**POST `/api/webhooks/tx811/locate-request`**
- Receives Texas 811 notifications
- HMAC signature verification
- Validates and processes request
- Returns acknowledgment

**Request Body:**
```json
{
  "ticketNumber": "TX811-2025-001234",
  "requestType": "ROUTINE", // or "NON_COMPLIANT", "EMERGENCY"
  "excavator": {
    "id": "EXC-12345",
    "name": "ABC Excavation LLC",
    "contact": {
      "phone": "210-555-1234",
      "email": "contact@abcexcavation.com"
    }
  },
  "location": {
    "address": "123 Main St, San Antonio, TX 78201",
    "coordinates": {
      "lat": 29.4241,
      "lng": -98.4936
    },
    "boundingBox": {
      "north": 29.4250,
      "south": 29.4230,
      "east": -98.4920,
      "west": -98.4950
    }
  },
  "workDescription": "Install new water line",
  "workStartDate": "2025-02-01",
  "receivedAt": "2025-01-27T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "ticketId": "uuid-here",
  "ticketNumber": "TX811-2025-001234",
  "status": "ASSIGNED",
  "assignedTo": {
    "employeeId": "EMP-001",
    "name": "John Doe"
  },
  "riskAssessment": {
    "riskScore": 45.5,
    "riskLevel": "MEDIUM",
    "summary": "This locate request is 0.25 miles..."
  }
}
```

#### Locate Request Management

**GET `/api/locate-requests`**
- List locate requests with filtering
- Query params: `status`, `assignedTo`, `requestType`, `dateFrom`, `dateTo`, `riskLevel`

**GET `/api/locate-requests/:id`**
- Get specific locate request details

**PUT `/api/locate-requests/:id/assign`**
- Manually assign or reassign ticket
- Body: `{ "employeeId": "uuid", "reason": "text" }`

**PUT `/api/locate-requests/:id/status`**
- Update ticket status
- Body: `{ "status": "IN_PROGRESS" | "COMPLETED" | "CANCELLED" }`

#### Employee Management

**GET `/api/employees`**
- List employees with filtering
- Query params: `role`, `isActive`, `geoFenceId`

**GET `/api/employees/:id`**
- Get employee details including performance metrics

**PUT `/api/employees/:id/geo-fence`**
- Update employee's assigned geo-fence
- Body: `{ "geoFenceId": "uuid" }`

**GET `/api/employees/:id/workload`**
- Get current ticket load and availability

#### GIS File Management

**POST `/api/gis-files/upload`**
- Upload GIS file
- Multipart form data with file
- Body: `{ "utilityOwner": "CPS_ENERGY", "fileType": "SHAPEFILE" }`

**GET `/api/gis-files`**
- List uploaded GIS files

**GET `/api/gis-files/:id`**
- Get GIS file metadata and download link

**GET `/api/gis-files/:id/facilities`**
- Extract and return facilities from GIS file

#### Risk Assessment

**POST `/api/risk-assessments/calculate`**
- Calculate risk for a locate request
- Body: `{ "ticketId": "uuid" }`

**GET `/api/risk-assessments/:ticketId`**
- Get risk assessment for a ticket

#### Weather Data

**GET `/api/weather`**
- Get weather data for location
- Query params: `lat`, `lng`, `date` (optional, defaults to current)

**POST `/api/weather/sync`**
- Trigger weather data sync for recent tickets

#### Damage Reports

**POST `/api/damage-reports`**
- Create damage report
- Body: Damage report data

**GET `/api/damage-reports`**
- List damage reports with filtering
- Query params: `dateFrom`, `dateTo`, `facilityType`, `rootCause`

**GET `/api/damage-reports/analytics`**
- Get aggregated damage analytics

#### Analytics & Dashboard

**GET `/api/analytics/dashboard`**
- Get dashboard metrics
- Query params: `dateRange`, `groupBy`

**GET `/api/analytics/predictions`**
- Get predictive analytics
- Query params: `metric`, `forecastDays`

**GET `/api/analytics/risk-trends`**
- Get risk trend analysis

---

## Integration Points

### 1. Texas 811 Integration

**Type:** Webhook (Incoming)
**Authentication:** HMAC signature verification
**Format:** JSON payload
**Delivery:** HTTPS POST to configured endpoint

**Status:** Already implemented in `src/Index.js`

**Enhancements Needed:**
- Expand payload schema to support all request types
- Add retry logic for failed processing
- Add webhook event logging
- Support for batch notifications

### 2. Map API Integration

**Primary Choice:** Mapbox
- Modern, performant SDKs
- Good pricing for PoC scale
- Strong React Native support
- Soil type overlay capability

**Alternative:** Google Maps API
- More familiar to many developers
- Better documentation
- Higher cost at scale

**Implementation:**
- Mapbox GL JS for web portal
- Mapbox React Native SDK for mobile
- Server-side API for distance calculations
- Offline map support (mobile)

### 3. Weather API Integration

**Primary:** OpenWeatherMap API
- Comprehensive weather data
- Historical data access
- Good API design
- Reasonable pricing

**Fallback:** NOAA Weather API
- Free (government)
- US-focused
- Reliable but less flexible

**Implementation:**
- Background job to sync weather data
- Cache recent weather data
- Correlate with ticket locations
- Store historical data for analysis

### 4. CPS Energy Integration

**Potential Integration Points:**
- GIS file uploads (manual or automated)
- Facility data sync
- Damage incident reporting
- Performance metrics sharing

**Format:** TBD (depends on CPS Energy systems)
- API integration (preferred)
- File transfer (SFTP)
- Manual upload portal

### 5. Soil Type Data Integration

**Sources:**
- USDA Web Soil Survey (API or shapefile download)
- NRCS Soil Data Access
- Custom CPS Energy soil maps

**Implementation:**
- Download/import soil type shapefiles
- Store in PostGIS
- Create overlay layer for map display
- Use in risk calculations

---

## Frontend Applications

### 1. React Native iOS Mobile App

**Target Users:** Utility Locators, Field Supervisors

**Key Features:**

**Dashboard:**
- Assigned tickets list
- Ticket priority/urgency indicators
- Map view of assigned locations
- Status filters

**Ticket Details:**
- Full ticket information
- Risk assessment summary
- Facility types present
- Map with facility overlays
- Soil type information
- Weather conditions
- Historical damage data (if available)

**Field Actions:**
- Mark ticket as "In Progress"
- Add field notes/photos
- Mark ticket as "Completed"
- Report issues/concerns
- Request assistance

**Navigation:**
- Turn-by-turn directions to ticket location
- Offline map support
- GPS tracking (for supervisors)

**Additional Features:**
- Push notifications for new assignments
- Offline mode (sync when online)
- Photo upload capability
- Digital signature capture

**Technology Stack:**
- React Native (latest stable)
- React Navigation
- Mapbox React Native SDK
- React Query for data fetching
- AsyncStorage for offline cache

### 2. React/Next.js Web Portal

**Target Users:** Supervisors, Auditors, Trainers, Managers

**Key Features:**

**Dashboard (Role-Based):**
- **Supervisors:** Team performance, ticket assignment oversight, real-time monitoring
- **Auditors:** Ticket quality review, compliance checking, audit trails
- **Trainers:** Training materials, employee progress tracking
- **Managers:** Executive dashboard, analytics, reporting

**Ticket Management:**
- Search and filter tickets
- Manual assignment/reassignment
- Bulk operations
- Status updates
- Risk assessment details

**Employee Management:**
- Employee directory
- Performance metrics
- Geo-fence assignments
- Workload balancing
- Training records

**Analytics & Reporting:**
- Executive dashboard
- Risk trend analysis
- Damage prevention metrics
- Performance reports
- Predictive analytics visualizations

**GIS File Management:**
- Upload utility maps
- View facility overlays
- Map visualization
- Facility search

**Configuration:**
- Geo-fence management
- Risk model parameters
- Assignment rules
- Notification settings

**Technology Stack:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Recharts/Chart.js for visualizations
- Mapbox GL JS
- React Query/TanStack Query

---

## Business Logic & Script Templates

### Script Template System Architecture

**Purpose:** Define reusable domain logic calculations that generate human-readable summaries

**Template Structure:**
```javascript
{
  "templateId": "risk-assessment-summary",
  "version": "1.0",
  "name": "Risk Assessment Summary Generator",
  "description": "Generates human-readable risk assessment summary",
  "inputs": [
    "ticketId",
    "distance",
    "facilities",
    "historicalDamages",
    "excavatorHistory",
    "weatherData"
  ],
  "calculations": [
    {
      "name": "calculateRiskLevel",
      "logic": "function() { ... }"
    },
    {
      "name": "getRecommendedExperience",
      "logic": "function() { ... }"
    }
  ],
  "outputFormat": "text",
  "template": "This locate request is {{distance}} miles and there are {{facilityCount}} facilities buried in the scope of the ticket. There have been {{historicalDamageCount}} reported damages at this site but the excavator has damaged {{excavatorDamageCount}} gas lines in the past 6 months according to our records. The chances of a utility damage is {{riskLevel}}-risk due to the excavator's damage history. Assigning a locator with at least {{recommendedExperience}} year(s) of experience is highly recommended."
}
```

### Key Script Templates

#### 1. Risk Assessment Summary Template

**Inputs:**
- Ticket location (lat/lng)
- Bounding box coordinates
- Facility types in area
- Historical damage data
- Excavator history
- Weather conditions

**Calculations:**
- Calculate distance from bounding box
- Count facilities by type
- Count historical damages (site)
- Count excavator damages (6-month rolling)
- Determine risk level (LOW/MEDIUM/HIGH)
- Calculate recommended locator experience

**Output Example:**
> "This locate request is 0.25 miles and there are gas and electric facilities buried in the scope of the ticket. There have been 2 reported damages at this site but the excavator has damaged 3 gas lines in the past 6 months according to our records. The chances of a utility damage is medium-risk due to the excavator's damage history. Assigning a locator with at least 1 year of experience is highly recommended."

#### 2. Assignment Recommendation Template

**Inputs:**
- Ticket location
- Risk level
- Facility types
- Current technician workloads
- Experience levels

**Output:**
- Recommended technician(s)
- Assignment reasoning
- Expected completion time

#### 3. Damage Prevention Score Template

**Inputs:**
- Historical damage rate
- Risk assessment score
- Preventive measures taken
- Time period

**Output:**
- Prevention effectiveness score
- Recommendations for improvement

### Template Execution Engine

**Implementation Approach:**
- Store templates in database (JSONB column)
- JavaScript/TypeScript execution engine
- Sandboxed execution environment
- Version control for templates
- Testing framework for templates

**Example Implementation:**
```javascript
class ScriptTemplateEngine {
  async execute(templateId, inputs) {
    const template = await this.loadTemplate(templateId);
    const context = this.buildContext(inputs);
    const results = await this.runCalculations(template.calculations, context);
    return this.render(template.template, { ...context, ...results });
  }
  
  buildContext(inputs) {
    // Fetch additional data, perform calculations
    return {
      distance: this.calculateDistance(inputs.boundingBox),
      facilityCount: inputs.facilities.length,
      // ... more context
    };
  }
}
```

---

## Risk Assessment & Auto-Assignment Logic

### Risk Assessment Algorithm

**Phase 1: Data Collection**
1. Gather ticket location and bounding box
2. Query facilities in bounding box area
3. Query historical damages within radius
4. Fetch excavator history (6-month rolling)
5. Fetch current weather data
6. Query soil type data

**Phase 2: Factor Calculation**

**Distance Factor:**
```javascript
distanceFactor = distance <= 0.25 ? 1.0 : 
                 distance <= 0.5 ? 0.8 : 
                 distance <= 1.0 ? 0.6 : 0.4;
```

**Facility Type Factor:**
```javascript
facilityTypeMultiplier = {
  'high_pressure_gas': 1.5,
  'gas': 1.2,
  'electric': 1.1,
  'water': 1.0,
  'telecom': 0.8,
  'sewer': 0.9
};
```

**Historical Damage Factor:**
```javascript
historicalDamageFactor = min(historicalDamages.length * 0.15, 1.0);
```

**Excavator History Factor:**
```javascript
excavatorDamageFactor = excavatorDamages6mo >= 3 ? 1.0 :
                        excavatorDamages6mo >= 2 ? 0.7 :
                        excavatorDamages6mo >= 1 ? 0.4 : 0.1;
```

**Weather Factor:**
```javascript
weatherFactor = isHeavyRain ? 0.3 :
                isFrozenGround ? 0.2 :
                isModerateRain ? 0.15 : 0.0;
```

**Soil Type Factor:**
```javascript
soilTypeFactor = {
  'clay': 0.2,
  'sandy': 0.1,
  'rocky': 0.15,
  'loam': 0.05
};
```

**Phase 3: Risk Score Calculation**
```javascript
baseRisk = 30; // Base risk score

riskScore = baseRisk +
  (distanceFactor * 10) +
  (facilityTypeMultiplier * 15) +
  (historicalDamageFactor * 20) +
  (excavatorDamageFactor * 25) +
  (weatherFactor * 15) +
  (soilTypeFactor * 5);

riskScore = min(riskScore, 100); // Cap at 100

riskLevel = riskScore >= 70 ? 'HIGH' :
            riskScore >= 40 ? 'MEDIUM' : 'LOW';
```

### Auto-Assignment Algorithm

**Step 1: Geographic Filtering**
```sql
-- Find technicians whose geo-fence contains the ticket location
SELECT e.* 
FROM employees e
JOIN geo_fences gf ON e.geo_fence_id = gf.id
WHERE ST_Contains(gf.boundary, ST_MakePoint(ticket_lng, ticket_lat))
  AND e.role = 'LOCATOR'
  AND e.is_active = TRUE
  AND e.availability_status = 'AVAILABLE';
```

**Step 2: Load Balancing**
```javascript
// Calculate assignment score for each candidate
function calculateAssignmentScore(technician, ticket) {
  const loadScore = 1 / (technician.currentTicketLoad + 1); // Lower load = higher score
  const experienceMatch = calculateExperienceMatch(technician, ticket);
  const distanceScore = calculateDistanceScore(technician, ticket);
  
  return (loadScore * 0.4) + (experienceMatch * 0.4) + (distanceScore * 0.2);
}

function calculateExperienceMatch(technician, ticket) {
  const requiredExperience = getRequiredExperience(ticket.riskLevel);
  if (technician.experienceYears >= requiredExperience) {
    return 1.0;
  } else {
    return technician.experienceYears / requiredExperience;
  }
}

function getRequiredExperience(riskLevel) {
  return {
    'HIGH': 3,
    'MEDIUM': 1,
    'LOW': 0.5
  }[riskLevel];
}
```

**Step 3: Assignment**
- Select technician with highest assignment score
- Create assignment record
- Update ticket status
- Send notification to technician
- Log assignment for audit

**Step 4: Fallback Logic**
- If no geo-fence match: Expand search radius
- If all technicians busy: Queue for next available
- If emergency: Override load balancing

---

## Technology Stack Recommendations

### Backend

**Runtime:** Node.js 20+ LTS
- **Rationale:** Already using Node.js, team familiarity, good ecosystem

**Framework:** Express.js (already in use)
- **Rationale:** Minimal, flexible, well-established
- **Alternative:** Fastify (if performance becomes critical)

**Database:** PostgreSQL 15+ with PostGIS extension
- **Rationale:** 
  - Excellent geospatial support (PostGIS)
  - ACID compliance
  - JSONB for flexible schema
  - Strong performance
  - Open source

**Object Storage:** MinIO (S3-compatible) or AWS S3
- **Rationale:** 
  - Cost-effective (MinIO for PoC)
  - Scalable
  - GIS file storage

**Cache/Queue:** Redis 7+
- **Rationale:**
  - Caching layer
  - Real-time features
  - Job queue (BullMQ)

**ORM/Query Builder:** Prisma or TypeORM
- **Rationale:**
  - Type safety
  - Migration management
  - Good PostGIS support

### Frontend

**Mobile:** React Native 0.72+
- **Rationale:** Cross-platform, large ecosystem, good Mapbox support

**Web:** Next.js 14+ (App Router)
- **Rationale:** 
  - Server-side rendering
  - API routes
  - Excellent DX
  - TypeScript support

**UI Libraries:**
- **Mobile:** React Native Paper or NativeBase
- **Web:** Shadcn/ui + Tailwind CSS

**State Management:**
- **Mobile:** React Query + Context API
- **Web:** React Query + Zustand (if needed)

**Maps:**
- **Mobile:** @rnmapbox/maps
- **Web:** mapbox-gl-js

### DevOps & Infrastructure

**Containerization:** Docker
**Orchestration:** Docker Compose (PoC), Kubernetes (production)
**CI/CD:** GitHub Actions
**Monitoring:** 
- Application: Winston/Pino logs + DataDog/Sentry
- Infrastructure: Prometheus + Grafana
**API Documentation:** Swagger/OpenAPI

### External Services

**Maps:** Mapbox (primary), Google Maps (fallback)
**Weather:** OpenWeatherMap (primary), NOAA (fallback)
**Analytics:** Custom (database queries) + possibly Metabase/Superset

---

## Security & Compliance

### Authentication & Authorization

**Authentication:**
- JWT tokens for API access
- Refresh token rotation
- Multi-factor authentication (MFA) for sensitive roles

**Authorization:**
- Role-based access control (RBAC)
- Permissions matrix:
  - **Locator:** View assigned tickets, update ticket status
  - **Field Supervisor:** View team tickets, reassign within team
  - **Supervisor:** All locator permissions + assign any ticket, view analytics
  - **Auditor:** Read-only access to all tickets, damage reports
  - **Trainer:** Read employee data, training records
  - **Manager:** Full access to all features

### Data Security

**Encryption:**
- TLS 1.3 for all API communications
- Encryption at rest for sensitive data
- Encrypted database backups

**Data Privacy:**
- PII encryption
- Access logging
- Data retention policies
- GDPR/CCPA compliance considerations

### API Security

**Rate Limiting:** Already implemented
**Input Validation:** Zod schemas (already in use)
**SQL Injection Prevention:** Parameterized queries via ORM
**XSS Prevention:** Input sanitization, CSP headers

### Compliance

**Texas 811 Requirements:**
- Audit trail for all locate requests
- Timestamp accuracy
- Data retention requirements

**Industry Standards:**
- Follow Common Ground Alliance (CGA) best practices
- Damage prevention standards compliance

---

## Scalability & Performance

### Database Optimization

**Indexing Strategy:**
- Geospatial indexes (GIST) on location columns
- Composite indexes on frequently queried columns
- Partial indexes for filtered queries

**Query Optimization:**
- Connection pooling (PgBouncer)
- Read replicas for analytics queries
- Materialized views for dashboards

### Caching Strategy

**Redis Cache Layers:**
1. **API Response Cache:** Cache frequently accessed endpoints
2. **Geospatial Cache:** Cache geo-fence queries
3. **Weather Cache:** Cache weather data (5-minute TTL)
4. **Session Cache:** User sessions

### Performance Targets

**API Response Times:**
- Ticket ingestion: < 500ms
- Risk assessment: < 2s
- Auto-assignment: < 1s
- Dashboard queries: < 3s

**Mobile App:**
- Initial load: < 2s
- Map rendering: < 1s
- Offline sync: Background processing

### Scalability Plan

**Horizontal Scaling:**
- Stateless API servers (load balancer)
- Database read replicas
- Redis cluster for cache

**Vertical Scaling:**
- Database optimization
- Query optimization
- Connection pooling

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)

**Goals:** Core infrastructure and basic functionality

**Tasks:**
1. Database schema design and setup (PostgreSQL + PostGIS)
2. Enhance Texas 811 webhook endpoint
3. Basic employee management API
4. Basic locate request storage
5. Authentication system
6. Basic risk assessment (rule-based)

**Deliverables:**
- Working API with core endpoints
- Database with sample data
- Basic documentation

### Phase 2: Geo-Fencing & Auto-Assignment (Weeks 5-8)

**Goals:** Implement intelligent assignment system

**Tasks:**
1. Geo-fence management system
2. PostGIS integration for spatial queries
3. Auto-assignment algorithm
4. Assignment API endpoints
5. Notification system

**Deliverables:**
- Auto-assignment working end-to-end
- Geo-fence management UI
- Assignment history tracking

### Phase 3: GIS & Map Integration (Weeks 9-12)

**Goals:** GIS file handling and map display

**Tasks:**
1. GIS file upload and processing
2. Facility extraction and storage
3. Mapbox integration (web and mobile)
4. Soil type data integration
5. Distance calculation service

**Deliverables:**
- GIS file upload working
- Map display with facilities
- Soil type overlays

### Phase 4: Weather & Risk Assessment (Weeks 13-16)

**Goals:** Enhanced risk assessment with weather data

**Tasks:**
1. Weather API integration
2. Weather data collection service
3. Enhanced risk assessment algorithm
4. Script template system
5. Risk summary generation

**Deliverables:**
- Weather data collection working
- Enhanced risk scores
- Human-readable risk summaries

### Phase 5: Damage Reporting (Weeks 17-20)

**Goals:** Damage tracking and analysis

**Tasks:**
1. Damage report API
2. Damage analytics
3. Correlation with risk assessments
4. Damage trend visualization

**Deliverables:**
- Damage reporting system
- Analytics dashboard
- Trend analysis

### Phase 6: Mobile App (Weeks 21-28)

**Goals:** React Native iOS app for field personnel

**Tasks:**
1. React Native project setup
2. Authentication and API integration
3. Ticket list and details screens
4. Map integration
5. Offline support
6. Push notifications
7. Testing and refinement

**Deliverables:**
- Functional iOS app
- App Store submission ready

### Phase 7: Web Portal (Weeks 29-36)

**Goals:** Next.js web portal for office personnel

**Tasks:**
1. Next.js project setup
2. Dashboard implementation
3. Ticket management interface
4. Employee management
5. Analytics visualizations
6. GIS file management UI
7. Role-based access control

**Deliverables:**
- Complete web portal
- Role-based dashboards

### Phase 8: Predictive Analytics (Weeks 37-40)

**Goals:** Executive dashboard and predictions

**Tasks:**
1. Predictive model development
2. Analytics API endpoints
3. Executive dashboard
4. Reporting system
5. Performance optimization

**Deliverables:**
- Executive dashboard
- Predictive analytics
- Reporting capabilities

### Phase 9: Testing & Refinement (Weeks 41-44)

**Goals:** Comprehensive testing and bug fixes

**Tasks:**
1. End-to-end testing
2. Performance testing
3. Security audit
4. User acceptance testing
5. Bug fixes and refinements

**Deliverables:**
- Tested and refined system
- Documentation

### Phase 10: Deployment & Launch (Weeks 45-48)

**Goals:** Production deployment

**Tasks:**
1. Production infrastructure setup
2. Data migration
3. Deployment
4. Monitoring setup
5. User training
6. Go-live support

**Deliverables:**
- Production system
- Training materials
- Support documentation

---

## Success Metrics

### Key Performance Indicators (KPIs)

**Operational Metrics:**
- Ticket assignment time (target: < 5 minutes)
- Auto-assignment accuracy rate (target: > 85%)
- Response time SLA compliance (target: > 95%)
- System uptime (target: > 99.5%)

**Risk Prevention Metrics:**
- Damage incident reduction (target: 20% reduction)
- High-risk ticket identification accuracy
- Risk score correlation with actual incidents

**User Experience Metrics:**
- Mobile app adoption rate
- User satisfaction scores
- Time to complete ticket (target: 10% reduction)

**Business Metrics:**
- Cost per ticket processed
- Technician utilization rate
- Contract compliance rate

### Monitoring & Alerts

**Critical Alerts:**
- System downtime
- API error rate spikes
- Database performance issues
- Failed assignments

**Operational Alerts:**
- High-risk ticket threshold exceeded
- Weather condition warnings
- Assignment backlog
- Performance degradation

---

## Appendix

### A. Sample Risk Assessment Output

**Input:**
- Ticket: TX811-2025-001234
- Location: 29.4241, -98.4936
- Bounding box: 0.25 miles
- Facilities: Gas (high pressure), Electric
- Historical damages at site: 2
- Excavator damages (6mo): 3 gas lines
- Weather: Heavy rain in last 24h

**Output:**
```
Risk Score: 72.5/100
Risk Level: HIGH

Summary:
This locate request is 0.25 miles and there are gas and electric 
facilities buried in the scope of the ticket. There have been 2 
reported damages at this site but the excavator has damaged 3 gas 
lines in the past 6 months according to our records. The chances of 
a utility damage is HIGH-risk due to the excavator's damage history 
and heavy rainfall conditions. Assigning a locator with at least 3 
years of experience is highly recommended.

Contributing Factors:
- High-pressure gas facilities present (+15 points)
- Excavator has 3+ damages in past 6 months (+25 points)
- Heavy rainfall in last 24 hours (+15 points)
- 2 historical damages at this site (+12 points)
- High utility density area (+5.5 points)
```

### B. Technology Comparison

**Database Options:**

| Feature | PostgreSQL + PostGIS | MongoDB | MySQL |
|---------|---------------------|---------|-------|
| Geospatial Support | Excellent | Good | Limited |
| ACID Compliance | Yes | Limited | Yes |
| JSON Support | Excellent (JSONB) | Native | Limited |
| Open Source | Yes | Yes | Yes |
| **Recommendation** | ? **Best Choice** | Good alternative | Not ideal |

**Map API Options:**

| Feature | Mapbox | Google Maps | Esri ArcGIS |
|---------|--------|-------------|-------------|
| Cost (PoC) | $0-500/mo | $200-2000/mo | $500+/mo |
| React Native Support | Excellent | Good | Limited |
| Customization | High | Medium | High |
| **Recommendation** | ? **Best Value** | Good fallback | Enterprise only |

### C. Integration Examples

**Texas 811 Webhook Handler:**
```javascript
// Enhanced version of existing handler
app.post('/api/webhooks/tx811/locate-request', async (req, res) => {
  // Verify signature
  // Validate payload
  // Process request
  // Calculate risk
  // Auto-assign
  // Return response
});
```

**Risk Assessment Service:**
```javascript
class RiskAssessmentService {
  async assessRisk(ticketId) {
    const ticket = await this.getTicket(ticketId);
    const factors = await this.gatherRiskFactors(ticket);
    const score = this.calculateRiskScore(factors);
    const summary = await this.generateSummary(ticket, factors, score);
    return { score, level: this.categorizeRisk(score), summary };
  }
}
```

---

## Conclusion

This design document provides a comprehensive blueprint for building the Texas 811 Locate Request Management System PoC. The system will integrate multiple data sources, provide intelligent auto-assignment, and deliver actionable insights through predictive analytics.

**Next Steps:**
1. Review and approve this design document
2. Set up development environment
3. Begin Phase 1 implementation
4. Establish regular review cycles

**Questions or Concerns:**
- Database schema refinements
- API endpoint modifications
- Integration point clarifications
- Timeline adjustments

---

*Document Version: 1.0*  
*Last Updated: 2025-01-27*  
*Status: Draft for Review*
