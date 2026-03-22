// Pure calculation logic for multi-year energy investment tax modeling

export const TAX_BRACKETS = [
  { label: "24%", rate: 0.24, income: "$100K–$191K" },
  { label: "32%", rate: 0.32, income: "$191K–$244K" },
  { label: "35%", rate: 0.35, income: "$244K–$609K" },
  { label: "37%", rate: 0.37, income: "$609K+" },
];

export const DEFAULTS = {
  investmentPerYear: 100000,
  idcPercent: 75,        // % of investment that is IDC (intangible drilling costs)
  tangiblePercent: 25,   // remainder = tangible
  depletionRate: 15,     // percentage depletion (15% of gross income)
  annualGrossIncome: 30, // % of investment returned as gross income per year
  declineRate: 15,       // annual production decline %
  loePercent: 25,        // lease operating expense as % of gross income
  severanceTaxPercent: 7,
  years: 5,
};

export function computeMultiYearModel(params, taxRate) {
  const {
    investmentPerYear,
    idcPercent,
    depletionRate,
    annualGrossIncome,
    declineRate,
    loePercent,
    severanceTaxPercent,
    years,
  } = params;

  const idcFraction = idcPercent / 100;
  const tangibleFraction = 1 - idcFraction;

  const yearlyData = [];
  let cumulativeInvested = 0;
  let cumulativeTaxSavings = 0;
  let cumulativeNetIncome = 0;
  let cumulativeNetCost = 0;

  // Track each vintage of investment for decline & depletion
  const vintages = []; // { year, investment, currentProduction }

  for (let y = 1; y <= years; y++) {
    const investment = investmentPerYear;
    cumulativeInvested += investment;

    // IDC deduction (100% in year of investment)
    const idcDeduction = investment * idcFraction;

    // Tangible depreciation (7-year MACRS, simplified ~14.3%/yr for first 5)
    const tangibleInvestment = investment * tangibleFraction;
    const macrsRates = [0.1429, 0.2449, 0.1749, 0.1249, 0.0893];

    // Add new vintage
    vintages.push({ yearInvested: y, investment, initialGross: investment * (annualGrossIncome / 100) });

    // Calculate total gross income from all vintages
    let totalGrossIncome = 0;
    for (const v of vintages) {
      const age = y - v.yearInvested;
      const declineFactor = Math.pow(1 - declineRate / 100, age);
      totalGrossIncome += v.initialGross * declineFactor;
    }

    // Operating expenses
    const loe = totalGrossIncome * (loePercent / 100);
    const severanceTax = totalGrossIncome * (severanceTaxPercent / 100);
    const netOperatingIncome = totalGrossIncome - loe - severanceTax;

    // Percentage depletion (15% of gross income, capped at 65% of net income)
    const depletionDeduction = Math.min(
      totalGrossIncome * (depletionRate / 100),
      netOperatingIncome * 0.65
    );

    // Tangible depreciation from all vintages
    let totalDepreciation = 0;
    for (const v of vintages) {
      const age = y - v.yearInvested;
      if (age < macrsRates.length) {
        totalDepreciation += v.investment * tangibleFraction * macrsRates[age];
      }
    }

    // Total deductions
    const totalDeductions = idcDeduction + depletionDeduction + totalDepreciation;

    // Tax savings
    const taxSavings = totalDeductions * taxRate;
    cumulativeTaxSavings += taxSavings;

    // Net income after tax benefit
    const netIncomeAfterTax = netOperatingIncome + taxSavings;
    cumulativeNetIncome += netOperatingIncome;

    // Net cost = total invested - total tax savings - total net income
    cumulativeNetCost = cumulativeInvested - cumulativeTaxSavings - cumulativeNetIncome;

    const effectiveROI = cumulativeInvested > 0
      ? ((cumulativeTaxSavings + cumulativeNetIncome) / cumulativeInvested) * 100
      : 0;

    yearlyData.push({
      year: y,
      investment,
      grossIncome: Math.round(totalGrossIncome),
      netOperatingIncome: Math.round(netOperatingIncome),
      idcDeduction: Math.round(idcDeduction),
      depletionDeduction: Math.round(depletionDeduction),
      tangibleDepreciation: Math.round(totalDepreciation),
      totalDeductions: Math.round(totalDeductions),
      taxSavings: Math.round(taxSavings),
      cumulativeInvested: Math.round(cumulativeInvested),
      cumulativeTaxSavings: Math.round(cumulativeTaxSavings),
      cumulativeNetIncome: Math.round(cumulativeNetIncome),
      cumulativeNetCost: Math.round(cumulativeNetCost),
      effectiveROI: Math.round(effectiveROI * 10) / 10,
    });
  }

  return yearlyData;
}

export function computeAllBrackets(params) {
  return TAX_BRACKETS.map((b) => ({
    ...b,
    data: computeMultiYearModel(params, b.rate),
  }));
}