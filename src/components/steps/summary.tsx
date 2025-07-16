import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

// Define modules for Step 3 to map values to labels and prices
const step3Modules = [
  {
    id: "globalElements",
    label: "Global Elements",
    options: [
      { value: "none", label: "No Global Elements", price: 0 },
      { value: "basic_navbar", label: "Basic Navbar", price: 500 },
      { value: "advanced_navbar", label: "Advanced Navbar", price: 600 },
      { value: "sticky_header", label: "Sticky Header", price: 400 },
      { value: "basic_footer", label: "Basic Footer", price: 400 },
      { value: "rich_footer", label: "Rich Footer", price: 500 },
    ],
  },
  {
    id: "homepage",
    label: "Homepage",
    options: [
      { value: "none", label: "No Homepage", price: 0 },
      { value: "basic_homepage", label: "Basic Homepage", price: 500 },
      { value: "hero_section", label: "Hero Section", price: 400 },
      { value: "category_showcase", label: "Category Showcase", price: 400 },
      { value: "vendor_spotlight", label: "Vendor Spotlight", price: 400 },
      {
        value: "personalized_content",
        label: "Personalized Content",
        price: 600,
      },
    ],
  },
  {
    id: "productPage",
    label: "Product Page",
    options: [
      { value: "none", label: "No Product Pages", price: 0 },
      { value: "basic_product_page", label: "Basic Product Page", price: 500 },
      { value: "gallery_layout", label: "Gallery Layout", price: 400 },
      { value: "review_section", label: "Review Section", price: 400 },
      { value: "related_products", label: "Related Products", price: 400 },
      {
        value: "custom_fields_display",
        label: "Custom Fields Display",
        price: 300,
      },
    ],
  },
  {
    id: "vendorStore",
    label: "Vendor Store Page",
    options: [
      { value: "none", label: "No Vendor Pages", price: 0 },
      { value: "basic_store", label: "Basic Store Page", price: 500 },
      { value: "bio_section", label: "Bio Section", price: 300 },
      { value: "store_reviews", label: "Store Reviews", price: 400 },
      { value: "custom_banner", label: "Custom Banner", price: 400 },
      { value: "store_filters", label: "Store Filters", price: 400 },
    ],
  },
  {
    id: "checkout",
    label: "Checkout Page",
    options: [
      { value: "none", label: "No Checkout", price: 0 },
      { value: "basic_checkout", label: "Basic Checkout", price: 500 },
      { value: "guest_checkout", label: "Guest Checkout", price: 400 },
      {
        value: "saved_payment_display",
        label: "Saved Payment Display",
        price: 400,
      },
      { value: "progress_bar", label: "Progress Bar", price: 300 },
      { value: "upsell_section", label: "Upsell Section", price: 400 },
    ],
  },
  {
    id: "customPages",
    label: "Custom Pages",
    options: [{ value: "none", label: "No Custom Pages", price: 0 }],
  },
];

