# Domain Logic Script Templates - Locate Request Analysis

## Overview

This document defines script templates for domain logic calculations that transform raw data into human-readable summaries and actionable insights. These templates will be used to generate the intelligent summaries described in the requirements.

**Example Output Goal:**
> "This locate request is 0.25 miles and there are gas and electric facilities buried in the scope of the ticket. There have been known reported damages at this site but the excavator has damaged 3 gas lines in the past 6 months according to our records. The chances of a utility damage is a medium-risk due to the excavator's damage history. Assigning a locator with at least 1 year of experience is highly recommended."

---

## Table of Contents

1. [Script Template Structure](#script-template-structure)
2. [Core Calculation Functions](#core-calculation-functions)
3. [Summary Generation Templates](#summary-generation-templates)
4. [Risk Assessment Integration](#risk-assessment-integration)
5. [Assignment Recommendation Logic](#assignment-recommendation-logic)

---

## Script Template Structure

### Template Syntax

Templates use a domain-specific language (DSL) that can be executed by a template engine. Each template consists of:

1. **Data Extraction** - Gather required data points
2. **Calculations** - Perform domain logic computations
3. **Conditional Logic** - Apply business rules
4. **Output Generation** - Format human-readable summary

### Template Engine Options

- **JavaScript Template Strings** - Simple, easy to maintain
- **Mustache/Handlebars** - More structured templating
- **Custom DSL** - Domain-specific template language
- **Python Jinja2** - Powerful templating engine

**Recommendation:** Start with JavaScript template literals for MVP, evolve to more structured approach as needed.

---

## Core Calculation Functions

### 1. Distance Calculation

```javascript
/**
 * Calculate distance in miles from boundary box
 * Uses bounding box dimensions or actual coordinates
 */
function calculateLocateDistance(boundaryBox) {
  const { north, south, east, west } = boundaryBox;
  
  // Calculate approximate distance using Haversine formula
  const latDiff = (north - south) * 69; // Rough miles per degree latitude
  const lngDiff = (east - west) * Math.cos((north + south) / 2 * Math.PI / 180) * 69;
  
  // Use diagonal as approximate distance
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  
  return {
    distance: Math.round(distance * 100) / 100, // Round to 2 decimals
    unit: 'miles',
    method: 'bounding_box_approximation'
  };
}
```

### 2. Utility Type Identification

```javascript
/**
 * Identify utility types present in locate scope
 * Queries GIS data and locate request data
 */
async function identifyUtilityTypes(locateRequestId, coordinates, boundaryBox) {
  const gisQuery = await queryGISFiles({
    location: coordinates,
    boundary: boundaryBox,
    utilityTypes: 'all'
  });
  
  // Combine requested utilities with actual GIS data
  const requested = locateRequest.requestedUtilities || [];
  const foundInGIS = gisQuery.utilities || [];
  
  // Merge and deduplicate
  const allUtilities = [...new Set([...requested, ...foundInGIS])];
  
  return {
    utilities: allUtilities,
    utilitiesInScope: allUtilities.length,
    utilitiesDetailed: {
      gas: allUtilities.includes('gas'),
      electric: allUtilities.includes('electric'),
      water: allUtilities.includes('water'),
      telecom: allUtilities.includes('telecom'),
      sewer: allUtilities.includes('sewer')
    }
  };
}
```

### 3. Damage History Analysis

```javascript
/**
 * Analyze damage history for site and excavator
 */
async function analyzeDamageHistory(locateRequest) {
  const siteCoordinates = locateRequest.coordinates;
  const excavatorId = locateRequest.excavatorId;
  const lookbackMonths = 12;
  const siteRadiusMiles = 0.1; // 0.1 mile radius for "same site"
  
  // Site damage history
  const siteDamages = await queryDamageIncidents({
    location: siteCoordinates,
    radius: siteRadiusMiles,
    monthsBack: lookbackMonths
  });
  
  // Excavator damage history
  const excavatorDamages = await queryDamageIncidents({
    excavatorId: excavatorId,
    monthsBack: lookbackMonths
  });
  
  // Recent excavator damages (last 6 months)
  const recentExcavatorDamages = excavatorDamages.filter(d => 
    d.incidentDate >= getMonthsAgo(6)
  );
  
  // Count by utility type
  const recentGasDamages = recentExcavatorDamages.filter(d => 
    d.utilityType === 'gas'
  ).length;
  
  return {
    site: {
      hasDamages: siteDamages.length > 0,
      damageCount: siteDamages.length,
      lastDamageDate: siteDamages[0]?.incidentDate || null,
      utilitiesDamaged: [...new Set(siteDamages.map(d => d.utilityType))]
    },
    excavator: {
      totalDamages12mo: excavatorDamages.length,
      recentDamages6mo: recentExcavatorDamages.length,
      gasDamages6mo: recentGasDamages,
      damageHistory: excavatorDamages.map(d => ({
        date: d.incidentDate,
        utilityType: d.utilityType,
        severity: d.severity,
        cause: d.cause
      }))
    }
  };
}
```

### 4. Risk Level Calculation

```javascript
/**
 * Calculate overall risk level based on multiple factors
 * Integrates with ML risk assessment service
 */
async function calculateRiskLevel(locateRequest) {
  // Get ML risk score from risk assessment service
  const mlRiskScore = await getRiskAssessment(locateRequest.id);
  
  // Calculate additional risk factors
  const damageHistory = await analyzeDamageHistory(locateRequest);
  const weatherConditions = await getCurrentWeather(locateRequest.coordinates);
  
  // Compile risk factors
  const riskFactors = {
    mlScore: mlRiskScore.riskScore, // 0-100
    excavatorHistory: {
      recentDamages: damageHistory.excavator.recentDamages6mo,
      gasDamages: damageHistory.excavator.gasDamages6mo,
      weight: calculateExcavatorRiskWeight(damageHistory.excavator)
    },
    siteHistory: {
      hasPriorDamages: damageHistory.site.hasDamages,
      weight: damageHistory.site.hasDamages ? 15 : 0
    },
    weather: {
      condition: weatherConditions.conditions,
      riskLevel: getWeatherRiskLevel(weatherConditions),
      weight: calculateWeatherRiskWeight(weatherConditions)
    },
    utilityType: {
      hasHighPressureGas: locateRequest.requestedUtilities.includes('gas'),
      weight: locateRequest.requestedUtilities.includes('gas') ? 30 : 0
    }
  };
  
  // Calculate overall risk (can use weighted combination or ML score)
  const overallRisk = mlRiskScore.riskScore || calculateCombinedRisk(riskFactors);
  
  // Categorize risk level
  let riskLevel;
  if (overallRisk >= 70) {
    riskLevel = 'high';
  } else if (overallRisk >= 40) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }
  
  return {
    riskScore: overallRisk,
    riskLevel: riskLevel,
    factors: riskFactors,
    primaryFactors: getPrimaryRiskFactors(riskFactors)
  };
}

function calculateExcavatorRiskWeight(excavatorHistory) {
  if (excavatorHistory.recentDamages6mo >= 3) return 25;
  if (excavatorHistory.recentDamages6mo >= 1) return 15;
  return 0;
}

function getWeatherRiskLevel(weather) {
  if (['heavy_rain', 'frozen_ground', 'saturated_soil'].includes(weather.conditions)) {
    return 'high';
  }
  if (['light_rain', 'snow'].includes(weather.conditions)) {
    return 'medium';
  }
  return 'low';
}

function calculateWeatherRiskWeight(weather) {
  const level = getWeatherRiskLevel(weather);
  if (level === 'high') return 15;
  if (level === 'medium') return 8;
  return 0;
}

function calculateCombinedRisk(factors) {
  return Math.min(100, 
    factors.excavatorHistory.weight +
    factors.siteHistory.weight +
    factors.weather.weight +
    factors.utilityType.weight
  );
}

function getPrimaryRiskFactors(factors) {
  const sorted = [
    { name: 'Excavator History', weight: factors.excavatorHistory.weight },
    { name: 'Weather Conditions', weight: factors.weather.weight },
    { name: 'Site History', weight: factors.siteHistory.weight },
    { name: 'Utility Type', weight: factors.utilityType.weight }
  ].sort((a, b) => b.weight - a.weight);
  
  return sorted.filter(f => f.weight > 0).slice(0, 3);
}
```

### 5. Locator Recommendation

```javascript
/**
 * Generate locator assignment recommendation based on risk level
 */
function generateLocatorRecommendation(riskLevel, riskFactors) {
  const recommendations = {
    minExperienceYears: 0,
    minExperienceMonths: 0,
    preferredExperience: '',
    requiredCertifications: [],
    recommendations: []
  };
  
  if (riskLevel === 'high') {
    recommendations.minExperienceYears = 3;
    recommendations.minExperienceMonths = 36;
    recommendations.preferredExperience = 'Senior locator with 3+ years experience';
    recommendations.requiredCertifications = ['advanced_gas_locating'];
    recommendations.recommendations = [
      'Assign most experienced locator available',
      'Consider dual-person assignment for verification',
      'Schedule pre-work safety meeting',
      'Enhanced monitoring and documentation required'
    ];
  } else if (riskLevel === 'medium') {
    recommendations.minExperienceYears = 1;
    recommendations.minExperienceMonths = 12;
    recommendations.preferredExperience = 'Locator with at least 1 year of experience';
    recommendations.recommendations = [
      'Assign locator with 1+ years experience',
      'Standard safety protocols apply',
      'Review excavator damage history with assigned locator'
    ];
  } else {
    recommendations.minExperienceYears = 0;
    recommendations.minExperienceMonths = 6;
    recommendations.preferredExperience = 'Any qualified locator';
    recommendations.recommendations = [
      'Standard assignment protocol',
      'Normal safety procedures'
    ];
  }
  
  // Adjust based on specific risk factors
  if (riskFactors.excavatorHistory.gasDamages > 0) {
    recommendations.requiredCertifications.push('gas_locating');
    recommendations.recommendations.push(
      'Locator must have gas locating certification due to excavator gas damage history'
    );
  }
  
  if (riskFactors.utilityType.hasHighPressureGas) {
    recommendations.requiredCertifications.push('high_pressure_gas');
    recommendations.recommendations.push(
      'High pressure gas line present - specialized training required'
    );
  }
  
  return recommendations;
}
```

---

## Summary Generation Templates

### Template 1: Standard Locate Request Summary

```javascript
/**
 * Generate human-readable summary for locate request
 */
async function generateLocateRequestSummary(locateRequestId) {
  const request = await getLocateRequest(locateRequestId);
  const distance = calculateLocateDistance(request.boundaryBox);
  const utilities = await identifyUtilityTypes(request.id, request.coordinates, request.boundaryBox);
  const damageHistory = await analyzeDamageHistory(request);
  const riskAssessment = await calculateRiskLevel(request);
  const recommendation = generateLocatorRecommendation(riskAssessment.riskLevel, riskAssessment.factors);
  const weather = await getCurrentWeather(request.coordinates);
  
  // Generate summary text
  const summaryParts = [];
  
  // Distance and scope
  summaryParts.push(
    `This locate request is ${distance.distance} miles ` +
    `and there are ${utilities.utilitiesInScope} utility type(s) ` +
    `(${utilities.utilities.join(', ')}) ` +
    `buried in the scope of the ticket.`
  );
  
  // Site damage history
  if (damageHistory.site.hasDamages) {
    summaryParts.push(
      `There have been ${damageHistory.site.damageCount} ` +
      `known reported damage(s) at this site in the past 12 months.`
    );
  }
  
  // Excavator history
  if (damageHistory.excavator.recentDamages6mo > 0) {
    const gasText = damageHistory.excavator.gasDamages6mo > 0 
      ? `, including ${damageHistory.excavator.gasDamages6mo} gas line(s)`
      : '';
    
    summaryParts.push(
      `The excavator has damaged ${damageHistory.excavator.recentDamages6mo} ` +
      `utility line(s) in the past 6 months${gasText} according to our records.`
    );
  }
  
  // Risk assessment
  const riskText = riskAssessment.riskLevel === 'high' 
    ? 'high-risk' 
    : riskAssessment.riskLevel === 'medium' 
      ? 'medium-risk' 
      : 'low-risk';
  
  summaryParts.push(
    `The chances of a utility damage is ${riskText} ` +
    `due to the excavator's damage history and site conditions.`
  );
  
  // Recommendation
  if (recommendation.minExperienceYears >= 1) {
    summaryParts.push(
      `Assigning a locator with at least ${recommendation.minExperienceYears} ` +
      `year${recommendation.minExperienceYears > 1 ? 's' : ''} ` +
      `of experience is ${riskAssessment.riskLevel === 'high' ? 'required' : 'highly recommended'}.`
    );
  }
  
  // Additional context
  if (weather.conditions !== 'clear') {
    summaryParts.push(
      `Current weather conditions: ${weather.conditions} ` +
      `(${weather.temperature}?F). This may affect locating accuracy.`
    );
  }
  
  // Combine into final summary
  const summary = summaryParts.join(' ') + '\n\n';
  
  // Add detailed recommendations
  if (recommendation.recommendations.length > 0) {
    summary += 'Additional Recommendations:\n';
    recommendation.recommendations.forEach((rec, idx) => {
      summary += `${idx + 1}. ${rec}\n`;
    });
  }
  
  return {
    summary: summary.trim(),
    structured: {
      distance: distance,
      utilities: utilities,
      damageHistory: damageHistory,
      riskAssessment: riskAssessment,
      recommendation: recommendation,
      weather: weather
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      templateVersion: '1.0',
      requestId: request.id
    }
  };
}
```

### Template 2: Executive Summary (Condensed)

```javascript
/**
 * Generate condensed executive summary
 */
function generateExecutiveSummary(fullSummary) {
  const { structured, riskAssessment } = fullSummary;
  
  return {
    ticketNumber: structured.request.ticketNumber,
    riskLevel: riskAssessment.riskLevel.toUpperCase(),
    riskScore: riskAssessment.riskScore,
    distance: structured.distance.distance + ' miles',
    utilities: structured.utilities.utilities.join(', '),
    excavatorRisk: structured.damageHistory.excavator.recentDamages6mo > 0 
      ? `${structured.damageHistory.excavator.recentDamages6mo} damages in 6mo`
      : 'Clean record',
    recommendation: structured.recommendation.preferredExperience,
    priority: riskAssessment.riskLevel === 'high' ? 'HIGH' : 'NORMAL'
  };
}
```

### Template 3: Field Personnel Summary (Mobile App)

```javascript
/**
 * Generate mobile-friendly summary for field personnel
 */
function generateFieldSummary(fullSummary) {
  const { structured, summary } = fullSummary;
  
  return {
    // Short version for quick reference
    quickInfo: {
      risk: structured.riskAssessment.riskLevel.toUpperCase(),
      distance: structured.distance.distance + ' mi',
      utilities: structured.utilities.utilities.length + ' types',
      weather: structured.weather.conditions
    },
    // Full summary
    fullSummary: summary,
    // Action items
    actionItems: structured.recommendation.recommendations,
    // Warnings
    warnings: generateWarnings(structured)
  };
}

function generateWarnings(structured) {
  const warnings = [];
  
  if (structured.damageHistory.excavator.gasDamages6mo > 0) {
    warnings.push({
      level: 'high',
      message: `?? Excavator has damaged ${structured.damageHistory.excavator.gasDamages6mo} gas line(s) recently`
    });
  }
  
  if (structured.riskAssessment.riskLevel === 'high') {
    warnings.push({
      level: 'high',
      message: '?? HIGH RISK - Exercise extreme caution'
    });
  }
  
  if (structured.utilities.utilitiesDetailed.gas) {
    warnings.push({
      level: 'medium',
      message: '? Gas facilities present - verify marks carefully'
    });
  }
  
  return warnings;
}
```

---

## Risk Assessment Integration

### Integration with ML Risk Model

```javascript
/**
 * Integrate with ML risk assessment service
 * Falls back to rule-based if ML service unavailable
 */
async function getRiskAssessment(locateRequestId) {
  try {
    // Call ML risk assessment service
    const response = await fetch(`${RISK_SERVICE_URL}/api/v1/risk/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locateRequestId })
    });
    
    if (response.ok) {
      const mlAssessment = await response.json();
      return {
        riskScore: mlAssessment.riskScore,
        riskLevel: mlAssessment.riskLevel,
        source: 'ml_model',
        factors: mlAssessment.contributingFactors,
        confidence: mlAssessment.confidence || 0.85
      };
    }
  } catch (error) {
    console.warn('ML risk service unavailable, using rule-based fallback', error);
  }
  
  // Fallback to rule-based calculation
  return await calculateRuleBasedRisk(locateRequestId);
}

async function calculateRuleBasedRisk(locateRequestId) {
  const request = await getLocateRequest(locateRequestId);
  const damageHistory = await analyzeDamageHistory(request);
  const weather = await getCurrentWeather(request.coordinates);
  
  let riskScore = 0;
  
  // Excavator history (0-25 points)
  if (damageHistory.excavator.recentDamages6mo >= 3) {
    riskScore += 25;
  } else if (damageHistory.excavator.recentDamages6mo >= 1) {
    riskScore += 15;
  }
  
  // Site history (0-20 points)
  if (damageHistory.site.hasDamages) {
    riskScore += 20;
  }
  
  // Weather (0-15 points)
  if (['heavy_rain', 'frozen_ground'].includes(weather.conditions)) {
    riskScore += 15;
  } else if (['light_rain', 'snow'].includes(weather.conditions)) {
    riskScore += 8;
  }
  
  // Utility type (0-30 points)
  if (request.requestedUtilities.includes('gas')) {
    riskScore += 30;
  }
  
  // Determine risk level
  let riskLevel;
  if (riskScore >= 70) {
    riskLevel = 'high';
  } else if (riskScore >= 40) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }
  
  return {
    riskScore: Math.min(100, riskScore),
    riskLevel: riskLevel,
    source: 'rule_based',
    confidence: 0.70
  };
}
```

---

## Assignment Recommendation Logic

### Auto-Assignment Algorithm

```javascript
/**
 * Generate assignment recommendation with locator matching
 */
async function generateAssignmentRecommendation(locateRequestId) {
  const request = await getLocateRequest(locateRequestId);
  const summary = await generateLocateRequestSummary(locateRequestId);
  const { recommendation, riskAssessment } = summary.structured;
  
  // Find eligible locators
  const eligibleLocators = await findEligibleLocators({
    geoFence: request.assignedGeoFence || request.geoFenceId,
    minExperienceMonths: recommendation.minExperienceMonths,
    maxCurrentLoad: 8, // Max tickets currently assigned
    requiredCertifications: recommendation.requiredCertifications,
    available: true // Currently available for assignment
  });
  
  // Score and rank locators
  const rankedLocators = eligibleLocators.map(locator => {
    let score = 100;
    
    // Experience bonus
    const experienceMonths = locator.experienceMonths || 0;
    if (experienceMonths >= recommendation.minExperienceMonths * 2) {
      score += 20; // Over-qualified bonus
    } else if (experienceMonths >= recommendation.minExperienceMonths) {
      score += 10; // Meets requirements
    } else {
      score -= 50; // Below requirements (shouldn't happen if filtered)
    }
    
    // Current workload penalty
    const loadRatio = locator.currentTicketLoad / locator.maxTicketLoad;
    if (loadRatio < 0.5) {
      score += 15; // Light workload
    } else if (loadRatio < 0.75) {
      score += 5; // Moderate workload
    } else if (loadRatio >= 1.0) {
      score -= 30; // Over capacity
    }
    
    // Damage history bonus (fewer damages = better)
    const atFaultDamages12mo = locator.atFaultDamages12mo || 0;
    if (atFaultDamages12mo === 0) {
      score += 10; // Clean record
    } else if (atFaultDamages12mo <= 1) {
      score += 5; // Good record
    } else {
      score -= (atFaultDamages12mo * 5); // Penalty for damages
    }
    
    // Proximity bonus (if multiple geo-fences)
    if (locator.primaryGeoFenceId === request.geoFenceId) {
      score += 10; // Primary territory
    }
    
    return {
      ...locator,
      assignmentScore: score
    };
  }).sort((a, b) => b.assignmentScore - a.assignmentScore);
  
  // Get top recommendations
  const topCandidates = rankedLocators.slice(0, 3);
  
  return {
    recommendation: summary.summary,
    recommendedLocators: topCandidates.map(loc => ({
      employeeId: loc.id,
      employeeName: `${loc.firstName} ${loc.lastName}`,
      employeeNumber: loc.employeeNumber,
      assignmentScore: loc.assignmentScore,
      matchReasons: [
        `Experience: ${loc.experienceMonths} months`,
        `Current load: ${loc.currentTicketLoad}/${loc.maxTicketLoad} tickets`,
        `Damage record: ${loc.atFaultDamages12mo} at-fault damages (12mo)`
      ]
    })),
    primaryRecommendation: topCandidates[0],
    riskLevel: riskAssessment.riskLevel,
    autoAssignable: topCandidates.length > 0 && topCandidates[0].assignmentScore >= 70
  };
}
```

---

## Template Execution Engine

### Template Runner

```javascript
/**
 * Execute template with data context
 */
class TemplateRunner {
  constructor(dataContext) {
    this.context = dataContext;
    this.functions = {
      calculateDistance: calculateLocateDistance,
      identifyUtilities: identifyUtilityTypes,
      analyzeDamageHistory: analyzeDamageHistory,
      calculateRisk: calculateRiskLevel,
      generateRecommendation: generateLocatorRecommendation
    };
  }
  
  async execute(templateName, params = {}) {
    const templates = {
      'locate_request_summary': generateLocateRequestSummary,
      'executive_summary': generateExecutiveSummary,
      'field_summary': generateFieldSummary,
      'assignment_recommendation': generateAssignmentRecommendation
    };
    
    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template not found: ${templateName}`);
    }
    
    return await template(params.locateRequestId || this.context.locateRequestId);
  }
}

// Usage
const runner = new TemplateRunner({ locateRequestId: 'abc-123' });
const summary = await runner.execute('locate_request_summary');
console.log(summary.summary);
```

---

## Configuration & Customization

### Template Configuration

Templates can be customized via configuration files:

```json
{
  "templates": {
    "risk_thresholds": {
      "high": 70,
      "medium": 40,
      "low": 0
    },
    "lookback_periods": {
      "damage_history_months": 12,
      "recent_damage_months": 6,
      "site_radius_miles": 0.1
    },
    "experience_requirements": {
      "high_risk": {
        "min_years": 3,
        "min_months": 36
      },
      "medium_risk": {
        "min_years": 1,
        "min_months": 12
      },
      "low_risk": {
        "min_years": 0,
        "min_months": 6
      }
    },
    "assignment_scoring": {
      "experience_bonus": 20,
      "workload_penalty": -30,
      "damage_penalty_per_incident": 5
    }
  }
}
```

---

## Next Steps

1. **Implement Core Functions** - Build calculation functions in TypeScript
2. **Create Template Engine** - Build template execution system
3. **Unit Tests** - Test each calculation function
4. **Integration Tests** - Test end-to-end summary generation
5. **Performance Optimization** - Cache calculations where possible
6. **Internationalization** - Support multiple languages (future)

---

*Document created: 2025-01-15*
*Status: Planning & Design Phase*
*Version: 1.0*
