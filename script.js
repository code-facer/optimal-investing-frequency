document.getElementById('investment-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const savingFrequency = document.getElementById('savings-frequency').value;
  const savings = parseFloat(document.getElementById('savings').value);
  const bankInterestRate = parseFloat(document.getElementById('bank-interest-rate').value) / 100;
  const expectedReturn = parseFloat(document.getElementById('expected-return').value) / 100;
  const brokerageFee = parseFloat(document.getElementById('brokerage-fee').value);

  function calculateTotal(investmentFrequency, numberOfYears, savingFrequency) {
    let periodsPerYear;

    switch (savingFrequency) {
      case 'month':
        periodsPerYear = 12.0;
        break;
      case 'fortnight':
        periodsPerYear = 26.0;
        break;
      case 'week':
        periodsPerYear = 52.0;
        break;
    }

    // FV of annuity of monthly savings at bank's rate after 1 period
    let savingsAfterInterest;
    if (bankInterestRate === 0) {
      savingsAfterInterest = savings * investmentFrequency - brokerageFee;
    } else {
      savingsAfterInterest = Math.max(savings * ((1 + bankInterestRate / periodsPerYear) ** investmentFrequency - 1) / (bankInterestRate / periodsPerYear) - brokerageFee, 0);
    }

    // FV of annuity of savingsAfterInterest at expected return after numberOfYears
    if (expectedReturn === 0) {
      return (savingsAfterInterest+brokerageFee) * periodsPerYear/investmentFrequency * numberOfYears;
    }
    const totalAmount = savingsAfterInterest * ((1 + expectedReturn) ** numberOfYears - 1) / ((1 + expectedReturn) ** (investmentFrequency / periodsPerYear) - 1);
    return totalAmount;
  }

  function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  }

  function updateResults(results) {
    results.slice(0, 3).forEach((result, index) => {
      const frequencyText = result.frequency === 1 ? savingFrequency : savingFrequency+'s';
      document.getElementById(`frequency-${index + 1}`).innerText = `Every ${result.frequency} ${frequencyText}`;
      document.getElementById(`amount-${index + 1}`).innerText = `Amount after a year: ${formatCurrency(result.amount)}`;
    });
  }

  function showResults() {
    const resultsSection = document.getElementById('results');
    const podium = document.querySelector('.podium');

    resultsSection.style.display = 'block';
    podium.classList.add('fade-in');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  function calculateAndSortResults() {
    const results = [];
    for (let i = 1; i <= 12; i++) {
      results.push({ frequency: i, amount: calculateTotal(i, 1, savingFrequency)});
    }
    results.sort((a, b) => b.amount - a.amount);
    return results;
  }

  function showResults() {
    const resultsSection = document.getElementById('results');
    const podium = document.querySelector('.podium');
  
    resultsSection.style.display = 'block';
    podium.classList.add('fade-in');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  const results = calculateAndSortResults();
  updateResults(results);
  showResults();
});
