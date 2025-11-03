import { faker } from '@faker-js/faker';
import * as turf from '@turf/turf';
import fs from 'fs';
import path from 'path';

// San Antonio area bounds
const SA_CENTER = [-98.4936, 29.4241];
const SA_BOUNDS = {
  minLng: -98.7,
  maxLng: -98.3,
  minLat: 29.3,
  maxLat: 29.6
};

/**
 * Generate realistic locate request tickets in Texas 811 format
 */
export function generateTickets(count = 1000, excavators = null) {
  console.log(`Generating ${count} locate request tickets...`);
  
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
  
  const tickets = [];
  const currentYear = new Date().getFullYear();
  
  for (let i = 0; i < count; i++) {
    const excavator = faker.helpers.arrayElement(excavators);
    
    // Ticket type with realistic weights
    const type = faker.helpers.weightedArrayElement([
      { weight: 85, value: 'routine' },
      { weight: 10, value: 'non_compliant' },
      { weight: 5, value: 'emergency' }
    ]);
    
    // Generate location
    const location = {
      type: 'Point',
      coordinates: [
        faker.number.float({ min: SA_BOUNDS.minLng, max: SA_BOUNDS.maxLng, precision: 0.0001 }),
        faker.number.float({ min: SA_BOUNDS.minLat, max: SA_BOUNDS.maxLat, precision: 0.0001 })
      ]
    };
    
    // Generate work extent and boundary box
    const distance = faker.number.float({ min: 0.05, max: 1.5, precision: 0.01 });
    const boundaryBox = generateBoundaryBox(location.coordinates, distance);
    
    // Utility types (correlated with excavator risk for interesting scenarios)
    const utilityTypes = generateUtilityTypes(excavator, type);
    
    // Work type and description
    const workType = faker.helpers.arrayElement([
      'NEW INSTALL', 'REPAIR', 'MAINTENANCE', 'DEMOLITION', 
      'BORING', 'EXCAVATION', 'TRENCHING', 'FOUNDATION'
    ]);
    
    const workDescription = generateWorkDescription(workType, utilityTypes);
    
    // Dates
    const requestedDate = faker.date.recent({ days: 30 });
    const dueDate = new Date(requestedDate);
    if (type === 'emergency') {
      dueDate.setHours(dueDate.getHours() + 2); // 2 hours for emergency
    } else if (type === 'non_compliant') {
      dueDate.setHours(dueDate.getHours() + 24); // 24 hours
    } else {
      dueDate.setHours(dueDate.getHours() + 48); // 48 hours for routine
    }
    
    const ticket = {
      id: faker.string.uuid(),
      ticket_number: `TX-${currentYear}-${String(100000 + i).padStart(6, '0')}`,
      type: type,
      status: 'pending',
      priority: type === 'emergency' ? 100 : type === 'non_compliant' ? 50 : 0,
      
      // Location information
      address: generateAddress(),
      nearest_intersection: generateIntersection(),
      location: location,
      boundary_box: boundaryBox,
      county: 'BEXAR',
      location_type: faker.helpers.arrayElement(['residential', 'commercial', 'industrial', 'rural']),
      
      // Work details
      work_type: workType,
      work_to_begin: dueDate.toISOString().split('T')[0],
      work_duration_days: faker.number.int({ min: 1, max: 30 }),
      work_description: workDescription,
      
      // Scope
      distance_miles: distance,
      excavation_extent_feet: Math.round(distance * 5280),
      excavation_depth_feet: faker.helpers.arrayElement([
        faker.number.int({ min: 2, max: 10 }),
        'unknown'
      ]),
      excavation_method: faker.helpers.weightedArrayElement([
        { weight: 60, value: 'mechanical' },
        { weight: 20, value: 'boring' },
        { weight: 15, value: 'trenching' },
        { weight: 5, value: 'hand' }
      ]),
      
      // Utilities
      utility_types: utilityTypes,
      facility_owners_notified: generateFacilityOwners(utilityTypes),
      
      // Excavator information
      excavator_id: excavator.id,
      excavator_company: excavator.company_name,
      caller_name: faker.person.fullName(),
      caller_phone: faker.phone.number('210-###-####'),
      
      // Marking information
      white_lined: faker.datatype.boolean(0.7), // 70% white-lined
      marking_instructions: faker.helpers.arrayElement([
        'Mark all utilities in work area',
        'Mark utilities along proposed route',
        'Mark entire property',
        'Mark utilities at excavation points only'
      ]),
      
      // Additional details
      remarks: faker.helpers.maybe(
        () => faker.helpers.arrayElement([
          'Previous locate performed 8 months ago',
          'Multiple utilities in small area',
          'Near school zone',
          'Work during business hours only',
          'Coordinate with property owner',
          'Limited access - narrow alley',
          ''
        ]),
        { probability: 0.3 }
      ) || '',
      
      // Assignment (initially null)
      assigned_to: null,
      assigned_at: null,
      
      // Risk assessment (initially null, will be populated by AI)
      risk_assessment: null,
      risk_score: null,
      risk_level: null,
      
      // Timestamps
      requested_date: requestedDate.toISOString(),
      due_date: dueDate.toISOString(),
      completed_date: null,
      created_at: requestedDate.toISOString(),
      updated_at: requestedDate.toISOString()
    };
    
    tickets.push(ticket);
  }
  
  return tickets;
}

