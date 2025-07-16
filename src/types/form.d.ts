export interface Pricing {
  brandingStatusCost: number;
  hostingStatusCost: number;
  languageCost: number;
  totalCost: number;
}

export interface Step1Data {
  companyName: string;
  contactName: string;
  contactEmail: string;
  website: string;
  companySize: string;
  facebookHandle: string;
  twitterHandle: string;
  instagramHandle: string;
  companyType: string;
  industry: string;
  brandingStatus: string;
  hostingStatus: string;
  language: string;
  targetAudiences: string[];
  pricing: Pricing;
}

export interface Step2Data {
  authentication: string[];
  userProfiles: string[];
  vendorRegistration: string[];
  productListings: string[];
  searchFiltering: string[];
  categoryManagement: string[];
  userRoles: string[];
  inventoryManagement: string[];
  pricingDiscounts: string[];
  shoppingCart: string[];
  multiLanguage: string[];
  onboardingTutorials: string[];
  dataImportExport: string[];
  customerReviews: string[];
  messagingSystem: string[];
  analyticsDashboards: string[];
  disputeResolution: string[];
  legalCompliance: string[];
  features: string[];
  pricing: Pricing;
  pricingBreakdown: {
    authentication: { [key: string]: number };
    userProfiles: { [key: string]: number };
    vendorRegistration: { [key: string]: number };
    productListings: { [key: string]: number };
    searchFiltering: { [key: string]: number };
    categoryManagement: { dispersions: { [key: string]: number } };
    shoppingCart: { [key: string]: number };
    multiLanguage: { [key: string]: number };
    onboardingTutorials: { [key: string]: number };
    dataImportExport: { [key: string]: number };
    customerReviews: { [key: string]: number };
    messagingSystem: { [key: string]: number };
    analyticsDashboards: { [key: string]: number };
    disputeResolution: { [key: string]: number };
    legalCompliance: { [key: string]: number };
  };
}

export interface Step3Data {
  globalElements: string[];
  homepage: string[];
  productPage: string[];
  vendorStore: string[];
  checkout: string[];
  customPages: { name: string; layout: string; price: number }[];
  moduleRoles: { [key: string]: string[] };
  pricing: Pricing;
  pricingBreakdown: {
    globalElements: { [key: string]: number };
    homepage: { [key: string]: number };
    productPage: { [key: string]: number };
    vendorStore: { [key: string]: number };
    checkout: { [key: string]: number };
    customPages: { [key: string]: number };
  };
}
export interface Step4Data {
  performance: string[];
  seo: string[];
  security: string[];
  analytics: string[];
  customEvents: { name: string; description: string; price: number }[];
  pricing: Pricing;
  pricingBreakdown: {
    performance: { [key: string]: number };
    seo: { [key: string]: number };
    security: { [key: string]: number };
    analytics: { [key: string]: number };
    customEvents: { [key: string]: number };
  };
}

export interface AnalyticsEvent {
  name: string;
  description: string;
  price: number;
}

export interface Step5Data {
  customerSupport: string[];
  maintenance: string[];
  marketing: string[];
  analytics: string[];
  customTickets: CustomTicket[];
  pricing: Pricing;
  pricingBreakdown: {
    customerSupport: { [key: string]: number };
    maintenance: { [key: string]: number };
    marketing: { [key: string]: number };
    analytics: { [key: string]: number };
    customTickets: { [name: string]: number };
  };
}

export interface CustomTicket {
  name: string;
  description: string;
  price: number;
}

export interface SummaryData {
  domain: string;
  launchDate: string;
  betaTesting: boolean;
  pricing: Pricing;
}

export interface FormData {
  pricing: Pricing;
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data; // Add types for step3 when implemented
  step4?: Step4Data;
  step5?: Step5Data;
  summary?: SummaryData;
}
