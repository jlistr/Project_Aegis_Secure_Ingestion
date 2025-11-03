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
 * Generate realistic locator employees with geo-fenced territories
 */
export function generateEmployees(count = 25) {
  console.log(`Generating ${count} locator employees...`);
  
  const employees = [];
  const gridSize = 0.15; // ~10 miles per grid cell
  let gridIndex = 0;
  
  for (let i = 0; i < count; i++) {
    // Determine experience level (distribution)
    const experienceCategory = faker.helpers.weightedArrayElement([
      { weight: 30, value: 'novice' },    // 0-2 years
      { weight: 50, value: 'experienced' }, // 2-5 years
      { weight: 20, value: 'senior' }      // 5+ years
    ]);
    
    const hireDate = generateHireDate(experienceCategory);
    const experienceYears = calculateExperience(hireDate);
    
    const employee = {
      id: faker.string.uuid(),
      employee_number: `LOC-${String(i + 1).padStart(4, '0')}`,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number('210-###-####'),
      role: experienceYears >= 5 ? 'senior_locator' : 
            experienceYears >= 2 ? 'locator' : 'trainee',
      
      // Experience
      experience: {
        hire_date: hireDate,
        years_experience: experienceYears,
        years_with_company: experienceYears,
        prior_industry_experience: experienceCategory === 'senior' 
          ? faker.number.float({ min: 1, max: 5, precision: 0.1 })
          : 0,
        total_tickets_completed: Math.floor(experienceYears * 800) // ~800 tickets per year
      },
      
      // Certifications (more for experienced locators)
      certifications: generateCertifications(experienceCategory),
      
      // Specialties
      specialties: faker.helpers.arrayElements(
        ['gas', 'electric', 'water', 'telecom', 'fiber_optics', 'high_voltage'],
        { min: 2, max: experienceYears >= 5 ? 5 : experienceYears >= 2 ? 4 : 2 }
      ),
      
      // Performance metrics (correlated with experience)
      performance_metrics: generatePerformanceMetrics(experienceCategory, experienceYears),
      
      // Current workload
      current_workload: generateWorkload(experienceCategory),
      
      // Territory assignment
      territory: generateTerritory(gridIndex++, gridSize),
      
      // Availability
      availability: {
        status: faker.helpers.weightedArrayElement([
          { weight: 70, value: 'available' },
          { weight: 20, value: 'busy' },
          { weight: 5, value: 'off_shift' },
          { weight: 5, value: 'on_leave' }
        ]),
        shift_start: '07:00',
        shift_end: '16:00',
        current_location: {
          type: 'Point',
          coordinates: [
            faker.number.float({ min: SA_BOUNDS.minLng, max: SA_BOUNDS.maxLng, precision: 0.0001 }),
            faker.number.float({ min: SA_BOUNDS.minLat, max: SA_BOUNDS.maxLat, precision: 0.0001 })
          ]
        },
        last_location_update: faker.date.recent({ days: 0.1 }).toISOString()
      },
      
      // Training history
      training_history: generateTrainingHistory(experienceYears),
      
      // Notable achievements
      notable_experience: generateNotableExperience(experienceCategory, experienceYears),
      
      active: true,
      created_at: hireDate,
      updated_at: new Date().toISOString()
    };
    
    // Add get full name helper
    employee.full_name = `${employee.first_name} ${employee.last_name}`;
    
    employees.push(employee);
  }
  
  return employees;
}

function generateHireDate(experienceCategory) {
  let yearsAgo;
  switch (experienceCategory) {
    case 'novice':
      yearsAgo = faker.number.float({ min: 0.2, max: 2, precision: 0.1 });
      break;
    case 'experienced':
      yearsAgo = faker.number.float({ min: 2, max: 5, precision: 0.1 });
      break;
    case 'senior':
      yearsAgo = faker.number.float({ min: 5, max: 15, precision: 0.1 });
      break;
  }
  
  const hireDate = new Date();
  hireDate.setDate(hireDate.getDate() - (yearsAgo * 365));
  return hireDate.toISOString().split('T')[0];
}