function generateBoundaryBox(centerCoords, distanceMiles) {
  const [lng, lat] = centerCoords;
  
  // Convert miles to kilometers
  const lengthKm = distanceMiles * 1.60934;
  
  // Create rectangle (width is ~10% of length)
  const widthKm = lengthKm * 0.1;
  
  // Random bearing for variety
  const bearing = faker.number.int({ min: 0, max: 360 });
  
  // Create line along bearing
  const endpoint = turf.destination(turf.point(centerCoords), lengthKm, bearing, { units: 'kilometers' });
  
  // Buffer to create polygon
  const line = turf.lineString([centerCoords, endpoint.geometry.coordinates]);
  const buffered = turf.buffer(line, widthKm / 2, { units: 'kilometers' });
  
  return buffered.geometry;
}

function generateUtilityTypes(excavator, ticketType) {
  // High-risk excavators more likely to get complex tickets (for demo purposes)
  const complexity = excavator.risk_profile === 'high_risk' && ticketType === 'emergency'
    ? 'complex'
    : excavator.risk_profile === 'excellent'
    ? 'simple'
    : 'moderate';
  
  const allUtilities = ['gas', 'electric', 'water', 'sewer', 'telecom', 'fiber', 'cable'];
  
  let count;
  switch (complexity) {
    case 'complex':
      count = faker.number.int({ min: 3, max: 5 });
      break;
    case 'simple':
      count = faker.number.int({ min: 1, max: 2 });
      break;
    default:
      count = faker.number.int({ min: 1, max: 4 });
  }
  
  // Gas and electric are more common and higher risk
  const utilities = [];
  const weighted = faker.helpers.weightedArrayElement([
    { weight: 40, value: true },
    { weight: 60, value: false }
  ]);
  
  if (weighted && complexity !== 'simple') {
    utilities.push(faker.helpers.arrayElement(['gas', 'electric']));
  }
  
  // Add remaining utilities
  const remaining = faker.helpers.arrayElements(
    allUtilities.filter(u => !utilities.includes(u)),
    Math.max(1, count - utilities.length)
  );
  
  return [...utilities, ...remaining];
}

function generateFacilityOwners(utilityTypes) {
  const owners = [];
  
  if (utilityTypes.includes('gas')) owners.push('CPS Energy');
  if (utilityTypes.includes('electric')) owners.push('CPS Energy');
  if (utilityTypes.includes('water')) owners.push('SAWS');
  if (utilityTypes.includes('sewer')) owners.push('SAWS');
  if (utilityTypes.includes('telecom')) owners.push('AT&T', 'Verizon');
  if (utilityTypes.includes('fiber')) owners.push('AT&T', 'Google Fiber');
  if (utilityTypes.includes('cable')) owners.push('Spectrum');
  
  return [...new Set(owners)]; // Remove duplicates
}

