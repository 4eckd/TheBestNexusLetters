/**
 * Validation Schemas using Zod
 * Provides comprehensive validation for all user input
 */

import { z } from 'zod';
import type { UserRole, ClaimStatus, ClaimType, ActivityType } from './supabase';

// =================================
// COMMON VALIDATION SCHEMAS
// =================================

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
  .optional();

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username is too long')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens');

// =================================
// USER VALIDATION SCHEMAS
// =================================

export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: nameSchema,
  username: usernameSchema,
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const userProfileUpdateSchema = z.object({
  fullName: nameSchema.optional(),
  username: usernameSchema.optional(),
  phone: phoneSchema,
  bio: z.string().max(500, 'Bio is too long').optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location is too long').optional(),
  avatarUrl: z.string().url('Please enter a valid avatar URL').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// =================================
// CLAIM VALIDATION SCHEMAS
// =================================

export const claimSubmissionSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title is too long'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description is too long'),
  claimType: z.enum(['complaint', 'request', 'suggestion', 'bug_report', 'other'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const).default('medium'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category is too long'),
  relatedUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  attachments: z
    .array(z.object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      url: z.string().url(),
    }))
    .max(10, 'Maximum 10 attachments allowed')
    .optional(),
  expectedResolution: z
    .string()
    .max(1000, 'Expected resolution is too long')
    .optional(),
  contactPreference: z.enum(['email', 'phone', 'both'] as const).default('email'),
});

export const claimUpdateSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title is too long')
    .optional(),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description is too long')
    .optional(),
  status: z.enum(['pending', 'under_review', 'approved', 'rejected'] as const).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const).optional(),
  category: z
    .string()
    .max(50, 'Category is too long')
    .optional(),
  assignedTo: z.string().uuid('Invalid user ID').optional(),
  resolution: z
    .string()
    .max(2000, 'Resolution is too long')
    .optional(),
});

export const claimCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment is too long'),
  isInternal: z.boolean().default(false),
});

// =================================
// CONTACT FORM VALIDATION SCHEMAS
// =================================

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject is too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
  category: z.enum(['general', 'support', 'sales', 'technical', 'partnership'] as const),
  urgency: z.enum(['low', 'medium', 'high'] as const).default('medium'),
  agreesToContact: z.boolean().refine(val => val === true, {
    message: 'You must agree to be contacted'
  }),
});

// Contact form schema for the nexus letters contact page
export const nexusContactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  email: emailSchema,
  phone: phoneSchema,
  service: z
    .string()
    .min(1, 'Please select a service'),
  otherService: z
    .string()
    .max(200, 'Service description is too long')
    .optional(),
  condition: z
    .string()
    .max(200, 'Condition description is too long')
    .optional(),
  message: z
    .string()
    .max(2000, 'Message is too long')
    .optional(),
  urgency: z.enum(['standard', 'expedited', 'urgent'] as const).default('standard'),
}).refine(data => {
  // If "Other" service is selected, otherService must be provided
  if (data.service === 'Other (please specify)' && (!data.otherService || data.otherService.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Please specify the service you need',
  path: ['otherService'],
});

// =================================
// SEARCH AND FILTER SCHEMAS
// =================================

export const searchSchema = z.object({
  query: z.string().max(200, 'Search query is too long').optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['created_at', 'updated_at', 'title', 'status'] as const).default('created_at'),
  sortOrder: z.enum(['asc', 'desc'] as const).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const filterSchema = z.object({
  status: z.array(z.string()).optional(),
  claimType: z.array(z.string()).optional(),
  priority: z.array(z.string()).optional(),
  assignedTo: z.array(z.string()).optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
});

// =================================
// FILE UPLOAD VALIDATION SCHEMAS
// =================================

export const fileUploadSchema = z.object({
  files: z
    .array(z.object({
      name: z.string().min(1, 'Filename is required'),
      size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
      type: z.string().refine(
        type => [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'text/csv',
        ].includes(type),
        'File type not supported'
      ),
    }))
    .min(1, 'At least one file is required')
    .max(10, 'Maximum 10 files allowed'),
});

// =================================
// ADMIN VALIDATION SCHEMAS
// =================================

export const userRoleUpdateSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.enum(['user', 'moderator', 'admin'] as const),
});

export const bulkActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'assign', 'delete'] as const),
  items: z.array(z.string().uuid('Invalid item ID')).min(1, 'Select at least one item'),
  assignTo: z.string().uuid('Invalid user ID').optional(),
  reason: z.string().max(500, 'Reason is too long').optional(),
});

// =================================
// SETTINGS VALIDATION SCHEMAS
// =================================

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  smsNotifications: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
  claimUpdates: z.boolean().default(true),
  systemAnnouncements: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'contacts_only'] as const).default('public'),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  allowIndexing: z.boolean().default(true),
  dataRetention: z.enum(['1_year', '2_years', '5_years', 'indefinite'] as const).default('5_years'),
});

// =================================
// TYPE EXPORTS FOR REACT HOOK FORM
// =================================

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
export type UserProfileUpdateData = z.infer<typeof userProfileUpdateSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export type ClaimSubmissionData = z.infer<typeof claimSubmissionSchema>;
export type ClaimUpdateData = z.infer<typeof claimUpdateSchema>;
export type ClaimCommentData = z.infer<typeof claimCommentSchema>;

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NexusContactFormData = z.infer<typeof nexusContactFormSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type FilterData = z.infer<typeof filterSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;

export type UserRoleUpdateData = z.infer<typeof userRoleUpdateSchema>;
export type BulkActionData = z.infer<typeof bulkActionSchema>;

export type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>;
export type PrivacySettingsData = z.infer<typeof privacySettingsSchema>;
