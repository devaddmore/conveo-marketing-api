const extractDomainFromEmail = (email) => {
  const domain = email.split('@')[1];
  return domain || null;
};

const getCompanyName = (domain) => {
  const company = domain.split('.')[0];
  return company.charAt(0).toUpperCase() + company.slice(1);
};

const getFavicon = (domain) => {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

module.exports = {
  extractDomainFromEmail,
  getCompanyName,
  getFavicon
}; 