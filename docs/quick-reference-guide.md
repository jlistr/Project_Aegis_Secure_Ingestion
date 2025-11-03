# Quick Reference Guide - Texas 811 Locate Request Management System

## System Overview

**Purpose:** SaaS PoC system for managing Texas 811 locate requests for ULS Locating Service (CPS Energy contract)

**Key Components:**
1. Texas 811 Notification Ingestion
2. Auto-Assignment Engine (Geo-fencing)
3. Risk Assessment System
4. GIS File Management
5. Weather Data Integration
6. Damage Reporting & Analytics
7. Mobile App (React Native iOS)
8. Web Portal (Next.js)

---

## Technology Stack Quick Reference

### Backend
- **Runtime:** Node.js 20+ LTS
- **Framework:** Express.js
- **Database:** PostgreSQL 15+ with PostGIS
- **Cache/Queue:** Redis 7+
- **Object Storage:** MinIO (PoC) or AWS S3
- **ORM:** Prisma or TypeORM

### Frontend
- **Mobile:** React Native 0.72+ (iOS)
- **Web:** Next.js 14+ (App Router)
- **Maps:** Mapbox GL JS / React Native Maps
- **UI:** Shadcn/ui + Tailwind CSS (web), React Native Paper (mobile)

### External APIs
- **Maps:** Mapbox (primary)
- **Weather:** OpenWeatherMap (primary), NOAA (fallback)
- **Soil Data:** USDA Web Soil Survey

---

## Core Data Models

### Locate Request
- Ticket number, type (Routine/Non-Compliant/Emergency)
- Location (lat/lng), bounding box
- Excavator info
- Status, assigned technician
- Risk score & summary

### Employee
- Employee ID, role, contact info
- **Experience level** (years)
- **At-fault damages** (12-month rolling)
- **Geo-fenced area** (polygon)
- **Current ticket load**

### Geo-Fence
- Name, description
- Boundary polygon (PostGIS)

### GIS Files
- File name, type, storage path
- Utility owner, area coverage
- Metadata (JSONB)

### Facilities
- Type (gas/electric/water/etc.)
- Location (point/linestring)
- Depth, pressure, material, age

### Weather Data
- Location, timestamp
- Temperature, precipitation
- Conditions

### Damage Reports
- Incident number, location
- Facility type, severity, cost
- Root cause, excavator/locator

---

## Key API Endpoints

### Texas 811 Integration
- `POST /api/webhooks/tx811/locate-request` - Receive notifications

### Locate Requests
- `GET /api/locate-requests` - List tickets
- `GET /api/locate-requests/:id` - Get ticket details
- `PUT /api/locate-requests/:id/assign` - Assign ticket
- `PUT /api/locate-requests/:id/status` - Update status

### Employees
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id/geo-fence` - Update geo-fence

### Risk Assessment
- `POST /api/risk-assessments/calculate` - Calculate risk
- `GET /api/risk-assessments/:ticketId` - Get assessment

### GIS Files
- `POST /api/gis-files/upload` - Upload GIS file
- `GET /api/gis-files` - List files
- `GET /api/gis-files/:id/facilities` - Extract facilities

### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/predictions` - Predictive analytics

---

## Risk Assessment Factors

### Contributing Factors (Weight)
1. **High-pressure gas present** (30%)
2. **Excavator violation/damage history** (25%)
3. **Heavy rain/frozen ground** (15%)
4. **Near previous damage site** (10%)
5. **Utility congestion** (10%)
6. **Inexperienced locator** (5%)
7. **Aging infrastructure** (5%)

### Risk Score Calculation
```
Base Risk: 30 points
+ Distance Factor: 0-10 points
+ Facility Type Multiplier: 0-15 points
+ Historical Damage Factor: 0-20 points
+ Excavator History Factor: 0-25 points
+ Weather Factor: 0-15 points
+ Soil Type Factor: 0-5 points
= Total Risk Score (0-100)

Risk Level:
- HIGH: ?70
- MEDIUM: 40-69
- LOW: <40
```

---

## Auto-Assignment Logic

### Steps
1. **Geographic Filter:** Find technicians whose geo-fence contains ticket location
2. **Availability Filter:** Filter by active, available technicians
3. **Load Balancing:** Score based on current ticket load
4. **Experience Matching:** Match risk level to experience requirements
5. **Assign:** Select highest-scoring technician

