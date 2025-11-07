export interface Country {
  code: string
  name: string
  phoneCode: string
}

/**
 * African countries with phone codes (used by onboarding UI)
 * Keep this list canonical and import where needed.
 */
export const AFRICAN_COUNTRIES: Country[] = [
  { code: "DZ", name: "Algeria", phoneCode: "+213" },
  { code: "AO", name: "Angola", phoneCode: "+244" },
  { code: "BJ", name: "Benin", phoneCode: "+229" },
  { code: "BW", name: "Botswana", phoneCode: "+267" },
  { code: "BF", name: "Burkina Faso", phoneCode: "+226" },
  { code: "BI", name: "Burundi", phoneCode: "+257" },
  { code: "CM", name: "Cameroon", phoneCode: "+237" },
  { code: "CV", name: "Cape Verde", phoneCode: "+238" },
  { code: "CF", name: "Central African Republic", phoneCode: "+236" },
  { code: "TD", name: "Chad", phoneCode: "+235" },
  { code: "KM", name: "Comoros", phoneCode: "+269" },
  { code: "CG", name: "Congo", phoneCode: "+242" },
  { code: "CD", name: "DR Congo", phoneCode: "+243" },
  { code: "DJ", name: "Djibouti", phoneCode: "+253" },
  { code: "EG", name: "Egypt", phoneCode: "+20" },
  { code: "GQ", name: "Equatorial Guinea", phoneCode: "+240" },
  { code: "ER", name: "Eritrea", phoneCode: "+291" },
  { code: "ET", name: "Ethiopia", phoneCode: "+251" },
  { code: "GA", name: "Gabon", phoneCode: "+241" },
  { code: "GM", name: "Gambia", phoneCode: "+220" },
  { code: "GH", name: "Ghana", phoneCode: "+233" },
  { code: "GN", name: "Guinea", phoneCode: "+224" },
  { code: "GW", name: "Guinea-Bissau", phoneCode: "+245" },
  { code: "KE", name: "Kenya", phoneCode: "+254" },
  { code: "LS", name: "Lesotho", phoneCode: "+266" },
  { code: "LR", name: "Liberia", phoneCode: "+231" },
  { code: "LY", name: "Libya", phoneCode: "+218" },
  { code: "MG", name: "Madagascar", phoneCode: "+261" },
  { code: "MW", name: "Malawi", phoneCode: "+265" },
  { code: "ML", name: "Mali", phoneCode: "+223" },
  { code: "MR", name: "Mauritania", phoneCode: "+222" },
  { code: "MU", name: "Mauritius", phoneCode: "+230" },
  { code: "MA", name: "Morocco", phoneCode: "+212" },
  { code: "MZ", name: "Mozambique", phoneCode: "+258" },
  { code: "NA", name: "Namibia", phoneCode: "+264" },
  { code: "NE", name: "Niger", phoneCode: "+227" },
  { code: "NG", name: "Nigeria", phoneCode: "+234" },
  { code: "RW", name: "Rwanda", phoneCode: "+250" },
  { code: "ST", name: "São Tomé and Príncipe", phoneCode: "+239" },
  { code: "SN", name: "Senegal", phoneCode: "+220" },
  { code: "SC", name: "Seychelles", phoneCode: "+248" },
  { code: "SL", name: "Sierra Leone", phoneCode: "+232" },
  { code: "SO", name: "Somalia", phoneCode: "+252" },
  { code: "ZA", name: "South Africa", phoneCode: "+27" },
  { code: "SS", name: "South Sudan", phoneCode: "+211" },
  { code: "SD", name: "Sudan", phoneCode: "+249" },
  { code: "SZ", name: "Eswatini", phoneCode: "+268" },
  { code: "TZ", name: "Tanzania", phoneCode: "+255" },
  { code: "TG", name: "Togo", phoneCode: "+228" },
  { code: "TN", name: "Tunisia", phoneCode: "+216" },
  { code: "UG", name: "Uganda", phoneCode: "+256" },
  { code: "ZM", name: "Zambia", phoneCode: "+260" },
  { code: "ZW", name: "Zimbabwe", phoneCode: "+263" },
]

/** Get country by ISO code (case-insensitive) */
export function getCountryByCode(code?: string): Country | undefined {
  if (!code) return undefined
  return AFRICAN_COUNTRIES.find(c => c.code.toLowerCase() === code.toLowerCase())
}

/** Get country by name (case-insensitive) */
export function getCountryByName(name?: string): Country | undefined {
  if (!name) return undefined
  return AFRICAN_COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase())
}

/** Get phone code for a country code, fallback to first entry if not found */
export function getPhoneCodeFor(code?: string): string {
  const c = getCountryByCode(code) || AFRICAN_COUNTRIES[0]
  return c.phoneCode
}

export default AFRICAN_COUNTRIES
