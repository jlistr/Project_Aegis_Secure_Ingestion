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
 * Generate realistic excavator companies with varied risk profiles
 */
export function generateExcavators(count = 50) {
  console.log(`Generating ${count} excavator companies...`);
  
  const excavators = [];
  const constructionSuffixes = [
    'Construction', 'Excavation', 'Contractors', 'Utilities',
    'Development', 'Services', 'Solutions', 'Group',
    'Enterprises', 'Corp', 'Company', 'LLC'
  ];
  
  for (let i = 0; i < count; i++) {
    // Create different risk profile categories
    let riskProfile;
    const rand = Math.random();
    
    if (rand < 0.15) {
      // 15% Problem excavators (high risk)
      riskProfile = 'high_risk';
    } else if (rand < 0.35) {
      // 20% Excellent excavators (zero damages)
      riskProfile = 'excellent';
    } else {
      // 65% Average excavators (0-2 damages)
      riskProfile = 'average';
    }
    
    const excavator = {
      id: faker.string.uuid(),
      company_name: `${faker.company.name()} ${faker.helpers.arrayElement(constructionSuffixes)}`,
      contact_name: faker.person.fullName(),
      phone: faker.phone.number('210-###-####'),
      email: faker.internet.email().toLowerCase(),
      address: faker.location.streetAddress(),
      city: 'San Antonio',
      state: 'TX',
      zip: faker.location.zipCode('#####'),
      
      years_in_business: faker.number.int({ min: 1, max: 30 }),
      
      // Compliance metrics based on risk profile
      compliance_metrics: generateComplianceMetrics(riskProfile),
      
      // Damage history based on risk profile
      damage_history: generateDamageHistory(riskProfile),
      
      // Equipment profile
      equipment_profile: {
        primary_equipment: faker.helpers.arrayElements(
          ['backhoe', 'excavator', 'trencher', 'dozer', 'loader', 'skid_steer'],
          { min: 2, max: 4 }
        ),
        uses_vacuum_excavation: faker.datatype.boolean(0.3), // 30% use vacuum
        uses_hydro_excavation: faker.datatype.boolean(0.2), // 20% use hydro
        excavation_method: faker.helpers.weightedArrayElement([
          { weight: 70, value: 'mechanical' },
          { weight: 20, value: 'boring' },
          { weight: 10, value: 'trenchless' }
        ])
      },
      
      // Certifications
      certifications: faker.helpers.arrayElements(
        ['OSHA 10', 'OSHA 30', 'Trench Safety', 'Confined Space', 'First Aid'],
        { min: 1, max: 4 }
      ),
      
      insurance_status: faker.helpers.weightedArrayElement([
        { weight: 90, value: 'active' },
        { weight: 10, value: 'lapsed' }
      ]),
      
      risk_profile: riskProfile,
      created_at: faker.date.past({ years: 3 }).toISOString()
    };
    
    excavators.push(excavator);
  }
  
  return excavators;
}

function generateComplianceMetrics(riskProfile) {
  let complianceScore, lateTicketRate, noShowRate, preMarkRate;
  
  switch (riskProfile) {
    case 'high_risk':
      complianceScore = faker.number.int({ min: 40, max: 70 });
      lateTicketRate = faker.number.float({ min: 0.15, max: 0.35, precision: 0.01 });
      noShowRate = faker.number.float({ min: 0.10, max: 0.25, precision: 0.01 });
      preMarkRate = faker.number.float({ min: 0.30, max: 0.60, precision: 0.01 });
      break;
    case 'excellent':
      complianceScore = faker.number.int({ min: 90, max: 100 });
      lateTicketRate = faker.number.float({ min: 0.00, max: 0.05, precision: 0.01 });
      noShowRate = faker.number.float({ min: 0.00, max: 0.03, precision: 0.01 });
      preMarkRate = faker.number.float({ min: 0.85, max: 1.00, precision: 0.01 });
      break;
    default: // average
      complianceScore = faker.number.int({ min: 70, max: 90 });
      lateTicketRate = faker.number.float({ min: 0.05, max: 0.15, precision: 0.01 });
      noShowRate = faker.number.float({ min: 0.03, max: 0.10, precision: 0.01 });
      preMarkRate = faker.number.float({ min: 0.60, max: 0.85, precision: 0.01 });
  }
  
  const totalTickets = faker.number.int({ min: 50, max: 800 });
  
  return {
    compliance_score: complianceScore,
    one_call_tickets_filed: totalTickets,
    late_tickets: Math.floor(totalTickets * lateTicketRate),
    no_show_rate: noShowRate,
    pre_mark_rate: preMarkRate
  };
}

