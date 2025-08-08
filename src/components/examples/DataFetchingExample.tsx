/**
 * Example component showcasing data fetching, validation, error & loading states
 */

import React, { Suspense } from 'react';
import { useUser, useUserClaims, useSubmitClaim } from '@/hooks';
import { useForm } from '@/hooks/use-form';
import { claimSubmissionSchema, type ClaimSubmissionData } from '@/lib/validations';
import { 
  LoadingSpinner, 
  ErrorAlert, 
  ValidationErrorAlert, 
  ComponentLoadingFallback,
  TableLoadingFallback 
} from '@/components/feedback';
import { ErrorBoundary, DataErrorBoundary } from '@/components/providers';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// =================================
// USER PROFILE SECTION
// =================================

const UserProfileSection: React.FC = () => {
  const { user, isLoading, error, refreshUser } = useUser();

  if (isLoading) {
    return <ComponentLoadingFallback text="Loading profile..." />;
  }

  if (error) {
    return (
      <ErrorAlert
        error={error}
        title="Failed to load profile"
        showRetry
        onRetry={refreshUser}
      />
    );
  }

  if (!user) {
    return (
      <ErrorAlert
        error="Please sign in to view your profile"
        variant="info"
        title="Authentication Required"
      />
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">User Profile</h3>
      <div className="space-y-2">
        <p><span className="font-medium">Name:</span> {user.full_name}</p>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Role:</span> {user.role}</p>
        <p><span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </Card>
  );
};

// =================================
// USER CLAIMS SECTION
// =================================

const UserClaimsSection: React.FC = () => {
  const { user } = useUser();
  const { claims, isLoading, error, refreshClaims } = useUserClaims(user?.id, {
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Claims</h3>
        <TableLoadingFallback rows={5} columns={3} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert
        error={error}
        title="Failed to load claims"
        showRetry
        onRetry={refreshClaims}
        category="server"
      />
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Claims ({claims.length})</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshClaims}
          startIcon={<LoadingSpinner variant="spinner" size="xs" inline />}
        >
          Refresh
        </Button>
      </div>

      {claims.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No claims found. Submit your first claim below!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{claim.title}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                  claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  claim.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {claim.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {claim.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {new Date(claim.created_at).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500">
                  #{claim.claim_number}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// =================================
// CLAIM SUBMISSION FORM
// =================================

const ClaimSubmissionForm: React.FC = () => {
  const { submitClaim, isSubmitting } = useSubmitClaim();
  const { refreshClaims } = useUserClaims();

  const form = useForm<ClaimSubmissionData>({
    schema: claimSubmissionSchema,
    resetOnSuccess: true,
    onSubmit: async (data) => {
      await submitClaim({
        ...data,
        user_id: 'current-user-id', // This would be from auth context
      });
      
      // Refresh claims list after successful submission
      refreshClaims();
    },
  });

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Submit New Claim</h3>
      
      <form onSubmit={form.handleSubmit(form.submit)} className="space-y-4">
        {/* Form Error Display */}
        {form.submitError && (
          <ErrorAlert
            error={form.submitError}
            variant="destructive"
            dismissible
            onDismiss={form.clearError}
            showRetry
            onRetry={() => form.submit()}
          />
        )}

        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Claim Title *
          </label>
          <input
            {...form.register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of your claim"
          />
          {form.formState.errors.title && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            {...form.register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide detailed information about your claim"
          />
          {form.formState.errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Claim Type Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Claim Type *
          </label>
          <select
            {...form.register('claimType')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select claim type</option>
            <option value="complaint">Complaint</option>
            <option value="request">Request</option>
            <option value="suggestion">Suggestion</option>
            <option value="bug_report">Bug Report</option>
            <option value="other">Other</option>
          </select>
          {form.formState.errors.claimType && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.claimType.message}
            </p>
          )}
        </div>

        {/* Priority Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            {...form.register('priority')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category *
          </label>
          <input
            {...form.register('category')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Account, Billing, Technical"
          />
          {form.formState.errors.category && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>

        {/* Related URL Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Related URL
          </label>
          <input
            {...form.register('relatedUrl')}
            type="url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/relevant-page"
          />
          {form.formState.errors.relatedUrl && (
            <p className="text-red-600 text-sm mt-1">
              {form.formState.errors.relatedUrl.message}
            </p>
          )}
        </div>

        {/* Contact Preference Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Preferred Contact Method
          </label>
          <select
            {...form.register('contactPreference')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-center space-x-3 pt-4">
          <Button
            type="submit"
            disabled={form.isSubmitting || isSubmitting}
            startIcon={
              (form.isSubmitting || isSubmitting) ? (
                <LoadingSpinner variant="spinner" size="sm" inline />
              ) : undefined
            }
          >
            {form.isSubmitting || isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={form.isSubmitting || isSubmitting}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};

// =================================
// ERROR BOUNDARY EXAMPLE
// =================================

const ProblematicComponent: React.FC = () => {
  const [shouldError, setShouldError] = React.useState(false);

  if (shouldError) {
    throw new Error('This is a simulated error for testing the ErrorBoundary!');
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Error Boundary Test</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to simulate an error and test the ErrorBoundary component.
      </p>
      <Button
        variant="destructive"
        onClick={() => setShouldError(true)}
      >
        Trigger Error
      </Button>
    </Card>
  );
};

// =================================
// MAIN EXAMPLE COMPONENT
// =================================

const DataFetchingExample: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Data Fetching, Validation & Error Handling Example
        </h1>
        <p className="text-gray-600">
          This example demonstrates SWR hooks, form validation with Zod, loading states, 
          error handling, and global error boundaries.
        </p>
      </div>

      {/* User Profile with Data Error Boundary */}
      <DataErrorBoundary>
        <Suspense fallback={<ComponentLoadingFallback text="Loading profile..." />}>
          <UserProfileSection />
        </Suspense>
      </DataErrorBoundary>

      {/* User Claims with Data Error Boundary */}
      <DataErrorBoundary>
        <Suspense fallback={<ComponentLoadingFallback text="Loading claims..." />}>
          <UserClaimsSection />
        </Suspense>
      </DataErrorBoundary>

      {/* Claim Submission Form */}
      <ErrorBoundary>
        <ClaimSubmissionForm />
      </ErrorBoundary>

      {/* Error Boundary Test */}
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>

      {/* Loading States Showcase */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Loading States Showcase</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Spinner Variants</h4>
            <div className="flex items-center space-x-2">
              <LoadingSpinner variant="spinner" size="sm" />
              <LoadingSpinner variant="pulse" size="sm" />
              <LoadingSpinner variant="dots" size="sm" />
              <LoadingSpinner variant="bars" size="sm" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">With Text</h4>
            <LoadingSpinner 
              variant="ring" 
              size="sm" 
              text="Loading..." 
              inline 
            />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Different Sizes</h4>
            <div className="flex items-end space-x-2">
              <LoadingSpinner variant="spinner" size="xs" />
              <LoadingSpinner variant="spinner" size="sm" />
              <LoadingSpinner variant="spinner" size="md" />
              <LoadingSpinner variant="spinner" size="lg" />
            </div>
          </div>
        </div>
      </Card>

      {/* Error States Showcase */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Error States Showcase</h3>
        <div className="space-y-4">
          <ErrorAlert
            error="This is a sample error message"
            variant="default"
            showRetry
            onRetry={() => alert('Retry clicked!')}
          />
          
          <ErrorAlert
            error="This is a warning message"
            variant="warning"
            dismissible
            onDismiss={() => alert('Dismissed!')}
          />
          
          <ValidationErrorAlert
            errors={['Field is required', 'Invalid email format', 'Password too short']}
          />
        </div>
      </Card>
    </div>
  );
};

export default DataFetchingExample;
