import * as z from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Invalid email format",
    }),
  password: z.string().min(1, "Password is required"),
  // .min(8, "Password must be at least 8 characters"),
});

export const verifyOTP = z.object({
  code: z.number().min(6, "A minimum number of 6"),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Title is required").optional(),
    // email: z.string().min(1, "Email is required").email("Please enter a valid email address").optional(),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const simpleProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be positive"),
  discountPrice: z.number().min(0, "Discount price must be positive").optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  stockCount: z.number().min(0, "Stock count must be positive"),
  images: z.array(z.any()).min(1, "At least one image is required").max(4, "Maximum 4 images allowed"),
  status: z.enum(["published", "draft"]).default("published"),
  weight: z.number().min(0, "Weight must be positive").default(1),
  fragile: z
    .union([z.boolean(), z.string()])
    .transform((value) => {
      if (typeof value === "string") return value === "true";
      return value;
    })
    .default(false),
});

export const withdrawalSchema = z.object({
  amount: z.number().min(1, "Price must be a positive number"),
});

export const bankFormSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  bank_code: z.string().min(1, "Bank name is required"),
  account_number: z.string().min(10, "Account number is required"),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required"),
  comment: z.string().optional(),
});

export const contactSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const externalContactSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().optional(),
  phone_number: z.string().min(10, "Phone number is required").max(11, "Phone number is required"),
  bio: z.string().min(1, "Message is required"),
  logo: z.any().optional(),
  twitter_account: z.string().optional(),
  facebook_account: z.string().optional(),
  youtube_account: z.string().optional(),
});

export const emailNotificationSettingSchema = z.object({
  purchase: z.boolean().optional(),
  news_updates: z.boolean().optional(),
  product_creation: z.boolean().optional(),
  payout: z.boolean().optional(),
});

// Security & Privacy settings schema
export const securityPrivacySettingsSchema = z.object({
  // Two-Factor Authentication
  twoFactorEnabled: z.boolean().default(false),
  // Login Notifications
  loginAlerts: z.boolean().default(true),
  suspiciousActivityAlerts: z.boolean().default(true),
  // Session Management
  logoutInactiveDevices: z.boolean().default(false),
  // Privacy Controls
  profileVisibility: z.enum(["public", "private", "business_only"]).default("business_only"),
  showEmailToCustomers: z.boolean().default(false),
  allowDataCollection: z.boolean().default(true),
  // Data Management
  enableDataExport: z.boolean().default(true),
  autoDeleteOldData: z.boolean().default(false),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Your current Password is Required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords don't match",
    path: ["new_password_confirmation"],
  });

export const changeEmailSchema = z.object({
  email: z.string().optional(),
  alt_email: z.string().email("Please enter a valid email address").optional(),
});

export const kycSchema = z.object({
  country: z.string().min(1, "Select a country"),
  document_type: z.string().min(1, "Document type is required"),
  document_image: z.any().refine((file) => file !== null, "document image is required"),
});

export const emailIntegrationSchema = z.object({
  provider: z.string().optional(),
  token: z.string().min(1, "API key is required"),
});

export const funnelSchema = z.object({
  title: z.string().min(1, "Title is required"),
  thumbnail: z.any().refine((file) => file !== null, "Thumbnail is required"),
  product_id: z.string().min(1, "At least one product is required"),
  // asset: z.any().refine((file) => file !== null, "asset is required"),
  assets: z.array(z.any()).min(1, "Product files are required").max(4, "You can upload up to 4 files"),
});

export const funnelSettingsSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  logo: z
    .any()
    .refine((file) => file !== null, "Thumbnail is required")
    .optional(),
});

export const businessInfoSchema = z.object({
  type: z.string().min(1, "Business type is required"),
  businessRegNumber: z.string().optional(),
  contactNumber: z.string().min(1, "Contact phone is required"),
  address: z.string().min(1, "Business address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  kycVerificationType: z.string().min(1, "KYC verification is required"),
  identificationNumber: z.string().min(1, "Identification number is required"),
});

export const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().min(1, "Store description is required"),
  image: z.any().refine((file) => file !== null, "Image is required"),
});