function calculateExperience(hireDate) {
  const hire = new Date(hireDate);
  const now = new Date();
  const years = (now - hire) / (365 * 24 * 60 * 60 * 1000);
  return Math.round(years * 10) / 10;
}

function generateCertifications(experienceCategory) {
  const allCerts = [
    { type: 'OUPS', level: 'certified' },
    { type: 'NULCA', level: 'certified' },
    { type: 'Gas', level: 'certified' },
    { type: 'Electric', level: 'certified' },
    { type: 'Fiber', level: 'certified' },
    { type: 'OSHA 10', level: 'certified' },
    { type: 'OSHA 30', level: 'certified' }
  ];
  
  const certCount = experienceCategory === 'senior' ? 
    faker.number.int({ min: 5, max: 7 }) :
    experienceCategory === 'experienced' ?
    faker.number.int({ min: 3, max: 5 }) :
    faker.number.int({ min: 1, max: 3 });
  
  return faker.helpers.arrayElements(allCerts, certCount).map(cert => ({
    ...cert,
    obtained_date: faker.date.past({ years: 3 }).toISOString().split('T')[0],
    expiration_date: faker.date.future({ years: 2 }).toISOString().split('T')[0]
  }));
}

function generatePerformanceMetrics(experienceCategory, experienceYears) {
  let accuracyRate, damages12mo, avgCompletionTime, reworkRate, customerSatisfaction;
  
  switch (experienceCategory) {
    case 'senior':
      accuracyRate = faker.number.float({ min: 0.96, max: 1.00, precision: 0.01 });
      damages12mo = faker.helpers.weightedArrayElement([
        { weight: 90, value: 0 },
        { weight: 10, value: 1 }
      ]);
      avgCompletionTime = faker.number.float({ min: 2.0, max: 3.0, precision: 0.1 });
      reworkRate = faker.number.float({ min: 0.00, max: 0.02, precision: 0.01 });
      customerSatisfaction = faker.number.float({ min: 4.5, max: 5.0, precision: 0.1 });
      break;
    case 'experienced':
      accuracyRate = faker.number.float({ min: 0.90, max: 0.96, precision: 0.01 });
      damages12mo = faker.helpers.weightedArrayElement([
        { weight: 80, value: 0 },
        { weight: 15, value: 1 },
        { weight: 5, value: 2 }
      ]);
      avgCompletionTime = faker.number.float({ min: 2.5, max: 3.5, precision: 0.1 });
      reworkRate = faker.number.float({ min: 0.02, max: 0.05, precision: 0.01 });
      customerSatisfaction = faker.number.float({ min: 4.0, max: 4.7, precision: 0.1 });
      break;
    default: // novice
      accuracyRate = faker.number.float({ min: 0.85, max: 0.92, precision: 0.01 });
      damages12mo = faker.helpers.weightedArrayElement([
        { weight: 70, value: 0 },
        { weight: 20, value: 1 },
        { weight: 8, value: 2 },
        { weight: 2, value: 3 }
      ]);
      avgCompletionTime = faker.number.float({ min: 3.0, max: 4.5, precision: 0.1 });
      reworkRate = faker.number.float({ min: 0.05, max: 0.10, precision: 0.01 });
      customerSatisfaction = faker.number.float({ min: 3.8, max: 4.3, precision: 0.1 });
  }
  
  return {
    accuracy_rate: accuracyRate,
    damages_12mo: damages12mo,
    at_fault_damages_ever: damages12mo + faker.number.int({ min: 0, max: 2 }),
    average_completion_time_hours: avgCompletionTime,
    rework_rate: reworkRate,
    customer_satisfaction: customerSatisfaction,
    tickets_completed_30d: faker.number.int({ min: 15, max: 90 })
  };
}

