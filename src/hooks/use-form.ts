/**
 * Enhanced React Hook Form integration with Zod validation
 */

import React from 'react';
import {
  useForm as useReactHookForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { DatabaseError } from '@/lib/database-helpers';

// =================================
// ENHANCED FORM HOOK
// =================================

interface UseFormOptions<T extends FieldValues>
  extends Omit<UseFormProps<T>, 'resolver'> {
  /** Zod schema for validation */
  schema?: z.ZodSchema<T>;
  /** Submit handler */
  onSubmit?: (data: T) => Promise<void> | void;
  /** Error handler */
  onError?: (error: Error) => void;
  /** Whether to reset form after successful submit */
  resetOnSuccess?: boolean;
  /** Whether to focus first error field */
  focusError?: boolean;
}

interface UseFormResult<T extends FieldValues>
  extends Omit<UseFormReturn<T>, 'reset' | 'handleSubmit'> {
  /** Submit handler with error handling */
  handleSubmit: (
    onValid: (data: T) => Promise<void> | void
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Submit error */
  submitError: Error | null;
  /** Clear submit error */
  clearError: () => void;
  /** Submit the form */
  submit: () => Promise<void>;
  /** Reset form and errors */
  reset: (values?: Partial<T> | T) => void;
}

export function useForm<T extends FieldValues = FieldValues>(
  options: UseFormOptions<T> = {}
): UseFormResult<T> {
  const {
    schema,
    onSubmit,
    onError,
    resetOnSuccess = false,
    focusError = true,
    ...formOptions
  } = options;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<Error | null>(null);

  // Create form configuration with conditional resolver
  const formConfig: UseFormProps<T> = {
    ...formOptions,
  };

  if (schema) {
    // Type assertion needed due to Zod schema compatibility with react-hook-form
    (formConfig as any).resolver = zodResolver(schema as any);
  }

  const form = useReactHookForm<T>(formConfig);

  const clearError = React.useCallback(() => {
    setSubmitError(null);
  }, []);

  const handleSubmit = React.useCallback(
    (onValid: (data: T) => Promise<void> | void) =>
      async (e?: React.BaseSyntheticEvent) => {
        e?.preventDefault();

        setIsSubmitting(true);
        setSubmitError(null);

        try {
          const isValid = await form.trigger();

          if (!isValid) {
            // Focus first error field
            if (focusError) {
              const firstError = Object.keys(form.formState.errors)[0];
              if (firstError) {
                const element = document.querySelector(
                  `[name="${firstError}"]`
                ) as HTMLElement;
                element?.focus();
              }
            }
            return;
          }

          const data = form.getValues();
          await onValid(data);

          if (resetOnSuccess) {
            form.reset();
          }
        } catch (error) {
          const errorObject =
            error instanceof Error ? error : new Error(String(error));
          setSubmitError(errorObject);

          if (onError) {
            onError(errorObject);
          }
        } finally {
          setIsSubmitting(false);
        }
      },
    [form, onError, resetOnSuccess, focusError]
  );

  const submit = React.useCallback(async () => {
    if (!onSubmit) return;
    await handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const reset = React.useCallback(
    (values?: Partial<T> | T) => {
      form.reset(values as any);
      setSubmitError(null);
      setIsSubmitting(false);
    },
    [form]
  );

  return {
    ...form,
    handleSubmit,
    isSubmitting,
    submitError,
    clearError,
    submit,
    reset,
  };
}

// =================================
// FORM VALIDATION HOOKS
// =================================

/**
 * Hook for real-time field validation
 */
export function useFieldValidation<T>(
  schema: z.ZodSchema<T>,
  value: T,
  debounceMs = 300
) {
  const [error, setError] = React.useState<string | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);

  React.useEffect(() => {
    if (!value) {
      setError(null);
      return;
    }

    setIsValidating(true);

    const timeoutId = setTimeout(() => {
      try {
        schema.parse(value);
        setError(null);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.issues[0]?.message || 'Invalid value');
        } else {
          setError('Validation error');
        }
      } finally {
        setIsValidating(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [schema, value, debounceMs]);

  return { error, isValidating };
}

/**
 * Hook for async field validation (e.g., checking username availability)
 */
export function useAsyncFieldValidation<T>(
  validator: (value: T) => Promise<string | null>,
  value: T,
  debounceMs = 500
) {
  const [error, setError] = React.useState<string | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);

  React.useEffect(() => {
    if (!value) {
      setError(null);
      return;
    }

    setIsValidating(true);

    const timeoutId = setTimeout(async () => {
      try {
        const validationError = await validator(value);
        setError(validationError);
      } catch (err) {
        setError('Validation failed');
      } finally {
        setIsValidating(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [validator, value, debounceMs]);

  return { error, isValidating };
}

// =================================
// SPECIALIZED FORM HOOKS
// =================================

/**
 * Hook for multi-step forms
 */
export function useMultiStepForm<T extends Record<string, any>>(
  steps: Array<{
    key: string;
    schema: z.ZodSchema<Partial<T>>;
    title: string;
  }>,
  options: UseFormOptions<T> = {}
) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
    new Set()
  );

  const form = useForm<T>(options);
  const currentStepConfig = steps[currentStep];

  const validateStep = async (stepIndex: number) => {
    const step = steps[stepIndex];
    if (!step) return false;

    const stepSchema = step.schema;
    const formData = form.getValues();

    try {
      await stepSchema.parseAsync(formData);
      setCompletedSteps(prev => new Set(prev).add(stepIndex));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach(err => {
          if (err.path.length > 0) {
            form.setError(err.path[0] as any, {
              message: err.message,
            });
          }
        });
      }
      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    return isValid;
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = async (stepIndex: number) => {
    // Validate all steps up to the target step
    for (let i = 0; i < stepIndex; i++) {
      const isValid = await validateStep(i);
      if (!isValid) return false;
    }

    setCurrentStep(stepIndex);
    return true;
  };

  const submitForm = async () => {
    // Validate all steps
    for (let i = 0; i < steps.length; i++) {
      const isValid = await validateStep(i);
      if (!isValid) {
        setCurrentStep(i);
        return false;
      }
    }

    // Submit the form
    await form.submit();
    return true;
  };

  return {
    ...form,
    currentStep,
    currentStepConfig,
    completedSteps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    progress: ((currentStep + 1) / steps.length) * 100,
    nextStep,
    prevStep,
    goToStep,
    validateStep,
    submitForm,
  };
}

/**
 * Hook for forms with file uploads
 */
export function useFileUploadForm<T extends FieldValues>(
  options: UseFormOptions<T> & {
    maxFiles?: number;
    maxFileSize?: number; // in bytes
    acceptedFileTypes?: string[];
  }
) {
  const {
    maxFiles = 10,
    maxFileSize = 10 * 1024 * 1024,
    acceptedFileTypes = [],
  } = options;
  const [uploadProgress, setUploadProgress] = React.useState<
    Record<string, number>
  >({});
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

  const form = useForm<T>(options);

  const validateFiles = (files: File[]): string[] => {
    const errors: string[] = [];

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
    }

    files.forEach(file => {
      if (file.size > maxFileSize) {
        errors.push(
          `File ${file.name} is too large (max ${maxFileSize / 1024 / 1024}MB)`
        );
      }

      if (
        acceptedFileTypes.length > 0 &&
        !acceptedFileTypes.includes(file.type)
      ) {
        errors.push(`File ${file.name} type not supported`);
      }
    });

    return errors;
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Mock upload with progress
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));

        if (progress >= 100) {
          clearInterval(interval);
          // Return mock URL - in real app, this would be the actual uploaded file URL
          resolve(`https://example.com/uploads/${file.name}`);
        }
      }, 200);
    });
  };

  const handleFileUpload = async (files: File[]) => {
    const errors = validateFiles(files);
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const uploadPromises = files.map(uploadFile);
    const urls = await Promise.all(uploadPromises);

    setUploadedFiles(prev => [...prev, ...files]);
    return urls;
  };

  const removeFile = (fileIndex: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  return {
    ...form,
    uploadProgress,
    uploadedFiles,
    validateFiles,
    handleFileUpload,
    removeFile,
  };
}

// =================================
// FORM ERROR COMPONENT
// =================================

/**
 * Component to display form submit errors
 */
export const FormErrorDisplay: React.FC<{
  error: Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}> = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  const props = {
    error,
    variant: 'destructive' as const,
    size: 'sm' as const,
    showRetry: !!onRetry,
    dismissible: !!onDismiss,
    className: 'mb-4',
    ...(onRetry && { onRetry }),
    ...(onDismiss && { onDismiss }),
  };

  return React.createElement(ErrorAlert, props);
};
