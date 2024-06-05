document.getElementById('investment-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const monthlySavings = parseFloat(document.getElementById('monthly-savings').value);
  const bankInterestRate = parseFloat(document.getElementById('bank-interest-rate').value) / 100;
  const expectedReturn = parseFloat(document.getElementById('expected-return').value) / 100;
  const brokerageFee = parseFloat(document.getElementById('brokerage-fee').value);

  function calculateTotal(investmentFrequency, numberOfYears) {
    // FV of annuity of monthly savings at banks rate after 1 period
    savingsAfterInterest = Math.max(monthlySavings*((1+bankInterestRate/12.0)**investmentFrequency - 1)/(bankInterestRate/12) - brokerageFee, 0);
    // FV of annuity of savingsAfterInterest at expected return after numberOfYears
    totalAmount = savingsAfterInterest*((1+expectedReturn)**numberOfYears - 1)/((1+expectedReturn)**(investmentFrequency/12)-1);
    return totalAmount;
  }

  let results = [];

  for (let i = 1; i <= 12; i++) {
    results.push({ frequency: i, amount: calculateTotal(i,10) });
  }

  results.sort((a, b) => b.amount - a.amount);

  document.getElementById('frequency-1').innerText = `Every ${results[1].frequency} months`;
  document.getElementById('amount-1').innerText = `Amount after 10 years: ${formatter.format(results[1].amount.toFixed(2))}`;

  document.getElementById('frequency-2').innerText = `Every ${results[0].frequency} months`;
  document.getElementById('amount-2').innerText = `Amount after 10 years: ${formatter.format(results[0].amount.toFixed(2))}`;

  document.getElementById('frequency-3').innerText = `Every ${results[2].frequency} months`;
  document.getElementById('amount-3').innerText = `Amount after 10 years: ${formatter.format(results[2].amount.toFixed(2))}`;

  document.getElementById('results').style.display = 'block';
});

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0
});
