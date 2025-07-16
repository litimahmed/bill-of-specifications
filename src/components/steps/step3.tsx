"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormContext } from "@/hook/FormContext";
import type { Step3Data } from "@/types/form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types
interface Option {
  value: string;
  label: string;
  price: number;
  description: string;
  tagline: string;
  realExample: string;
}

interface CustomPage {
  name: string;
  layout: string;
  price: number;
}

interface Module {
  id: keyof Omit<Step3Data, "pricing" | "pricingBreakdown" | "moduleRoles">;
  label: string;
  tooltip: string;
  options: Option[];
}

interface Step3Props {
  onNext: (data: Step3Data) => void;
  onBack: () => void;
  formData: Partial<Step3Data> & {
    pricing?: {
      brandingStatusCost: number;
      hostingStatusCost: number;
      languageCost: number;
      totalCost: number;
    };
  };
}

const CUSTOM_PAGE_PRICE = 200; // $200 per custom page

const modules: Module[] = [
  {
    id: "globalElements",
    label: "Global Elements",
    tooltip:
      "Add navigation and branding elements that appear across all pages. A consistent layout builds trust and eases navigation.",
    options: [
      {
        value: "none",
        label: "No Global Elements",
        price: 0,
        description: "No navbar, header, or footer; pages feel disconnected.",
        tagline: "Confusing for users.",
        realExample: "Buyers struggle to navigate without a menu.",
      },
      {
        value: "basic_navbar",
        label: "Basic Navbar",
        price: 500,
        description: "Menu with logo, search bar, and login button.",
        tagline: "Guides users easily.",
        realExample: "Buyers search for ‘scarves’ or log in from the top bar.",
      },
      {
        value: "advanced_navbar",
        label: "Advanced Navbar",
        price: 600,
        description: "Adds cart icon, profile link, and category dropdown.",
        tagline: "Perfect for busy marketplaces.",
        realExample: "Buyers click a dropdown to browse ‘Electronics’.",
      },
      {
        value: "sticky_header",
        label: "Sticky Header",
        price: 400,
        description: "Banner or promo that stays visible while scrolling.",
        tagline: "Keeps promotions in view.",
        realExample: "An Eid sale banner stays at the top during browsing.",
      },
      {
        value: "basic_footer",
        label: "Basic Footer",
        price: 400,
        description: "Links to contact, terms, and social media.",
        tagline: "Builds trust with info.",
        realExample: "A footer links to your Algiers contact page.",
      },
      {
        value: "rich_footer",
        label: "Rich Footer",
        price: 500,
        description: "Adds newsletter signup and vendor directory.",
        tagline: "Engages users further.",
        realExample: "Buyers subscribe to Ramadan deals in the footer.",
      },
    ],
  },
  {
    id: "homepage",
    label: "Homepage",
    tooltip:
      "Create a welcoming homepage that draws buyers in. A great homepage boosts engagement and showcases your marketplace.",
    options: [
      {
        value: "none",
        label: "No Homepage",
        price: 0,
        description: "No homepage; generic landing page.",
        tagline: "Confusing for new buyers.",
        realExample:
          "Visitors see a blank page, turning away potential shoppers.",
      },
      {
        value: "basic_homepage",
        label: "Basic Homepage",
        price: 500,
        description: "Logo, search bar, and featured products.",
        tagline: "Good for small marketplaces.",
        realExample: "Buyers see top Algiers scarves on a clean homepage.",
      },
      {
        value: "hero_section",
        label: "Hero Section",
        price: 400,
        description: "Large banner with call-to-action.",
        tagline: "Grabs attention instantly.",
        realExample: "A ‘Shop Now’ banner promotes an Eid sale.",
      },
      {
        value: "category_showcase",
        label: "Category Showcase",
        price: 400,
        description: "Display top categories (e.g., Clothing, Electronics).",
        tagline: "Simplifies browsing.",
        realExample: "Buyers click ‘Jewelry’ to explore products directly.",
      },
      {
        value: "vendor_spotlight",
        label: "Vendor Spotlight",
        price: 400,
        description: "Highlight top vendors.",
        tagline: "Promotes trusted sellers.",
        realExample: "An Oran artisan’s store is featured on the homepage.",
      },
      {
        value: "personalized_content",
        label: "Personalized Content",
        price: 600,
        description: "Show tailored product suggestions.",
        tagline: "Boosts buyer engagement.",
        realExample: "A buyer sees electronics based on past searches.",
      },
    ],
  },
  {
    id: "productPage",
    label: "Product Page",
    tooltip:
      "Design product pages that sell. Clear, attractive pages turn browsers into buyers.",
    options: [
      {
        value: "none",
        label: "No Product Pages",
        price: 0,
        description: "No product pages; products unlisted.",
        tagline: "Prevents sales.",
        realExample: "Buyers can’t view or buy a specific phone.",
      },
      {
        value: "basic_product_page",
        label: "Basic Product Page",
        price: 500,
        description: "Title, price, photo, and buy button.",
        tagline: "Good for simple shops.",
        realExample: "A scarf page shows price and ‘Add to Cart’ button.",
      },
      {
        value: "gallery_layout",
        label: "Gallery Layout",
        price: 400,
        description: "Multiple photos or videos.",
        tagline: "Shows products in detail.",
        realExample: "Buyers swipe through phone images on a product page.",
      },
      {
        value: "review_section",
        label: "Review Section",
        price: 400,
        description: "Show customer reviews and ratings.",
        tagline: "Builds buyer trust.",
        realExample: "A laptop page displays 4-star reviews from buyers.",
      },
      {
        value: "related_products",
        label: "Related Products",
        price: 400,
        description: "Suggest similar items.",
        tagline: "Increases sales.",
        realExample: "A phone page suggests cases and chargers.",
      },
      {
        value: "custom_fields_display",
        label: "Custom Fields Display",
        price: 300,
        description: "Show size, color, etc.",
        tagline: "Perfect for diverse products.",
        realExample: "A dress page lists available sizes and colors.",
      },
    ],
  },
  {
    id: "vendorStore",
    label: "Vendor Store Page",
    tooltip:
      "Give vendors their own shopfront. Great store pages build trust and brand loyalty.",
    options: [
      {
        value: "none",
        label: "No Vendor Pages",
        price: 0,
        description: "No vendor pages; products listed generically.",
        tagline: "Reduces vendor visibility.",
        realExample: "Buyers don’t know which artisan made a scarf.",
      },
      {
        value: "basic_store",
        label: "Basic Store Page",
        price: 500,
        description: "Vendor name, logo, and product grid.",
        tagline: "Good for small vendors.",
        realExample: "An Algiers jeweler’s page shows their earrings.",
      },
      {
        value: "bio_section",
        label: "Bio Section",
        price: 300,
        description: "Vendor story or bio.",
        tagline: "Adds a personal touch.",
        realExample: "A vendor shares their crafting journey.",
      },
      {
        value: "store_reviews",
        label: "Store Reviews",
        price: 400,
        description: "Display vendor ratings.",
        tagline: "Builds buyer confidence.",
        realExample: "Buyers see 4.5 stars for a vendor’s store.",
      },
      {
        value: "custom_banner",
        label: "Custom Banner",
        price: 400,
        description: "Vendor uploads a branded banner.",
        tagline: "Enhances store branding.",
        realExample: "A vendor’s page has a floral banner for their shop.",
      },
      {
        value: "store_filters",
        label: "Store Filters",
        price: 400,
        description: "Filter vendor’s products (e.g., price, category).",
        tagline: "Improves buyer experience.",
        realExample:
          "Buyers filter a vendor’s store for ‘rings under 5000 DZD’.",
      },
    ],
  },
  {
    id: "checkout",
    label: "Checkout Page",
    tooltip:
      "Make buying easy and fast. A smooth checkout page boosts sales and reduces cart abandonment.",
    options: [
      {
        value: "none",
        label: "No Checkout",
        price: 0,
        description: "No checkout; purchases not possible.",
        tagline: "Prevents sales.",
        realExample: "Buyers abandon carts without a checkout page.",
      },
      {
        value: "basic_checkout",
        label: "Basic Checkout",
        price: 500,
        description: "Cart summary, payment, and shipping fields.",
        tagline: "Good for small platforms.",
        realExample: "A buyer enters CIB card details to buy a phone.",
      },
      {
        value: "guest_checkout",
        label: "Guest Checkout",
        price: 400,
        description: "Buy without an account.",
        tagline: "Speeds up purchases.",
        realExample: "A one-time buyer skips signup to purchase.",
      },
      {
        value: "saved_payment_display",
        label: "Saved Payment Display",
        price: 400,
        description: "Show saved cards for speed.",
        tagline: "Encourages repeat buys.",
        realExample: "A buyer selects their saved CIB card to pay.",
      },
      {
        value: "progress_bar",
        label: "Progress Bar",
        price: 300,
        description: "Show checkout steps (cart, shipping, payment).",
        tagline: "Guides buyers clearly.",
        realExample: "Buyers see ‘Step 2: Shipping’ during checkout.",
      },
      {
        value: "upsell_section",
        label: "Upsell Section",
        price: 400,
        description: "Suggest add-ons at checkout.",
        tagline: "Boosts order value.",
        realExample: "A buyer adds a phone case before paying.",
      },
    ],
  },
  {
    id: "customPages",
    label: "Custom Pages",
    tooltip:
      "Add unique pages to tell your story or promote events. Custom pages make your platform stand out.",
    options: [
      {
        value: "none",
        label: "No Custom Pages",
        price: 0,
        description: "No custom pages; standard pages only.",
        tagline: "Limits platform personality.",
        realExample: "No About page, so buyers don’t know your story.",
      },
    ],
  },
];

