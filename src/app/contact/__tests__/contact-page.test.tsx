import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ContactPage from '../page';

// Mock the Button component
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  PhoneIcon: () => <svg data-testid="phone-icon" />,
  EnvelopeIcon: () => <svg data-testid="envelope-icon" />,
  MapPinIcon: () => <svg data-testid="map-icon" />,
  ClockIcon: () => <svg data-testid="clock-icon" />,
}));

describe('ContactPage', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render the contact form with all required fields', () => {
      render(<ContactPage />);
      
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
      expect(screen.getByText('Get Your Free Consultation')).toBeInTheDocument();
      expect(screen.getByText('Fill out the form below and we\'ll contact you within 72 hours to discuss your case.')).toBeInTheDocument();
      
      // Check form fields
      expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Service Needed *')).toBeInTheDocument();
      expect(screen.getByLabelText('Medical Condition/Disability')).toBeInTheDocument();
      expect(screen.getByLabelText('Timeline')).toBeInTheDocument();
      expect(screen.getByLabelText('Additional Information')).toBeInTheDocument();
      
      expect(screen.getByRole('button', { name: 'Submit Inquiry' })).toBeInTheDocument();
    });

    it('should display masked phone numbers in contact information', () => {
      render(<ContactPage />);
      
      const maskedPhone = screen.getAllByText('************');
      expect(maskedPhone.length).toBeGreaterThan(0);
    });

    it('should display the updated address', () => {
      render(<ContactPage />);
      
      expect(screen.getByText('11801 Pierce Street Riverside Ca 92505')).toBeInTheDocument();
    });

    it('should display the commitment message section', () => {
      render(<ContactPage />);
      
      expect(screen.getByText('Our Commitment to You')).toBeInTheDocument();
      expect(screen.getByText(/Thank you for considering our services/)).toBeInTheDocument();
      expect(screen.getByText(/respond within 72 hours/)).toBeInTheDocument();
      expect(screen.getByText('Visits are by appointment only; please schedule in advance.')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields when submitted empty', async () => {
      render(<ContactPage />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Please select a service')).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      render(<ContactPage />);
      
      const emailInput = screen.getByLabelText('Email Address *');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('should validate first name length', async () => {
      render(<ContactPage />);
      
      const firstNameInput = screen.getByLabelText('First Name *');
      fireEvent.change(firstNameInput, { target: { value: 'a'.repeat(51) } });
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('First name is too long')).toBeInTheDocument();
      });
    });

    it('should validate last name length', async () => {
      render(<ContactPage />);
      
      const lastNameInput = screen.getByLabelText('Last Name *');
      fireEvent.change(lastNameInput, { target: { value: 'a'.repeat(51) } });
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Last name is too long')).toBeInTheDocument();
      });
    });

    it('should show "Other" service specification field when "Other" is selected', async () => {
      render(<ContactPage />);
      
      const serviceSelect = screen.getByLabelText('Service Needed *');
      fireEvent.change(serviceSelect, { target: { value: 'Other (please specify)' } });
      
      await waitFor(() => {
        expect(screen.getByLabelText('Please specify the service you need *')).toBeInTheDocument();
      });
    });

    it('should validate "Other" service specification when selected', async () => {
      render(<ContactPage />);
      
      const serviceSelect = screen.getByLabelText('Service Needed *');
      fireEvent.change(serviceSelect, { target: { value: 'Other (please specify)' } });
      
      await waitFor(() => {
        const otherServiceInput = screen.getByLabelText('Please specify the service you need *');
        expect(otherServiceInput).toBeInTheDocument();
      });
      
      // Submit without filling the other service field
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please specify the service you need')).toBeInTheDocument();
      });
    });

    it('should clear validation errors when user starts typing', async () => {
      render(<ContactPage />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
      
      const firstNameInput = screen.getByLabelText('First Name *');
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      
      await waitFor(() => {
        expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    const fillValidForm = () => {
      fireEvent.change(screen.getByLabelText('First Name *'), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText('Last Name *'), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'john.doe@example.com' } });
      fireEvent.change(screen.getByLabelText('Service Needed *'), { target: { value: 'Comprehensive Nexus Letter' } });
    };

    it('should show loading state during form submission', async () => {
      render(<ContactPage />);
      
      fillValidForm();
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Submitting...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it('should show success message after successful submission', async () => {
      render(<ContactPage />);
      
      fillValidForm();
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Thank You!')).toBeInTheDocument();
        expect(screen.getByText(/We've received your inquiry and will contact you within 72 hours/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should show error message when submission fails', async () => {
      // Mock Math.random to always return a value that triggers error
      const originalRandom = Math.random;
      Math.random = vi.fn(() => 0.05); // Less than 0.1, triggers error
      
      render(<ContactPage />);
      
      fillValidForm();
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Network error occurred. Please try again.')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      // Restore original Math.random
      Math.random = originalRandom;
    });

    it('should allow submitting another inquiry from success page', async () => {
      render(<ContactPage />);
      
      fillValidForm();
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Thank You!')).toBeInTheDocument();
      }, { timeout: 3000 });
      
      const anotherInquiryButton = screen.getByText('Submit Another Inquiry');
      fireEvent.click(anotherInquiryButton);
      
      await waitFor(() => {
        expect(screen.getByText('Get Your Free Consultation')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit Inquiry' })).toBeInTheDocument();
      });
    });
  });

  describe('Contact Information', () => {
    it('should display all contact information sections', () => {
      render(<ContactPage />);
      
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('Business Hours')).toBeInTheDocument();
    });

    it('should display emergency cases section', () => {
      render(<ContactPage />);
      
      expect(screen.getByText('Emergency Cases')).toBeInTheDocument();
      expect(screen.getByText(/If you have an urgent deadline/)).toBeInTheDocument();
    });

    it('should have working email link', () => {
      render(<ContactPage />);
      
      const emailLink = screen.getByText('info@thebestnexusletters.com');
      expect(emailLink).toHaveAttribute('href', 'mailto:info@thebestnexusletters.com');
    });
  });

  describe('Service Options', () => {
    it('should display all service options', () => {
      render(<ContactPage />);
      
      const serviceSelect = screen.getByLabelText('Service Needed *');
      
      expect(serviceSelect).toBeInTheDocument();
      
      // Check that all service options are available
      const expectedServices = [
        'Comprehensive Nexus Letter',
        'Nexus Letter Consultation', 
        'Expedited Service',
        'Letter Review & Revision',
        'Independent Medical Examination (IME)',
        'Other (please specify)',
      ];
      
      expectedServices.forEach(service => {
        expect(screen.getByRole('option', { name: service })).toBeInTheDocument();
      });
    });
  });

  describe('Timeline Options', () => {
    it('should display all timeline options with updated text', () => {
      render(<ContactPage />);
      
      const timelineSelect = screen.getByLabelText('Timeline');
      
      expect(timelineSelect).toBeInTheDocument();
      
      // Check that all timeline options are available
      expect(screen.getByRole('option', { name: 'Standard (7-10 business days)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Expedited (3-5 business days)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Urgent (As soon as possible)' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<ContactPage />);
      
      expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Service Needed *')).toBeInTheDocument();
      expect(screen.getByLabelText('Medical Condition/Disability')).toBeInTheDocument();
      expect(screen.getByLabelText('Timeline')).toBeInTheDocument();
      expect(screen.getByLabelText('Additional Information')).toBeInTheDocument();
    });

    it('should show validation errors with proper accessibility', async () => {
      render(<ContactPage />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/is required|Please/);
        expect(errorMessages.length).toBeGreaterThan(0);
        
        // Check that error messages are properly associated with form fields
        errorMessages.forEach(error => {
          expect(error).toHaveClass('text-red-600');
        });
      });
    });
  });

  describe('Form Field Styling', () => {
    it('should apply error styling to invalid fields', async () => {
      render(<ContactPage />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const firstNameInput = screen.getByLabelText('First Name *');
        expect(firstNameInput).toHaveClass('border-red-500');
      });
    });

    it('should remove error styling when field becomes valid', async () => {
      render(<ContactPage />);
      
      // Submit to trigger validation
      const submitButton = screen.getByRole('button', { name: 'Submit Inquiry' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const firstNameInput = screen.getByLabelText('First Name *');
        expect(firstNameInput).toHaveClass('border-red-500');
      });
      
      // Fix the field
      const firstNameInput = screen.getByLabelText('First Name *');
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      
      await waitFor(() => {
        expect(firstNameInput).not.toHaveClass('border-red-500');
        expect(firstNameInput).toHaveClass('focus:border-primary');
      });
    });
  });
});
