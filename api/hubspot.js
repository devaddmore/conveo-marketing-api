const axios = require('axios');

const submitToHubSpot = async (data, context) => {
  try {
    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formGuid = process.env.HUBSPOT_FORM_GUID;
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;
    
    // Ensure all values are strings
    const formattedFields = Object.entries(data).map(([name, value]) => ({
      name,
      value: String(value) // Convert all values to strings
    }));

    const formattedData = {
      submittedAt: Date.now(),
      fields: formattedFields,
      context: {
        hutk: context.hutk,
        pageUri: context.pageUri,
        pageName: context.pageName
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: "I agree to allow this website to store and process my personal data."
        }
      }
    };

    const response = await axios.post(url, formattedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw {
        status: error.response.status,
        message: error.response.data.message || 'HubSpot submission failed',
        errors: error.response.data.errors
      };
    } else if (error.request) {
      // The request was made but no response was received
      throw {
        status: 500,
        message: 'No response from HubSpot'
      };
    } else {
      // Something happened in setting up the request
      throw {
        status: 500,
        message: error.message
      };
    }
  }
};

module.exports = {
  submitToHubSpot
}; 