const layoutOptions = [
  { value: "text_only", label: "Text Only" },
  { value: "text_images", label: "Text + Images" },
  { value: "form", label: "Form" },
  { value: "grid", label: "Product Grid" },
  { value: "banner", label: "Banner + Content" },
  { value: "faq", label: "FAQ" },
  { value: "testimonials", label: "Testimonials" },
  { value: "contact_form", label: "Contact Form" },
  { value: "portfolio", label: "Portfolio" },
  { value: "pricing_table", label: "Pricing Table" },
];

export default function Step3({ onNext, onBack, formData }: Step3Props) {
  const { updateFormData } = useFormContext();
  const [data, setData] = useState<Step3Data>({
    globalElements: formData.globalElements || [],
    homepage: formData.homepage || [],
    productPage: formData.productPage || [],
    vendorStore: formData.vendorStore || [],
    checkout: formData.checkout || [],
    customPages: formData.customPages || [],
    moduleRoles: formData.moduleRoles || {},
    pricing: formData.pricing || {
      brandingStatusCost: 0,
      hostingStatusCost: 0,
      languageCost: 0,
      totalCost: 0,
    },
    pricingBreakdown: formData.pricingBreakdown || {
      globalElements: {},
      homepage: {},
      productPage: {},
      vendorStore: {},
      checkout: {},
      customPages: {},
    },
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Step3Data, string>>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customPage, setCustomPage] = useState<{
    name: string;
    layout: string;
  }>({
    name: "",
    layout: "",
  });
  const [modalErrors, setModalErrors] = useState<{
    name?: string;
    layout?: string;
  }>({});

  const calculateTotalPrice = useCallback((currentData: Step3Data = data) => {
    let step3Total = 0;
    const newPricingBreakdown: Step3Data["pricingBreakdown"] = {
      globalElements: {},
      homepage: {},
      productPage: {},
      vendorStore: {},
      checkout: {},
      customPages: {},
    };

    // Calculate price for module features
    modules.forEach((module) => {
      if (module.id === "customPages") return;
      const selectedFeatures = currentData[module.id] as string[];
      const moduleBreakdown: { [key: string]: number } = {};
      module.options.forEach((option) => {
        if (selectedFeatures.includes(option.value)) {
          step3Total += option.price;
          moduleBreakdown[option.value] = option.price;
        }
      });
      newPricingBreakdown[module.id] = moduleBreakdown;
    });

    // Calculate price for custom pages
    const customPagesBreakdown: { [key: string]: number } = {};
    currentData.customPages.forEach((page) => {
      step3Total += page.price;
      customPagesBreakdown[page.name] = page.price;
    });
    newPricingBreakdown.customPages = customPagesBreakdown;

    return { step3Total, newPricingBreakdown };
  }, []);

  useEffect(() => {
    const { step3Total, newPricingBreakdown } = calculateTotalPrice();
    setTotalPrice(step3Total);
    setData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, totalCost: step3Total },
      pricingBreakdown: newPricingBreakdown,
    }));
  }, [formData, calculateTotalPrice]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Step3Data, string>> = {};
    if (!data.globalElements.length) {
      newErrors.globalElements = "At least one global element is required.";
    }
    if (!data.homepage.length) {
      newErrors.homepage = "At least one homepage feature is required.";
    }
    if (!data.productPage.length) {
      newErrors.productPage = "At least one product page feature is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateModal = () => {
    const newErrors: { name?: string; layout?: string } = {};
    if (!customPage.name.trim()) {
      newErrors.name = "Page name is required.";
    }
    if (!customPage.layout) {
      newErrors.layout = "Layout is required.";
    }
    setModalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFeatureToggle = (module: Module, value: string) => {
    const currentFeatures = data[module.id] as string[];
    let newFeatures = currentFeatures.includes(value)
      ? currentFeatures.filter((v) => v !== value)
      : [...currentFeatures, value];

    const noneOption = module.options.find((opt) => opt.price === 0)?.value;
    if (
      noneOption &&
      value !== noneOption &&
      !currentFeatures.includes(value)
    ) {
      newFeatures = newFeatures.filter((v) => v !== noneOption);
    }
    if (value === noneOption) {
      newFeatures = [noneOption];
    }

    const updatedData = { ...data, [module.id]: newFeatures };
    const { step3Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step3Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step3Total);
    setErrors((prev) => ({ ...prev, [module.id]: undefined }));
  };

  const isNoneOptionDisabled = (module: Module) => {
    const selectedFeatures = data[module.id] as string[];
    return selectedFeatures.some(
      (value) => value !== module.options.find((opt) => opt.price === 0)?.value
    );
  };

  const handleAddCustomPage = () => {
    if (!validateModal()) return;

    const newPage: CustomPage = {
      name: customPage.name.trim(),
      layout: customPage.layout,
      price: CUSTOM_PAGE_PRICE,
    };

    const updatedCustomPages =
      editingIndex !== null
        ? data.customPages.map((page, index) =>
            index === editingIndex ? newPage : page
          )
        : [...data.customPages, newPage];

    const updatedData = { ...data, customPages: updatedCustomPages };
    const { step3Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step3Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step3Total);
    setCustomPage({ name: "", layout: "" });
    setModalErrors({});
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleEditCustomPage = (index: number) => {
    const page = data.customPages[index];
    setCustomPage({
      name: page.name,
      layout: page.layout,
    });
    setEditingIndex(index);
    setModalErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteCustomPage = (index: number) => {
    const updatedData = {
      ...data,
      customPages: data.customPages.filter((_, i) => i !== index),
    };
    const { step3Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step3Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step3Total);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { step3Total, newPricingBreakdown } = calculateTotalPrice();
      const step3Data: Step3Data = {
        ...data,
        pricing: {
          ...data.pricing,
          totalCost: step3Total,
        },
        pricingBreakdown: newPricingBreakdown,
      };
      updateFormData("step3", step3Data);
      onNext(step3Data);
    }
  };

  const calculateModulePrice = (moduleId: keyof Step3Data) => {
    let modulePrice = 0;
    if (moduleId === "customPages") {
      modulePrice = data.customPages.reduce((sum, page) => sum + page.price, 0);
    } else {
      const selectedFeatures = data[moduleId] as string[];
      const selectedModule = modules.find((m) => m.id === moduleId);
      selectedModule?.options.forEach((option) => {
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
                Platform Structure
              </h2>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    Design the pages and global elements of your marketplace.
                    Add features and create a tailored shopping experience.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-lg font-medium text-gray-900">
              Total: ${totalPrice.toLocaleString()}
            </div>
          </div>

          {modules.map((module) => (
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
              {module.id !== "customPages" && (
                <div className="space-y-3">
                  {module.options.map((option) => (
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
              )}
              {module.id === "customPages" && (
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setCustomPage({ name: "", layout: "" });
                      setEditingIndex(null);
                      setModalErrors({});
                      setIsModalOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Custom Page ($200)
                  </Button>
                  {data.customPages.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Added Custom Pages
                      </h3>
                      {data.customPages.map((page, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md border border-gray-200 bg-gray-50"
                        >
                          <div>
                            <p className="text-sm text-gray-700">
                              {page.name} ({page.layout}) - ${page.price}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCustomPage(index)}
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCustomPage(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingIndex !== null
                    ? "Edit Custom Page"
                    : "Add Custom Page"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="page-name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Page Name
                  </Label>
                  <Input
                    id="page-name"
                    value={customPage.name}
                    onChange={(e) =>
                      setCustomPage({ ...customPage, name: e.target.value })
                    }
                    placeholder="e.g., Blog"
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
                    htmlFor="page-layout"
                    className="text-sm font-medium text-gray-700"
                  >
                    Layout
                  </Label>
                  <Select
                    value={customPage.layout}
                    onValueChange={(value) =>
                      setCustomPage({ ...customPage, layout: value })
                    }
                  >
                    <SelectTrigger id="page-layout" className="mt-1">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      {layoutOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {modalErrors.layout && (
                    <p className="text-xs text-red-500 mt-1">
                      {modalErrors.layout}
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
                  onClick={handleAddCustomPage}
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
              onClick={onBack}
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
