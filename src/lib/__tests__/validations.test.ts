import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  nameSchema,
  usernameSchema,
  userRegistrationSchema,
  userLoginSchema,
  userProfileUpdateSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  claimSubmissionSchema,
  claimUpdateSchema,
  claimCommentSchema,
  contactFormSchema,
  nexusContactFormSchema,
  searchSchema,
  filterSchema,
  fileUploadSchema,
  userRoleUpdateSchema,
  bulkActionSchema,
  notificationSettingsSchema,
  privacySettingsSchema,
} from '../validations';

describe('Validation Schemas', () => {
  describe('Common Schemas', () => {
    describe('emailSchema', () => {
      it('should validate correct email addresses', () => {
        const validEmails = [
          'test@example.com',
          'user.name@domain.co.uk',
          'user+tag@domain.com',
          'a@b.co',
        ];

        validEmails.forEach(email => {
          expect(() => emailSchema.parse(email)).not.toThrow();
        });
      });

      it('should reject invalid email addresses', () => {
        const invalidEmails = [
          '',
          'invalid',
          'test@',
          '@domain.com',
          'test@.com',
          'test@domain.',
          'a'.repeat(250) + '@domain.com', // Too long
        ];

        invalidEmails.forEach(email => {
          expect(() => emailSchema.parse(email)).toThrow();
        });
      });
    });

    describe('passwordSchema', () => {
      it('should validate strong passwords', () => {
        const validPasswords = [
          'Password123!',
          'MyStr0ng@Pass',
          'C0mplex$Password',
          'Valid1234#',
        ];

        validPasswords.forEach(password => {
          expect(() => passwordSchema.parse(password)).not.toThrow();
        });
      });

      it('should reject weak passwords', () => {
        const invalidPasswords = [
          '', // Empty
          'short', // Too short
          'nouppercase123!', // No uppercase
          'NOLOWERCASE123!', // No lowercase
          'NoNumbers!', // No numbers
          'NoSpecial123', // No special characters
          'a'.repeat(130), // Too long
        ];

        invalidPasswords.forEach(password => {
          expect(() => passwordSchema.parse(password)).toThrow();
        });
      });
    });

    describe('phoneSchema', () => {
      it('should validate correct phone numbers', () => {
        const validPhones = [
          '+1234567890',
          '1234567890',
          '+441234567890',
          '+8613812345678',
        ];

        validPhones.forEach(phone => {
          expect(() => phoneSchema.parse(phone)).not.toThrow();
        });
      });

      it('should handle optional phone numbers', () => {
        expect(() => phoneSchema.parse(undefined)).not.toThrow();
        expect(() => phoneSchema.parse('')).toThrow(); // Empty string is invalid
      });

      it('should reject invalid phone numbers', () => {
        const invalidPhones = [
          '123', // Too short
          '+0123456789', // Starts with 0 after +
          'abc123456789', // Contains letters
          '+123456789012345678', // Too long
        ];

        invalidPhones.forEach(phone => {
          expect(() => phoneSchema.parse(phone)).toThrow();
        });
      });
    });

    describe('nameSchema', () => {
      it('should validate correct names', () => {
        const validNames = [
          'John Doe',
          "O'Connor",
          'Mary-Jane',
          'José',
          'Van Der Berg',
        ];

        validNames.forEach(name => {
          expect(() => nameSchema.parse(name)).not.toThrow();
        });
      });

      it('should reject invalid names', () => {
        const invalidNames = [
          '', // Empty
          'John123', // Contains numbers
          'John@Doe', // Contains special characters
          'a'.repeat(101), // Too long
        ];

        invalidNames.forEach(name => {
          expect(() => nameSchema.parse(name)).toThrow();
        });
      });
    });

    describe('usernameSchema', () => {
      it('should validate correct usernames', () => {
        const validUsernames = [
          'johndoe',
          'john_doe',
          'john-doe',
          'user123',
          'abc',
        ];

        validUsernames.forEach(username => {
          expect(() => usernameSchema.parse(username)).not.toThrow();
        });
      });

      it('should reject invalid usernames', () => {
        const invalidUsernames = [
          '', // Empty
          'ab', // Too short
          'user with space', // Contains space
          'user@name', // Contains @
          'a'.repeat(31), // Too long
        ];

        invalidUsernames.forEach(username => {
          expect(() => usernameSchema.parse(username)).toThrow();
        });
      });
    });
  });

  describe('User Schemas', () => {
    describe('userRegistrationSchema', () => {
      it('should validate correct registration data', () => {
        const validData = {
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          fullName: 'John Doe',
          username: 'johndoe',
          agreedToTerms: true,
        };

        expect(() => userRegistrationSchema.parse(validData)).not.toThrow();
      });

      it('should reject when passwords do not match', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'DifferentPassword123!',
          fullName: 'John Doe',
          username: 'johndoe',
          agreedToTerms: true,
        };

        expect(() => userRegistrationSchema.parse(invalidData)).toThrow();
      });

      it('should reject when terms are not agreed', () => {
        const invalidData = {
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          fullName: 'John Doe',
          username: 'johndoe',
          agreedToTerms: false,
        };

        expect(() => userRegistrationSchema.parse(invalidData)).toThrow();
      });
    });

    describe('userLoginSchema', () => {
      it('should validate correct login data', () => {
        const validData = {
          email: 'test@example.com',
          password: 'anypassword',
          rememberMe: true,
        };

        expect(() => userLoginSchema.parse(validData)).not.toThrow();
      });

      it('should validate without rememberMe field', () => {
        const validData = {
          email: 'test@example.com',
          password: 'anypassword',
        };

        expect(() => userLoginSchema.parse(validData)).not.toThrow();
      });
    });

    describe('changePasswordSchema', () => {
      it('should validate correct password change data', () => {
        const validData = {
          currentPassword: 'oldpassword',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        };

        expect(() => changePasswordSchema.parse(validData)).not.toThrow();
      });

      it('should reject when new passwords do not match', () => {
        const invalidData = {
          currentPassword: 'oldpassword',
          newPassword: 'NewPassword123!',
          confirmPassword: 'DifferentPassword123!',
        };

        expect(() => changePasswordSchema.parse(invalidData)).toThrow();
      });
    });
  });

  describe('Claim Schemas', () => {
    describe('claimSubmissionSchema', () => {
      it('should validate correct claim submission data', () => {
        const validData = {
          title: 'Test Claim Title',
          description: 'This is a detailed description of the claim that meets the minimum length requirement.',
          claimType: 'complaint' as const,
          priority: 'medium' as const,
          category: 'General',
          contactPreference: 'email' as const,
        };

        expect(() => claimSubmissionSchema.parse(validData)).not.toThrow();
      });

      it('should reject short titles and descriptions', () => {
        const invalidData = {
          title: 'Too short', // Less than 5 characters
          description: 'Too short desc', // Less than 20 characters
          claimType: 'complaint' as const,
          category: 'General',
        };

        expect(() => claimSubmissionSchema.parse(invalidData)).toThrow();
      });

      it('should validate with optional fields', () => {
        const validData = {
          title: 'Test Claim Title',
          description: 'This is a detailed description of the claim that meets the minimum length requirement.',
          claimType: 'bug_report' as const,
          category: 'Technical',
          relatedUrl: 'https://example.com',
          expectedResolution: 'Please fix this issue',
          attachments: [
            {
              name: 'screenshot.png',
              size: 1024000,
              type: 'image/png',
              url: 'https://example.com/file.png',
            },
          ],
        };

        expect(() => claimSubmissionSchema.parse(validData)).not.toThrow();
      });

      it('should reject too many attachments', () => {
        const invalidData = {
          title: 'Test Claim Title',
          description: 'This is a detailed description of the claim.',
          claimType: 'complaint' as const,
          category: 'General',
          attachments: Array(11).fill({
            name: 'file.pdf',
            size: 1000,
            type: 'application/pdf',
            url: 'https://example.com/file.pdf',
          }),
        };

        expect(() => claimSubmissionSchema.parse(invalidData)).toThrow();
      });
    });

    describe('claimCommentSchema', () => {
      it('should validate correct comment data', () => {
        const validData = {
          content: 'This is a valid comment.',
          isInternal: false,
        };

        expect(() => claimCommentSchema.parse(validData)).not.toThrow();
      });

      it('should reject empty comments', () => {
        const invalidData = {
          content: '',
        };

        expect(() => claimCommentSchema.parse(invalidData)).toThrow();
      });
    });
  });

  describe('Contact Form Schema', () => {
    describe('contactFormSchema', () => {
      it('should validate correct contact form data', () => {
        const validData = {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          subject: 'Inquiry about services',
          message: 'I would like more information about your services.',
          category: 'general' as const,
          urgency: 'medium' as const,
          agreesToContact: true,
        };

        expect(() => contactFormSchema.parse(validData)).not.toThrow();
      });

      it('should reject when agreesToContact is false', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test subject',
          message: 'Test message that is long enough.',
          category: 'general' as const,
          agreesToContact: false,
        };

        expect(() => contactFormSchema.parse(invalidData)).toThrow();
      });

      it('should reject short subjects and messages', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Hi', // Too short
          message: 'Short', // Too short
          category: 'general' as const,
          agreesToContact: true,
        };

        expect(() => contactFormSchema.parse(invalidData)).toThrow();
      });
    });

    describe('nexusContactFormSchema', () => {
      it('should validate correct nexus contact form data', () => {
        const validData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          service: 'Comprehensive Nexus Letter',
          condition: 'PTSD',
          message: 'I need help with my VA claim.',
          urgency: 'standard' as const,
        };

        expect(() => nexusContactFormSchema.parse(validData)).not.toThrow();
      });

      it('should require firstName and lastName', () => {
        const invalidData = {
          firstName: '',
          lastName: '',
          email: 'john@example.com',
          service: 'Comprehensive Nexus Letter',
          urgency: 'standard' as const,
        };

        expect(() => nexusContactFormSchema.parse(invalidData)).toThrow();
      });

      it('should validate "Other" service with otherService field', () => {
        const validData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          service: 'Other (please specify)',
          otherService: 'Custom medical evaluation',
          urgency: 'standard' as const,
        };

        expect(() => nexusContactFormSchema.parse(validData)).not.toThrow();
      });

      it('should reject "Other" service without otherService field', () => {
        const invalidData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          service: 'Other (please specify)',
          otherService: '',
          urgency: 'standard' as const,
        };

        expect(() => nexusContactFormSchema.parse(invalidData)).toThrow();
      });

      it('should validate all urgency options', () => {
        const urgencyOptions = ['standard', 'expedited', 'urgent'] as const;
        
        urgencyOptions.forEach(urgency => {
          const validData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            service: 'Comprehensive Nexus Letter',
            urgency,
          };

          expect(() => nexusContactFormSchema.parse(validData)).not.toThrow();
        });
      });

      it('should allow optional fields to be empty', () => {
        const validData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          service: 'Comprehensive Nexus Letter',
          phone: undefined,
          condition: undefined,
          message: undefined,
          urgency: 'standard' as const,
        };

        expect(() => nexusContactFormSchema.parse(validData)).not.toThrow();
      });

      it('should validate field length limits', () => {
        const invalidData = {
          firstName: 'a'.repeat(51), // Too long
          lastName: 'b'.repeat(51), // Too long
          email: 'john@example.com',
          service: 'Comprehensive Nexus Letter',
          condition: 'c'.repeat(201), // Too long
          message: 'd'.repeat(2001), // Too long
          otherService: 'e'.repeat(201), // Too long
          urgency: 'standard' as const,
        };

        expect(() => nexusContactFormSchema.parse(invalidData)).toThrow();
      });
    });
  });

  describe('Search and Filter Schemas', () => {
    describe('searchSchema', () => {
      it('should validate search parameters with defaults', () => {
        const validData = {};
        const result = searchSchema.parse(validData);

        expect(result.sortBy).toBe('created_at');
        expect(result.sortOrder).toBe('desc');
        expect(result.page).toBe(1);
        expect(result.limit).toBe(20);
      });

      it('should validate custom search parameters', () => {
        const validData = {
          query: 'test search',
          category: 'technical',
          status: 'pending',
          sortBy: 'title' as const,
          sortOrder: 'asc' as const,
          page: 2,
          limit: 50,
        };

        expect(() => searchSchema.parse(validData)).not.toThrow();
      });

      it('should reject invalid page and limit values', () => {
        const invalidData = {
          page: 0, // Must be >= 1
          limit: 101, // Must be <= 100
        };

        expect(() => searchSchema.parse(invalidData)).toThrow();
      });
    });

    describe('filterSchema', () => {
      it('should validate filter parameters', () => {
        const validData = {
          status: ['pending', 'approved'],
          priority: ['high', 'urgent'],
          dateRange: {
            from: new Date('2024-01-01'),
            to: new Date('2024-12-31'),
          },
        };

        expect(() => filterSchema.parse(validData)).not.toThrow();
      });
    });
  });

  describe('File Upload Schema', () => {
    describe('fileUploadSchema', () => {
      it('should validate correct file upload data', () => {
        const validData = {
          files: [
            {
              name: 'document.pdf',
              size: 5 * 1024 * 1024, // 5MB
              type: 'application/pdf',
            },
            {
              name: 'image.jpg',
              size: 2 * 1024 * 1024, // 2MB
              type: 'image/jpeg',
            },
          ],
        };

        expect(() => fileUploadSchema.parse(validData)).not.toThrow();
      });

      it('should reject files that are too large', () => {
        const invalidData = {
          files: [
            {
              name: 'large-file.pdf',
              size: 15 * 1024 * 1024, // 15MB - exceeds 10MB limit
              type: 'application/pdf',
            },
          ],
        };

        expect(() => fileUploadSchema.parse(invalidData)).toThrow();
      });

      it('should reject unsupported file types', () => {
        const invalidData = {
          files: [
            {
              name: 'script.exe',
              size: 1024,
              type: 'application/x-executable', // Not allowed
            },
          ],
        };

        expect(() => fileUploadSchema.parse(invalidData)).toThrow();
      });

      it('should reject too many files', () => {
        const files = Array(11).fill({
          name: 'file.txt',
          size: 1024,
          type: 'text/plain',
        });

        const invalidData = { files };

        expect(() => fileUploadSchema.parse(invalidData)).toThrow();
      });

      it('should reject empty file array', () => {
        const invalidData = { files: [] };

        expect(() => fileUploadSchema.parse(invalidData)).toThrow();
      });
    });
  });

  describe('Admin Schemas', () => {
    describe('userRoleUpdateSchema', () => {
      it('should validate role update data', () => {
        const validData = {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          role: 'moderator' as const,
        };

        expect(() => userRoleUpdateSchema.parse(validData)).not.toThrow();
      });

      it('should reject invalid UUID', () => {
        const invalidData = {
          userId: 'invalid-uuid',
          role: 'admin' as const,
        };

        expect(() => userRoleUpdateSchema.parse(invalidData)).toThrow();
      });
    });

    describe('bulkActionSchema', () => {
      it('should validate bulk action data', () => {
        const validData = {
          action: 'approve' as const,
          items: ['123e4567-e89b-12d3-a456-426614174000'],
          reason: 'Bulk approval process',
        };

        expect(() => bulkActionSchema.parse(validData)).not.toThrow();
      });

      it('should reject empty items array', () => {
        const invalidData = {
          action: 'delete' as const,
          items: [],
        };

        expect(() => bulkActionSchema.parse(invalidData)).toThrow();
      });
    });
  });

  describe('Settings Schemas', () => {
    describe('notificationSettingsSchema', () => {
      it('should validate with default values', () => {
        const validData = {};
        const result = notificationSettingsSchema.parse(validData);

        expect(result.emailNotifications).toBe(true);
        expect(result.pushNotifications).toBe(false);
        expect(result.claimUpdates).toBe(true);
      });

      it('should validate custom notification settings', () => {
        const validData = {
          emailNotifications: false,
          pushNotifications: true,
          smsNotifications: true,
          marketingEmails: true,
        };

        expect(() => notificationSettingsSchema.parse(validData)).not.toThrow();
      });
    });

    describe('privacySettingsSchema', () => {
      it('should validate with default values', () => {
        const validData = {};
        const result = privacySettingsSchema.parse(validData);

        expect(result.profileVisibility).toBe('public');
        expect(result.showEmail).toBe(false);
        expect(result.allowIndexing).toBe(true);
      });

      it('should validate custom privacy settings', () => {
        const validData = {
          profileVisibility: 'private' as const,
          showEmail: true,
          dataRetention: '2_years' as const,
        };

        expect(() => privacySettingsSchema.parse(validData)).not.toThrow();
      });
    });
  });

  describe('Edge Cases and Error Messages', () => {
    it('should provide meaningful error messages', () => {
      try {
        emailSchema.parse('invalid-email');
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError);
        const zodError = error as z.ZodError;
        expect(zodError.errors[0].message).toBe('Please enter a valid email address');
      }
    });

    it('should handle nested validation errors', () => {
      const invalidRegistration = {
        email: 'invalid',
        password: 'weak',
        confirmPassword: 'different',
        fullName: '',
        username: 'ab',
        agreedToTerms: false,
      };

      try {
        userRegistrationSchema.parse(invalidRegistration);
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError);
        const zodError = error as z.ZodError;
        expect(zodError.errors.length).toBeGreaterThan(1);
      }
    });

    it('should handle optional fields correctly', () => {
      const dataWithOptionals = {
        fullName: 'John Doe',
        website: '', // Empty string should be valid for optional URL
        bio: undefined, // Undefined should be valid
      };

      expect(() => userProfileUpdateSchema.parse(dataWithOptionals)).not.toThrow();
    });

    it('should validate enum values strictly', () => {
      const invalidClaimType = {
        title: 'Valid Title',
        description: 'Valid description that meets length requirements.',
        claimType: 'invalid_type', // Not in enum
        category: 'General',
      };

      expect(() => claimSubmissionSchema.parse(invalidClaimType)).toThrow();
    });
  });
});
