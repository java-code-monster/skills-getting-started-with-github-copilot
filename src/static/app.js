// Username validation function
function validateUsername(username) {
  // Username must be 3-20 characters, alphanumeric with underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  
  if (!username || username.trim() === '') {
    return { valid: false, message: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 20) {
    return { valid: false, message: 'Username must be 20 characters or less' };
  }
  
  if (!usernameRegex.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { valid: true, message: 'Username is valid' };
}

// Budget Tracker Class
class BudgetTracker {
  constructor() {
    this.transactions = [];
    this.chart = null;
    this.currentUsername = null;
  }

  addTransaction(description, amount, type) {
    const transaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type
    };
    this.transactions.push(transaction);
    return transaction;
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(t => t.id !== id);
  }

  getTotalIncome() {
    return this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses() {
    return this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getBalance() {
    return this.getTotalIncome() - this.getTotalExpenses();
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const budgetTracker = new BudgetTracker();
  
  // DOM elements
  const usernameInput = document.getElementById("username");
  const usernameError = document.getElementById("username-error");
  const usernameSuccess = document.getElementById("username-success");
  const saveUsernameBtn = document.getElementById("save-username");
  const usernameDisplay = document.getElementById("username-display");
  
  const transactionForm = document.getElementById("transaction-form");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");
  const typeSelect = document.getElementById("type");
  
  const totalIncomeEl = document.getElementById("total-income");
  const totalExpensesEl = document.getElementById("total-expenses");
  const balanceEl = document.getElementById("balance");
  const transactionsList = document.getElementById("transactions-list");
  
  const chartCanvas = document.getElementById("budget-chart");

  // Username validation on input
  usernameInput.addEventListener("input", () => {
    const validation = validateUsername(usernameInput.value);
    
    if (validation.valid) {
      usernameInput.classList.remove("is-invalid");
      usernameInput.classList.add("is-valid");
      usernameError.textContent = "";
      usernameSuccess.textContent = validation.message;
    } else {
      usernameInput.classList.remove("is-valid");
      usernameInput.classList.add("is-invalid");
      usernameError.textContent = validation.message;
      usernameSuccess.textContent = "";
    }
  });

  // Save username
  saveUsernameBtn.addEventListener("click", () => {
    const validation = validateUsername(usernameInput.value);
    
    if (validation.valid) {
      budgetTracker.currentUsername = usernameInput.value;
      usernameDisplay.innerHTML = `<div class="alert alert-success">Welcome, <strong>${budgetTracker.currentUsername}</strong>!</div>`;
    } else {
      usernameDisplay.innerHTML = `<div class="alert alert-danger">${validation.message}</div>`;
    }
  });

  // Initialize Chart
  function initChart() {
    const ctx = chartCanvas.getContext('2d');
    budgetTracker.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#28a745', '#dc3545'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Income vs Expenses'
          }
        }
      }
    });
  }

  // Update Chart
  function updateChart() {
    const income = budgetTracker.getTotalIncome();
    const expenses = budgetTracker.getTotalExpenses();
    
    budgetTracker.chart.data.datasets[0].data = [income, expenses];
    budgetTracker.chart.update();
  }

  // Update UI
  function updateUI() {
    const income = budgetTracker.getTotalIncome();
    const expenses = budgetTracker.getTotalExpenses();
    const balance = budgetTracker.getBalance();

    totalIncomeEl.textContent = `$${income.toFixed(2)}`;
    totalExpensesEl.textContent = `$${expenses.toFixed(2)}`;
    balanceEl.textContent = `$${balance.toFixed(2)}`;

    // Update balance card color based on positive/negative
    const balanceCard = balanceEl.closest('.card');
    balanceCard.classList.remove('bg-primary', 'bg-success', 'bg-danger');
    if (balance > 0) {
      balanceCard.classList.add('bg-success');
    } else if (balance < 0) {
      balanceCard.classList.add('bg-danger');
    } else {
      balanceCard.classList.add('bg-primary');
    }

    // Update transactions list
    if (budgetTracker.transactions.length === 0) {
      transactionsList.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No transactions yet</td></tr>';
    } else {
      transactionsList.innerHTML = budgetTracker.transactions
        .map(t => `
          <tr>
            <td>${t.description}</td>
            <td class="${t.type === 'income' ? 'text-success' : 'text-danger'}">
              ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            </td>
            <td>
              <span class="badge ${t.type === 'income' ? 'bg-success' : 'bg-danger'}">
                ${t.type.charAt(0).toUpperCase() + t.type.slice(1)}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${t.id}">Delete</button>
            </td>
          </tr>
        `)
        .join('');

      // Add delete event listeners
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.dataset.id);
          budgetTracker.deleteTransaction(id);
          updateUI();
          updateChart();
        });
      });
    }

    updateChart();
  }

  // Handle transaction form submission
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if (description && amount > 0 && type) {
      budgetTracker.addTransaction(description, amount, type);
      updateUI();
      
      // Reset form
      transactionForm.reset();
    }
  });

  // Initialize chart on load
  initChart();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateUsername };
}
