export type LegalItem = {
  title: string;
  text: string;
  points: string[];
};

export type LegalMeta = {
  companyName: string;
  platformName: string;
  effectiveDate: string;
  address?: string;
  phone?: string;
  website?: string;
  platformUrl?: string;
  contactEmail?: string;
  downloadPath?: string;
};

export const PRIVACY_POLICY_META: LegalMeta = {
  companyName: "Skicom Limited (SkiShop)",
  platformName: "SkiShop",
  effectiveDate: "1st Dec 2025",
  address: "49, Adeyemi Street, Otubu Bus Stop, Agege, Lagos, Nigeria",
  phone: "+234 703 541 2899",
  website: "https://www.skicomltd.com",
  contactEmail: "contact@skicomltd.com",
  downloadPath: "/SkiShop Privacy Policy.docx",
};

export const TERMS_AND_CONDITIONS_META: LegalMeta = {
  companyName: "Skicom Limited",
  platformName: "SkiShop",
  effectiveDate: "1st Dec 2025",
  platformUrl: "https://www.skicomltd.com/ski-shop",
  contactEmail: "contact@skicomltd.com",
  downloadPath: "/SkiShop_Terms_and_Conditions.docx",
};

export const PRIVACY_POLICY_INTRO: string[] = [
  'SkiShop ("Platform", "we", "our", or "us") is an e-commerce marketplace operated by Skicom Limited, a privately owned Nigerian company. This Privacy Policy explains how we collect, use, disclose, store, and protect personal information obtained from users of the SkiShop website, mobile applications, and related services (collectively, the "Services").',
  "By accessing or using SkiShop, you agree to the terms of this Privacy Policy. If you do not agree, please discontinue use of the Platform.",
];

export const TERMS_AND_CONDITIONS_INTRO: string[] = [];

