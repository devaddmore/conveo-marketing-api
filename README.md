# Marketing API

A serverless API built with Express.js and deployed on Vercel.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run locally:
```bash
npm run dev
```

3. Deploy to Vercel:
```bash
npm run deploy
```

## Available Endpoints

### Email Analysis
- `GET /`: Welcome message
- `GET /api/health`: Health check endpoint
- `GET /api/analyze-email`: Analyze email address
  - Query parameter: `email` (required)
  - Returns:
    - `companyName`: Company name extracted from domain
    - `favicon`: URL to company's favicon (128px)
    - `domain`: Extracted domain

#### Example Request
```
GET /api/analyze-email?email=support@conveo.ai
```

#### Example Response
```json
{
  "companyName": "Conveo",
  "favicon": "https://www.google.com/s2/favicons?domain=conveo.ai&sz=128",
  "domain": "conveo.ai"
}
```

### HubSpot Form Submission
- `POST /api/submit-form`: Submit data to HubSpot form
  - Request body:
    - `portalId`: Your HubSpot portal ID
    - `formGuid`: Your HubSpot form GUID
    - `data`: Object containing form fields and values

#### Example Request
```json
POST /api/submit-form
{
  "portalId": "YOUR_PORTAL_ID",
  "formGuid": "YOUR_FORM_GUID",
  "data": {
    "email": "john@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "company": "Example Inc"
  }
}
```

#### Example Response
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "result": {
    // HubSpot API response
  }
}
```

## HubSpot Setup

1. Get your form details:
   - Portal ID: Found in your HubSpot URL or account settings
   - Form GUID: Found in your form's settings or embed code
   - You can find these in your form's embed code snippet

## Development

This project uses:
- Express.js for the API framework
- Vercel for serverless deployment
- Google's favicon service for company icons
- HubSpot Forms API for form submissions

To add new endpoints, modify `api/index.js`. 