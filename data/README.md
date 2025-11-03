# Mock Data Generation

This directory contains scripts to generate realistic mock data for the Utility Locate Risk Assessment PoC.

## Overview

The data generators create:
- **50 Excavator companies** with varied risk profiles
- **25 Locator employees** with geo-fenced territories
- **1000 Locate request tickets** in Texas 811 format (including 3 special demo scenarios)
- **100 Historical damage incidents** linked to excavators and locations

## Quick Start

### Generate All Data (Recommended)

```bash
npm run generate:data
```

This runs all generators in the correct order and produces a summary report.

### Generate Individual Datasets

```bash
# Must be run in this order (dependencies)
npm run generate:excavators   # Run first
npm run generate:employees     # Independent
npm run generate:tickets       # Requires excavators
npm run generate:damages       # Requires excavators
```

## Output

All generated data is saved to `/data/seed/` as JSON files:

- `excavators.json` - Excavator company profiles with damage history
- `employees.json` - Locator technicians with performance metrics and geo-fences
- `tickets.json` - Locate request tickets with 3 special demo scenarios
- `damages.json` - Historical damage incidents
- `_summary.json` - Statistics and generation report

## Data Features

### Excavators
- **Risk Profiles:**
  - 15% High-risk (3+ damages in 6 months)
  - 20% Excellent (0 damages, high compliance)
  - 65% Average (0-2 damages)
  
- **Includes:**
  - Compliance metrics
  - Damage history by utility type and severity
  - Equipment profiles
  - Certifications and insurance status

### Employees
- **Experience Levels:**
  - 30% Novice (0-2 years)
  - 50% Experienced (2-5 years)
  - 20% Senior (5+ years)
  
- **Includes:**
  - Geo-fenced territories (covering San Antonio in grid)
  - Performance metrics (correlated with experience)
  - Certifications and specialties
  - Current workload
  - Training history

### Tickets
- **Types:**
  - 85% Routine
  - 10% Non-compliant
  - 5% Emergency
  
- **Includes:**
  - Texas 811 format compliance
  - Realistic addresses in San Antonio
  - Boundary box geometries (using Turf.js)
  - 1-5 utility types per ticket
  - Correlation between excavator risk and ticket complexity
  
- **3 Demo Scenarios:**
  1. **TX-2025-999001** - Critical risk (problem excavator + emergency + gas)
  2. **TX-2025-500123** - Low risk (excellent excavator + telecom only)
  3. **TX-2025-750456** - Complex multi-utility (5 utility types in congested area)

### Damages
- **Severity:**
  - 60% Minor
  - 30% Major
  - 10% Critical
  
- **Includes:**
  - Root cause analysis
  - Consequences (service disruption, evacuations, injuries)
  - Costs (repair, fines, service credits)
  - Lessons learned and corrective actions
  - 5 damage "hotspot" locations
  - Weighted by excavator risk profile

## Data Relationships

```
Excavators ???> Tickets (excavator_id)
            ??> Damages (excavator_id)

Employees ??> (No direct links, matched by territory)

Tickets ???> Damages (ticket_id, optional)

Damages ???> Tickets (40% of damages linked to tickets)
        ???> Excavators (all damages linked)
```

## Geographic Coverage

All data is centered around **San Antonio, Texas**:
- Coordinates: 29.4241?N, 98.4936?W
- Bounds: 
  - Latitude: 29.3 to 29.6
  - Longitude: -98.7 to -98.3
- Coverage: ~30 miles ? 30 miles

Employee territories divide this area into ~25 zones using Turf.js circle geometries.

## Customization

Edit the generator files to adjust:
- Count of records (default: 50/25/1000/100)
- Risk profile distributions
- Geographic bounds
- Utility type frequencies
- Damage severity distributions

Example:
```javascript
// In generateExcavators.js
const excavators = generateExcavators(100); // Generate 100 instead of 50
```

## Dependencies

- `@faker-js/faker` - Realistic fake data generation
- `@turf/turf` - Geospatial operations (boundaries, circles, distances)

## Validation

After generation, check `_summary.json` for:
- Record counts
- Distribution statistics
- Demo scenario ticket numbers
- Total costs and averages

## Next Steps

1. Review generated data in `/data/seed/`
2. Set up PostgreSQL + PostGIS database (Supabase recommended)
3. Create database seed script to import JSON data
4. Test spatial queries
5. Begin risk assessment API development

## Troubleshooting

**Error: "excavators.json not found"**
- Run `npm run generate:excavators` first
- Excavators must be generated before tickets and damages

**Error: "Cannot find module '@faker-js/faker'"**
- Run `npm install` to install dependencies

**Want different data?**
- Delete files in `/data/seed/` and regenerate
- Each run creates completely new random data

## Data Quality

Generated data is realistic and includes:
- ? Proper Texas 811 ticket format
- ? Valid San Antonio addresses and coordinates
- ? Realistic damage costs (based on industry averages)
- ? Correlated relationships (high-risk excavators appear more in damages)
- ? Weighted distributions matching real-world patterns
- ? GeoJSON geometries compatible with PostGIS
- ? 3 hand-crafted demo scenarios for impressive presentations

## File Sizes

Approximate sizes:
- `excavators.json` - ~150 KB
- `employees.json` - ~200 KB  
- `tickets.json` - ~3 MB
- `damages.json` - ~500 KB
- Total: ~4 MB

Perfect for PoC development and demos!
