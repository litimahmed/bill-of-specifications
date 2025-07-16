"use client";

import { useState, useEffect, useCallback } from "react";
import { useFormContext } from "@/hook/FormContext";
import type { Step2Data } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the Module type
interface ModuleOption {
  value: string;
  label: string;
  price: number;
  description: string;
  tagline: string;
  realExample: string;
}

interface Module {
  id: keyof Omit<Step2Data, "pricing" | "pricingBreakdown" | "features">;
  label: string;
  tooltip: string;
  options: ModuleOption[];
}

interface Step2Props {
  onNext: (data: Step2Data) => void;
  onBack: (data: Step2Data) => void;
  formData: Partial<Step2Data> & { pricing?: { totalCost: number } };
}

const modules: Module[] = [
  {
    id: "authentication",
    label: "User Authentication",
    tooltip:
      "Give customers secure and easy ways to log into your marketplace. Strong authentication builds trust.",
    options: [
      {
        value: "anonymous",
        label: "No Authentication",
        price: 0,
        description: "Visitors browse without logging in.",
        tagline: "Good for simple browsing platforms.",
        realExample:
          "Customers explore your catalog without creating an account, like a guest browsing a store.",
      },
      {
        value: "email_login",
        label: "Email & Password Login",
        price: 500,
        description: "Classic login with name and email profile.",
        tagline: "Perfect for secure customer accounts.",
        realExample:
          "A shopper signs up with their email to save their cart and track orders.",
      },
      {
        value: "social_login",
        label: "Social Media Login",
        price: 600,
        description: "Sign in with Google, Facebook, or Twitter.",
        tagline: "Makes signup quick and familiar.",
        realExample:
          "A customer logs in with their Google account to start shopping instantly.",
      },
      {
        value: "two_factor_auth",
        label: "Two-Factor Authentication",
        price: 400,
        description: "Adds email/SMS verification for extra security.",
        tagline: "Keeps accounts safe from hackers.",
        realExample:
          "A user receives an SMS code to verify their login, protecting their account.",
      },
      {
        value: "sso",
        label: "Single Sign-On (SSO)",
        price: 700,
        description: "Login once to access multiple services.",
        tagline: "Great for platforms with partner apps.",
        realExample:
          "A vendor logs into your marketplace and a partner analytics tool with one click.",
      },
    ],
  },
  {
    id: "userProfiles",
    label: "User Profiles",
    tooltip:
      "Let customers personalize their shopping experience with profiles. Great profiles encourage repeat visits.",
    options: [
      {
        value: "none",
        label: "No Profiles",
        price: 0,
        description: "Users have no personal profiles or saved info.",
        tagline: "Fine for anonymous shopping.",
        realExample:
          "Shoppers buy without saving any personal details, like a one-time purchase.",
      },
      {
        value: "basic_profiles",
        label: "Basic Profiles",
        price: 300,
        description: "Store name and email for user accounts.",
        tagline: "Good for simple personalization.",
        realExample:
          "A customer’s account shows their name and email for order confirmations.",
      },
      {
        value: "rich_profiles",
        label: "Rich User Profiles",
        price: 400,
        description: "Includes profile picture, bio, and preferences.",
        tagline: "Encourages customers to personalize their experience.",
        realExample:
          "A shopper uploads a photo and sets preferences for product recommendations.",
      },
      {
        value: "payment_profiles",
        label: "Saved Payment Info",
        price: 500,
        description: "Securely store cards for fast checkouts.",
        tagline: "Speeds up purchases, boosting sales.",
        realExample:
          "A customer saves their CIB card to buy items with one click next time.",
      },
    ],
  },
  {
    id: "vendorRegistration",
    label: "Vendor Registration & Approval",
    tooltip:
      "Get sellers onboard quickly and securely. A smooth signup process attracts more vendors to your marketplace.",
    options: [
      {
        value: "none",
        label: "No Vendor Registration",
        price: 0,
        description: "No selling features; platform is browse-only.",
        tagline: "Not suitable for marketplaces.",
        realExample:
          "Your platform only displays static content, with no vendor activity.",
      },
      {
        value: "simple_form",
        label: "Simple Signup Form",
        price: 600,
        description: "Vendors apply via a basic form, approved manually.",
        tagline: "Good for small platforms with few sellers.",
        realExample:
          "A local artisan fills out a form to join your marketplace, and you approve it via email.",
      },
      {
        value: "document_upload",
        label: "Document Upload",
        price: 500,
        description: "Vendors submit ID or licenses for verification.",
        tagline: "Builds trust with verified sellers.",
        realExample:
          "A vendor uploads their business license to prove they’re a legitimate seller.",
      },
      {
        value: "auto_emails",
        label: "Automated Approval Emails",
        price: 400,
        description: "Sends status updates to vendors automatically.",
        tagline: "Saves time on vendor communication.",
        realExample:
          "A vendor gets an email confirming their application is under review.",
      },
      {
        value: "onboarding_dashboard",
        label: "Guided Onboarding Dashboard",
        price: 600,
        description: "Step-by-step signup with progress tracking.",
        tagline: "Makes joining easy for new vendors.",
        realExample:
          "A vendor sees a checklist to complete their profile and add products.",
      },
      {
        value: "verification_checks",
        label: "Vendor Verification Checks",
        price: 700,
        description: "Auto-checks vendor details for legitimacy.",
        tagline: "Keeps your platform reputable.",
        realExample:
          "Your system flags a vendor’s incomplete tax ID before approval.",
      },
      {
        value: "invite_system",
        label: "Vendor Invite System",
        price: 400,
        description: "Invite-only registration for exclusive vendors.",
        tagline: "Perfect for premium marketplaces.",
        realExample:
          "You send an invite link to a top jewelry brand to join your platform.",
      },
    ],
  },
  {
    id: "productListings",
    label: "Product Listings with Media Upload",
    tooltip:
      "Help vendors showcase their products beautifully. Great listings attract more buyers and boost sales.",
    options: [
      {
        value: "none",
        label: "No Product Listings",
        price: 0,
        description: "No products; platform is empty.",
        tagline: "Not suitable for marketplaces.",
        realExample:
          "Your platform has no shop section, only informational pages.",
      },
      {
        value: "simple_listings",
        label: "Simple Listings",
        price: 800,
        description: "Title, description, price, and one photo.",
        tagline: "Good for basic online shops.",
        realExample:
          "A vendor lists a handmade scarf with a single photo and price.",
      },
      {
        value: "multi_photos",
        label: "Multiple Photos",
        price: 500,
        description: "Add several images per product.",
        tagline: "Shows products from every angle.",
        realExample:
          "A phone vendor uploads front, back, and side images of a smartphone.",
      },
      {
        value: "video_uploads",
        label: "Video Uploads",
        price: 600,
        description: "Vendors include product videos.",
        tagline: "Brings products to life for buyers.",
        realExample:
          "A vendor adds a video showing how their kitchen gadget works.",
      },
      {
        value: "interactive_media",
        label: "Interactive Media",
        price: 800,
        description: "360° views or AR previews.",
        tagline: "Makes shopping immersive and fun.",
        realExample:
          "A furniture vendor lets customers spin a 360° view of a sofa.",
      },
      {
        value: "custom_fields",
        label: "Custom Product Fields",
        price: 400,
        description: "Add unique details (e.g., size, color).",
        tagline: "Perfect for diverse product types.",
        realExample:
          "A clothing vendor specifies sizes and colors for each dress.",
      },
      {
        value: "bulk_upload",
        label: "Bulk Product Upload",
        price: 500,
        description: "Import multiple products at once.",
        tagline: "Saves time for vendors with large catalogs.",
        realExample: "A vendor uploads a CSV with 100 products in one go.",
      },
      {
        value: "product_variants",
        label: "Product Variants",
        price: 500,
        description:
          "Support variations (e.g., sizes, colors) for each product.",
        tagline: "Great for clothing or tech shops.",
        realExample:
          "A shoe vendor lists one sneaker with sizes 7-12 in black and white.",
      },
    ],
  },
  {
    id: "searchFiltering",
    label: "Product Search & Filtering",
    tooltip:
      "Make it easy for customers to find what they want. A great search experience keeps shoppers coming back.",
    options: [
      {
        value: "none",
        label: "No Search or Filters",
        price: 0,
        description: "Users browse manually; no search.",
        tagline: "Only for tiny catalogs.",
        realExample:
          "Customers scroll through all products without a search bar.",
      },
      {
        value: "keyword_search",
        label: "Keyword Search",
        price: 400,
        description: "Search products by typing words.",
        tagline: "Helps customers find products quickly.",
        realExample:
          "A shopper types 'laptop' to find all laptops on your platform.",
      },
      {
        value: "basic_filters",
        label: "Basic Filters",
        price: 300,
        description: "Filter by price or category.",
        tagline: "Good for simple browsing.",
        realExample:
          "A customer filters products to show only items under 5000 DZD.",
      },
      {
        value: "advanced_filters",
        label: "Advanced Filters",
        price: 400,
        description: "Add brand, rating, or size filters.",
        tagline: "Perfect for large product ranges.",
        realExample:
          "A shopper filters for 5-star-rated Samsung phones in electronics.",
      },
      {
        value: "autocomplete",
        label: "Autocomplete Search",
        price: 300,
        description: "Suggests terms as users type.",
        tagline: "Speeds up the search process.",
        realExample:
          "Typing 'pho' suggests 'phone' and 'photo frame' instantly.",
      },
      {
        value: "smart_search",
        label: "Smart Search",
        price: 600,
        description: "Learns user preferences for better results.",
        tagline: "Feels like a personal shopper.",
        realExample: "A frequent buyer sees tailored results for tech gadgets.",
      },
      {
        value: "saved_searches",
        label: "Saved Searches",
        price: 300,
        description: "Users save favorite search settings.",
        tagline: "Great for repeat customers.",
        realExample:
          "A customer saves a search for 'organic skincare' for quick access.",
      },
    ],
  },
  {
    id: "categoryManagement",
    label: "Category Management",
    tooltip:
      "Organize products into clear groups so customers can browse effortlessly. Well-organized shops sell more.",
    options: [
      {
        value: "none",
        label: "No Categories",
        price: 0,
        description: "Products are unorganized; hard to browse.",
        tagline: "Not ideal for marketplaces.",
        realExample:
          "Customers see a jumbled list of products with no grouping.",
      },
      {
        value: "fixed_categories",
        label: "Fixed Categories",
        price: 300,
        description: "Set list of categories by your team.",
        tagline: "Good for small platforms.",
        realExample:
          "Your team sets categories like 'Clothing' and 'Electronics'.",
      },
      {
        value: "vendor_categories",
        label: "Vendor-Assigned Categories",
        price: 400,
        description: "Vendors choose categories for their products.",
        tagline: "Gives vendors flexibility.",
        realExample:
          "A vendor assigns their handmade jewelry to the 'Accessories' category.",
      },
      {
        value: "subcategories",
        label: "Subcategories",
        price: 400,
        description: "Nested groups (e.g., Electronics > Phones).",
        tagline: "Perfect for large catalogs.",
        realExample: "A customer browses 'Electronics > Phones > Smartphones'.",
      },
      {
        value: "smart_categories",
        label: "Smart Category Suggestions",
        price: 500,
        description: "Auto-suggests categories for products.",
        tagline: "Saves time for vendors.",
        realExample:
          "A vendor’s laptop listing is suggested for the 'Electronics' category.",
      },
      {
        value: "category_reports",
        label: "Category Sales Reports",
        price: 400,
        description: "Tracks sales by category.",
        tagline: "Helps optimize your product mix.",
        realExample:
          "You see 'Clothing' outsells 'Home Decor' and adjust your focus.",
      },
    ],
  },
  {
    id: "userRoles",
    label: "User Roles & Permissions",
    tooltip:
      "Control who can do what on your platform. Clear roles keep your marketplace secure and organized.",
    options: [
      {
        value: "none",
        label: "No Roles",
        price: 0,
        description: "Everyone has the same access; no restrictions.",
        tagline: "Risky for marketplaces.",
        realExample:
          "Any user can edit products or approve vendors, causing chaos.",
      },
      {
        value: "basic_roles",
        label: "Basic Roles",
        price: 400,
        description: "Buyer, vendor, admin roles with set permissions.",
        tagline: "Good for small teams.",
        realExample:
          "Vendors manage products, while admins approve new sellers.",
      },
      {
        value: "custom_roles",
        label: "Custom Roles",
        price: 400,
        description: "Create roles like moderators or support staff.",
        tagline: "Perfect for growing platforms.",
        realExample:
          "A moderator role handles customer complaints without full admin access.",
      },
      {
        value: "editable_permissions",
        label: "Editable Permissions",
        price: 400,
        description: "Adjust what each role can do.",
        tagline: "Gives you full control.",
        realExample:
          "You allow support staff to view orders but not edit products.",
      },
      {
        value: "role_hierarchies",
        label: "Role Hierarchies",
        price: 500,
        description: "Set senior roles with more power.",
        tagline: "Great for large teams.",
        realExample: "A senior admin can override a junior admin’s decisions.",
      },
      {
        value: "audit_logs",
        label: "Action Audit Logs",
        price: 400,
        description: "Track what users do for security.",
        tagline: "Keeps your platform safe.",
        realExample:
          "You check logs to see who changed a product’s price yesterday.",
      },
      {
        value: "temporary_roles",
        label: "Temporary Roles",
        price: 400,
        description: "Assign short-term roles (e.g., guest moderators).",
        tagline: "Great for events or promotions.",
        realExample:
          "A guest moderator manages vendor posts during a weekend sale.",
      },
    ],
  },
  {
    id: "inventoryManagement",
    label: "Inventory Management",
    tooltip:
      "Help vendors track their stock so they never sell what’s unavailable. Good inventory management builds trust.",
    options: [
      {
        value: "none",
        label: "No Inventory Tracking",
        price: 0,
        description: "Vendors manage stock manually.",
        tagline: "Risky for busy vendors.",
        realExample: "A vendor tracks stock on paper, risking overselling.",
      },
      {
        value: "stock_counts",
        label: "Stock Counts",
        price: 500,
        description: "Track stock levels per product.",
        tagline: "Good for small sellers.",
        realExample:
          "A clothing vendor sees they have 5 shirts left and restocks.",
      },
      {
        value: "low_stock_alerts",
        label: "Low-Stock Alerts",
        price: 300,
        description: "Notify vendors when stock is low.",
        tagline: "Prevents sold-out surprises.",
        realExample:
          "A vendor gets an alert when only 3 units of a product remain.",
      },
      {
        value: "stock_history",
        label: "Stock History",
        price: 400,
        description: "Log stock changes over time.",
        tagline: "Helps vendors plan restocking.",
        realExample:
          "A vendor reviews last month’s stock changes to plan orders.",
      },
      {
        value: "auto_updates",
        label: "Auto Stock Updates",
        price: 400,
        description: "Adjust stock after sales.",
        tagline: "Keeps inventory accurate.",
        realExample: "Stock drops from 10 to 9 when a customer buys an item.",
      },
      {
        value: "multi_warehouse",
        label: "Multi-Warehouse Support",
        price: 500,
        description: "Track stock across locations.",
        tagline: "Perfect for big vendors.",
        realExample:
          "A vendor tracks stock in Algiers and Oran warehouses separately.",
      },
      {
        value: "predictive_restock",
        label: "Predictive Restocking",
        price: 600,
        description: "Suggest when to restock.",
        tagline: "Boosts efficiency for large inventories.",
        realExample:
          "The system suggests restocking 50 units based on sales trends.",
      },
      {
        value: "barcode_integration",
        label: "Barcode Integration",
        price: 500,
        description: "Scan barcodes to update stock.",
        tagline: "Speeds up warehouse tasks.",
        realExample: "A vendor scans barcodes to add 50 new items in minutes.",
      },
    ],
  },
  {
    id: "pricingDiscounts",
    label: "Pricing & Discounts",
    tooltip:
      "Let vendors set prices and offer deals to attract buyers. Discounts drive sales and keep customers happy.",
    options: [
      {
        value: "none",
        label: "Fixed Pricing Only",
        price: 0,
        description: "Vendors set one price; no discounts.",
        tagline: "Basic but limiting.",
        realExample:
          "A vendor lists a phone at 20,000 DZD with no discount options.",
      },
      {
        value: "percentage_discounts",
        label: "Percentage Discounts",
        price: 400,
        description: "Offer simple % off deals.",
        tagline: "Good for small promotions.",
        realExample: "A vendor offers 10% off all shoes during a holiday sale.",
      },
      {
        value: "discount_codes",
        label: "Discount Codes",
        price: 400,
        description: "Create codes for special offers.",
        tagline: "Great for marketing campaigns.",
        realExample: "A vendor creates 'SUMMER20' for 20% off summer clothes.",
      },
      {
        value: "timed_deals",
        label: "Time-Limited Deals",
        price: 400,
        description: "Run sales for a set period.",
        tagline: "Creates urgency for buyers.",
        realExample: "A vendor runs a 48-hour flash sale on electronics.",
      },
      {
        value: "bundle_pricing",
        label: "Bundle Pricing",
        price: 400,
        description: "Discount multiple items together.",
        tagline: "Encourages bigger purchases.",
        realExample: "A vendor offers a phone + case bundle for 10% less.",
      },
      {
        value: "dynamic_pricing",
        label: "Dynamic Pricing",
        price: 600,
        description: "Adjust prices based on demand.",
        tagline: "Maximizes profits for vendors.",
        realExample: "A vendor raises prices on high-demand items during Eid.",
      },
      {
        value: "loyalty_discounts",
        label: "Loyalty Discounts",
        price: 400,
        description: "Reward repeat customers.",
        tagline: "Builds customer loyalty.",
        realExample: "A frequent buyer gets 5% off for their 10th purchase.",
      },
      {
        value: "affiliate_discount",
        label: "Affiliate Discount System",
        price: 500,
        description:
          "Buyers invite friends to purchase and earn discounts for future purchases.",
        tagline: "Boosts sales through referrals.",
        realExample:
          "A buyer shares a referral link for a vendor's product. Their friend buys it, and the buyer gets a 10% discount on their next purchase from that vendor.",
      },
    ],
  },
  {
    id: "shoppingCart",
    label: "Shopping Cart",
    tooltip:
      "Let customers collect items before buying. A great cart experience makes checkout smooth and boosts sales.",
    options: [
      {
        value: "none",
        label: "No Cart",
        price: 0,
        description: "Buy items one at a time; no cart.",
        tagline: "Not ideal for marketplaces.",
        realExample:
          "A customer must buy each item separately, slowing checkout.",
      },
      {
        value: "basic_cart",
        label: "Basic Cart",
        price: 500,
        description: "Hold items with quantity adjustments.",
        tagline: "Good for simple shops.",
        realExample: "A customer adds 2 shirts to their cart and adjusts to 3.",
      },
      {
        value: "saved_carts",
        label: "Saved Carts",
        price: 400,
        description: "Save items for later shopping.",
        tagline: "Encourages return visits.",
        realExample: "A shopper saves a cart with shoes to buy next week.",
      },
      {
        value: "cross_vendor_cart",
        label: "Cross-Vendor Cart",
        price: 400,
        description: "Combine items from multiple vendors.",
        tagline: "Perfect for multi-vendor platforms.",
        realExample:
          "A customer adds a phone from one vendor and a case from another.",
      },
      {
        value: "cart_sharing",
        label: "Cart Sharing",
        price: 300,
        description: "Share carts with others (e.g., wishlists).",
        tagline: "Great for social shopping.",
        realExample:
          "A shopper shares their wishlist with friends for gift ideas.",
      },
      {
        value: "abandoned_cart",
        label: "Abandoned Cart Reminders",
        price: 500,
        description: "Email users about forgotten carts.",
        tagline: "Recovers lost sales.",
        realExample:
          "A customer gets an email about a cart they left with a laptop.",
      },
      {
        value: "cart_analytics",
        label: "Cart Analytics",
        price: 400,
        description: "Track cart usage for insights.",
        tagline: "Helps optimize the shopping experience.",
        realExample: "You see 30% of carts are abandoned and add reminders.",
      },
    ],
  },
  {
    id: "multiLanguage",
    label: "Multi-Language Support",
    tooltip:
      "Reach customers in their native language. Multi-language support grows your market and builds trust.",
    options: [
      {
        value: "none",
        label: "Single Language",
        price: 0,
        description: "One language (from Step 1).",
        tagline: "Fine for local platforms.",
        realExample:
          "Your platform is in Arabic only, limiting non-Arabic speakers.",
      },
      {
        value: "dual_languages",
        label: "Dual Languages",
        price: 600,
        description: "Support two languages with manual translations.",
        tagline: "Good for bilingual markets.",
        realExample:
          "Your platform supports Arabic and French for Algerian shoppers.",
      },
      {
        value: "multi_language_tool",
        label: "Multi-Language Tool",
        price: 600,
        description: "Manage up to five languages easily.",
        tagline: "Perfect for regional platforms.",
        realExample:
          "Vendors translate product listings into English, Spanish, and more.",
      },
      {
        value: "unlimited_languages",
        label: "Unlimited Languages",
        price: 700,
        description: "Support any language with a translation system.",
        tagline: "Ideal for global marketplaces.",
        realExample:
          "Your platform supports 20+ languages for international buyers.",
      },
      {
        value: "rtl_support",
        label: "Right-to-Left Support",
        price: 500,
        description: "Support languages like Arabic.",
        tagline: "Essential for Middle Eastern markets.",
        realExample: "Arabic text displays correctly for Algerian customers.",
      },
      {
        value: "auto_translations",
        label: "Auto-Translation Suggestions",
        price: 600,
        description: "Suggest translations for content.",
        tagline: "Saves time on language setup.",
        realExample:
          "A vendor’s French description is auto-translated to Arabic.",
      },
      {
        value: "language_switcher",
        label: "Language Switcher",
        price: 400,
        description: "Let users toggle languages on the fly.",
        tagline: "Great for diverse customers.",
        realExample:
          "A customer switches from Arabic to French while browsing.",
      },
    ],
  },
  {
    id: "onboardingTutorials",
    label: "Onboarding & Tutorials",
    tooltip:
      "Help new users and vendors learn your platform fast. Great onboarding reduces confusion and boosts engagement.",
    options: [
      {
        value: "none",
        label: "No Guides",
        price: 0,
        description: "Users figure it out themselves.",
        tagline: "Risky for complex platforms.",
        realExample: "New vendors struggle to add products without help.",
      },
      {
        value: "help_pages",
        label: "Help Pages",
        price: 300,
        description: "Text-based guides for users and vendors.",
        tagline: "Good for basic support.",
        realExample: "A vendor reads a guide on how to upload products.",
      },
      {
        value: "walkthroughs",
        label: "Interactive Walkthroughs",
        price: 400,
        description: "Step-by-step in-app guides.",
        tagline: "Makes learning intuitive.",
        realExample:
          "A new user follows an in-app tour to set up their profile.",
      },
      {
        value: "video_tutorials",
        label: "Video Tutorials",
        price: 400,
        description: "Short videos explaining features.",
        tagline: "Perfect for visual learners.",
        realExample: "A vendor watches a video on creating discount codes.",
      },
      {
        value: "in_app_tips",
        label: "In-App Tips",
        price: 400,
        description: "Pop-up hints for new users.",
        tagline: "Guides users as they explore.",
        realExample: "A pop-up suggests adding a photo to a vendor’s profile.",
      },
      {
        value: "personalized_onboarding",
        label: "Personalized Onboarding",
        price: 500,
        description: "Tailored support (e.g., live chat).",
        tagline: "Great for premium platforms.",
        realExample:
          "A vendor gets live chat help to list their first product.",
      },
      {
        value: "live_chat",
        label: "Live Chat Support",
        price: 600,
        description: "Offer real-time help during onboarding.",
        tagline: "Perfect for hands-on support.",
        realExample: "A vendor chats with your team to set up their store.",
      },
    ],
  },
  {
    id: "dataImportExport",
    label: "Data Import/Export",
    tooltip:
      "Let vendors add or manage products in bulk. Easy data tools save time and attract serious sellers.",
    options: [
      {
        value: "none",
        label: "Manual Product Entry",
        price: 0,
        description: "Vendors add products one by one.",
        tagline: "Slow for large catalogs.",
        realExample: "A vendor manually enters each product, taking hours.",
      },
      {
        value: "csv_import",
        label: "CSV Import/Export",
        price: 400,
        description: "Use CSV files for bulk data.",
        tagline: "Good for small vendors.",
        realExample: "A vendor uploads a CSV to add 50 products at once.",
      },
      {
        value: "excel_support",
        label: "Excel Support",
        price: 400,
        description: "Import/export via Excel files.",
        tagline: "Familiar for business users.",
        realExample: "A vendor uses an Excel sheet to update product prices.",
      },
      {
        value: "error_checking",
        label: "Error Checking",
        price: 300,
        description: "Catch mistakes in uploaded data.",
        tagline: "Keeps product data clean.",
        realExample: "The system flags a missing price in a vendor’s CSV file.",
      },
      {
        value: "data_mapping",
        label: "Data Mapping",
        price: 400,
        description: "Match fields to your platform’s format.",
        tagline: "Simplifies complex imports.",
        realExample: "A vendor maps their 'cost' field to your 'price' field.",
      },
      {
        value: "auto_imports",
        label: "Automated Imports",
        price: 500,
        description: "Schedule regular data updates.",
        tagline: "Perfect for busy vendors.",
        realExample:
          "A vendor’s stock updates weekly via automated CSV imports.",
      },
      {
        value: "tool_integration",
        label: "External Tool Integration",
        price: 600,
        description: "Connect to tools like Shopify.",
        tagline: "Great for advanced sellers.",
        realExample: "A vendor syncs their Shopify store with your platform.",
      },
    ],
  },
  {
    id: "customerReviews",
    label: "Customer Reviews & Ratings",
    tooltip:
      "Let customers share feedback on products and vendors. Reviews build trust and drive sales.",
    options: [
      {
        value: "none",
        label: "No Reviews",
        price: 0,
        description: "Products have no customer feedback or ratings.",
        tagline: "Risky for buyer trust.",
        realExample:
          "Shoppers buy without knowing what others think, reducing confidence.",
      },
      {
        value: "basic_reviews",
        label: "Basic Reviews",
        price: 400,
        description: "Customers leave star ratings and text reviews.",
        tagline: "Good for small marketplaces.",
        realExample:
          "A buyer rates a scarf 4 stars and writes 'Great quality!'",
      },
      {
        value: "verified_reviews",
        label: "Verified Purchase Reviews",
        price: 500,
        description: "Only buyers can review, ensuring authenticity.",
        tagline: "Boosts trust in feedback.",
        realExample:
          "Only customers who bought a phone can rate it, preventing fake reviews.",
      },
      {
        value: "vendor_responses",
        label: "Vendor Responses",
        price: 400,
        description: "Vendors reply to customer reviews.",
        tagline: "Improves vendor-buyer trust.",
        realExample:
          "A vendor responds to a 3-star review, offering a solution.",
      },
      {
        value: "review_moderation",
        label: "Review Moderation",
        price: 500,
        description: "Admins approve or flag inappropriate reviews.",
        tagline: "Keeps feedback fair and clean.",
        realExample: "An admin removes a review with offensive language.",
      },
      {
        value: "review_analytics",
        label: "Review Analytics",
        price: 400,
        description: "Track review trends for insights.",
        tagline: "Helps vendors improve products.",
        realExample:
          "A vendor sees 80% of reviews mention fast shipping and promotes it.",
      },
    ],
  },
  {
    id: "messagingSystem",
    label: "Messaging System",
    tooltip:
      "Enable direct communication between buyers, vendors, and admins. Messaging builds relationships and resolves issues fast.",
    options: [
      {
        value: "none",
        label: "No Messaging",
        price: 0,
        description: "No direct communication; users rely on external tools.",
        tagline: "Limits customer support.",
        realExample:
          "A buyer emails a vendor separately, slowing down inquiries.",
      },
      {
        value: "basic_messaging",
        label: "Basic Messaging",
        price: 500,
        description: "In-platform text chat between buyers and vendors.",
        tagline: "Good for simple communication.",
        realExample: "A buyer asks a vendor about a product’s size via chat.",
      },
      {
        value: "file_attachments",
        label: "File Attachments",
        price: 400,
        description: "Share images or documents in messages.",
        tagline: "Helps clarify issues.",
        realExample: "A buyer sends a photo of a damaged item to a vendor.",
      },
      {
        value: "admin_messaging",
        label: "Admin Messaging",
        price: 400,
        description: "Admins join or monitor conversations.",
        tagline: "Great for support oversight.",
        realExample:
          "An admin steps into a chat to resolve a vendor-buyer dispute.",
      },
      {
        value: "auto_replies",
        label: "Automated Replies",
        price: 400,
        description: "Send preset responses for common questions.",
        tagline: "Saves vendors time.",
        realExample:
          "A buyer gets an auto-reply about shipping times after messaging.",
      },
      {
        value: "message_templates",
        label: "Message Templates",
        price: 300,
        description: "Predefined messages for vendors to use.",
        tagline: "Speeds up communication.",
        realExample:
          "A vendor uses a template to confirm order details with a buyer.",
      },
      {
        value: "chat_notifications",
        label: "Chat Notifications",
        price: 400,
        description: "Email or in-app alerts for new messages.",
        tagline: "Keeps conversations active.",
        realExample: "A vendor gets an email when a buyer sends a new message.",
      },
    ],
  },
  {
    id: "analyticsDashboards",
    label: "Analytics Dashboards",
    tooltip:
      "Give vendors and admins insights into sales, traffic, and performance. Analytics help optimize business decisions.",
    options: [
      {
        value: "none",
        label: "No Analytics",
        price: 0,
        description: "No data insights; vendors track manually.",
        tagline: "Limits growth potential.",
        realExample: "A vendor guesses which products sell best without data.",
      },
      {
        value: "basic_analytics",
        label: "Basic Analytics",
        price: 500,
        description: "Track sales and views per product.",
        tagline: "Good for small vendors.",
        realExample: "A vendor sees their top-selling item is a leather bag.",
      },
      {
        value: "traffic_analytics",
        label: "Traffic Analytics",
        price: 400,
        description: "Monitor page views and visitor trends.",
        tagline: "Helps target marketing.",
        realExample:
          "A vendor notices most visitors browse their store on weekends.",
      },
      {
        value: "customer_analytics",
        label: "Customer Analytics",
        price: 500,
        description: "Analyze buyer behavior and demographics.",
        tagline: "Personalizes sales strategies.",
        realExample:
          "A vendor learns most buyers are from Algiers, aged 25-34.",
      },
      {
        value: "exportable_reports",
        label: "Exportable Reports",
        price: 400,
        description: "Download analytics as CSV or PDF.",
        tagline: "Great for planning.",
        realExample:
          "A vendor exports a sales report to share with their team.",
      },
      {
        value: "real_time_analytics",
        label: "Real-Time Analytics",
        price: 600,
        description: "Live data on sales and traffic.",
        tagline: "Perfect for fast decisions.",
        realExample:
          "A vendor sees a product spike in views during a sale and restocks.",
      },
    ],
  },
  {
    id: "disputeResolution",
    label: "Dispute Resolution",
    tooltip:
      "Handle conflicts between buyers and vendors smoothly. A fair resolution system builds trust and reduces refunds.",
    options: [
      {
        value: "none",
        label: "No Dispute System",
        price: 0,
        description: "No tools to manage conflicts; handled manually.",
        tagline: "Risky for customer satisfaction.",
        realExample:
          "A buyer and vendor argue over a refund via email, unresolved.",
      },
      {
        value: "basic_disputes",
        label: "Basic Dispute System",
        price: 500,
        description: "Buyers submit claims; admins review manually.",
        tagline: "Good for small platforms.",
        realExample:
          "A buyer files a claim for a missing order, and you review it.",
      },
      {
        value: "automated_refunds",
        label: "Automated Refund Requests",
        price: 400,
        description: "Buyers request refunds with preset rules.",
        tagline: "Speeds up resolutions.",
        realExample: "A buyer gets an instant refund for a late delivery.",
      },
      {
        value: "escalation_process",
        label: "Escalation Process",
        price: 400,
        description: "Admins handle unresolved disputes.",
        tagline: "Ensures fair outcomes.",
        realExample:
          "An admin steps in when a buyer and vendor disagree on a return.",
      },
      {
        value: "dispute_analytics",
        label: "Dispute Analytics",
        price: 400,
        description: "Track common issues and trends.",
        tagline: "Improves platform policies.",
        realExample:
          "You notice 20% of disputes are about shipping and adjust terms.",
      },
      {
        value: "vendor_arbitration",
        label: "Vendor Arbitration",
        price: 500,
        description: "Vendors appeal admin decisions.",
        tagline: "Promotes fairness for sellers.",
        realExample:
          "A vendor appeals a refund decision, providing proof of delivery.",
      },
    ],
  },
  {
    id: "legalCompliance",
    label: "Legal & Compliance Tools",
    tooltip:
      "Ensure your platform meets local and global regulations. Compliance tools protect your business and build trust.",
    options: [
      {
        value: "none",
        label: "No Compliance Tools",
        price: 0,
        description: "No built-in legal or compliance features.",
        tagline: "Risky for regulated markets.",
        realExample: "You manually handle tax forms, risking errors.",
      },
      {
        value: "terms_templates",
        label: "Terms & Conditions Templates",
        price: 400,
        description: "Customizable terms for users and vendors.",
        tagline: "Good for basic compliance.",
        realExample:
          "You set platform rules for returns using a preset template.",
      },
      {
        value: "tax_compliance",
        label: "Tax Compliance",
        price: 500,
        description: "Auto-calculate and report taxes for sales.",
        tagline: "Essential for legal sales.",
        realExample:
          "The system calculates VAT for Algerian sales automatically.",
      },
      {
        value: "gdpr_compliance",
        label: "GDPR Compliance",
        price: 600,
        description: "Tools for data privacy (e.g., consent forms).",
        tagline: "Critical for EU markets.",
        realExample: "Buyers consent to data storage before signing up.",
      },
      {
        value: "vendor_agreements",
        label: "Vendor Agreements",
        price: 400,
        description: "Digital contracts for vendors to sign.",
        tagline: "Protects your platform.",
        realExample:
          "A vendor signs a contract agreeing to your commission rates.",
      },
      {
        value: "compliance_audits",
        label: "Compliance Audit Logs",
        price: 500,
        description: "Track actions for regulatory reviews.",
        tagline: "Great for transparency.",
        realExample:
          "You provide logs to prove GDPR compliance during an audit.",
      },
    ],
  },
];