### Experience Requirements by Risk Level
- **HIGH Risk:** 3+ years experience
- **MEDIUM Risk:** 1+ years experience
- **LOW Risk:** 6+ months experience

### Assignment Score Formula
```
Score = (Load Score ? 0.4) + (Experience Match ? 0.4) + (Distance Score ? 0.2)
```

---

## Script Template Example

### Risk Summary Template

**Input Variables:**
- `distance` - Distance in miles
- `facilityCount` - Number of facilities
- `facilityTypes` - Array of facility types
- `historicalDamages` - Count at site
- `excavatorDamages6mo` - Excavator's 6-month damage count
- `riskLevel` - LOW/MEDIUM/HIGH
- `recommendedExperience` - Years of experience needed

**Output Template:**
```
This locate request is {{distance}} miles and there are {{facilityTypes}} 
facilities buried in the scope of the ticket. There have been 
{{historicalDamages}} reported damages at this site but the excavator 
has damaged {{excavatorDamages6mo}} gas lines in the past 6 months 
according to our records. The chances of a utility damage is 
{{riskLevel}}-risk due to the excavator's damage history. Assigning a 
locator with at least {{recommendedExperience}} year(s) of experience 
is highly recommended.
```

---

## User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Locator** | View assigned tickets, update status, add notes |
| **Field Supervisor** | All locator permissions + view team tickets, reassign within team |
| **Supervisor** | All field supervisor permissions + assign any ticket, view analytics |
| **Auditor** | Read-only access to all tickets, damage reports, audit trails |
| **Trainer** | Read employee data, training records, view performance |
| **Manager** | Full access to all features, configuration, reporting |

---

## Geo-Fencing Structure

### PostGIS Data Types
- **POINT:** Single location (lat, lng)
- **POLYGON:** Geo-fence boundary
- **BOX:** Bounding box (north, south, east, west)
- **LINESTRING:** Utility line segments

### Spatial Queries
```sql
-- Find technicians for location
SELECT * FROM employees e
JOIN geo_fences gf ON e.geo_fence_id = gf.id
WHERE ST_Contains(gf.boundary, ST_MakePoint(lng, lat));

-- Find facilities in bounding box
SELECT * FROM facilities
WHERE ST_Intersects(location, ST_MakeBox2D(
  ST_MakePoint(west, south),
  ST_MakePoint(east, north)
));
```

---

## File Formats Supported

### GIS Files
- Shapefile (.shp, .shx, .dbf)
- GeoJSON (.geojson)
- KML/KMZ (.kml, .kmz)
- PDF maps (georeferenced)
- GeoTIFF

### Storage
- Object storage (S3/MinIO)
- Metadata in PostgreSQL (JSONB)
- PostGIS for spatial indexing

---

## Weather Data Sources

### Primary: OpenWeatherMap
- Current conditions
- Historical data (paid)
- Forecast data
- Severe weather alerts

### Fallback: NOAA Weather API
- Free government API
- US-focused
- Historical data available

### Data Points Collected
- Temperature
- Precipitation (current, 24h, 48h)
- Wind speed
- Conditions (clear/rain/snow/frozen)
- Severe weather alerts

---

## Performance Targets

### API Response Times
- Ticket ingestion: < 500ms
- Risk assessment: < 2s
- Auto-assignment: < 1s
- Dashboard queries: < 3s

### Mobile App
- Initial load: < 2s
- Map rendering: < 1s
- Offline sync: Background

### System Availability
- Uptime target: > 99.5%
- Database query: < 100ms (p95)

---

## Implementation Phases Summary

1. **Phase 1 (Weeks 1-4):** Foundation - Database, basic API, auth
2. **Phase 2 (Weeks 5-8):** Geo-fencing & Auto-assignment
3. **Phase 3 (Weeks 9-12):** GIS & Map Integration
4. **Phase 4 (Weeks 13-16):** Weather & Risk Assessment
5. **Phase 5 (Weeks 17-20):** Damage Reporting
6. **Phase 6 (Weeks 21-28):** Mobile App
7. **Phase 7 (Weeks 29-36):** Web Portal
8. **Phase 8 (Weeks 37-40):** Predictive Analytics
9. **Phase 9 (Weeks 41-44):** Testing & Refinement
10. **Phase 10 (Weeks 45-48):** Deployment & Launch

