document.addEventListener('DOMContentLoaded', () => {
  
  // Helper to format currency
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(num);
  };

  // Helper to get input value safely
  const getValue = (id) => parseFloat(document.getElementById(id).value) || 0;

  // 1. Compound Interest Calculator (복리 수익 계산기)
  const compoundForm = document.getElementById('compound-form');
  if (compoundForm) {
    compoundForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const p = getValue('initial-investment');
      const pmt = getValue('monthly-contribution');
      const r = getValue('interest-rate') / 100;
      const t = getValue('years');
      const n = parseInt(document.getElementById('compound-frequency').value);

      // Future Value of Principal
      const fvPrincipal = p * Math.pow((1 + r/n), (n*t));
      
      // Future Value of Series
      const fvSeries = pmt * (Math.pow((1 + r/n), (n*t)) - 1) / (r/n);
      
      const total = fvPrincipal + fvSeries;
      const totalInvested = p + (pmt * 12 * t); // approx if n=12
      const totalInterest = total - totalInvested;

      document.getElementById('compound-result').innerHTML = `
        <h3>계산 결과</h3>
        <div class="result-item"><span>최종 자산 (미래 가치):</span> <span class="result-value highlight">${formatCurrency(total)}</span></div>
        <div class="result-item"><span>총 투자금:</span> <span class="result-value">${formatCurrency(totalInvested)}</span></div>
        <div class="result-item"><span>총 수익금 (이자):</span> <span class="result-value">${formatCurrency(totalInterest)}</span></div>
      `;
    });
  }

  // 2. Monthly Income Goal Calculator (월 100만원 만들기 계산기)
  const incomeGoalForm = document.getElementById('income-goal-form');
  if (incomeGoalForm) {
    incomeGoalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const goal = getValue('monthly-income-goal');
      const rate = getValue('expected-return') / 100;
      
      if (rate === 0) return;

      const requiredCapital = (goal * 12) / rate;

      document.getElementById('income-goal-result').innerHTML = `
        <h3>계산 결과</h3>
        <div class="result-item"><span>필요한 총 자산:</span> <span class="result-value highlight">${formatCurrency(requiredCapital)}</span></div>
        <p>연 수익률 <strong>${(rate*100).toFixed(1)}%</strong>로 매월 <strong>${formatCurrency(goal)}</strong>을(를) 벌기 위해 필요한 자산입니다.</p>
      `;
    });
  }

  // 3. Dividend Calculator (배당 수익 계산기)
  const dividendForm = document.getElementById('dividend-form');
  if (dividendForm) {
    dividendForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = getValue('investment-amount');
      const yieldRate = getValue('dividend-yield') / 100;

      const annual = amount * yieldRate;
      const monthly = annual / 12;

      document.getElementById('dividend-result').innerHTML = `
        <h3>계산 결과</h3>
        <div class="result-item"><span>예상 연 배당금:</span> <span class="result-value highlight">${formatCurrency(annual)}</span></div>
        <div class="result-item"><span>예상 월 배당금:</span> <span class="result-value">${formatCurrency(monthly)}</span></div>
      `;
    });
  }

  // 4. Savings Goal Calculator (적금 목표 달성 계산기 - Time to reach goal)
  const savingsGoalForm = document.getElementById('savings-goal-form');
  if (savingsGoalForm) {
    savingsGoalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const goal = getValue('goal-amount');
      const pmt = getValue('monthly-saving');
      const r = getValue('interest-rate') / 100 / 12; // Monthly rate

      if (pmt === 0) return;

      let months = 0;
      if (r === 0) {
        months = goal / pmt;
      } else {
        // FV = PMT * ((1+r)^n - 1) / r
        // n = ln(FV * r / PMT + 1) / ln(1+r)
        months = Math.log(goal * r / pmt + 1) / Math.log(1 + r);
      }

      const years = Math.floor(months / 12);
      const remainingMonths = Math.ceil(months % 12);

      document.getElementById('savings-goal-result').innerHTML = `
        <h3>계산 결과</h3>
        <div class="result-item"><span>목표 달성 예상 기간:</span> <span class="result-value highlight">${years}년 ${remainingMonths}개월</span></div>
        <div class="result-item"><span>총 저축 개월 수:</span> <span class="result-value">${Math.ceil(months)}개월</span></div>
      `;
    });
  }

  // 5. FIRE Calculator (파이어족 은퇴 계산기)
  const fireForm = document.getElementById('fire-form');
  if (fireForm) {
    fireForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const expenses = getValue('annual-expense');
      const currentNetWorth = getValue('current-net-worth');
      const annualSavings = getValue('annual-savings');
      const returnRate = getValue('return-rate') / 100;
      const withdrawalRate = getValue('withdrawal-rate') / 100;

      const fireNumber = expenses / withdrawalRate;
      let yearsToFire = 0;
      let netWorth = currentNetWorth;

      // Simple iteration to find years (handling compound growth + contributions)
      if (annualSavings > 0) {
        while (netWorth < fireNumber && yearsToFire < 100) {
          netWorth = netWorth * (1 + returnRate) + annualSavings;
          yearsToFire++;
        }
      } else if (netWorth >= fireNumber) {
        yearsToFire = 0;
      } else {
        yearsToFire = "무한대 (저축액을 늘리세요)";
      }

      document.getElementById('fire-result').innerHTML = `
        <h3>계산 결과</h3>
        <div class="result-item"><span>FIRE 목표 자산:</span> <span class="result-value highlight">${formatCurrency(fireNumber)}</span></div>
        <div class="result-item"><span>은퇴까지 남은 기간:</span> <span class="result-value">${yearsToFire === "무한대 (저축액을 늘리세요)" ? yearsToFire : yearsToFire + "년"}</span></div>
      `;
    });
  }

  // 6. ETF Investment Calculator (ETF 적립식 투자 계산기)
  const etfForm = document.getElementById('etf-form');
  if (etfForm) {
    etfForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pmt = getValue('monthly-investment');
      const r = getValue('expected-return') / 100 / 12; // Monthly rate
      const years = getValue('investment-period');
      const months = years * 12;

      // FV of Series
      const fv = pmt * (Math.pow((1 + r), months) - 1) / r;
      const totalInvested = pmt * months;
      const totalGain = fv - totalInvested;

      document.getElementById('etf-result').innerHTML = `
        <h3>계산 결과</h3>
        <div class="result-item"><span>예상 자산:</span> <span class="result-value highlight">${formatCurrency(fv)}</span></div>
        <div class="result-item"><span>총 투자 원금:</span> <span class="result-value">${formatCurrency(totalInvested)}</span></div>
        <div class="result-item"><span>총 수익금:</span> <span class="result-value">${formatCurrency(totalGain)}</span></div>
      `;
    });
  }

  // 7. Loan Interest Comparison (대출 이자 비교 계산기)
  const loanForm = document.getElementById('loan-comparison-form');
  if (loanForm) {
    loanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const calcLoan = (amount, rate, years) => {
        const r = rate / 100 / 12;
        const n = years * 12;
        if (r === 0) return { pmt: amount/n, total: amount };
        const pmt = (amount * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
        return { pmt, total: pmt * n };
      };

      const loanA = calcLoan(getValue('loan-amount-a'), getValue('interest-rate-a'), getValue('loan-term-a'));
      const loanB = calcLoan(getValue('loan-amount-b'), getValue('interest-rate-b'), getValue('loan-term-b'));

      const diff = Math.abs(loanA.total - loanB.total);
      const better = loanA.total < loanB.total ? "대출 A" : "대출 B";

      document.getElementById('loan-comparison-result').innerHTML = `
        <h3>비교 결과</h3>
        <div class="result-item"><span>대출 A 월 상환금:</span> <span class="result-value">${formatCurrency(loanA.pmt)}</span></div>
        <div class="result-item"><span>대출 A 총 상환금:</span> <span class="result-value">${formatCurrency(loanA.total)}</span></div>
        <hr style="margin: 0.5rem 0; border: 0; border-top: 1px dashed #ccc;">
        <div class="result-item"><span>대출 B 월 상환금:</span> <span class="result-value">${formatCurrency(loanB.pmt)}</span></div>
        <div class="result-item"><span>대출 B 총 상환금:</span> <span class="result-value">${formatCurrency(loanB.total)}</span></div>
        <p style="margin-top: 1rem; color: var(--secondary-color); font-weight: bold;">
          ${better}가 총 ${formatCurrency(diff)} 더 저렴합니다.
        </p>
      `;
    });
  }

  // 8. Monthly Saving Calculator (월 저축 목표 계산기 - Solve for PMT)
  const monthlySavingForm = document.getElementById('monthly-saving-form');
  if (monthlySavingForm) {
    monthlySavingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const goal = getValue('goal-amount');
      const months = getValue('months-to-goal');
      const r = getValue('interest-rate') / 100 / 12;

      let pmt = 0;
      if (r === 0) {
        pmt = goal / months;
      } else {
        // PMT = FV * r / ((1+r)^n - 1)
        pmt = goal * r / (Math.pow(1+r, months) - 1);
      }

      document.getElementById('monthly-saving-result').innerHTML = `
        <h3>계산 결과</h3>
        <div class="result-item"><span>매월 필요한 저축액:</span> <span class="result-value highlight">${formatCurrency(pmt)}</span></div>
      `;
    });
  }

  // 9. Salary Net Calculator (연봉 실수령액 계산기)
  const salaryForm = document.getElementById('salary-form');
  if (salaryForm) {
    salaryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const gross = getValue('annual-salary');
      const taxRate = getValue('tax-rate') / 100;
      
      const netAnnual = gross * (1 - taxRate);
      const netMonthly = netAnnual / 12;

      document.getElementById('salary-result').innerHTML = `
        <h3>계산 결과</h3>
        <div class="result-item"><span>예상 연 실수령액:</span> <span class="result-value">${formatCurrency(netAnnual)}</span></div>
        <div class="result-item"><span>예상 월 실수령액:</span> <span class="result-value highlight">${formatCurrency(netMonthly)}</span></div>
      `;
    });
  }

  // 10. Side Income Target (부업 목표 달성 계산기)
  const sideIncomeForm = document.getElementById('side-income-form');
  if (sideIncomeForm) {
    sideIncomeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const goal = getValue('monthly-income-goal');
      const rpm = getValue('rpm');
      const convRate = getValue('conversion-rate') / 100;
      const price = getValue('product-price');

      let adViews = 0;
      let sales = 0;
      let salesTraffic = 0;

      if (rpm > 0) {
        adViews = (goal / rpm) * 1000;
      }

      if (price > 0 && convRate > 0) {
        sales = goal / price;
        salesTraffic = sales / convRate;
      }

      let output = `<h3>계산 결과</h3>`;
      if (rpm > 0) {
        output += `<div class="result-item"><span>필요 조회수 (광고):</span> <span class="result-value highlight">${Math.ceil(adViews).toLocaleString()} 회/월</span></div>`;
      }
      if (price > 0 && convRate > 0) {
        output += `<div class="result-item"><span>필요 판매 건수:</span> <span class="result-value highlight">${Math.ceil(sales)} 건/월</span></div>`;
        output += `<div class="result-item"><span>필요 방문자 수 (판매):</span> <span class="result-value">${Math.ceil(salesTraffic).toLocaleString()} 명/월</span></div>`;
      }

      document.getElementById('side-income-result').innerHTML = output;
    });
  }
});