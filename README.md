# Company Financial Behavior Analysis & Advisory System

Plain HTML, CSS, and JavaScript starter project for a student finance analytics system.

## Pages

- `listing.html`: transaction listing and manual registration form
- `details.html`: transaction details with OCR/category inspection
- `dashboard.html`: risk detection, cashflow forecast, and AI advisory view

## Proposed modules

- Authentication module
- Transaction management module
- Invoice OCR and categorization module
- Financial analytics module
- Risk detection module
- Forecasting module
- AI advisory module

## Suggested backend integration

This frontend is static first. For a fuller version, connect it to:

- OCR service for image/PDF invoice text extraction
- database for users and transactions
- AI API for advisory generation
- cache layer to reduce repeated AI calls

## Demo flow

1. Open `listing.html`
2. Review sample transactions
3. Add a new record with invoice text to trigger auto categorization
4. Open a transaction detail page
5. Open `dashboard.html` to inspect risk, forecast, and advice