**Total Timeline:** ~48 weeks (12 months)

---

## Key Decisions Made

### Database Choice: PostgreSQL + PostGIS
- **Rationale:** Best geospatial support, ACID compliance, JSONB flexibility

### Map API: Mapbox
- **Rationale:** Cost-effective for PoC, excellent React Native support, modern SDKs

### Weather API: OpenWeatherMap (primary)
- **Rationale:** Comprehensive data, good API design, reasonable pricing

### Architecture: Microservices-Oriented Monolith
- **Rationale:** Faster PoC development, easier to extract microservices later if needed

### Mobile Framework: React Native
- **Rationale:** Cross-platform potential, large ecosystem, good Mapbox support

---

## Success Metrics

### Operational
- Ticket assignment time: < 5 minutes
- Auto-assignment accuracy: > 85%
- SLA compliance: > 95%
- System uptime: > 99.5%

### Risk Prevention
- Damage reduction: 20% target
- High-risk identification accuracy
- Risk score correlation with incidents

### User Experience
- Mobile app adoption rate
- User satisfaction scores
- Time to complete ticket: 10% reduction target

---

## Common Integrations

### Texas 811
- **Type:** Webhook (incoming)
- **Auth:** HMAC signature
- **Format:** JSON
- **Status:** Already implemented (enhancement needed)

### CPS Energy
- **Type:** TBD (API or SFTP)
- **Data:** GIS files, facility data, damage reports
- **Status:** To be determined

### Mapbox
- **SDK:** mapbox-gl-js (web), @rnmapbox/maps (mobile)
- **Features:** Base maps, custom layers, routing
- **Setup:** API key required

### OpenWeatherMap
- **API:** REST API
- **Auth:** API key
- **Rate Limits:** Based on subscription tier

---

## Development Environment Setup

### Prerequisites
- Node.js 20+ LTS
- PostgreSQL 15+ with PostGIS extension
- Redis 7+
- Docker (optional, for MinIO)

### Quick Start
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Environment Variables Needed
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `MAPBOX_ACCESS_TOKEN` - Mapbox API key
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key
- `WEBHOOK_SECRET` - Texas 811 webhook secret
- `JWT_SECRET` - JWT signing secret

---

## Testing Strategy

### Unit Tests
- Business logic functions
- Risk calculation algorithms
- Assignment algorithms

### Integration Tests
- API endpoints
- Database queries
- External API integrations

### E2E Tests
- Ticket workflow (ingestion ? assignment ? completion)
- Mobile app workflows
- Web portal workflows

### Performance Tests
- API response times
- Database query performance
- Concurrent request handling

---

## Security Checklist

- [ ] JWT authentication implemented
- [ ] Role-based access control (RBAC)
- [ ] Input validation (Zod schemas)
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] Rate limiting (already implemented)
- [ ] TLS/HTTPS enforced
- [ ] Secrets management (environment variables)
- [ ] Audit logging
- [ ] Data encryption at rest

---

## Monitoring & Alerting

### Application Monitoring
- Error rates
- Response times
- API endpoint health

### Infrastructure Monitoring
- Database performance
- Redis performance
- Server resources

### Business Metrics
- Ticket processing rate
- Assignment success rate
- Risk score distribution
- Damage incident trends

### Alert Thresholds
- API error rate > 5%
- Response time p95 > 2s
- Database query time > 500ms
- System downtime

---

## Troubleshooting Common Issues

### Auto-Assignment Failing
1. Check geo-fence boundaries (may need adjustment)
2. Verify technician availability status
3. Check load balancing scores
4. Review assignment history logs

### Risk Assessment Errors
1. Verify all required data is present
2. Check weather API connectivity
3. Validate facility data availability
4. Review risk calculation logs

### Map Display Issues
1. Verify Mapbox API key
2. Check coordinate system (WGS84)
3. Validate GeoJSON format
4. Check network connectivity

### Mobile App Sync Issues
1. Verify API connectivity
2. Check offline cache size
3. Review sync logs
4. Validate authentication tokens

---

## Documentation References

- **System Design:** `/docs/system-design-plan.md`
- **ML Guide:** `/docs/utility-damage-prevention-ml-guide.md`
- **API Documentation:** (To be generated via Swagger)
- **Database Schema:** (To be generated via Prisma)

---

*Last Updated: 2025-01-27*  
*Version: 1.0*
