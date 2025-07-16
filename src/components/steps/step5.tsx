"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormContext } from "@/hook/FormContext";
import type { Step5Data } from "@/types/form";
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

// Define types
interface Option {
  value: string;
  label: string;
  price: number;
  description: string;
  tagline: string;
  realExample: string;
}

interface CustomTicket {
  name: string;
  description: string;
  price: number;
}

interface Module {
  id: keyof Omit<Step5Data, "customTickets" | "pricing" | "pricingBreakdown">;
  label: string;
  tooltip: string;
  options: Option[];
}

interface Step5Props {
  onNext: (data: Step5Data) => void;
  onBack: (data: Step5Data) => void;
  formData: Partial<Step5Data> & { pricing?: { totalCost: number } };
}

const CUSTOM_TICKET_PRICE = 300; // $300 per custom support ticket

const modules: Module[] = [
  {
    id: "customerSupport",
    label: "Customer Support",
    tooltip:
      "Provide support channels for buyers and vendors. Great support builds trust and loyalty.",
    options: [
      {
        value: "none",
        label: "No Support",
        price: 0,
        description: "No support channels; users are on their own.",
        tagline: "Risks user frustration.",
        realExample: "Algiers buyers can’t get help with checkout issues.",
      },
      {
        value: "email_support",
        label: "Email Support",
        price: 200,
        description: "24/7 email support with 24-hour response time.",
        tagline: "Cost-effective help.",
        realExample: "Email support responds to Algiers buyers in 24 hours.",
      },
      {
        value: "live_chat",
        label: "Live Chat",
        price: 300,
        description: "Real-time chat support during business hours.",
        tagline: "Instant assistance.",
        realExample: "Oran vendors chat about store setup issues.",
      },
      {
        value: "phone_support",
        label: "Phone Support",
        price: 500,
        description: "Dedicated phone line for urgent queries.",
        tagline: "Personal touch.",
        realExample: "Phone support helps during Eid sale rushes.",
      },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance Plans",
    tooltip:
      "Keep your platform updated and secure with regular maintenance. Prevents downtime and bugs.",
    options: [
      {
        value: "none",
        label: "No Maintenance",
        price: 0,
        description: "No updates or backups; risks outages.",
        tagline: "Vulnerable to issues.",
        realExample: "Platform crashes during Ramadan sales.",
      },
      {
        value: "basic_maintenance",
        label: "Basic Maintenance",
        price: 300,
        description: "Monthly updates and weekly backups.",
        tagline: "Keeps platform stable.",
        realExample: "Weekly backups save Algiers artisan data.",
      },
      {
        value: "premium_maintenance",
        label: "Premium Maintenance",
        price: 600,
        description: "Weekly updates, daily backups, and priority fixes.",
        tagline: "Maximum reliability.",
        realExample: "Daily backups ensure no data loss during Yennayer.",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing Campaigns",
    tooltip:
      "Promote your platform to attract buyers and vendors. Targeted campaigns drive growth.",
    options: [
      {
        value: "none",
        label: "No Marketing",
        price: 0,
        description: "No campaigns; relies on organic growth.",
        tagline: "Slows user acquisition.",
        realExample: "No ads mean fewer Constantine buyers find you.",
      },
      {
        value: "email_campaigns",
        label: "Email Campaigns",
        price: 400,
        description: "Monthly newsletters and promotions.",
        tagline: "Engages existing users.",
        realExample: "Email promotes Eid deals to Algiers buyers.",
      },
      {
        value: "social_media_ads",
        label: "Social Media Ads",
        price: 600,
        description: "Targeted ads on platforms like Instagram.",
        tagline: "Attracts new users.",
        realExample: "Instagram ads target Oran jewelry shoppers.",
      },
      {
        value: "seo_boost",
        label: "SEO Boost",
        price: 800,
        description: "Ongoing SEO to improve Google rankings.",
        tagline: "Drives organic traffic.",
        realExample: "SEO ranks platform for ‘Algiers marketplace’.",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics Reporting",
    tooltip:
      "Get insights into platform performance with regular reports. Optimize based on data.",
    options: [
      {
        value: "none",
        label: "No Reporting",
        price: 0,
        description: "No reports; no performance insights.",
        tagline: "Misses optimization chances.",
        realExample: "No data on Ramadan deal conversions.",
      },
      {
        value: "weekly_reports",
        label: "Weekly Reports",
        price: 200,
        description: "Weekly summaries of key metrics.",
        tagline: "Keeps you informed.",
        realExample: "Weekly reports show Algiers buyer trends.",
      },
      {
        value: "monthly_reports",
        label: "Monthly Reports",
        price: 300,
        description: "Detailed monthly performance analysis.",
        tagline: "Deep dive into data.",
        realExample: "Monthly reports track Yennayer campaign success.",
      },
      {
        value: "custom_dashboards",
        label: "Custom Dashboards",
        price: 500,
        description: "Real-time dashboards tailored to your needs.",
        tagline: "Live performance tracking.",
        realExample: "Dashboard shows live Eid sale conversions.",
      },
    ],
  },
];

export default function Step5({ onNext, onBack, formData }: Step5Props) {
  const { updateFormData } = useFormContext();

  const [data, setData] = useState<Step5Data>({
    customerSupport: formData.customerSupport || [],
    maintenance: formData.maintenance || [],
    marketing: formData.marketing || [],
    analytics: formData.analytics || [],
    customTickets: formData.customTickets || [],
    pricing: formData.pricing || {
      totalCost: 0,
      brandingStatusCost: 0,
      hostingStatusCost: 0,
      languageCost: 0,
    },
    pricingBreakdown: formData.pricingBreakdown || {
      customerSupport: {},
      maintenance: {},
      marketing: {},
      analytics: {},
      customTickets: {},
    },
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Step5Data, string>>
  >({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customTicket, setCustomTicket] = useState<{
    name: string;
    description: string;
  }>({ name: "", description: "" });
  const [modalErrors, setModalErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const calculateTotalPrice = useCallback((currentData: Step5Data = data) => {
    let step5Total = 0;
    const newPricingBreakdown: Step5Data["pricingBreakdown"] = {
      customerSupport: {},
      maintenance: {},
      marketing: {},
      analytics: {},
      customTickets: {},
    };

    // Calculate price for module features
    modules.forEach((module: Module) => {
      const selectedFeatures = currentData[module.id] as string[];
      const moduleBreakdown: { [key: string]: number } = {};
      module.options.forEach((option: Option) => {
        if (selectedFeatures.includes(option.value)) {
          step5Total += option.price;
          moduleBreakdown[option.value] = option.price;
        }
      });
      newPricingBreakdown[module.id] = moduleBreakdown;
    });

    // Calculate price for custom support tickets
    const customTicketsBreakdown: { [key: string]: number } = {};
    currentData.customTickets.forEach((ticket) => {
      step5Total += ticket.price;
      customTicketsBreakdown[ticket.name] = ticket.price;
    });
    newPricingBreakdown.customTickets = customTicketsBreakdown;

    return { step5Total, newPricingBreakdown };
  }, []);

  useEffect(() => {
    const { step5Total, newPricingBreakdown } = calculateTotalPrice();
    setTotalPrice(step5Total);
    setData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, totalCost: step5Total },
      pricingBreakdown: newPricingBreakdown,
    }));
  }, [formData, calculateTotalPrice]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Step5Data, string>> = {};
    if (!data.customerSupport.length) {
      newErrors.customerSupport = "At least one support option is required.";
    }
    if (!data.maintenance.length) {
      newErrors.maintenance = "At least one maintenance plan is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateModal = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};
    if (!customTicket.name.trim()) {
      newErrors.name = "Ticket name is required.";
    }
    if (!customTicket.description.trim()) {
      newErrors.description = "Ticket description is required.";
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
    const { step5Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step5Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step5Total);
    setErrors((prev) => ({ ...prev, [module.id]: undefined }));
  };

  const isNoneOptionDisabled = (module: Module): boolean => {
    const selectedFeatures = data[module.id] as string[];
    return selectedFeatures.some(
      (value: string) =>
        value !== module.options.find((opt: Option) => opt.price === 0)?.value
    );
  };

  const handleAddCustomTicket = (): void => {
    if (!validateModal()) return;

    const newTicket: CustomTicket = {
      name: customTicket.name.trim(),
      description: customTicket.description.trim(),
      price: CUSTOM_TICKET_PRICE,
    };

    let updatedCustomTickets: CustomTicket[];
    if (editingIndex !== null) {
      updatedCustomTickets = data.customTickets.map(
        (ticket: CustomTicket, index: number) =>
          index === editingIndex ? newTicket : ticket
      );
    } else {
      updatedCustomTickets = [...(data.customTickets || []), newTicket];
    }

    const updatedData = { ...data, customTickets: updatedCustomTickets };
    const { step5Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step5Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step5Total);
    setCustomTicket({ name: "", description: "" });
    setModalErrors({});
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleEditCustomTicket = (index: number): void => {
    const ticket = data.customTickets[index];
    setCustomTicket({
      name: ticket.name,
      description: ticket.description,
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDeleteCustomTicket = (index: number): void => {
    const updatedCustomTickets = data.customTickets.filter(
      (_: CustomTicket, i: number) => i !== index
    );
    const updatedData = { ...data, customTickets: updatedCustomTickets };
    const { step5Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step5Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step5Total);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateForm()) {
      const { step5Total, newPricingBreakdown } = calculateTotalPrice();
      const step5Data: Step5Data = {
        ...data,
        pricing: {
          ...data.pricing,
          totalCost: step5Total,
        },
        pricingBreakdown: newPricingBreakdown,
      };
      updateFormData("step5", step5Data);
      onNext(step5Data);
    }
  };

  const calculateModulePrice = (moduleId: keyof Step5Data): number => {
    let modulePrice = 0;
    if (moduleId === "customTickets") {
      modulePrice += (data.customTickets?.length || 0) * CUSTOM_TICKET_PRICE;
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
                Post-Service Options
              </h2>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    Configure ongoing support, maintenance, marketing, and
                    analytics to keep your marketplace thriving.
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
                        ? "bg-blue-50 border-blue-500"
                        : "hover:bg-gray-50"
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

          {/* Custom Support Tickets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Custom Support Tickets
                </Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <p className="text-sm text-gray-700">
                      Add specific support scenarios (e.g., refund handling) for
                      tailored assistance.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-sm text-gray-600">
                Cost: ${calculateModulePrice("customTickets")}
              </div>
            </div>
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setCustomTicket({ name: "", description: "" });
                  setEditingIndex(null);
                  setModalErrors({});
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Custom Ticket ($300)
              </Button>
              {data.customTickets?.length ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Added Custom Tickets
                  </h3>
                  {data.customTickets.map(
                    (ticket: CustomTicket, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-md border border-gray-200 bg-gray-50"
                      >
                        <div>
                          <p className="text-sm text-gray-700">{ticket.name}</p>
                          <p className="text-xs text-gray-500">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCustomTicket(index)}
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCustomTicket(index)}
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
                    ? "Edit Custom Ticket"
                    : "Add Custom Ticket"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="ticket-name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ticket Name
                  </Label>
                  <Input
                    id="ticket-name"
                    value={customTicket.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCustomTicket({ ...customTicket, name: e.target.value })
                    }
                    placeholder="e.g., Handle Refund Requests"
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
                    htmlFor="ticket-description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="ticket-description"
                    value={customTicket.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setCustomTicket({
                        ...customTicket,
                        description: e.target.value,
                      })
                    }
                    placeholder="e.g., Assist buyers with refund requests during Eid sales."
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
                  onClick={handleAddCustomTicket}
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
              Complete Setup
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