function generateDamageHistory(riskProfile) {
  let damages6mo, damages12mo;
  
  switch (riskProfile) {
    case 'high_risk':
      damages6mo = faker.helpers.weightedArrayElement([
        { weight: 30, value: 3 },
        { weight: 40, value: 4 },
        { weight: 20, value: 5 },
        { weight: 10, value: faker.number.int({ min: 6, max: 10 }) }
      ]);
      damages12mo = damages6mo + faker.number.int({ min: 2, max: 6 });
      break;
    case 'excellent':
      damages6mo = 0;
      damages12mo = 0;
      break;
    default: // average
      damages6mo = faker.helpers.weightedArrayElement([
        { weight: 60, value: 0 },
        { weight: 30, value: 1 },
        { weight: 8, value: 2 },
        { weight: 2, value: 3 }
      ]);
      damages12mo = damages6mo + faker.helpers.weightedArrayElement([
        { weight: 50, value: 0 },
        { weight: 30, value: 1 },
        { weight: 15, value: 2 },
        { weight: 5, value: 3 }
      ]);
  }
  
  const damages24mo = damages12mo + faker.number.int({ min: 0, max: 5 });
  const damagesAllTime = damages24mo + faker.number.int({ min: 0, max: 15 });
  
  // Distribution by utility type (gas is most common in damages)
  const byUtilityType = {};
  let remaining = damagesAllTime;
  
  if (remaining > 0) {
    byUtilityType.gas = faker.number.int({ min: 0, max: Math.ceil(remaining * 0.4) });
    remaining -= byUtilityType.gas;
  }
  if (remaining > 0) {
    byUtilityType.electric = faker.number.int({ min: 0, max: Math.ceil(remaining * 0.4) });
    remaining -= byUtilityType.electric;
  }
  if (remaining > 0) {
    byUtilityType.water = faker.number.int({ min: 0, max: Math.ceil(remaining * 0.3) });
    remaining -= byUtilityType.water;
  }
  byUtilityType.telecom = remaining;
  
  // Distribution by severity
  const bySeverity = {
    minor: Math.floor(damagesAllTime * 0.6),
    major: Math.floor(damagesAllTime * 0.3),
    critical: Math.floor(damagesAllTime * 0.1)
  };
  
  const atFaultRate = riskProfile === 'high_risk' 
    ? faker.number.float({ min: 0.80, max: 0.95, precision: 0.01 })
    : faker.number.float({ min: 0.50, max: 0.75, precision: 0.01 });
  
  return {
    damages_6mo: damages6mo,
    damages_12mo: damages12mo,
    damages_24mo: damages24mo,
    damages_all_time: damagesAllTime,
    by_utility_type: byUtilityType,
    by_severity: bySeverity,
    at_fault_rate: atFaultRate,
    damage_trend: damages6mo > damages12mo - damages6mo ? 'increasing' : 
                  damages6mo < damages12mo - damages6mo ? 'decreasing' : 'stable',
    last_damage_days_ago: damages6mo > 0 
      ? faker.number.int({ min: 5, max: 180 })
      : damages12mo > 0 
        ? faker.number.int({ min: 181, max: 365 })
        : null
  };
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const excavators = generateExcavators(50);
  
  const outputPath = path.join(process.cwd(), 'data', 'seed', 'excavators.json');
  fs.writeFileSync(outputPath, JSON.stringify(excavators, null, 2));
  
  console.log(`? Generated ${excavators.length} excavators`);
  console.log(`   - High risk: ${excavators.filter(e => e.risk_profile === 'high_risk').length}`);
  console.log(`   - Excellent: ${excavators.filter(e => e.risk_profile === 'excellent').length}`);
  console.log(`   - Average: ${excavators.filter(e => e.risk_profile === 'average').length}`);
  console.log(`?? Saved to: ${outputPath}`);
}
