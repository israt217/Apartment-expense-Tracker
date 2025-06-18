let expenses = [];

// Load data from localStorage
function loadData() {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
    updateUI();
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Handle form submission
document.getElementById('expenseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const expense = {
        id: Date.now(),
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        paidBy: document.getElementById('paidBy').value.trim(),
        splitAmong: parseInt(document.getElementById('splitAmong').value)
    };

    if (expense.splitAmong < 1) {
        alert('Number of roommates must be at least 1.');
        return;
    }

    expenses.push(expense);
    saveData();
    updateUI();
    e.target.reset();
});

// Handle clear all button
document.getElementById('clearAll').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all expenses?')) {
        expenses = [];
        saveData();
        updateUI();
    }
});

// Update UI
function updateUI() {
    // Update expense table
    const tableBody = document.getElementById('expenseTableBody');
    tableBody.innerHTML = expenses.map(expense => `
        <tr>
            <td>${expense.description}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.paidBy}</td>
            <td>${expense.splitAmong}</td>
            <td>$${(expense.amount / expense.splitAmong).toFixed(2)}</td>
        </tr>
    `).join('');

    // Update summary
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const roommateContributions = {};
    expenses.forEach(exp => {
        roommateContributions[exp.paidBy] = (roommateContributions[exp.paidBy] || 0) + exp.amount;
    });

    let summaryHTML = `<p><strong>Total Expenses:</strong> $${totalExpenses.toFixed(2)}</p>`;
    for (const [roommate, amount] of Object.entries(roommateContributions)) {
        summaryHTML += `<p><strong>${roommate}'s Contribution:</strong> $${amount.toFixed(2)}</p>`;
    }
    document.getElementById('summaryContent').innerHTML = summaryHTML;

    // Update visualization
    const barChart = document.getElementById('barChart');
    const maxContribution = Math.max(...Object.values(roommateContributions), 100); // Avoid division by zero
    barChart.innerHTML = Object.entries(roommateContributions).map(([roommate, amount]) => `
        <div class="bar-container">
            <div class="bar" style="height: ${(amount / maxContribution) * 150}px;">$${amount.toFixed(2)}</div>
            <div class="bar-label">${roommate}</div>
        </div>
    `).join('');
}

// Initialize
loadData();