import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

// San Antonio area bounds
const SA_BOUNDS = {
  minLng: -98.7,
  maxLng: -98.3,
  minLat: 29.3,
  maxLat: 29.6
};

/**
 * Generate historical damage incidents
 */
export function generateDamages(count = 100, excavators = null, tickets = null) {
  console.log(`Generating ${count} damage incident records...`);
  
  // Load excavators if not provided
  if (!excavators) {
    try {
      const excavatorsPath = path.join(process.cwd(), 'data', 'seed', 'excavators.json');
      excavators = JSON.parse(fs.readFileSync(excavatorsPath, 'utf-8'));
    } catch (error) {
      console.error('??  Could not load excavators.json. Generate excavators first.');
      process.exit(1);
    }
  }
  
  // Load tickets if not provided (optional)
  if (!tickets) {
    try {
      const ticketsPath = path.join(process.cwd(), 'data', 'seed', 'tickets.json');
      tickets = JSON.parse(fs.readFileSync(ticketsPath, 'utf-8'));
    } catch (error) {
      console.log('??  tickets.json not found. Damages will not be linked to tickets.');
      tickets = [];
    }
  }
  
  const damages = [];
  const hotspotLocations = generateHotspots(5); // Create 5 damage hotspot locations
  
  for (let i = 0; i < count; i++) {
    // Select excavator (weighted by their damage profile)
    const excavator = selectExcavatorForDamage(excavators);
    
    // Determine if this damage is at a hotspot location
    const isHotspot = Math.random() < 0.3; // 30% of damages at hotspots
    const location = isHotspot 
      ? faker.helpers.arrayElement(hotspotLocations)
      : generateRandomLocation();
    
    // Determine if linked to a ticket
    const linkedTicket = tickets.length > 0 && Math.random() < 0.4 
      ? faker.helpers.arrayElement(tickets)
      : null;
    
    // Utility type (weighted by real-world damage frequency)
    const utilityType = faker.helpers.weightedArrayElement([
      { weight: 35, value: 'gas' },
      { weight: 30, value: 'electric' },
      { weight: 20, value: 'water' },
      { weight: 10, value: 'telecom' },
      { weight: 5, value: 'sewer' }
    ]);
    
    // Severity (weighted distribution)
    const severity = faker.helpers.weightedArrayElement([
      { weight: 60, value: 'minor' },
      { weight: 30, value: 'major' },
      { weight: 10, value: 'critical' }
    ]);
    
    // Responsible party (weighted by real-world data)
    const responsibleParty = faker.helpers.weightedArrayElement([
      { weight: 70, value: 'excavator' },
      { weight: 20, value: 'locator' },
      { weight: 8, value: 'utility_owner' },
      { weight: 2, value: 'unknown' }
    ]);
    
    // Root cause
    const rootCause = generateRootCause(responsibleParty);
    
    // Date (weighted toward recent past)
    const daysAgo = faker.helpers.weightedArrayElement([
      { weight: 20, value: faker.number.int({ min: 0, max: 90 }) },    // Recent (last 3 months)
      { weight: 30, value: faker.number.int({ min: 91, max: 365 }) },  // Past year
      { weight: 30, value: faker.number.int({ min: 366, max: 730 }) }, // 1-2 years ago
      { weight: 20, value: faker.number.int({ min: 731, max: 1095 }) } // 2-3 years ago
    ]);
    
    const incidentDate = new Date();
    incidentDate.setDate(incidentDate.getDate() - daysAgo);
    
    // Consequences
    const consequences = generateConsequences(severity, utilityType);
    
    // Costs
    const costs = generateCosts(severity, consequences);
    
    const damage = {
      id: faker.string.uuid(),
      incident_number: `DMG-${incidentDate.getFullYear()}-${String(1000 + i).padStart(4, '0')}`,
      
      // Date and location
      date: incidentDate.toISOString().split('T')[0],
      location: {
        type: 'Point',
        coordinates: location
      },
      address: generateAddress(location),
      
      // Related entities
      ticket_id: linkedTicket?.id || null,
      ticket_number: linkedTicket?.ticket_number || null,
      excavator_id: excavator.id,
      excavator_company: excavator.company_name,
      locator_company: 'ULS Locating Service',
      
      // Utility information
      utility_type: utilityType,
      utility_owner: getUtilityOwner(utilityType),
      line_material: getLineMaterial(utilityType),
      line_diameter_inches: getLineDiameter(utilityType),
      line_depth_feet: faker.number.float({ min: 2, max: 8, precision: 0.5 }),
      
      // Damage details
      damage_type: faker.helpers.arrayElement(['strike', 'nick', 'scrape', 'complete_break']),
      severity: severity,
      
      // Responsibility
      responsible_party: responsibleParty,
      root_cause: rootCause.code,
      detailed_cause: rootCause.description,
      
      // Consequences
      consequences: consequences,
      
      // Costs
      costs: costs,
      
      // Investigation
      investigation_status: faker.helpers.arrayElement(['closed', 'under_review', 'pending']),
      regulatory_notification: severity === 'critical' || utilityType === 'gas',
      regulatory_case_number: severity === 'critical' 
        ? `RRC-${incidentDate.getFullYear()}-${faker.string.alphanumeric(6).toUpperCase()}`
        : null,
      
      // Lessons learned
      lessons_learned: generateLessonsLearned(rootCause, utilityType),
      corrective_actions: generateCorrectiveActions(rootCause),
      
      // Photos and documentation
      photos_available: faker.datatype.boolean(0.6), // 60% have photos
      report_filed: true,
      report_date: new Date(incidentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      
      created_at: incidentDate.toISOString(),
      updated_at: new Date().toISOString()
    };
    
    damages.push(damage);
  }
  
  return damages;
}

function selectExcavatorForDamage(excavators) {
  // Weighted selection - high-risk excavators more likely to appear in damages
  const weights = excavators.map(e => {
    switch (e.risk_profile) {
      case 'high_risk': return 5;  // 5x more likely
      case 'average': return 2;     // 2x
      case 'excellent': return 0.5; // 0.5x (they damage too, just rarely)
      default: return 1;
    }
  });
  
  return faker.helpers.arrayElement(excavators);
}

function generateHotspots(count) {
  // Create locations where multiple damages have occurred
  const hotspots = [];
  for (let i = 0; i < count; i++) {
    hotspots.push([
      faker.number.float({ min: SA_BOUNDS.minLng, max: SA_BOUNDS.maxLng, precision: 0.0001 }),
      faker.number.float({ min: SA_BOUNDS.minLat, max: SA_BOUNDS.maxLat, precision: 0.0001 })
    ]);
  }
  return hotspots;
}

function generateRandomLocation() {
  return [
    faker.number.float({ min: SA_BOUNDS.minLng, max: SA_BOUNDS.maxLng, precision: 0.0001 }),
    faker.number.float({ min: SA_BOUNDS.minLat, max: SA_BOUNDS.maxLat, precision: 0.0001 })
  ];
}

function generateAddress(location) {
  const [lng, lat] = location;
  const streets = [
    'Main St', 'Broadway', 'Commerce St', 'Houston St', 'McCullough Ave',
    'San Pedro Ave', 'Flores St', 'Zarzamora St', 'Fredericksburg Rd'
  ];
  
  return `${faker.number.int({ min: 100, max: 9999 })} ${faker.helpers.arrayElement(streets)}, San Antonio, TX ${faker.location.zipCode('#####')}`;
}

function generateRootCause(responsibleParty) {
  const causes = {
    excavator: [
      { code: 'excavated_without_ticket', description: 'Excavator began work without valid locate ticket' },
      { code: 'didnt_wait_for_locates', description: 'Excavator did not wait for locates to be completed before digging' },
      { code: 'ignored_markings', description: 'Excavator ignored or removed utility markings' },
      { code: 'excavated_outside_tolerance', description: 'Excavated outside the marked tolerance zone' },
      { code: 'improper_excavation_method', description: 'Used improper excavation method near marked utilities' },
      { code: 'failed_to_expose_verify', description: 'Failed to hand-dig and expose utilities before mechanical excavation' }
    ],
    locator: [
      { code: 'missed_utility', description: 'Locator failed to identify and mark utility' },
      { code: 'inaccurate_marking', description: 'Utility marking was significantly off from actual location' },
      { code: 'incomplete_locate', description: 'Locator did not complete the entire scope of the ticket' },
      { code: 'wrong_depth_marked', description: 'Marked depth information was incorrect' }
    ],
    utility_owner: [
      { code: 'inaccurate_records', description: 'Utility owner records showed incorrect location' },
      { code: 'undocumented_utility', description: 'Utility not shown on owner records or maps' },
      { code: 'shallow_utility', description: 'Utility was shallower than minimum depth requirements' },
      { code: 'poor_maintenance', description: 'Utility condition contributed to failure (corrosion, age)' }
    ],
    unknown: [
      { code: 'unknown', description: 'Root cause could not be determined from available information' }
    ]
  };
  
  return faker.helpers.arrayElement(causes[responsibleParty] || causes.unknown);
}

function generateConsequences(severity, utilityType) {
  const baseConsequences = {
    service_disruption: severity !== 'minor',
    customers_affected: 0,
    outage_duration_hours: 0,
    evacuation_required: false,
    injuries: 0,
    fatalities: 0,
    property_damage: severity === 'critical' || Math.random() < 0.3,
    environmental_impact: utilityType === 'gas' && severity === 'critical'
  };
  
  if (severity === 'critical') {
    baseConsequences.customers_affected = faker.number.int({ min: 100, max: 5000 });
    baseConsequences.outage_duration_hours = faker.number.int({ min: 6, max: 72 });
    baseConsequences.evacuation_required = utilityType === 'gas' && Math.random() < 0.5;
    baseConsequences.injuries = faker.helpers.weightedArrayElement([
      { weight: 70, value: 0 },
      { weight: 20, value: 1 },
      { weight: 8, value: 2 },
      { weight: 2, value: faker.number.int({ min: 3, max: 10 }) }
    ]);
  } else if (severity === 'major') {
    baseConsequences.customers_affected = faker.number.int({ min: 10, max: 500 });
    baseConsequences.outage_duration_hours = faker.number.int({ min: 2, max: 24 });
    baseConsequences.evacuation_required = false;
    baseConsequences.injuries = 0;
  } else {
    baseConsequences.service_disruption = Math.random() < 0.2;
    baseConsequences.customers_affected = Math.random() < 0.2 ? faker.number.int({ min: 1, max: 20 }) : 0;
    baseConsequences.outage_duration_hours = Math.random() < 0.2 ? faker.number.int({ min: 1, max: 4 }) : 0;
  }
  
  return baseConsequences;
}

function generateCosts(severity, consequences) {
  let repairCost, regulatoryFines, serviceCredits;
  
  switch (severity) {
    case 'critical':
      repairCost = faker.number.int({ min: 50000, max: 500000 });
      regulatoryFines = faker.number.int({ min: 25000, max: 250000 });
      serviceCredits = consequences.customers_affected * faker.number.int({ min: 25, max: 100 });
      break;
    case 'major':
      repairCost = faker.number.int({ min: 10000, max: 100000 });
      regulatoryFines = faker.number.int({ min: 5000, max: 50000 });
      serviceCredits = consequences.customers_affected * faker.number.int({ min: 10, max: 50 });
      break;
    default: // minor
      repairCost = faker.number.int({ min: 1000, max: 15000 });
      regulatoryFines = 0;
      serviceCredits = consequences.customers_affected * faker.number.int({ min: 5, max: 25 });
  }
  
  const indirectCosts = Math.floor(repairCost * 0.2); // 20% indirect costs
  
  return {
    repair: repairCost,
    regulatory_fines: regulatoryFines,
    service_credits: serviceCredits,
    indirect_costs: indirectCosts,
    total: repairCost + regulatoryFines + serviceCredits + indirectCosts
  };
}

function getUtilityOwner(utilityType) {
  const owners = {
    gas: 'CPS Energy',
    electric: 'CPS Energy',
    water: 'SAWS',
    sewer: 'SAWS',
    telecom: faker.helpers.arrayElement(['AT&T', 'Verizon'])
  };
  return owners[utilityType] || 'Unknown';
}

function getLineMaterial(utilityType) {
  const materials = {
    gas: faker.helpers.arrayElement(['steel', 'plastic', 'cast_iron']),
    electric: faker.helpers.arrayElement(['copper', 'aluminum']),
    water: faker.helpers.arrayElement(['PVC', 'cast_iron', 'copper', 'steel']),
    sewer: faker.helpers.arrayElement(['PVC', 'clay', 'cast_iron']),
    telecom: faker.helpers.arrayElement(['copper', 'fiber_optic'])
  };
  return materials[utilityType] || 'unknown';
}

function getLineDiameter(utilityType) {
  const diameters = {
    gas: faker.helpers.arrayElement([2, 4, 6, 8, 12]),
    electric: null, // not applicable
    water: faker.helpers.arrayElement([4, 6, 8, 12, 16]),
    sewer: faker.helpers.arrayElement([6, 8, 10, 12]),
    telecom: faker.helpers.arrayElement([1, 2, 4])
  };
  return diameters[utilityType];
}

function generateLessonsLearned(rootCause, utilityType) {
  const lessons = {
    excavated_without_ticket: 'Emphasized importance of filing locate tickets before starting work. Enhanced pre-job safety meetings.',
    didnt_wait_for_locates: 'Reinforced requirement to wait for all locates to be completed before excavation begins.',
    ignored_markings: 'Additional training on utility marking identification and respect for marked boundaries.',
    inaccurate_records: `Updated GIS records for ${utilityType} utilities in this area. Flagged area for field verification on future tickets.`,
    missed_utility: 'Additional locator training scheduled. Implemented secondary verification for complex areas.',
    shallow_utility: `Utility was shallower than minimum depth standards. Area flagged for future tickets. Consider raising line.`
  };
  
  return lessons[rootCause.code] || 'Standard corrective procedures implemented.';
}

function generateCorrectiveActions(rootCause) {
  const actions = {
    excavated_without_ticket: [
      'Excavator counseled on one-call requirements',
      'Enhanced excavator education program implemented',
      'Penalty assessed per state regulations'
    ],
    didnt_wait_for_locates: [
      'Excavator required to complete safety training',
      'Pre-job conference now mandatory for this excavator',
      'Added to watch list for future tickets'
    ],
    ignored_markings: [
      'Excavator suspended from work pending investigation',
      'Required to complete utility damage prevention training',
      'Increased supervision required for future work'
    ],
    inaccurate_records: [
      'GIS records updated with accurate location',
      'Field survey completed for surrounding area',
      'Warning flag added for future tickets in this location'
    ],
    missed_utility: [
      'Locator retraining completed',
      'Implemented peer review for complex tickets',
      'Enhanced quality control procedures'
    ]
  };
  
  return actions[rootCause.code] || ['Standard corrective procedures implemented'];
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  // Load excavators
  let excavators;
  try {
    const excavatorsPath = path.join(process.cwd(), 'data', 'seed', 'excavators.json');
    excavators = JSON.parse(fs.readFileSync(excavatorsPath, 'utf-8'));
  } catch (error) {
    console.error('? Error: excavators.json not found. Run npm run generate:excavators first');
    process.exit(1);
  }
  
  // Try to load tickets (optional)
  let tickets;
  try {
    const ticketsPath = path.join(process.cwd(), 'data', 'seed', 'tickets.json');
    tickets = JSON.parse(fs.readFileSync(ticketsPath, 'utf-8'));
  } catch (error) {
    tickets = null;
  }
  
  const damages = generateDamages(100, excavators, tickets);
  
  const outputPath = path.join(process.cwd(), 'data', 'seed', 'damages.json');
  fs.writeFileSync(outputPath, JSON.stringify(damages, null, 2));
  
  console.log(`? Generated ${damages.length} damage incidents`);
  console.log(`   - Critical: ${damages.filter(d => d.severity === 'critical').length}`);
  console.log(`   - Major: ${damages.filter(d => d.severity === 'major').length}`);
  console.log(`   - Minor: ${damages.filter(d => d.severity === 'minor').length}`);
  console.log(`   - Total cost: $${damages.reduce((sum, d) => sum + d.costs.total, 0).toLocaleString()}`);
  console.log(`?? Saved to: ${outputPath}`);
}