// Separate schemas for individual vendor form sections
export const vendorStoreSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().min(1, "Store description is required"),
  logo: z.any().optional(),
});

export const vendorPersonalSchema = z.object({
  vendor: z.object({
    name: z.string().min(1, "Vendor name is required"),
  }),
});

export const vendorBusinessSchema = z.object({
  business: z.object({
    type: z.enum(["individual", "corporation", "partnership", "llc"]),
    businessRegNumber: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    address: z.string().min(1, "Address is required"),
  }),
});

// Combined schema (for complete profile updates)
export const vendorProfileSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().min(1, "Store description is required"),
  logo: z.any().optional(),
  vendor: z.object({
    name: z.string().min(1, "Vendor name is required"),
  }),
  business: z.object({
    type: z.enum(["individual", "corporation", "partnership", "llc"]),
    businessRegNumber: z.string().optional(),
    name: z.string().optional(),
    contactNumber: z.string().min(1, "Contact number is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    address: z.string().min(1, "Address is required"),
    kycVerificationType: z.enum(["passport", "drivers_license", "national_id", "other"]),
    identificationNumber: z.string().min(1, "Identification number is required"),
  }),
});

export const bankPayoutSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountName: z.string().min(1, "Account name is required"),
  code: z.string().min(1, "Bank code is required"),
});

// Comprehensive notification settings schema
export const notificationSettingsSchema = z.object({
  // App Notifications
  appNotifications: z.boolean().default(true),
  // Sound Notifications
  soundNotifications: z.boolean().default(true),
  // Order Management Notifications
  newOrders: z.boolean().default(true),
  orderUpdates: z.boolean().default(true),
  orderCancellations: z.boolean().default(true),
  // Business Notifications
  lowStock: z.boolean().default(true),
  payoutUpdates: z.boolean().default(true),
  salesMilestones: z.boolean().default(false),
  // Customer Engagement
  newReviews: z.boolean().default(true),
  customerMessages: z.boolean().default(true),
  // System & Security
  securityAlerts: z.boolean().default(true),
  systemUpdates: z.boolean().default(false),
  maintenanceNotifications: z.boolean().default(true),
  // Marketing & Promotions
  promotionalOffers: z.boolean().default(false),
  newsUpdates: z.boolean().default(false),
});

// Play-2-Win: Coupon form schema
export const couponFormSchema = z
  .object({
    title: z.string().min(1, "Coupon title is required"),

    couponType: z.enum(["discount", "amount"]),
    value: z.number().positive("Value must be greater than 0"),
    quantity: z.number().int().positive("Quantity must be greater than 0"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end.getTime() >= start.getTime();
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );

// Types
export type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>;

export type BankPayoutFormData = z.infer<typeof bankPayoutSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type VerifyOTP = z.infer<typeof verifyOTP>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type WithdrawalData = z.infer<typeof withdrawalSchema>;
export type BankFormData = z.infer<typeof bankFormSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type EmailNotificationSettingFormData = z.infer<typeof emailNotificationSettingSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;
export type KycFormData = z.infer<typeof kycSchema>;
export type EmailIntegrationFormData = z.infer<typeof emailIntegrationSchema>;
export type FunnelFormData = z.infer<typeof funnelSchema>;
export type FunnelSettingFormData = z.infer<typeof funnelSettingsSchema>;
export type ExternalContactFormData = z.infer<typeof externalContactSchema>;
export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type StoreFormData = z.infer<typeof storeSchema>;
export type SimpleProductFormData = z.infer<typeof simpleProductSchema>;
export type VendorProfileFormData = z.infer<typeof vendorProfileSchema>;
export type VendorStoreFormData = z.infer<typeof vendorStoreSchema>;
export type VendorPersonalFormData = z.infer<typeof vendorPersonalSchema>;
export type VendorBusinessFormData = z.infer<typeof vendorBusinessSchema>;
export type SecurityPrivacySettingsData = z.infer<typeof securityPrivacySettingsSchema>;
