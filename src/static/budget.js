// Budget Tracker Application

// Validation Functions
function validateUsername(username) {
    if (!username || typeof username !== 'string') {
        return { valid: false, error: 'Username is required' };
    }
    
    const trimmed = username.trim();
    
    if (trimmed.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters long' };
    }
    
    if (trimmed.length > 20) {
        return { valid: false, error: 'Username must be at most 20 characters long' };
    }
    
    const alphanumericPattern = /^[a-zA-Z0-9_-]+$/;
    if (!alphanumericPattern.test(trimmed)) {
        return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }
    
    return { valid: true, error: null };
}

function validateTransaction(description, amount, category) {
    if (!description || description.trim().length === 0) {
        return { valid: false, error: 'Description is required' };
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return { valid: false, error: 'Amount must be a positive number' };
    }
    
    if (!category || category === '') {
        return { valid: false, error: 'Category is required' };
    }
    
    return { valid: true, error: null };
}

// Transaction Management
class BudgetTracker {
    constructor() {
        this.transactions = this.loadFromStorage('transactions') || [];
        this.username = this.loadFromStorage('username') || '';
        this.chart = null;
        this.initChart();
        this.initEventListeners();
        this.loadUserInfo();
        this.render();
    }
    
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading from storage:', e);
            return null;
        }
    }
    
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    }
    
    initEventListeners() {
        // Username save button
        document.getElementById('save-username').addEventListener('click', () => {
            this.saveUsername();
        });
        
        // Budget form submission
        document.getElementById('budget-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });
        
        // Username input validation on input
        document.getElementById('username').addEventListener('input', (e) => {
            this.validateUsernameInput(e.target);
        });
    }
    
    validateUsernameInput(input) {
        const validation = validateUsername(input.value);
        
        if (validation.valid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            document.getElementById('username-error').textContent = '';
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            document.getElementById('username-error').textContent = validation.error;
        }
        
        return validation.valid;
    }
    
    saveUsername() {
        const usernameInput = document.getElementById('username');
        const validation = validateUsername(usernameInput.value);
        
        if (!validation.valid) {
            usernameInput.classList.add('is-invalid');
            document.getElementById('username-error').textContent = validation.error;
            return;
        }
        
        this.username = usernameInput.value.trim();
        this.saveToStorage('username', this.username);
        this.loadUserInfo();
        usernameInput.value = '';
        usernameInput.classList.remove('is-valid', 'is-invalid');
    }
    
    loadUserInfo() {
        const currentUserDiv = document.getElementById('current-user');
        if (this.username) {
            currentUserDiv.innerHTML = `<strong>Current User:</strong> ${this.username}`;
            currentUserDiv.style.display = 'block';
        } else {
            currentUserDiv.style.display = 'none';
        }
    }
    
    addTransaction() {
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        
        const validation = validateTransaction(description, amount, category);
        
        if (!validation.valid) {
            alert(validation.error);
            return;
        }
        
        const transaction = {
            id: Date.now(),
            description: description.trim(),
            amount: parseFloat(amount),
            category: category,
            date: new Date().toISOString()
        };
        
        this.transactions.push(transaction);
        this.saveToStorage('transactions', this.transactions);
        
        // Reset form
        document.getElementById('budget-form').reset();
        
        // Re-render
        this.render();
    }
    
    removeTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveToStorage('transactions', this.transactions);
        this.render();
    }
    
    calculateStats() {
        const total = this.transactions.reduce((sum, t) => sum + t.amount, 0);
        const count = this.transactions.length;
        const average = count > 0 ? total / count : 0;
        
        return { total, count, average };
    }
    
    getCategoryTotals() {
        const categoryTotals = {};
        
        this.transactions.forEach(t => {
            if (!categoryTotals[t.category]) {
                categoryTotals[t.category] = 0;
            }
            categoryTotals[t.category] += t.amount;
        });
        
        return categoryTotals;
    }
    
    initChart() {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js is not loaded. Chart visualization will not be available.');
            this.chart = null;
            return;
        }
        
        const ctx = document.getElementById('budgetChart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    label: 'Spending by Category',
                    data: [],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }
    
    updateChart() {
        // Only update if Chart.js is available
        if (!this.chart) {
            return;
        }
        
        const categoryTotals = this.getCategoryTotals();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }
    
    renderTransactionList() {
        const tbody = document.getElementById('transaction-list');
        
        if (this.transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No transactions yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.transactions.map(t => `
            <tr class="transaction-row">
                <td>${t.description}</td>
                <td><span class="badge bg-primary">${t.category}</span></td>
                <td>$${t.amount.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger btn-remove" onclick="budgetTracker.removeTransaction(${t.id})">
                        Remove
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    renderStats() {
        const stats = this.calculateStats();
        
        document.getElementById('total-count').textContent = stats.count;
        document.getElementById('total-amount').textContent = `$${stats.total.toFixed(2)}`;
        document.getElementById('avg-amount').textContent = `$${stats.average.toFixed(2)}`;
    }
    
    render() {
        this.renderTransactionList();
        this.renderStats();
        this.updateChart();
    }
}

// Initialize app when DOM is ready
let budgetTracker;

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        budgetTracker = new BudgetTracker();
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateUsername, validateTransaction, BudgetTracker };
}