export default function Step2({ onNext, onBack, formData }: Step2Props) {
  const { updateFormData } = useFormContext();
  const [data, setData] = useState<Step2Data>({
    authentication: formData.authentication || [],
    userProfiles: formData.userProfiles || [],
    vendorRegistration: formData.vendorRegistration || [],
    productListings: formData.productListings || [],
    searchFiltering: formData.searchFiltering || [],
    categoryManagement: formData.categoryManagement || [],
    userRoles: formData.userRoles || [],
    inventoryManagement: formData.inventoryManagement || [],
    pricingDiscounts: formData.pricingDiscounts || [],
    shoppingCart: formData.shoppingCart || [],
    multiLanguage: formData.multiLanguage || [],
    onboardingTutorials: formData.onboardingTutorials || [],
    dataImportExport: formData.dataImportExport || [],
    customerReviews: formData.customerReviews || [],
    messagingSystem: formData.messagingSystem || [],
    analyticsDashboards: formData.analyticsDashboards || [],
    disputeResolution: formData.disputeResolution || [],
    legalCompliance: formData.legalCompliance || [],
    features: formData.features || [],
    pricing: formData.pricing || {
      totalCost: 0,
      brandingStatusCost: 0,
      hostingStatusCost: 0,
      languageCost: 0,
    },
    pricingBreakdown: formData.pricingBreakdown || {
      authentication: {},
      userProfiles: {},
      vendorRegistration: {},
      productListings: {},
      searchFiltering: {},
      categoryManagement: { dispersions: {} },
      userRoles: {},
      inventoryManagement: {},
      pricingDiscounts: {},
      shoppingCart: {},
      multiLanguage: {},
      onboardingTutorials: {},
      dataImportExport: {},
      customerReviews: {},
      messagingSystem: {},
      analyticsDashboards: {},
      disputeResolution: {},
      legalCompliance: {},
    },
  });

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [errors, setErrors] = useState<
    Partial<Record<keyof Step2Data, string>>
  >({});

  const calculateTotalPrice = useCallback((currentData: Step2Data = data) => {
    let step2Total = 0;
    const newPricingBreakdown: Step2Data["pricingBreakdown"] = {
      authentication: {},
      userProfiles: {},
      vendorRegistration: {},
      productListings: {},
      searchFiltering: {},
      categoryManagement: { dispersions: {} },
      userRoles: {},
      inventoryManagement: {},
      pricingDiscounts: {},
      shoppingCart: {},
      multiLanguage: {},
      onboardingTutorials: {},
      dataImportExport: {},
      customerReviews: {},
      messagingSystem: {},
      analyticsDashboards: {},
      disputeResolution: {},
      legalCompliance: {},
    };

    modules.forEach((module: Module) => {
      const selectedFeatures = currentData[module.id] as string[];
      const moduleBreakdown: { [key: string]: number } = {};
      module.options.forEach((option: ModuleOption) => {
        if (selectedFeatures.includes(option.value)) {
          step2Total += option.price;
          moduleBreakdown[option.value] = option.price;
        }
      });
      if (module.id === "categoryManagement") {
        newPricingBreakdown.categoryManagement.dispersions = moduleBreakdown;
      } else {
        newPricingBreakdown[module.id] = moduleBreakdown;
      }
    });

    return { step2Total, newPricingBreakdown };
  }, []);

  useEffect(() => {
    const { step2Total, newPricingBreakdown } = calculateTotalPrice();
    setTotalPrice(step2Total);
    setData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, totalCost: step2Total },
      pricingBreakdown: newPricingBreakdown,
    }));
  }, [formData, calculateTotalPrice]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Step2Data, string>> = {};
    if (!data.authentication.length) {
      newErrors.authentication =
        "At least one authentication feature is required.";
    }
    if (!data.userProfiles.length) {
      newErrors.userProfiles = "At least one user profile feature is required.";
    }
    if (!data.vendorRegistration.length) {
      newErrors.vendorRegistration =
        "At least one vendor registration feature is required.";
    }
    if (!data.productListings.length) {
      newErrors.productListings =
        "At least one product listing feature is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFeatureToggle = (module: Module, value: string): void => {
    const currentFeatures = data[module.id] as string[];
    let newFeatures: string[] = currentFeatures.includes(value)
      ? currentFeatures.filter((v: string) => v !== value)
      : [...currentFeatures, value];

    const noneOption = module.options.find(
      (opt: ModuleOption) => opt.price === 0
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
    const { step2Total, newPricingBreakdown } =
      calculateTotalPrice(updatedData);

    setData({
      ...updatedData,
      pricing: { ...updatedData.pricing, totalCost: step2Total },
      pricingBreakdown: newPricingBreakdown,
    });
    setTotalPrice(step2Total);
    setErrors((prev) => ({ ...prev, [module.id]: undefined }));
  };

  const isNoneOptionDisabled = (module: Module): boolean => {
    const selectedFeatures = data[module.id] as string[];
    return selectedFeatures.some(
      (value: string) =>
        value !==
        module.options.find((opt: ModuleOption) => opt.price === 0)?.value
    );
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateForm()) {
      const { step2Total, newPricingBreakdown } = calculateTotalPrice();
      const step2Data: Step2Data = {
        ...data,
        pricing: {
          ...data.pricing,
          totalCost: step2Total,
        },
        pricingBreakdown: newPricingBreakdown,
      };
      updateFormData("step2", step2Data);
      onNext(step2Data);
    }
  };

  const calculateModulePrice = (moduleId: keyof Step2Data): number => {
    const selectedFeatures = data[moduleId] as string[];
    const selectedModule = modules.find((m: Module) => m.id === moduleId);
    let modulePrice = 0;
    selectedModule?.options.forEach((option: ModuleOption) => {
      if (selectedFeatures.includes(option.value)) {
        modulePrice += option.price;
      }
    });
    return modulePrice;
  };

  return (
    <TooltipProvider>
      <div className="bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Core Platform Features
              </h2>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-700">
                    Choose the essential building blocks for your marketplace.
                    These features create the foundation for customers to shop
                    and vendors to sell.
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
                {module.options.map((option: ModuleOption) => (
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