// NOTE: These contents are sourced from the DOCX files in the `public/` folder.
// Keep the structure here close to the official documents.
export const policies: LegalItem[] = [
  {
    title: "1. Scope of This Privacy Policy",
    text: "This Privacy Policy applies to:\n\nIt does not apply to third-party websites, applications, or services that may be linked to or integrated with SkiShop.",
    points: [
      "Visitors to the SkiShop website",
      "Registered users and account holders",
      "Buyers and sellers (vendors) on the marketplace",
      "Service providers and partners interacting with SkiShop",
    ],
  },
  {
    title: "2. Information We Collect",
    text: "We may collect personal information, transaction information, technical and usage information, and communications as described below.",
    points: [],
  },
  {
    title: "2.1 Personal Information",
    text: "We may collect personal information that you voluntarily provide, including but not limited to:",
    points: [
      "Full name",
      "Email address",
      "Phone number",
      "Shipping and billing addresses",
      "Login credentials (username and encrypted password)",
      "Government-issued identification (where legally required for verification)",
      "Vendor business details (business name, registration documents, bank account details)",
    ],
  },
  {
    title: "2.2 Transaction Information",
    text: "When you make a purchase or sale on SkiShop, we collect:",
    points: [
      "Order details",
      "Payment confirmation and transaction references",
      "Delivery and logistics information",
      "Refund and dispute records",
      "Note: SkiShop does not store full debit/credit card details. Payments are processed through secure third-party payment gateways.",
    ],
  },
  {
    title: "2.3 Technical and Usage Information",
    text: "We automatically collect certain information when you access the Platform, including:",
    points: [
      "IP address",
      "Device type, operating system, and browser type",
      "Log files and access times",
      "Pages viewed and actions taken on the Platform",
      "Cookies and similar tracking technologies",
    ],
  },
  {
    title: "2.4 Communications",
    text: "We may collect information from:",
    points: [
      "Emails, chat messages, and support tickets",
      "Customer reviews, ratings, and feedback",
      "Surveys or promotional responses",
    ],
  },
  {
    title: "3. How We Use Your Information",
    text: "We use collected information to:",
    points: [
      "Create and manage user accounts",
      "Facilitate buying and selling of goods and services",
      "Process payments, refunds, and withdrawals",
      "Provide customer support and resolve disputes",
      "Verify identity and prevent fraud",
      "Improve platform functionality and user experience",
      "Communicate service updates, notifications, and promotional messages",
      "Comply with legal, regulatory, and tax obligations",
    ],
  },
  {
    title: "4. Legal Basis for Processing (Where Applicable)",
    text: "We process personal data based on one or more of the following:",
    points: [
      "Your consent",
      "Performance of a contract (e.g., processing orders)",
      "Compliance with legal obligations",
      "Legitimate business interests (fraud prevention, platform improvement)",
    ],
  },
  {
    title: "5. Cookies and Tracking Technologies",
    text: "SkiShop uses cookies and similar technologies to:",
    points: [
      "Enable essential site functionality",
      "Remember user preferences",
      "Analyze traffic and usage patterns",
      "Deliver relevant marketing content",
      "You may manage or disable cookies through your browser settings. Disabling cookies may affect certain features of the Platform.",
    ],
  },
  {
    title: "6. Information Sharing and Disclosure",
    text: "We may share your information with:",
    points: [],
  },
  {
    title: "6.1 Vendors and Buyers",
    text: "Relevant information (such as name, address, and order details) is shared between buyers and sellers solely to fulfill transactions.",
    points: [],
  },
  {
    title: "6.2 Service Providers",
    text: "Third-party vendors providing services such as payment processing, cloud hosting, email delivery, analytics, logistics, and customer support.",
    points: [],
  },
  {
    title: "6.3 Legal and Regulatory Authorities",
    text: "Where required by law, court order, or governmental request.",
    points: [],
  },
  {
    title: "6.4 Business Transfers",
    text: "In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction.",
    points: ["We do not sell personal data to third parties."],
  },
  {
    title: "7. Data Storage and Security",
    text: "We implement appropriate technical and organizational measures to protect personal data, including:",
    points: [
      "Secure servers and encrypted databases",
      "Restricted access controls",
      "Regular monitoring and security updates",
      "Despite these measures, no system is completely secure. Users are responsible for maintaining the confidentiality of their login credentials.",
    ],
  },
  {
    title: "8. Data Retention",
    text: "We retain personal information only for as long as necessary to:",
    points: [
      "Provide the Services",
      "Fulfill contractual obligations",
      "Comply with legal and regulatory requirements",
      "Resolve disputes and enforce agreements",
      "When no longer required, data is securely deleted or anonymized.",
    ],
  },
  {
    title: "9. User Rights",
    text: "Subject to applicable laws, users may have the right to:",
    points: [
      "Access personal information we hold about them",
      "Request correction of inaccurate or incomplete data",
      "Request deletion of personal data",
      "Object to or restrict certain processing activities",
      "Withdraw consent (where processing is based on consent)",
      "Requests may be submitted via the contact details provided below.",
    ],
  },
  {
    title: "10. Vendor-Specific Privacy Obligations",
    text: "Vendors on SkiShop:",
    points: [
      "Are responsible for protecting buyer information received through the Platform",
      "Must not use buyer data for purposes outside order fulfillment without consent",
      "Must comply with applicable data protection laws",
      "Violation may result in suspension or permanent removal from the Platform.",
    ],
  },
  {
    title: "11. Children’s Privacy",
    text: "SkiShop is not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If such data is discovered, it will be deleted promptly.",
    points: [],
  },
  {
    title: "12. International Data Transfers",
    text: "User information may be processed or stored on servers located outside Nigeria. Where applicable, we take reasonable steps to ensure adequate data protection safeguards are in place.",
    points: [],
  },
  {
    title: "13. Third-Party Links",
    text: "The Platform may contain links to third-party websites or services. SkiShop is not responsible for the privacy practices or content of such third parties.",
    points: [],
  },
  {
    title: "14. Updates to This Privacy Policy",
    text: "We may update this Privacy Policy from time to time. Changes will be posted on the Platform with an updated effective date. Continued use of SkiShop after updates constitutes acceptance of the revised policy.",
    points: [],
  },
  {
    title: "15. Contact Information",
    text: "For questions, requests, or complaints regarding this Privacy Policy or data practices, please contact: Skicom Limited (SkiShop).\n\nBy using SkiShop, you acknowledge that you have read, understood, and agreed to this Privacy Policy.",
    points: ["Email: contact@skicomltd.com", "Website: www.skicomltd.com"],
  },
];