// Define modules for Step 4 to map values to labels and prices
const step4Modules = [
  {
    id: "performance",
    label: "Performance",
    options: [
      { value: "none", label: "No Performance Optimization", price: 0 },
      { value: "lazy_loading", label: "Lazy-Loading", price: 200 },
      { value: "cdn", label: "Content Delivery Network (CDN)", price: 300 },
      { value: "minification", label: "Code Minification", price: 150 },
      { value: "browser_caching", label: "Browser Caching", price: 100 },
    ],
  },
  {
    id: "seo",
    label: "SEO",
    options: [
      { value: "none", label: "No SEO", price: 0 },
      { value: "basic_seo", label: "Basic SEO", price: 300 },
      { value: "schema_markup", label: "Schema Markup", price: 400 },
      { value: "sitemap", label: "XML Sitemap", price: 200 },
      { value: "alt_tags", label: "Image Alt Tags", price: 150 },
    ],
  },
  {
    id: "security",
    label: "Security",
    options: [
      { value: "none", label: "No Security", price: 0 },
      { value: "https", label: "HTTPS", price: 300 },
      {
        value: "two_factor_auth",
        label: "Two-Factor Authentication",
        price: 400,
      },
      { value: "data_encryption", label: "Data Encryption", price: 500 },
      { value: "firewall", label: "Web Application Firewall", price: 600 },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    options: [
      { value: "none", label: "No Analytics", price: 0 },
      { value: "google_analytics", label: "Google Analytics", price: 200 },
      { value: "hotjar", label: "Hotjar", price: 300 },
      {
        value: "conversion_tracking",
        label: "Conversion Tracking",
        price: 250,
      },
    ],
  },
];

// Define modules for Step 5 to map values to labels and prices
const step5Modules = [
  {
    id: "customerSupport",
    label: "Customer Support",
    options: [
      { value: "none", label: "No Support", price: 0 },
      { value: "email_support", label: "Email Support", price: 200 },
      { value: "live_chat", label: "Live Chat", price: 300 },
      { value: "phone_support", label: "Phone Support", price: 500 },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance Plans",
    options: [
      { value: "none", label: "No Maintenance", price: 0 },
      { value: "basic_maintenance", label: "Basic Maintenance", price: 300 },
      {
        value: "premium_maintenance",
        label: "Premium Maintenance",
        price: 600,
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing Campaigns",
    options: [
      { value: "none", label: "No Marketing", price: 0 },
      { value: "email_campaigns", label: "Email Campaigns", price: 400 },
      { value: "social_media_ads", label: "Social Media Ads", price: 600 },
      { value: "seo_boost", label: "SEO Boost", price: 800 },
    ],
  },
  {
    id: "analytics",
    label: "Analytics Reporting",
    options: [
      { value: "none", label: "No Reporting", price: 0 },
      { value: "weekly_reports", label: "Weekly Reports", price: 200 },
      { value: "monthly_reports", label: "Monthly Reports", price: 300 },
      { value: "custom_dashboards", label: "Custom Dashboards", price: 500 },
    ],
  },
];

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

export interface Step5Data {
  customerSupport: string[];
  maintenance: string[];
  marketing: string[];
  analytics: string[];
  customTickets: { name: string; description: string; price: number }[];
  pricing: Pricing;
  pricingBreakdown: {
    customerSupport: { [key: string]: number };
    maintenance: { [key: string]: number };
    marketing: { [key: string]: number };
    analytics: { [key: string]: number };
    customTickets: { [key: string]: number };
  };
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
  step3?: Step3Data;
  step4?: Step4Data;
  step5?: Step5Data;
  summary?: SummaryData;
}

interface SummaryProps {
  formData: FormData;
}

export default function Summary({ formData }: SummaryProps) {
  const [expandedSteps, setExpandedSteps] = useState<{
    [key: string]: boolean;
  }>({
    step1: true,
    step2: true,
    step3: true,
    step4: true,
    step5: true,
    summary: true,
  });

  const toggleStep = (stepKey: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const calculateStepCost = (
    stepData:
      | Step2Data
      | Step3Data
      | Step4Data
      | Step5Data
      | SummaryData
      | undefined,
    stepKey: string
  ): number => {
    if (!stepData || !stepData.pricingBreakdown) return 0;
    let total = 0;

    if (stepKey === "step2") {
      const { pricingBreakdown } = stepData as Step2Data;
      Object.values(pricingBreakdown).forEach((category) => {
        if ("dispersions" in category) {
          Object.values(category.dispersions).forEach((price: number) => {
            total += price;
          });
        } else {
          Object.values(category).forEach((price: number) => {
            total += price;
          });
        }
      });
    } else if (
      stepKey === "step3" ||
      stepKey === "step4" ||
      stepKey === "step5"
    ) {
      const { pricingBreakdown } = stepData as
        | Step3Data
        | Step4Data
        | Step5Data;
      Object.values(pricingBreakdown).forEach(
        (module: { [key: string]: number }) => {
          Object.values(module).forEach((price: number) => {
            total += price;
          });
        }
      );
    }

    return total;
  };

  const calculateTotalCost = (): number => {
    let total = 0;
    total += formData.step1?.pricing.brandingStatusCost ?? 0;
    total += formData.step1?.pricing.hostingStatusCost ?? 0;
    total += formData.step1?.pricing.languageCost ?? 0;
    total += calculateStepCost(formData.step2, "step2");
    total += calculateStepCost(formData.step3, "step3");
    total += calculateStepCost(formData.step4, "step4");
    total += calculateStepCost(formData.step5, "step5");
    return total;
  };

  const renderStepData = (
    stepKey: string,
    stepData:
      | Step1Data
      | Step2Data
      | Step3Data
      | Step4Data
      | Step5Data
      | SummaryData
      | undefined
  ) => {
    if (!stepData) return null;

    const isExpanded = expandedSteps[stepKey] ?? true;

    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-6">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleStep(stepKey)}
        >
          <h3 className="text-xl font-bold text-gray-900 capitalize">
            {stepKey === "step1"
              ? "Client Information"
              : stepKey === "step2"
              ? "Project Details"
              : stepKey === "step3"
              ? "Design Preferences"
              : stepKey === "step4"
              ? "Technical Requirements"
              : stepKey === "step5"
              ? "Support & Maintenance"
              : "Summary"}
          </h3>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {isExpanded && (
          <div className="mt-4 text-gray-700">
            {stepKey === "step1" ? (
              <ul className="space-y-2">
                {Object.entries(stepData as Step1Data).map(([key, value]) => {
                  if (key === "pricing" || key === "targetAudiences")
                    return null;
                  return (
                    <li key={key}>
                      <strong className="font-semibold">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        :
                      </strong>{" "}
                      {typeof value === "string" ? value : ""}
                    </li>
                  );
                })}
                {(stepData as Step1Data).targetAudiences && (
                  <li>
                    <strong className="font-semibold">Target Audiences:</strong>{" "}
                    {(stepData as Step1Data).targetAudiences.join(", ")}
                  </li>
                )}
              </ul>
            ) : stepKey === "step3" ||
              stepKey === "step4" ||
              stepKey === "step5" ? (
              <div className="space-y-4">
                {Object.entries(
                  stepData as Step3Data | Step4Data | Step5Data
                ).map(([key, value]) => {
                  if (key === "pricing" || key === "pricingBreakdown")
                    return null;

                  const modules =
                    stepKey === "step3"
                      ? step3Modules
                      : stepKey === "step4"
                      ? step4Modules
                      : step5Modules;
                  const stepModule = modules.find((m) => m.id === key);

                  if (
                    key === "customPages" ||
                    key === "customEvents" ||
                    key === "customTickets"
                  ) {
                    const items = value as {
                      name: string;
                      layout?: string;
                      description?: string;
                      price: number;
                    }[];
                    if (!items || items.length === 0) return null;

                    return (
                      <div key={key} className="space-y-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {key === "customPages"
                            ? "Custom Pages"
                            : key === "customEvents"
                            ? "Custom Events"
                            : "Custom Tickets"}
                        </h4>
                        <div className="ml-4 space-y-2">
                          {items.map((item, index) => (
                            <div key={index} className="text-gray-600">
                              <p className="text-sm">
                                <span className="font-medium">Name:</span>{" "}
                                {item.name}
                              </p>
                              {item.layout && (
                                <p className="text-sm">
                                  <span className="font-medium">Layout:</span>{" "}
                                  {item.layout}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-sm">
                                  <span className="font-medium">
                                    Description:
                                  </span>{" "}
                                  {item.description}
                                </p>
                              )}
                              <p className="text-sm">
                                <span className="font-medium">Price:</span> $
                                {item.price.toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (key === "moduleRoles" && stepKey === "step3") {
                    const moduleRoles = value as { [key: string]: string[] };
                    if (!moduleRoles || Object.keys(moduleRoles).length === 0)
                      return null;
                    return (
                      <div key={key} className="space-y-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Module Roles
                        </h4>
                        <div className="ml-4 space-y-1">
                          {Object.entries(moduleRoles).map(
                            ([moduleKey, roles]) => (
                              <p
                                key={moduleKey}
                                className="text-sm text-gray-600"
                              >
                                - {moduleKey}: {roles.join(", ")}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (!stepModule || !Array.isArray(value)) return null;

                  const selectedOptions = (value as string[])
                    .filter((item) => item !== "none")
                    .map((item) => {
                      const option = stepModule.options.find(
                        (opt) => opt.value === item
                      );
                      return option
                        ? { label: option.label, price: option.price }
                        : null;
                    })
                    .filter(
                      (opt): opt is { label: string; price: number } =>
                        opt !== null
                    );

                  if (selectedOptions.length === 0) return null;

                  return (
                    <div key={key} className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {stepModule.label}
                      </h4>
                      <div className="ml-4 space-y-1">
                        {selectedOptions.map((option, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            - {option.label}: ${option.price.toLocaleString()}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : stepKey === "step2" ? (
              <div className="space-y-4">
                {Object.entries(stepData as Step2Data).map(([key, value]) => {
                  if (
                    key === "pricing" ||
                    key === "pricingBreakdown" ||
                    key === "features"
                  )
                    return null;
                  if (!Array.isArray(value)) return null;
                  if (value.length === 0) return null;

                  return (
                    <div key={key} className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </h4>
                      <div className="ml-4 space-y-1">
                        {value.map((item: string, index: number) => {
                          const price =
                            (stepData as Step2Data).pricingBreakdown?.[key]?.[
                              item
                            ] ||
                            ((stepData as Step2Data).pricingBreakdown?.[key]
                              ?.dispersions?.[item] ??
                              0);
                          return (
                            <p key={index} className="text-sm text-gray-600">
                              - {item}: ${price.toLocaleString()}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <ul className="space-y-2">
                {Object.entries(stepData as SummaryData).map(([key, value]) => {
                  if (key === "pricing") return null;
                  return (
                    <li key={key}>
                      <strong className="font-semibold">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        :
                      </strong>{" "}
                      {typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : value}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Project Summary</h2>
      {formData.step1 && renderStepData("step1", formData.step1)}
      {formData.step2 && renderStepData("step2", formData.step2)}
      {formData.step3 && renderStepData("step3", formData.step3)}
      {formData.step4 && renderStepData("step4", formData.step4)}
      {formData.step5 && renderStepData("step5", formData.step5)}
      {formData.summary && renderStepData("summary", formData.summary)}
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold text-gray-900">Pricing Summary</h3>
        <ul className="mt-4 space-y-2 text-gray-700">
          <li>
            <strong className="font-semibold">Branding Status Cost:</strong> $
            {formData.step1?.pricing.brandingStatusCost.toLocaleString() ?? 0}
          </li>
          <li>
            <strong className="font-semibold">Hosting Status Cost:</strong> $
            {formData.step1?.pricing.hostingStatusCost.toLocaleString() ?? 0}
          </li>
          <li>
            <strong className="font-semibold">Language Cost:</strong> $
            {formData.step1?.pricing.languageCost.toLocaleString() ?? 0}
          </li>
          <li>
            <strong className="font-semibold">Step 2 Features Cost:</strong> $
            {calculateStepCost(formData.step2, "step2").toLocaleString()}
          </li>
          <li>
            <strong className="font-semibold">Step 3 Features Cost:</strong> $
            {calculateStepCost(formData.step3, "step3").toLocaleString()}
          </li>
          <li>
            <strong className="font-semibold">Step 4 Features Cost:</strong> $
            {calculateStepCost(formData.step4, "step4").toLocaleString()}
          </li>
          <li>
            <strong className="font-semibold">Step 5 Features Cost:</strong> $
            {calculateStepCost(formData.step5, "step5").toLocaleString()}
          </li>
          <li>
            <strong className="font-semibold">Total Cost:</strong> $
            {calculateTotalCost().toLocaleString()}
          </li>
        </ul>
      </div>
    </div>
  );
}
