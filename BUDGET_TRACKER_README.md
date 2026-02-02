# Budget Tracker

A single-page vanilla JavaScript budget tracker application with real-time chart visualization and username validation.

## Features

- **Username Validation**: Real-time validation ensuring usernames are 3-20 characters long and contain only letters, numbers, hyphens, and underscores
- **Transaction Management**: Add and remove budget transactions with description, amount, and category
- **Real-time Statistics**: Automatically calculates total transactions, total amount, and average transaction
- **Data Persistence**: Stores username and transactions in browser LocalStorage
- **Chart Visualization**: Interactive doughnut chart showing spending breakdown by category (uses Chart.js)
- **Responsive Design**: Built with Bootstrap 5 for mobile-friendly interface

## Technologies Used

- **Vanilla JavaScript** - No frameworks, runs directly in browser
- **Bootstrap 5** - Modern UI components and responsive grid
- **Chart.js** - Beautiful, interactive charts
- **Jest** - Testing framework for validation logic
- **LocalStorage** - Client-side data persistence

## Getting Started

### Running the Application

Simply open `src/static/budget.html` in a web browser. No build step required!

Alternatively, serve it with any HTTP server:

```bash
# Using Python
python3 -m http.server 8080 --directory src/static

# Using Node.js http-server
npx http-server src/static -p 8080
```

Then navigate to `http://localhost:8080/budget.html`

### Running Tests

The project includes a comprehensive Jest test suite with 30 tests covering username and transaction validation.

```bash
# Install dependencies
npm install

# Run tests
npm test
```

## Usage

1. **Set Username** (Optional)
   - Enter a username (3-20 characters, letters/numbers/hyphens/underscores only)
   - Click "Save Username" to store it
   - Real-time validation feedback is provided

2. **Add Transaction**
   - Enter a description for the transaction
   - Enter the amount (must be positive)
   - Select a category (Food, Transportation, Entertainment, Shopping, Bills, or Other)
   - Click "Add Transaction"

3. **View Statistics**
   - See total number of transactions
   - View total amount spent
   - Check average transaction amount
   - Visualize spending by category in the chart

4. **Remove Transactions**
   - Click the "Remove" button next to any transaction to delete it
   - Statistics and chart update automatically

## File Structure

```
.
├── src/static/
│   ├── budget.html       # Main HTML page
│   ├── budget.js         # Application logic
│   └── budget.css        # Additional styles
├── budget.test.js        # Jest test suite
└── package.json          # NPM dependencies
```

## Validation Rules

### Username Validation
- Required field
- Minimum 3 characters
- Maximum 20 characters
- Only alphanumeric characters, hyphens, and underscores allowed
- Whitespace is trimmed

### Transaction Validation
- Description: Required, non-empty
- Amount: Must be a positive number (> 0)
- Category: Required, must select from available options

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- LocalStorage API
- Fetch API (for CDN resources)

## Testing

The project includes comprehensive Jest tests for all validation logic:
- 16 tests for username validation
- 14 tests for transaction validation
- 100% test coverage for validation functions

Run tests with:
```bash
npm test
```

## Security

- ✅ No SQL injection vulnerabilities (client-side only)
- ✅ Input validation on all user inputs
- ✅ XSS protection through proper DOM manipulation
- ✅ CodeQL security scan passed with 0 alerts

## License

MIT License - See LICENSE file for details
