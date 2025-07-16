"use client";

import { useState } from "react";
import type { Step1Data } from "@/types/form";
import { useFormContext } from "@/hook/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info, Facebook, Twitter, Instagram } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const companySizes = [
  {
    value: "small",
    label: "Small (1-10 employees)",
    description: "Small-sized company",
  },
  {
    value: "medium",
    label: "Medium (11-50 employees)",
    description: "Medium-sized company",
  },
  {
    value: "large",
    label: "Large (51+ employees)",
    description: "Large-sized company",
  },
];

const companyTypes = [
  {
    value: "startup",
    label: "Startup",
    description: "A newly established business",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "A large-scale business",
  },
  { value: "Other", label: "Other", description: "Specify your company type" },
];

const industries = [
  { value: "tech", label: "Technology", description: "Tech-related industry" },
  {
    value: "finance",
    label: "Finance",
    description: "Finance-related industry",
  },
  { value: "Other", label: "Other", description: "Specify your industry" },
];

const brandingOptions = [
  {
    value: "basic",
    label: "Basic Branding",
    cost: 100,
    description: "Basic branding package",
  },
  {
    value: "premium",
    label: "Premium Branding",
    cost: 300,
    description: "Premium branding package",
  },
];

const hostingOptions = [
  {
    value: "shared",
    label: "Shared Hosting",
    cost: 50,
    description: "Shared hosting plan",
  },
  {
    value: "dedicated",
    label: "Dedicated Hosting",
    cost: 200,
    description: "Dedicated hosting plan",
  },
];

const languageOptions = [
  {
    value: "en",
    label: "English",
    cost: 0,
    description: "English language support",
  },
  {
    value: "fr",
    label: "French",
    cost: 50,
    description: "French language support",
  },
];
// --- Keep industries, companyTypes, companySizes, brandingOptions, hostingOptions, languageOptions unchanged ---

interface Props {
  onNext: (data: Step1Data) => void;
  formData: Partial<Step1Data>;
}