function generateWorkload(experienceCategory) {
  const maxCapacity = experienceCategory === 'novice' ? 5 : 8;
  const currentTickets = faker.number.int({ min: 0, max: maxCapacity });
  const highRiskTickets = faker.number.int({ min: 0, max: Math.ceil(currentTickets * 0.3) });
  
  return {
    tickets_today: currentTickets,
    tickets_this_week: faker.number.int({ min: currentTickets, max: 35 }),
    max_capacity_daily: maxCapacity,
    current_utilization: currentTickets / maxCapacity,
    ticket_breakdown: {
      routine: currentTickets - highRiskTickets,
      high_risk: highRiskTickets,
      emergency: 0
    },
    high_risk_percentage: currentTickets > 0 ? highRiskTickets / currentTickets : 0
  };
}

function generateTerritory(gridIndex, gridSize) {
  // Calculate grid position
  const cols = 5; // 5x5 grid covering San Antonio
  const row = Math.floor(gridIndex / cols);
  const col = gridIndex % cols;
  
  // Calculate center point
  const centerLng = SA_CENTER[0] + (col - 2) * gridSize;
  const centerLat = SA_CENTER[1] + (row - 2) * gridSize;
  
  // Create polygon with some variation (not perfect squares)
  const radiusKm = (gridSize * 111) * 0.5; // Convert degrees to km roughly
  const variations = faker.number.float({ min: 0.8, max: 1.2 });
  
  const polygon = turf.circle([centerLng, centerLat], radiusKm * variations, {
    steps: 6,
    units: 'kilometers'
  });
  
  return {
    assigned_geo_fence: polygon.geometry,
    center_point: {
      type: 'Point',
      coordinates: [centerLng, centerLat]
    },
    description: `Zone ${String.fromCharCode(65 + row)}${col + 1}` // A1, A2, B1, etc.
  };
}

function generateTrainingHistory(experienceYears) {
  const courses = [
    'Basic Utility Locating',
    'Advanced Gas Line Locating',
    'High-Voltage Electric Safety',
    'Fiber Optic Identification',
    'Ground Penetrating Radar Operation',
    'Excavation Safety',
    'Customer Service Excellence',
    'GIS Mapping Systems'
  ];
  
  const trainingCount = Math.min(Math.floor(experienceYears * 2), 8);
  
  return faker.helpers.arrayElements(courses, trainingCount).map(course => ({
    course,
    date: faker.date.past({ years: experienceYears }).toISOString().split('T')[0],
    instructor: faker.helpers.arrayElement(['CPS Energy', 'OUPS', 'NULCA', 'Internal Training'])
  }));
}

function generateNotableExperience(experienceCategory, experienceYears) {
  if (experienceCategory === 'novice') {
    return [];
  }
  
  const experiences = [
    'Completed 50+ tickets for hospital expansion project',
    'Handled 3 emergency gas leak locates without incident',
    'Trained 5 junior locators in gas line detection',
    'Perfect safety record for 24 consecutive months',
    'Successfully located utilities at 15+ complex industrial sites',
    'Zero damage rate on 200+ consecutive tickets',
    'Specialized in downtown congested area locating',
    'Expert in difficult soil conditions and deep utilities'
  ];
  
  const count = experienceCategory === 'senior' ? 
    faker.number.int({ min: 3, max: 5 }) : 
    faker.number.int({ min: 1, max: 3 });
  
  return faker.helpers.arrayElements(experiences, count);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const employees = generateEmployees(25);
  
  const outputPath = path.join(process.cwd(), 'data', 'seed', 'employees.json');
  fs.writeFileSync(outputPath, JSON.stringify(employees, null, 2));
  
  console.log(`? Generated ${employees.length} employees`);
  console.log(`   - Senior: ${employees.filter(e => e.role === 'senior_locator').length}`);
  console.log(`   - Locator: ${employees.filter(e => e.role === 'locator').length}`);
  console.log(`   - Trainee: ${employees.filter(e => e.role === 'trainee').length}`);
  console.log(`   - Avg experience: ${(employees.reduce((sum, e) => sum + e.experience.years_experience, 0) / employees.length).toFixed(1)} years`);
  console.log(`?? Saved to: ${outputPath}`);
}