export const termsandconditions: LegalItem[] = [
  {
    title: "1. Introduction",
    text: "Ski-Shop is an online marketplace operated by Skicom Limited, a privately owned company duly registered under the laws of the Federal Republic of Nigeria. By accessing, browsing, registering, or making a purchase on our website or mobile platform, you agree to be bound by these Terms and Conditions, our Privacy Policy, and all applicable Nigerian laws and regulations. If you do not agree, you must discontinue use of the platform immediately.",
    points: [],
  },
  {
    title: "2. Orders and Payment",
    text: "",
    points: [
      "All orders placed on SkiShop are subject to product availability and vendor confirmation.",
      "Prices displayed are final unless otherwise stated and may include applicable taxes or fees.",
      "Full payment must be made through our approved payment gateway before any order is processed or shipped.",
      "We reserve the right to cancel or refuse any order due to pricing errors, suspected fraud, or policy violations.",
    ],
  },
  {
    title: "3. Shipping and Delivery",
    text: "",
    points: [
      "Delivery timelines provided are estimates and may vary due to location, logistics partners, weather conditions, or unforeseen circumstances.",
      "Skicom Limited is not responsible for delays, failures, or disruptions caused by third-party courier or logistics services.",
      "Risk of loss passes to the customer upon successful delivery confirmation by the courier.",
    ],
  },
  {
    title: "4. Marketplace Role and Limitation of Liability",
    text: "",
    points: [
      "SkiShop operates solely as a marketplace platform connecting buyers and independent third-party vendors.",
      "Skicom Limited is not a supplier, manufacturer, or direct seller of listed products unless explicitly stated.",
      "Vendors are solely responsible for product quality, authenticity, safety, compliance, warranties, and intellectual property rights.",
      "Skicom Limited shall not be liable for defects, misrepresentations, infringements, or disputes arising between buyers and vendors.",
    ],
  },
  {
    title: "5. Product Issues (Damaged, Misplaced, Lost, or Contraband Items)",
    text: "",
    points: [
      "Customers must report damaged, missing, misplaced, or incorrect items within forty-eight (48) hours of delivery.",
      "Failure to report within this period may result in claim rejection.",
      "Any vendor found listing prohibited, illegal, counterfeit, or contraband items will face immediate suspension, permanent account removal, and possible legal action under Nigerian law.",
    ],
  },
  {
    title: "6. Return and Refund Policy",
    text: "",
    points: [
      "Eligible items may be returned within three (3) days of receipt, subject to vendor-specific return policies.",
      "Returned items must be unused, in original condition, and comply with Nigerian consumer protection laws.",
      "Refunds will only be processed after inspection and confirmation of the returned item.",
      "Refunds are issued strictly through the original payment method used at checkout.",
      "Return shipping costs are borne by the customer unless the product is confirmed to be defective, damaged, or wrongly delivered.",
    ],
  },
  {
    title: "7. Customer Responsibility",
    text: "Customers agree to:",
    points: [
      "Provide accurate and complete delivery information.",
      "Maintain the confidentiality of login credentials and account details.",
      "Accept responsibility for all activities conducted through their account.",
    ],
  },
  {
    title: "8. Insurance",
    text: "Skicom Limited does not provide product or shipment insurance. Customers are advised to confirm insurance coverage directly with vendors where applicable.",
    points: [],
  },
  {
    title: "9. Data Privacy & Protection",
    text: "",
    points: [
      "Skicom Limited complies fully with the Nigeria Data Protection Act (NDPA) and related regulations.",
      "Personal data is collected and processed only for legitimate business purposes.",
      "Customer data will not be shared with third parties except where legally required, including valid court orders or regulatory mandates.",
    ],
  },
  {
    title: "10. Vendor Verification and Conduct",
    text: "",
    points: [
      "All vendors undergo an internal verification process before onboarding.",
      "Vendors must comply with platform rules, ethical business practices, and Nigerian laws.",
      "Any misconduct, fraud, or policy violation will result in suspension or permanent removal from the platform.",
    ],
  },
  {
    title: "11. Limitation of Liability",
    text: "To the fullest extent permitted by law, Skicom Limited shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use the platform, products, or services.",
    points: [],
  },
  {
    title: "12. Payment and Fraud Protection",
    text: "",
    points: [
      "All payments must be processed exclusively through SkiShop’s official payment gateway.",
      "Cash payments, direct transfers, or off-platform transactions are strictly prohibited.",
      "Skicom Limited bears no responsibility for losses resulting from transactions conducted outside the platform.",
    ],
  },
  {
    title: "13. Legal and Compliance Disclaimer",
    text: "Skicom Limited is a private entity and not affiliated with any government agency. We operate strictly under Nigerian law and do not engage in fraudulent, deceptive, or unlawful activities.",
    points: [],
  },
  {
    title: "14. Intellectual Property",
    text: "All website content, including text, graphics, logos, trademarks, images, and software, is owned by or licensed to Skicom Limited. Unauthorized reproduction, distribution, replication or use of any content is strictly prohibited.",
    points: [],
  },
  {
    title: "15. Changes to Terms",
    text: "Skicom Limited reserves the right to amend or update these Terms and Conditions at any time. Continued use of the platform after changes constitutes acceptance of the revised terms.",
    points: [],
  },
  {
    title: "16. Governing Law and Jurisdiction",
    text: "These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved exclusively in Nigerian courts.",
    points: [],
  },
  {
    title: "17. Force Majeure",
    text: "Skicom Limited shall not be held liable for any failure or delay in the performance of its obligations where such failure or delay results from events beyond its reasonable control. These events include, but are not limited to, acts of God, natural disasters, pandemics, epidemics, war, civil unrest, government actions, strikes, power outages, internet or network failures, or disruptions to logistics and courier services. During such events, service obligations may be suspended without liability until normal operations resume.",
    points: [],
  },
  {
    title: "18. Contraband, Prohibited, and Illegal Goods",
    text: "Vendors are strictly prohibited from listing, selling, or distributing any illegal, restricted, counterfeit, stolen, or contraband goods on the Ski-Shop platform. This includes items banned under Nigerian law, regulatory directives, or international trade restrictions.\n\nAny vendor found engaging in the sale or attempted sale of contraband items will face immediate account suspension, permanent removal from the platform, forfeiture of earnings where applicable, and possible reporting to law enforcement or regulatory authorities. Skicom Limited reserves the right to remove such listings without prior notice.",
    points: [],
  },
  {
    title: "19. Vendor Withdrawal and Account Deactivation",
    text: "Vendors wishing to withdraw from the SkiShop marketplace must wait a minimum of seven (7) days to Skicom Limited. All pending orders, disputes, refunds, and customer obligations must be fully resolved before account deactivation is approved. Skicom Limited reserves the right to withhold payouts where unresolved issues remain.",
    points: [],
  },
  {
    title: "20. Vendor Misconduct, Penalties, and Enforcement",
    text: "Any form of misconduct including, but not limited to, fraud, misrepresentation, poor fulfillment practices, customer abuse, policy violations, or illegal activities will attract penalties.\n\nPenalties may include temporary suspension, restriction of listings, withholding of funds, or permanent removal from the platform, depending on the severity of the violation. Skicom Limited’s decision in enforcing penalties shall be final, subject to applicable Nigerian laws.",
    points: [],
  },
  {
    title: "Contact & Support",
    text: "For questions, complaints, or support inquiries, please contact: contact@skicomltd.com",
    points: [],
  },
];