function generateAddress() {
  const streets = [
    'Main St', 'Broadway', 'Commerce St', 'Houston St', 'McCullough Ave',
    'San Pedro Ave', 'Flores St', 'Zarzamora St', 'Fredericksburg Rd',
    'Bandera Rd', 'Blanco Rd', 'Austin Hwy', 'New Braunfels Ave',
    'Southton Rd', 'Military Dr', 'Culebra Rd', 'Marbach Rd',
    'Wurzbach Rd', 'Bitters Rd', 'Stone Oak Pkwy'
  ];
  
  return `${faker.number.int({ min: 100, max: 9999 })} ${faker.helpers.arrayElement(streets)}, San Antonio, TX ${faker.location.zipCode('#####')}`;
}

function generateIntersection() {
  const streets = [
    'Main St', 'Commerce St', 'Houston St', 'Flores St', 'San Pedro Ave',
    'McCullough Ave', 'Broadway', 'Alamo St', 'Travis St', 'Navarro St'
  ];
  
  return `${faker.helpers.arrayElement(streets)} & ${faker.helpers.arrayElement(streets.filter((_, i) => i !== 0))}`;
}

function generateWorkDescription(workType, utilities) {
  const templates = {
    'NEW INSTALL': [
      `Installing new ${utilities[0]} service line from main to building`,
      `New ${utilities[0]} line installation for residential property`,
      `Installing ${utilities.length > 1 ? utilities.join(' and ') : utilities[0]} infrastructure for new development`
    ],
    'REPAIR': [
      `Repair ${utilities[0]} line leak`,
      `Emergency ${utilities[0]} service line repair`,
      `${utilities[0].toUpperCase()} line maintenance and repair work`
    ],
    'BORING': [
      `Directional boring for ${utilities[0]} conduit installation`,
      `Horizontal boring under roadway for ${utilities[0]} line`,
      `Boring operation for underground ${utilities.join('/')} installation`
    ],
    'EXCAVATION': [
      `General excavation for ${utilities.join(' and ')} utility access`,
      `Excavation to expose and verify ${utilities[0]} utilities`,
      `Trenching for ${utilities[0]} line replacement`
    ],
    'DEMOLITION': [
      `Building demolition - identify and cap all ${utilities.join(', ')} services`,
      `Demolition of structure - utility disconnection required`
    ],
    'FOUNDATION': [
      `Foundation excavation for new construction`,
      `Pier drilling for building foundation`,
      `Excavation for building foundation and basement`
    ]
  };
  
  const descriptions = templates[workType] || templates['EXCAVATION'];
  return faker.helpers.arrayElement(descriptions);
}

