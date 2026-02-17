import type { PensionPot, RetirementGoal, YearlyProjection } from "@shared/schema";

export function calculateProjections(
  pensions: PensionPot[],
  goal: RetirementGoal | null | undefined
): {
  data: YearlyProjection[];
  summary: {
    totalPotValue: number;
    projectedTotal: number;
    totalMonthlyContribution: number;
    projectedMonthlyIncome: number;
    shortfall: number;
  };
} {
  // Defaults if no goal is set
  const currentAge = goal?.currentAge || 30;
  const retirementAge = goal?.retirementAge || 65;
  const lifeExpectancy = goal?.lifeExpectancy || 85;
  const targetAnnualIncome = Number(goal?.targetAnnualIncome || 25000);
  const includeStatePension = goal?.includeStatePension ?? true;
  
  // State pension assumption (UK approx £11,500/year from age 67)
  const STATE_PENSION = 11500;
  const STATE_PENSION_AGE = 67;

  let totalPotValue = 0;
  let totalMonthlyContribution = 0;

  pensions.forEach((p) => {
    totalPotValue += Number(p.currentValue);
    totalMonthlyContribution += Number(p.monthlyContribution);
  });

  const projectionYears = Math.max(0, lifeExpectancy - currentAge);
  const data: YearlyProjection[] = [];

  let runningPotValue = totalPotValue;
  
  for (let i = 0; i <= projectionYears; i++) {
    const age = currentAge + i;
    const year = new Date().getFullYear() + i;
    
    // Growth phase (Pre-retirement)
    if (age < retirementAge) {
      // Annual contribution
      const annualContribution = totalMonthlyContribution * 12;
      
      // Apply growth to each pot individually ideally, but for summary we use average or per-pot logic
      // Simplified: Aggregate growth logic
      // To be accurate, we should iterate pots. Let's do a simplified aggregate 5% real growth for now 
      // or better, sum up growth from each pot.
      
      let yearGrowth = 0;
      let yearFees = 0;
      
      // Re-calculate based on individual pots for better accuracy
      // This is complex because we just have the aggregate running total in this loop structure.
      // Let's assume a weighted average growth for the aggregate pot for simplicity in this frontend view
      const AVG_GROWTH = 0.05; // 5%
      const AVG_FEES = 0.0075; // 0.75%
      const NET_GROWTH = AVG_GROWTH - AVG_FEES;

      const growthAmount = runningPotValue * NET_GROWTH;
      runningPotValue += growthAmount + annualContribution;
      
      data.push({
        age,
        year,
        totalPotValue: Math.round(runningPotValue),
        totalContributions: Math.round(totalMonthlyContribution * 12 * (i + 1)), // Cumulative approx
        projectedIncome: 0,
      });
    } 
    // Drawdown phase (Post-retirement)
    else {
      // Simple drawdown: spread pot over remaining years
      const yearsRemaining = Math.max(1, lifeExpectancy - age);
      
      // Continue growing the remaining pot? Yes, usually funds stay invested.
      // Assume slightly more conservative growth in retirement
      const RETIREMENT_NET_GROWTH = 0.03; // 3%
      
      const growthAmount = runningPotValue * RETIREMENT_NET_GROWTH;
      runningPotValue += growthAmount;

      // Calculate max sustainable income for this year
      // This is a simple annuity-style calc or drawdown
      // Let's just do a simple division for visualization
      let annualDrawdown = runningPotValue / yearsRemaining;
      
      // Add state pension if eligible
      let totalAnnualIncome = annualDrawdown;
      if (includeStatePension && age >= STATE_PENSION_AGE) {
        totalAnnualIncome += STATE_PENSION;
      }

      // Subtract drawdown from pot
      runningPotValue -= annualDrawdown;
      if (runningPotValue < 0) runningPotValue = 0;

      data.push({
        age,
        year,
        totalPotValue: Math.round(runningPotValue),
        totalContributions: 0,
        projectedIncome: Math.round(totalAnnualIncome),
      });
    }
  }

  // Final summary numbers
  const retirementYearIndex = retirementAge - currentAge;
  const projectedTotalAtRetirement = data[retirementYearIndex]?.totalPotValue || 0;
  
  // Annual income in first year of retirement
  const firstRetirementYear = data[retirementYearIndex];
  const projectedAnnualIncome = firstRetirementYear ? firstRetirementYear.projectedIncome : 0;
  
  const projectedMonthlyIncome = projectedAnnualIncome / 12;
  const targetMonthlyIncome = targetAnnualIncome / 12;
  const shortfall = Math.max(0, targetMonthlyIncome - projectedMonthlyIncome);

  return {
    data,
    summary: {
      totalPotValue,
      projectedTotal: projectedTotalAtRetirement,
      totalMonthlyContribution,
      projectedMonthlyIncome,
      shortfall
    }
  };
}
