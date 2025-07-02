// utils/validators.ts
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPhone = (phone: string) => /^\+20[0-9]{10}$/.test(phone);
export const isValidSubdomain = (subdomain: string) => /^[a-zA-Z0-9]+$/.test(subdomain);