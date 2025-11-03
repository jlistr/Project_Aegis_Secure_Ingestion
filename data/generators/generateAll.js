import { generateExcavators } from './generateExcavators.js';
import { generateEmployees } from './generateEmployees.js';
import { generateTickets } from './generateTickets.js';
import { generateDamages } from './generateDamages.js';
import fs from 'fs';
import path from 'path';

/**
 * Master script to generate all mock data
 */
async function generateAllData() {
  console.log('?? Starting data generation process...\n');
  
  const startTime = Date.now();
  
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'data', 'seed');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  try {
    // Step 1: Generate Excavators (required by tickets and damages)
    console.log('?? Step 1/4: Generating excavators...');
    const excavators = generateExcavators(50);
    fs.writeFileSync(
      path.join(outputDir, 'excavators.json'),
      JSON.stringify(excavators, null, 2)
    );
    console.log(`   ? ${excavators.length} excavators generated\n`);
    
    // Step 2: Generate Employees (independent)
    console.log('?? Step 2/4: Generating employees...');
    const employees = generateEmployees(25);
    fs.writeFileSync(
      path.join(outputDir, 'employees.json'),
      JSON.stringify(employees, null, 2)
    );
    console.log(`   ? ${employees.length} employees generated\n`);
    
    // Step 3: Generate Tickets (requires excavators)
    console.log('?? Step 3/4: Generating locate request tickets...');
    const tickets = generateTickets(1000, excavators);
    fs.writeFileSync(
      path.join(outputDir, 'tickets.json'),
      JSON.stringify(tickets, null, 2)
    );
    console.log(`   ? ${tickets.length} tickets generated\n`);
    
    // Step 4: Generate Damage Incidents (requires excavators, optionally uses tickets)
    console.log('??  Step 4/4: Generating damage incidents...');
    const damages = generateDamages(100, excavators, tickets);
    fs.writeFileSync(
      path.join(outputDir, 'damages.json'),
      JSON.stringify(damages, null, 2)
    );
    console.log(`   ? ${damages.length} damage incidents generated\n`);
    
    // Generate summary report
    const summary = {
      generated_at: new Date().toISOString(),
      counts: {
        excavators: excavators.length,
        employees: employees.length,
        tickets: tickets.length,
        damages: damages.length
      },
      statistics: {
        excavators: {
          high_risk: excavators.filter(e => e.risk_profile === 'high_risk').length,
          excellent: excavators.filter(e => e.risk_profile === 'excellent').length,
          average: excavators.filter(e => e.risk_profile === 'average').length,
          total_damages_recorded: excavators.reduce((sum, e) => sum + e.damage_history.damages_all_time, 0)
        },
        employees: {
          senior: employees.filter(e => e.role === 'senior_locator').length,
          locator: employees.filter(e => e.role === 'locator').length,
          trainee: employees.filter(e => e.role === 'trainee').length,
          avg_experience_years: (employees.reduce((sum, e) => sum + e.experience.years_experience, 0) / employees.length).toFixed(1),
          zero_damages: employees.filter(e => e.performance_metrics.damages_12mo === 0).length
        },
        tickets: {
          emergency: tickets.filter(t => t.type === 'emergency').length,
          non_compliant: tickets.filter(t => t.type === 'non_compliant').length,
          routine: tickets.filter(t => t.type === 'routine').length,
          with_gas: tickets.filter(t => t.utility_types.includes('gas')).length,
          with_electric: tickets.filter(t => t.utility_types.includes('electric')).length,
          avg_distance_miles: (tickets.reduce((sum, t) => sum + t.distance_miles, 0) / tickets.length).toFixed(2)
        },
        damages: {
          critical: damages.filter(d => d.severity === 'critical').length,
          major: damages.filter(d => d.severity === 'major').length,
          minor: damages.filter(d => d.severity === 'minor').length,
          excavator_fault: damages.filter(d => d.responsible_party === 'excavator').length,
          locator_fault: damages.filter(d => d.responsible_party === 'locator').length,
          total_cost: `$${damages.reduce((sum, d) => sum + d.costs.total, 0).toLocaleString()}`,
          avg_cost: `$${Math.round(damages.reduce((sum, d) => sum + d.costs.total, 0) / damages.length).toLocaleString()}`
        }
      },
      demo_scenarios: {
        critical_risk: 'TX-2025-999001',
        low_risk: 'TX-2025-500123',
        complex_multi_utility: 'TX-2025-750456'
      },
      generation_time_seconds: ((Date.now() - startTime) / 1000).toFixed(2)
    };
    
    fs.writeFileSync(
      path.join(outputDir, '_summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    // Print summary
    console.log('??????????????????????????????????????????????????');
    console.log('? DATA GENERATION COMPLETE!');
    console.log('??????????????????????????????????????????????????\n');
    
    console.log('?? Summary:');
    console.log(`   Excavators: ${summary.counts.excavators} (${summary.statistics.excavators.high_risk} high-risk, ${summary.statistics.excavators.excellent} excellent)`);
    console.log(`   Employees: ${summary.counts.employees} (${summary.statistics.employees.senior} senior, avg ${summary.statistics.employees.avg_experience_years} years exp)`);
    console.log(`   Tickets: ${summary.counts.tickets} (${summary.statistics.tickets.emergency} emergency, ${summary.statistics.tickets.with_gas} with gas)`);
    console.log(`   Damages: ${summary.counts.damages} (${summary.statistics.damages.critical} critical, total cost: ${summary.statistics.damages.total_cost})`);
    
    console.log('\n?? Demo Scenarios Ready:');
    console.log(`   Critical Risk: ${summary.demo_scenarios.critical_risk}`);
    console.log(`   Low Risk: ${summary.demo_scenarios.low_risk}`);
    console.log(`   Complex Multi-Utility: ${summary.demo_scenarios.complex_multi_utility}`);
    
    console.log(`\n??  Generated in ${summary.generation_time_seconds} seconds`);
    console.log(`?? Output directory: ${outputDir}`);
    
    console.log('\n?? Generated files:');
    console.log('   ? excavators.json');
    console.log('   ? employees.json');
    console.log('   ? tickets.json');
    console.log('   ? damages.json');
    console.log('   ? _summary.json');
    
    console.log('\n?? Next steps:');
    console.log('   1. Review the generated data in data/seed/');
    console.log('   2. Check _summary.json for statistics');
    console.log('   3. Set up your database (Supabase)');
    console.log('   4. Run database seed script to import data');
    console.log('   5. Start building the risk assessment API!\n');
    
  } catch (error) {
    console.error('\n? Error during data generation:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllData();
}