export default function Step1({ onNext, formData }: Props) {
  const { updateFormData } = useFormContext();
  const [data, setData] = useState<Step1Data>({
    companyName: formData.companyName || "",
    contactName: formData.contactName || "",
    contactEmail: formData.contactEmail || "",
    website: formData.website || "",
    companySize: formData.companySize || "",
    facebookHandle: formData.facebookHandle || "",
    twitterHandle: formData.twitterHandle || "",
    instagramHandle: formData.instagramHandle || "",
    companyType: formData.companyType || "",
    industry: formData.industry || "",
    brandingStatus: formData.brandingStatus || "",
    hostingStatus: formData.hostingStatus || "",
    language: formData.language || "",
    targetAudiences: formData.targetAudiences || [],
    pricing: {
      brandingStatusCost: formData.pricing?.brandingStatusCost || 0,
      hostingStatusCost: formData.pricing?.hostingStatusCost || 0,
      languageCost: formData.pricing?.languageCost || 0,
      totalCost: formData.pricing?.totalCost || 0,
    },
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof Step1Data, string>>
  >({});

  const calculateTotalCost = (pricing: Step1Data["pricing"]): number => {
    return (
      pricing.brandingStatusCost +
      pricing.hostingStatusCost +
      pricing.languageCost
    );
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Step1Data, string>> = {};
    if (!data.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!data.contactName.trim())
      newErrors.contactName = "Contact name is required";
    if (!data.contactEmail.trim()) newErrors.contactEmail = "Email is required";
    if (
      data.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)
    ) {
      newErrors.contactEmail = "Invalid email format";
    }
    if (!data.companyType) newErrors.companyType = "Company type is required";
    if (!data.industry) newErrors.industry = "Industry is required";
    if (!data.language) newErrors.language = "Preferred language is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const step1FormData: Step1Data = {
        ...data,
        pricing: {
          brandingStatusCost: data.pricing.brandingStatusCost,
          hostingStatusCost: data.pricing.hostingStatusCost,
          languageCost: data.pricing.languageCost,
          totalCost: calculateTotalCost(data.pricing),
        },
      };

      updateFormData("step1", step1FormData);
      onNext(step1FormData);
    }
  };

  const handleAddAudience = (newAudience: string) => {
    if (newAudience.trim() && data.targetAudiences.length < 5) {
      const updatedAudiences = [...data.targetAudiences, newAudience.trim()];
      setData({
        ...data,
        targetAudiences: updatedAudiences,
      });
    }
  };

  const handleRemoveAudience = (index: number) => {
    const updatedAudiences = data.targetAudiences.filter((_, i) => i !== index);
    setData({
      ...data,
      targetAudiences: updatedAudiences,
    });
  };

  const isOtherCompany = data.companyType === "Other";
  const isOtherIndustry = data.industry === "Other";

  return (
    <TooltipProvider>
      <div className="bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Client Information
            </h2>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                <p className="text-sm text-gray-700">
                  Provide details about your company and contact information.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Display Total Cost */}
          <div className="flex justify-end">
            <p className="text-sm font-medium text-gray-700">
              Total Cost: ${calculateTotalCost(data.pricing).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="companyName"
                  className="text-sm font-medium text-gray-700"
                >
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      Your company&apos;s official name or brand name.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="companyName"
                className="rounded-md border-gray-300"
                value={data.companyName}
                onChange={(e) =>
                  setData({ ...data, companyName: e.target.value })
                }
              />
              {errors.companyName && (
                <p className="text-xs text-red-500">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="contactName"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Name <span className="text-red-500">*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      The primary contact person&apos;s full name.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="contactName"
                className="rounded-md border-gray-300"
                value={data.contactName}
                onChange={(e) =>
                  setData({ ...data, contactName: e.target.value })
                }
              />
              {errors.contactName && (
                <p className="text-xs text-red-500">{errors.contactName}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="contactEmail"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Email <span className="text-red-500">*</span>
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      The email address for project communication.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="contactEmail"
                type="email"
                className="rounded-md border-gray-300"
                value={data.contactEmail}
                onChange={(e) =>
                  setData({ ...data, contactEmail: e.target.value })
                }
              />
              {errors.contactEmail && (
                <p className="text-xs text-red-500">{errors.contactEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="website"
                  className="text-sm font-medium text-gray-700"
                >
                  Website/Domain
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      Your current website or domain name, if applicable.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="website"
                className="rounded-md border-gray-300"
                value={data.website}
                onChange={(e) => setData({ ...data, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="companySize"
                  className="text-sm font-medium text-gray-700"
                >
                  Company Size
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      The number of employees in your organization.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={data.companySize}
                onValueChange={(val) => {
                  setData({
                    ...data,
                    companySize: val,
                  });
                }}
              >
                <SelectTrigger className="rounded-md border-gray-300">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      <div className="flex items-center gap-2">
                        <span>{size.label}</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                            <p className="text-sm text-gray-700">
                              {size.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="facebookHandle"
                  className="text-sm font-medium text-gray-700"
                >
                  Facebook Profile
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      Your Facebook page or profile username (e.g., mycompany).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">facebook.com/</span>
                <Input
                  id="facebookHandle"
                  className="rounded-md border-gray-300"
                  value={data.facebookHandle}
                  onChange={(e) =>
                    setData({ ...data, facebookHandle: e.target.value })
                  }
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter your Facebook username (optional).
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="twitterHandle"
                  className="text-sm font-medium text-gray-700"
                >
                  Twitter Profile
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      Your Twitter profile handle (e.g., mycompany).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Twitter className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">twitter.com/</span>
                <Input
                  id="twitterHandle"
                  className="rounded-md border-gray-300"
                  value={data.twitterHandle}
                  onChange={(e) =>
                    setData({ ...data, twitterHandle: e.target.value })
                  }
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter your Twitter username (optional).
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="instagramHandle"
                  className="text-sm font-medium text-gray-700"
                >
                  Instagram Profile
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      Your Instagram profile username (e.g., mycompany).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">instagram.com/</span>
                <Input
                  id="instagramHandle"
                  className="rounded-md border-gray-300"
                  value={data.instagramHandle}
                  onChange={(e) =>
                    setData({ ...data, instagramHandle: e.target.value })
                  }
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter your Instagram username (optional).
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Company Type <span className="text-red-500">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    The type of organization or business you operate.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={data.companyType}
              onValueChange={(val) => {
                setData({
                  ...data,
                  companyType: val,
                });
              }}
            >
              <SelectTrigger className="rounded-md border-gray-300">
                <SelectValue placeholder="Select company type" />
              </SelectTrigger>
              <SelectContent>
                {companyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span>{type.label}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                          <p className="text-sm text-gray-700">
                            {type.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.companyType && (
              <p className="text-xs text-red-500">{errors.companyType}</p>
            )}
            {isOtherCompany && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="customCompanyType"
                    className="text-sm font-medium text-gray-700"
                  >
                    Specify Company Type
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                      <p className="text-sm text-gray-700">
                        Describe your company type if not listed above.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Textarea
                  id="customCompanyType"
                  value={data.customCompanyType}
                  onChange={(e) =>
                    setData({ ...data, customCompanyType: e.target.value })
                  }
                  className="rounded-md border-gray-300"
                  placeholder="Tell us more about your company type"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Industry <span className="text-red-500">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    The primary industry your business operates in.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={data.industry}
              onValueChange={(val) => {
                setData({
                  ...data,
                  industry: val,
                });
              }}
            >
              <SelectTrigger className="rounded-md border-gray-300">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind.value} value={ind.value}>
                    <div className="flex items-center gap-2">
                      <span>{ind.label}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                          <p className="text-sm text-gray-700">
                            {ind.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-xs text-red-500">{errors.industry}</p>
            )}
            {isOtherIndustry && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="customIndustry"
                    className="text-sm font-medium text-gray-700"
                  >
                    Specify Industry
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                      <p className="text-sm text-gray-700">
                        Describe your industry if not listed above.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Textarea
                  id="customIndustry"
                  value={data.customIndustry}
                  onChange={(e) =>
                    setData({ ...data, customIndustry: e.target.value })
                  }
                  className="rounded-md border-gray-300"
                  placeholder="What industry are you in?"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Branding Status
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    Your current branding assets and needs.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {brandingOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 p-3 rounded-md border border-gray-200 cursor-pointer transition-colors ${
                    data.brandingStatus === option.value
                      ? "bg-blue-50 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Checkbox
                    checked={data.brandingStatus === option.value}
                    onCheckedChange={() => {
                      const newBrandingStatus =
                        data.brandingStatus === option.value
                          ? ""
                          : option.value;
                      const newBrandingCost =
                        data.brandingStatus === option.value ? 0 : option.cost;
                      const updatedPricing = {
                        ...data.pricing,
                        brandingStatusCost: newBrandingCost,
                        totalCost: calculateTotalCost({
                          ...data.pricing,
                          brandingStatusCost: newBrandingCost,
                        }),
                      };
                      setData({
                        ...data,
                        brandingStatus: newBrandingStatus,
                        pricing: updatedPricing,
                      });
                    }}
                  />
                  <span className="text-sm text-gray-700">
                    {option.label} (${option.cost})
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                      <p className="text-sm text-gray-700">
                        {option.description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Hosting Status
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    Your current domain and hosting setup.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hostingOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 p-3 rounded-md border border-gray-200 cursor-pointer transition-colors ${
                    data.hostingStatus === option.value
                      ? "bg-blue-50 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Checkbox
                    checked={data.hostingStatus === option.value}
                    onCheckedChange={() => {
                      const newHostingStatus =
                        data.hostingStatus === option.value ? "" : option.value;
                      const newHostingCost =
                        data.hostingStatus === option.value ? 0 : option.cost;
                      const updatedPricing = {
                        ...data.pricing,
                        hostingStatusCost: newHostingCost,
                        totalCost: calculateTotalCost({
                          ...data.pricing,
                          hostingStatusCost: newHostingCost,
                        }),
                      };
                      setData({
                        ...data,
                        hostingStatus: newHostingStatus,
                        pricing: updatedPricing,
                      });
                    }}
                  />
                  <span className="text-sm text-gray-700">
                    {option.label} (${option.cost})
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                      <p className="text-sm text-gray-700">
                        {option.description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Preferred Language <span className="text-red-500">*</span>
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    The primary language for your platform and communication.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={data.language}
              onValueChange={(val) => {
                const selectedLanguage = languageOptions.find(
                  (lang) => lang.value === val
                );
                const updatedPricing = {
                  ...data.pricing,
                  languageCost: selectedLanguage?.cost || 0,
                  totalCost: calculateTotalCost({
                    ...data.pricing,
                    languageCost: selectedLanguage?.cost || 0,
                  }),
                };
                setData({
                  ...data,
                  language: val,
                  pricing: updatedPricing,
                });
              }}
            >
              <SelectTrigger className="rounded-md border-gray-300">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <div className="flex items-center gap-2">
                      <span>
                        {lang.label} (${lang.cost})
                      </span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                          <p className="text-sm text-gray-700">
                            {lang.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="text-xs text-red-500">{errors.language}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Target Audiences
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    Add up to 5 target audiences for your platform (e.g.,
                    Technical people, Small businesses).
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-3">
              {data.targetAudiences.length < 5 && (
                <div className="flex items-center gap-2">
                  <Input
                    id="newAudience"
                    className="rounded-md border-gray-300"
                    placeholder="e.g., Technical people"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAudience(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => {
                      const input = document.getElementById(
                        "newAudience"
                      ) as HTMLInputElement;
                      handleAddAudience(input.value);
                      input.value = "";
                    }}
                  >
                    Add
                  </Button>
                </div>
              )}
              {data.targetAudiences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.targetAudiences.map((audience, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      <span>{audience}</span>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveAudience(index)}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Add up to 5 audiences (optional). Press Enter or click Add.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Next Step
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
