// src/data/plans.js
export const plans = [
  {
    id: "1",
    name: "Basic Student Plan",
    price: 89,
    coverage: ["Medical", "Dental", "Vision"],
    description: "Essential coverage for students on a budget",
    providers: ["p1", "p2"],
  },
  // Add more plans...
];

export const providers = [
  {
    id: "p1",
    name: "Campus Health Providers",
    rating: 4.5,
    price: 89,
    benefits: ["24/7 Telehealth", "No deductible"],
    contact: "contact@campushealth.edu",
  },
  // Add more providers...
];