// Create special demo scenarios
function createDemoScenarios(excavators) {
  console.log('Creating special demo scenarios...');
  
  const scenarios = [];
  
  // Scenario 1: Critical Risk - Problem excavator + emergency + gas
  const problemExcavator = excavators.find(e => e.risk_profile === 'high_risk');
  if (problemExcavator) {
    scenarios.push({
      id: faker.string.uuid(),
      ticket_number: 'TX-2025-999001',
      type: 'emergency',
      status: 'pending',
      priority: 100,
      address: '1500 Medical Dr, San Antonio, TX 78229',
      nearest_intersection: 'Medical Dr & Fredericksburg Rd',
      location: {
        type: 'Point',
        coordinates: [-98.4850, 29.4800]
      },
      boundary_box: generateBoundaryBox([-98.4850, 29.4800], 0.8),
      county: 'BEXAR',
      location_type: 'commercial',
      work_type: 'EMERGENCY REPAIR',
      work_to_begin: new Date().toISOString().split('T')[0],
      work_duration_days: 1,
      work_description: 'Emergency gas leak repair near hospital access road',
      distance_miles: 0.8,
      excavation_extent_feet: 4224,
      excavation_depth_feet: 6,
      excavation_method: 'mechanical',
      utility_types: ['gas', 'electric'],
      facility_owners_notified: ['CPS Energy'],
      excavator_id: problemExcavator.id,
      excavator_company: problemExcavator.company_name,
      caller_name: faker.person.fullName(),
      caller_phone: '210-555-0911',
      white_lined: false,
      marking_instructions: 'URGENT - Mark all gas and electric lines immediately',
      remarks: 'Active gas leak reported. Coordinate with CPS Energy gas ops before excavation.',
      assigned_to: null,
      assigned_at: null,
      risk_assessment: null,
      risk_score: null,
      risk_level: null,
      requested_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      completed_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  // Scenario 2: Low Risk - Excellent excavator + simple work
  const excellentExcavator = excavators.find(e => e.risk_profile === 'excellent');
  if (excellentExcavator) {
    scenarios.push({
      id: faker.string.uuid(),
      ticket_number: 'TX-2025-500123',
      type: 'routine',
      status: 'pending',
      priority: 0,
      address: '3456 Residential Ln, San Antonio, TX 78230',
      nearest_intersection: 'Residential Ln & Oak Park Dr',
      location: {
        type: 'Point',
        coordinates: [-98.4500, 29.5200]
      },
      boundary_box: generateBoundaryBox([-98.4500, 29.5200], 0.15),
      county: 'BEXAR',
      location_type: 'residential',
      work_type: 'NEW INSTALL',
      work_to_begin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      work_duration_days: 3,
      work_description: 'Installing new telecom service line to residence',
      distance_miles: 0.15,
      excavation_extent_feet: 792,
      excavation_depth_feet: 3,
      excavation_method: 'hand',
      utility_types: ['telecom'],
      facility_owners_notified: ['AT&T'],
      excavator_id: excellentExcavator.id,
      excavator_company: excellentExcavator.company_name,
      caller_name: faker.person.fullName(),
      caller_phone: '210-555-0100',
      white_lined: true,
      marking_instructions: 'Mark telecom line along proposed route',
      remarks: 'Homeowner will be present during work',
      assigned_to: null,
      assigned_at: null,
      risk_assessment: null,
      risk_score: null,
      risk_level: null,
      requested_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      completed_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  // Scenario 3: Complex Multi-Utility
  const averageExcavator = excavators.find(e => e.risk_profile === 'average');
  if (averageExcavator) {
    scenarios.push({
      id: faker.string.uuid(),
      ticket_number: 'TX-2025-750456',
      type: 'routine',
      status: 'pending',
      priority: 0,
      address: '789 Downtown Plaza, San Antonio, TX 78205',
      nearest_intersection: 'Commerce St & Alamo St',
      location: {
        type: 'Point',
        coordinates: [-98.4900, 29.4250]
      },
      boundary_box: generateBoundaryBox([-98.4900, 29.4250], 1.2),
      county: 'BEXAR',
      location_type: 'commercial',
      work_type: 'EXCAVATION',
      work_to_begin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      work_duration_days: 14,
      work_description: 'Underground utility corridor excavation for new downtown development',
      distance_miles: 1.2,
      excavation_extent_feet: 6336,
      excavation_depth_feet: 8,
      excavation_method: 'mechanical',
      utility_types: ['gas', 'electric', 'water', 'telecom', 'sewer'],
      facility_owners_notified: ['CPS Energy', 'SAWS', 'AT&T', 'Verizon'],
      excavator_id: averageExcavator.id,
      excavator_company: averageExcavator.company_name,
      caller_name: faker.person.fullName(),
      caller_phone: '210-555-0750',
      white_lined: true,
      marking_instructions: 'Mark all utilities along entire corridor - coordinate with all utility owners',
      remarks: 'High traffic area - work during off-peak hours. Multiple utility crossings expected.',
      assigned_to: null,
      assigned_at: null,
      risk_assessment: null,
      risk_score: null,
      risk_level: null,
      requested_date: new Date().toISOString(),
      due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      completed_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return scenarios;
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
  
  // Generate regular tickets
  const tickets = generateTickets(997, excavators);
  
  // Add demo scenarios
  const demoScenarios = createDemoScenarios(excavators);
  const allTickets = [...demoScenarios, ...tickets];
  
  const outputPath = path.join(process.cwd(), 'data', 'seed', 'tickets.json');
  fs.writeFileSync(outputPath, JSON.stringify(allTickets, null, 2));
  
  console.log(`? Generated ${allTickets.length} tickets`);
  console.log(`   - Emergency: ${allTickets.filter(t => t.type === 'emergency').length}`);
  console.log(`   - Non-compliant: ${allTickets.filter(t => t.type === 'non_compliant').length}`);
  console.log(`   - Routine: ${allTickets.filter(t => t.type === 'routine').length}`);
  console.log(`   - Demo scenarios: ${demoScenarios.length}`);
  console.log(`?? Saved to: ${outputPath}`);
}
