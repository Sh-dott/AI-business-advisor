/**
 * Security product database - maps product names to URLs and domains
 * Used to generate clickable links with favicon previews in recommendations
 */
const SECURITY_PRODUCTS = {
  // Email Security
  'proofpoint essentials': { url: 'https://www.proofpoint.com/us/products/email-security-and-protection/essentials', domain: 'proofpoint.com', name: 'Proofpoint Essentials' },
  'proofpoint': { url: 'https://www.proofpoint.com', domain: 'proofpoint.com', name: 'Proofpoint' },
  'avanan': { url: 'https://www.avanan.com', domain: 'avanan.com', name: 'Avanan (Check Point)' },
  'mimecast': { url: 'https://www.mimecast.com', domain: 'mimecast.com', name: 'Mimecast' },
  'barracuda': { url: 'https://www.barracuda.com/products/email-protection', domain: 'barracuda.com', name: 'Barracuda' },
  'barracuda email protection': { url: 'https://www.barracuda.com/products/email-protection', domain: 'barracuda.com', name: 'Barracuda Email Protection' },
  'abnormal security': { url: 'https://abnormalsecurity.com', domain: 'abnormalsecurity.com', name: 'Abnormal Security' },
  'ironscales': { url: 'https://ironscales.com', domain: 'ironscales.com', name: 'Ironscales' },
  'perception point': { url: 'https://perception-point.io', domain: 'perception-point.io', name: 'Perception Point' },
  'microsoft defender for office 365': { url: 'https://www.microsoft.com/en-us/security/business/siem-and-xdr/microsoft-defender-office-365', domain: 'microsoft.com', name: 'Microsoft Defender for Office 365' },
  'microsoft defender': { url: 'https://www.microsoft.com/en-us/security/business/microsoft-defender', domain: 'microsoft.com', name: 'Microsoft Defender' },
  'google workspace security': { url: 'https://workspace.google.com/security/', domain: 'google.com', name: 'Google Workspace Security' },
  'tessian': { url: 'https://www.tessian.com', domain: 'tessian.com', name: 'Tessian' },
  'egress': { url: 'https://www.egress.com', domain: 'egress.com', name: 'Egress' },
  'check point harmony email': { url: 'https://www.checkpoint.com/harmony/email-security/', domain: 'checkpoint.com', name: 'Check Point Harmony Email' },
  'check point harmony': { url: 'https://www.checkpoint.com/harmony/', domain: 'checkpoint.com', name: 'Check Point Harmony' },
  'check point': { url: 'https://www.checkpoint.com', domain: 'checkpoint.com', name: 'Check Point' },
  'spamtitan': { url: 'https://www.spamtitan.com', domain: 'spamtitan.com', name: 'SpamTitan' },
  'mailguard': { url: 'https://www.mailguard.com.au', domain: 'mailguard.com.au', name: 'MailGuard' },

  // Identity & Access Management
  'duo security': { url: 'https://duo.com', domain: 'duo.com', name: 'Duo Security (Cisco)' },
  'duo': { url: 'https://duo.com', domain: 'duo.com', name: 'Duo Security' },
  'okta': { url: 'https://www.okta.com', domain: 'okta.com', name: 'Okta' },
  'microsoft authenticator': { url: 'https://www.microsoft.com/en-us/security/mobile-authenticator-app', domain: 'microsoft.com', name: 'Microsoft Authenticator' },
  'google authenticator': { url: 'https://safety.google/authentication/', domain: 'google.com', name: 'Google Authenticator' },
  'authy': { url: 'https://authy.com', domain: 'authy.com', name: 'Authy (Twilio)' },
  '1password': { url: 'https://1password.com/business', domain: '1password.com', name: '1Password' },
  'lastpass': { url: 'https://www.lastpass.com/products/business', domain: 'lastpass.com', name: 'LastPass' },
  'bitwarden': { url: 'https://bitwarden.com/products/business/', domain: 'bitwarden.com', name: 'Bitwarden' },
  'jumpcloud': { url: 'https://jumpcloud.com', domain: 'jumpcloud.com', name: 'JumpCloud' },
  'auth0': { url: 'https://auth0.com', domain: 'auth0.com', name: 'Auth0' },
  'azure ad': { url: 'https://azure.microsoft.com/en-us/products/active-directory', domain: 'microsoft.com', name: 'Azure AD' },
  'microsoft entra': { url: 'https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id', domain: 'microsoft.com', name: 'Microsoft Entra ID' },
  'ping identity': { url: 'https://www.pingidentity.com', domain: 'pingidentity.com', name: 'Ping Identity' },
  'keeper': { url: 'https://www.keepersecurity.com/business.html', domain: 'keepersecurity.com', name: 'Keeper Security' },
  'dashlane': { url: 'https://www.dashlane.com/business', domain: 'dashlane.com', name: 'Dashlane Business' },
  'yubikey': { url: 'https://www.yubico.com', domain: 'yubico.com', name: 'YubiKey' },
  'yubico': { url: 'https://www.yubico.com', domain: 'yubico.com', name: 'Yubico' },

  // Security Awareness Training
  'knowbe4': { url: 'https://www.knowbe4.com', domain: 'knowbe4.com', name: 'KnowBe4' },
  'cofense': { url: 'https://cofense.com', domain: 'cofense.com', name: 'Cofense' },
  'cofense phishme': { url: 'https://cofense.com/product-services/phishme/', domain: 'cofense.com', name: 'Cofense PhishMe' },
  'proofpoint security awareness': { url: 'https://www.proofpoint.com/us/products/security-awareness-training', domain: 'proofpoint.com', name: 'Proofpoint Security Awareness' },
  'sans security awareness': { url: 'https://www.sans.org/security-awareness-training/', domain: 'sans.org', name: 'SANS Security Awareness' },
  'sans': { url: 'https://www.sans.org', domain: 'sans.org', name: 'SANS Institute' },
  'ninjio': { url: 'https://ninjio.com', domain: 'ninjio.com', name: 'NINJIO' },
  'hoxhunt': { url: 'https://www.hoxhunt.com', domain: 'hoxhunt.com', name: 'Hoxhunt' },
  'curricula': { url: 'https://www.curricula.com', domain: 'curricula.com', name: 'Curricula' },
  'usecure': { url: 'https://www.usecure.io', domain: 'usecure.io', name: 'usecure' },
  'terranova security': { url: 'https://terranovasecurity.com', domain: 'terranovasecurity.com', name: 'Terranova Security' },

  // Incident Response / SIEM / EDR
  'crowdstrike': { url: 'https://www.crowdstrike.com', domain: 'crowdstrike.com', name: 'CrowdStrike' },
  'crowdstrike falcon': { url: 'https://www.crowdstrike.com/platform/', domain: 'crowdstrike.com', name: 'CrowdStrike Falcon' },
  'sentinelone': { url: 'https://www.sentinelone.com', domain: 'sentinelone.com', name: 'SentinelOne' },
  'huntress': { url: 'https://www.huntress.com', domain: 'huntress.com', name: 'Huntress' },
  'splunk': { url: 'https://www.splunk.com', domain: 'splunk.com', name: 'Splunk' },
  'cisa': { url: 'https://www.cisa.gov/incident-response', domain: 'cisa.gov', name: 'CISA' },
  'pagerduty': { url: 'https://www.pagerduty.com', domain: 'pagerduty.com', name: 'PagerDuty' },
  'opsgenie': { url: 'https://www.atlassian.com/software/opsgenie', domain: 'atlassian.com', name: 'Opsgenie' },
  'arctic wolf': { url: 'https://arcticwolf.com', domain: 'arcticwolf.com', name: 'Arctic Wolf' },
  'sophos': { url: 'https://www.sophos.com', domain: 'sophos.com', name: 'Sophos' },
  'sophos mdr': { url: 'https://www.sophos.com/en-us/products/managed-detection-and-response', domain: 'sophos.com', name: 'Sophos MDR' },
  'malwarebytes': { url: 'https://www.malwarebytes.com/business', domain: 'malwarebytes.com', name: 'Malwarebytes' },
  'bitdefender': { url: 'https://www.bitdefender.com/business/', domain: 'bitdefender.com', name: 'Bitdefender' },
  'norton': { url: 'https://us.norton.com/products/small-business', domain: 'norton.com', name: 'Norton Small Business' },

  // DNS / Web Security
  'cloudflare': { url: 'https://www.cloudflare.com', domain: 'cloudflare.com', name: 'Cloudflare' },
  'cisco umbrella': { url: 'https://umbrella.cisco.com', domain: 'umbrella.cisco.com', name: 'Cisco Umbrella' },
  'dnsfilter': { url: 'https://www.dnsfilter.com', domain: 'dnsfilter.com', name: 'DNSFilter' },

  // Backup
  'veeam': { url: 'https://www.veeam.com', domain: 'veeam.com', name: 'Veeam' },
  'acronis': { url: 'https://www.acronis.com', domain: 'acronis.com', name: 'Acronis' },
  'datto': { url: 'https://www.datto.com', domain: 'datto.com', name: 'Datto' },

  // Communication Security
  'slack': { url: 'https://slack.com', domain: 'slack.com', name: 'Slack' },
  'microsoft teams': { url: 'https://www.microsoft.com/en-us/microsoft-teams/group-chat-software', domain: 'microsoft.com', name: 'Microsoft Teams' },
  'signal': { url: 'https://signal.org', domain: 'signal.org', name: 'Signal' }
};

/**
 * Look up a product by name (case-insensitive, fuzzy match)
 * Returns { url, domain, name } or null
 */
export function lookupProduct(productName) {
  if (!productName || typeof productName !== 'string') return null;

  const normalized = productName.toLowerCase().trim();

  // Exact match
  if (SECURITY_PRODUCTS[normalized]) {
    return SECURITY_PRODUCTS[normalized];
  }

  // Partial match - check if any key is contained in the product name or vice versa
  for (const [key, value] of Object.entries(SECURITY_PRODUCTS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  return null;
}

/**
 * Get favicon URL for a domain
 */
export function getFaviconUrl(domain, size = 32) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

export default SECURITY_PRODUCTS;
