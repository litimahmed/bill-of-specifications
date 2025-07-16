"use client";

import { useState, useEffect, useCallback } from "react";
import type { Step4Data } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info, Plus, Trash2, Edit } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "@/hook/FormContext";

// Define types
interface Option {
  value: string;
  label: string;
  price: number;
  description: string;
  tagline: string;
  realExample: string;
}

interface AnalyticsEvent {
  name: string;
  description: string;
  price: number;
}

interface Module {
  id: keyof Omit<Step4Data, "customEvents" | "pricing" | "pricingBreakdown">;
  label: string;
  tooltip: string;
  options: Option[];
}

interface Step4Props {
  onNext: (data: Step4Data) => void;
  onBack: (data: Step4Data) => void;
  formData: Partial<Step4Data> & { pricing?: { totalCost: number } };
}

const CUSTOM_EVENT_PRICE = 300; // $300 per custom analytics event

const modules: Module[] = [
  {
    id: "performance",
    label: "Performance",
    tooltip:
      "Optimize your platform for speed and responsiveness. Fast load times keep buyers engaged.",
    options: [
      {
        value: "none",
        label: "No Performance Optimization",
        price: 0,
        description: "No optimizations; slow load times risk losing buyers.",
        tagline: "Frustrates users.",
        realExample: "Product Pages take 10 seconds to load, buyers leave.",
      },
      {
        value: "lazy_loading",
        label: "Lazy-Loading",
        price: 200,
        description: "Load images and content only when visible.",
        tagline: "Speeds up initial page load.",
        realExample: "Vendor Store images load as buyers scroll.",
      },
      {
        value: "cdn",
        label: "Content Delivery Network (CDN)",
        price: 300,
        description: "Serve assets from servers closer to users.",
        tagline: "Reduces latency globally.",
        realExample: "Constantine vendor pages load fast for Algiers users.",
      },
      {
        value: "minification",
        label: "Code Minification",
        price: 150,
        description: "Compress CSS, JS, and HTML for faster delivery.",
        tagline: "Shrinks file sizes.",
        realExample: "Homepage loads 20% faster after minifying scripts.",
      },
      {
        value: "browser_caching",
        label: "Browser Caching",
        price: 100,
        description: "Store static assets locally on user devices.",
        tagline: "Boosts repeat visits.",
        realExample: "Returning buyers see cached Eid banners instantly.",
      },
    ],
  },
  {
    id: "seo",
    label: "Search Engine Optimization (SEO)",
    tooltip:
      "Improve your platform’s visibility on Google. Great SEO drives more traffic to your marketplace.",
    options: [
      {
        value: "none",
        label: "No SEO",
        price: 0,
        description: "No SEO; platform hard to find on Google.",
        tagline: "Misses potential buyers.",
        realExample: "Searches for ‘Algiers scarves’ don’t show your platform.",
      },
      {
        value: "basic_seo",
        label: "Basic SEO",
        price: 300,
        description: "Meta titles and descriptions for all pages.",
        tagline: "Gets you noticed.",
        realExample: "Homepage ranks for ‘Algiers marketplace’.",
      },
      {
        value: "schema_markup",
        label: "Schema Markup",
        price: 400,
        description: "Structured data for products and vendors.",
        tagline: "Enhances search snippets.",
        realExample: "Product Pages show star ratings in Google results.",
      },
      {
        value: "sitemap",
        label: "XML Sitemap",
        price: 200,
        description: "Map of all pages for search engine crawling.",
        tagline: "Improves indexing.",
        realExample: "Google crawls Vendor Stores more efficiently.",
      },
      {
        value: "alt_tags",
        label: "Image Alt Tags",
        price: 150,
        description: "Descriptive tags for images to boost SEO.",
        tagline: "Ranks images too.",
        realExample: "Oran jewelry images rank in Google Image Search.",
      },
    ],
  },
  {
    id: "security",
    label: "Security",
    tooltip:
      "Protect your platform and users from threats. Strong security builds trust and prevents breaches.",
    options: [
      {
        value: "none",
        label: "No Security",
        price: 0,
        description: "No protections; vulnerable to attacks.",
        tagline: "Risks user data.",
        realExample: "Hackers steal buyer data from unsecured checkout.",
      },
      {
        value: "https",
        label: "HTTPS",
        price: 300,
        description: "Encrypt all data with SSL/TLS.",
        tagline: "Secures all connections.",
        realExample: "CIB payments are encrypted during checkout.",
      },
      {
        value: "two_factor_auth",
        label: "Two-Factor Authentication",
        price: 400,
        description: "Require extra verification for logins.",
        tagline: "Protects accounts.",
        realExample: "Vendors use SMS codes to access their store.",
      },
      {
        value: "data_encryption",
        label: "Data Encryption",
        price: 500,
        description: "Encrypt sensitive data at rest.",
        tagline: "Safeguards buyer info.",
        realExample: "Buyer addresses are encrypted in the database.",
      },
      {
        value: "firewall",
        label: "Web Application Firewall",
        price: 600,
        description: "Block malicious traffic and attacks.",
        tagline: "Prevents hacks.",
        realExample: "Firewall stops DDoS attacks during Eid sales.",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    tooltip:
      "Track user behavior to grow your platform. Analytics help you understand buyers and optimize sales.",
    options: [
      {
        value: "none",
        label: "No Analytics",
        price: 0,
        description: "No tracking; no insights into user behavior.",
        tagline: "Misses growth opportunities.",
        realExample: "No data on why buyers abandon carts.",
      },
      {
        value: "google_analytics",
        label: "Google Analytics",
        price: 200,
        description: "Track page views, sessions, and conversions.",
        tagline: "Industry standard tracking.",
        realExample: "See how many buyers visit Eid sale pages.",
      },
      {
        value: "hotjar",
        label: "Hotjar",
        price: 300,
        description: "Heatmaps and session recordings.",
        tagline: "Visualize user behavior.",
        realExample: "Heatmap shows clicks on Product Page buttons.",
      },
      {
        value: "conversion_tracking",
        label: "Conversion Tracking",
        price: 250,
        description: "Track purchases and signups.",
        tagline: "Measures success.",
        realExample: "Track how many buyers complete Ramadan deal purchases.",
      },
    ],
  },
];

export default function Step4({ onNext, onBack, formData }: Step4Props) {
  const { updateFormData } = useFormContext();

  const [data, setData] = useState<Step4Data>({
    performance: formData.performance || [],
    seo: formData.seo || [],
    security: formData.security || [],
    analytics: formData.analytics || [],
    customEvents: formData.customEvents || [],
    pricing: formData.pricing || {
      totalCost: 0,
      brandingStatusCost: 0,
      hostingStatusCost: 0,
      languageCost: 0,
    },
    pricingBreakdown: formData.pricingBreakdown || {
      performance: {},
      seo: {},
      security: {},
      analytics: {},
      customEvents: {},
    },
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Step4Data, string>>
  >({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customEvent, setCustomEvent] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });
  const [modalErrors, setModalErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const calculateTotalPrice = useCallback((currentData: Step4Data = data) => {
    let step4Total = 0;
    const newPricingBreakdown: Step4Data["pricingBreakdown"] = {
      performance: {},
      seo: {},
      security: {},
      analytics: {},
      customEvents: {},
    };

    // Calculate price for module features
    modules.forEach((module: Module) => {
      const selectedFeatures = currentData[module.id] as string[];
      const moduleBreakdown: { [key: string]: number } = {};
      module.options.forEach((option: Option) => {
        if (selectedFeatures.includes(option.value)) {
          step4Total += option.price;
          moduleBreakdown[option.value] = option.price;
        }
      });
      newPricingBreakdown[module.id] = moduleBreakdown;
    });

    // Calculate price for custom analytics events
    const customEventsBreakdown: { [key: string]: number } = {};
    currentData.customEvents.forEach((event) => {
      step4Total += event.price;
      customEventsBreakdown[event.name] = event.price;
    });
    newPricingBreakdown.customEvents = customEventsBreakdown;

    return { step4Total, newPricingBreakdown };
  }, []);

  useEffect(() => {
    const { step4Total, newPricingBreakdown } = calculateTotalPrice();
    setTotalPrice(step4Total);
    setData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, totalCost: step4Total },
      pricingBreakdown: newPricingBreakdown,
    }));
  }, [formData]); // Only run on formData change

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Step4Data, string>> = {};
    if (!data.security.includes("https")) {
      newErrors.security = "HTTPS is required for a secure platform.";
    }
    if (!data.seo.length) {
      newErrors.seo = "At least one SEO feature (e.g., Basic SEO) is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateModal = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};
    if (!customEvent.name.trim()) {
      newErrors.name = "Event name is required.";
    }
    if (!customEvent.description.trim()) {
      newErrors.description = "Event description is required.";
    }
    setModalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFeatureToggle = (module: Module, value: string): void => {
    const currentFeatures = data[module.id] as string[];
    let newFeatures: string[] = currentFeatures.includes(value)
      ? currentFeatures.filter((v: string) => v !== value)
      : [...currentFeatures, value];

    const noneOption = module.options.find(
      (opt: Option) => opt.price === 0
    )?.value;
    if (
      noneOption &&
      value !== noneOption &&
      !currentFeatures.includes(value)
    ) {
      newFeatures = newFeatures.filter((v: string) => v !== noneOption);
    }
    if (value === noneOption) {
      newFeatures = [noneOption];
    }

    const updatedData = { ...data, [module.id]: newFeatures };
    const { step4Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step4Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step4Total);
    setErrors((prev) => ({ ...prev, [module.id]: undefined }));
  };

  const isNoneOptionDisabled = (module: Module): boolean => {
    const selectedFeatures = data[module.id] as string[];
    return selectedFeatures.some(
      (value: string) =>
        value !== module.options.find((opt: Option) => opt.price === 0)?.value
    );
  };

  const handleAddCustomEvent = (): void => {
    if (!validateModal()) return;

    const newEvent: AnalyticsEvent = {
      name: customEvent.name.trim(),
      description: customEvent.description.trim(),
      price: CUSTOM_EVENT_PRICE,
    };

    let updatedCustomEvents: AnalyticsEvent[];
    if (editingIndex !== null) {
      updatedCustomEvents = data.customEvents!.map(
        (event: AnalyticsEvent, index: number) =>
          index === editingIndex ? newEvent : event
      );
    } else {
      updatedCustomEvents = [...(data.customEvents || []), newEvent];
    }

    const updatedData = { ...data, customEvents: updatedCustomEvents };
    const { step4Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step4Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step4Total);
    setCustomEvent({ name: "", description: "" });
    setModalErrors({});
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleEditCustomEvent = (index: number): void => {
    const event = data.customEvents![index];
    setCustomEvent({
      name: event.name,
      description: event.description,
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteCustomEvent = (index: number): void => {
    const updatedCustomEvents = data.customEvents!.filter(
      (_: AnalyticsEvent, i: number) => i !== index
    );
    const updatedData = { ...data, customEvents: updatedCustomEvents };
    const { step4Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step4Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step4Total);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateForm()) {
      const { step4Total, newPricingBreakdown } = calculateTotalPrice();
      const step4Data: Step4Data = {
        ...data,
        pricing: {
          ...data.pricing,
          totalCost: step4Total, // Ensure totalCost is updated
        },
        pricingBreakdown: newPricingBreakdown,
      };
      updateFormData("step4", step4Data); // Pass updated data to context
      onNext(step4Data); // Pass updated data to the next step
    }
  };

  const calculateModulePrice = (moduleId: keyof Step4Data): number => {
    let modulePrice = 0;
    if (moduleId === "customEvents") {
      modulePrice += (data.customEvents?.length || 0) * CUSTOM_EVENT_PRICE;
    } else {
      const selectedFeatures = data[moduleId] as string[];
      const selectedModule = modules.find((m: Module) => m.id === moduleId);
      selectedModule?.options.forEach((option: Option) => {
        if (selectedFeatures.includes(option.value)) {
          modulePrice += option.price;
        }
      });
    }
    return modulePrice;
  };

  return (
    <TooltipProvider>
      <div className="bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Platform Health
              </h2>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    Optimize your platform’s speed, search visibility, security,
                    and insights. Ensure a fast, discoverable, and safe
                    marketplace.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-lg font-medium text-gray-900">
              Total: ${totalPrice.toLocaleString()}
            </div>
          </div>

          {modules.map((module: Module) => (
            <div key={module.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {module.label}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                      <p className="text-sm text-gray-700">{module.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-sm text-gray-600">
                  Cost: ${calculateModulePrice(module.id)}
                </div>
              </div>
              {errors[module.id] && (
                <p className="text-xs text-red-500">{errors[module.id]}</p>
              )}
              <div className="space-y-3">
                {module.options.map((option: Option) => (
                  <div
                    key={option.value}
                    className={`flex items-start gap-3 p-3 rounded-md border border-gray-200 transition-colors w-full ${
                      (data[module.id] as string[]).includes(option.value)
                        ? "bg-blue-50 border-blue-500" // Selected option styling
                        : "hover:bg-gray-50" // Hover styling
                    }`}
                  >
                    <Checkbox
                      id={`${module.id}-${option.value}`}
                      checked={(data[module.id] as string[]).includes(
                        option.value
                      )}
                      onCheckedChange={() =>
                        handleFeatureToggle(module, option.value)
                      }
                      disabled={
                        option.price === 0 && isNoneOptionDisabled(module)
                      }
                      className={
                        option.price === 0 && isNoneOptionDisabled(module)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`${module.id}-${option.value}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {option.label}{" "}
                        {option.price > 0 ? `($${option.price})` : ""}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </p>
                      <p className="text-xs text-gray-400 italic">
                        {option.tagline}
                      </p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                        <p className="text-sm text-gray-700">
                          {option.realExample}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Custom Analytics Events */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Custom Analytics Events
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      Track specific user actions (e.g., button clicks, form
                      submissions) to gain deeper insights.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-sm text-gray-600">
                Cost: ${calculateModulePrice("customEvents")}
              </div>
            </div>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setCustomEvent({ name: "", description: "" });
                  setEditingIndex(null);
                  setModalErrors({});
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Custom Event ($300)
              </Button>
              {data.customEvents?.length ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Added Custom Events
                  </h3>
                  {data.customEvents.map(
                    (event: AnalyticsEvent, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-md border border-gray-200 bg-gray-50"
                      >
                        <div>
                          <p className="text-sm text-gray-700">{event.name}</p>
                          <p className="text-xs text-gray-500">
                            {event.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCustomEvent(index)}
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCustomEvent(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingIndex !== null
                    ? "Edit Custom Event"
                    : "Add Custom Event"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="event-name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Event Name
                  </Label>
                  <Input
                    id="event-name"
                    value={customEvent.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCustomEvent({ ...customEvent, name: e.target.value })
                    }
                    placeholder="e.g., Add to Cart Click"
                    className="mt-1"
                  />
                  {modalErrors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {modalErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="event-description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="event-description"
                    value={customEvent.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCustomEvent({
                        ...customEvent,
                        description: e.target.value,
                      })
                    }
                    placeholder="e.g., Tracks when buyers click 'Add to Cart' on Product Pages."
                    className="mt-1"
                  />
                  {modalErrors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {modalErrors.description}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddCustomEvent}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editingIndex !== null ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => onBack(data)}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Next Step
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
