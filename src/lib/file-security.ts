import { z } from 'zod';

// File type MIME type mappings
const ALLOWED_MIME_TYPES = {
  image: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  media: [
    'video/mp4',
    'video/webm',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
  ],
} as const;

// File extension to MIME type mapping
const EXTENSION_TO_MIME: Record<string, string> = {
  // Images
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  // Documents
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain',
  // Media
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mp3',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
};

// Dangerous file extensions that should never be allowed
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.scr', '.pif', '.com',
  '.js', '.jar', '.vbs', '.wsf', '.wsh', '.ps1',
  '.msi', '.dll', '.deb', '.rpm', '.dmg',
  '.app', '.ipa', '.apk', '.class',
];

export interface FileValidationConfig {
  allowedTypes?: ('image' | 'document' | 'media')[];
  maxSize?: number; // in bytes
  maxWidth?: number; // for images
  maxHeight?: number; // for images
  allowedExtensions?: string[];
  blockedExtensions?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  file?: {
    name: string;
    size: number;
    type: string;
    extension: string;
  };
}

export function validateFile(
  file: File,
  config: FileValidationConfig = {}
): FileValidationResult {
  const errors: string[] = [];
  
  const {
    allowedTypes = ['image', 'document'],
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxWidth = 4096,
    maxHeight = 4096,
    allowedExtensions,
    blockedExtensions = DANGEROUS_EXTENSIONS,
  } = config;

  // Extract file information
  const fileName = file.name.toLowerCase();
  const fileSize = file.size;
  const fileMimeType = file.type.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

  // Check for dangerous extensions first
  if (blockedExtensions.includes(fileExtension)) {
    errors.push(`File type '${fileExtension}' is not allowed for security reasons`);
    return {
      isValid: false,
      errors,
      file: {
        name: file.name,
        size: fileSize,
        type: fileMimeType,
        extension: fileExtension,
      },
    };
  }

  // Validate file extension
  if (allowedExtensions && !allowedExtensions.includes(fileExtension)) {
    errors.push(`File extension '${fileExtension}' is not allowed`);
  }

  // Validate MIME type
  const allowedMimeTypes = allowedTypes.flatMap(type => ALLOWED_MIME_TYPES[type]);
  if (!allowedMimeTypes.includes(fileMimeType as any)) {
    errors.push(`File type '${fileMimeType}' is not allowed`);
  }

  // Check MIME type matches extension
  const expectedMimeType = EXTENSION_TO_MIME[fileExtension];
  if (expectedMimeType && expectedMimeType !== fileMimeType) {
    errors.push('File extension and MIME type do not match');
  }

  // Validate file size
  if (fileSize > maxSize) {
    errors.push(`File size ${formatFileSize(fileSize)} exceeds maximum allowed size of ${formatFileSize(maxSize)}`);
  }

  // Check if file is empty
  if (fileSize === 0) {
    errors.push('File is empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    file: {
      name: file.name,
      size: fileSize,
      type: fileMimeType,
      extension: fileExtension,
    },
  };
}

export async function validateImageDimensions(
  file: File,
  maxWidth: number = 4096,
  maxHeight: number = 4096
): Promise<{ isValid: boolean; errors: string[]; dimensions?: { width: number; height: number } }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({ isValid: true, errors: [] }); // Not an image, skip validation
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const { width, height } = img;
      const errors: string[] = [];

      if (width > maxWidth) {
        errors.push(`Image width ${width}px exceeds maximum allowed width of ${maxWidth}px`);
      }

      if (height > maxHeight) {
        errors.push(`Image height ${height}px exceeds maximum allowed height of ${maxHeight}px`);
      }

      resolve({
        isValid: errors.length === 0,
        errors,
        dimensions: { width, height },
      });
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        errors: ['Invalid image file'],
      });
    };

    img.src = URL.createObjectURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function sanitizeFileName(fileName: string): string {
  // Remove path separators and dangerous characters
  return fileName
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/\.\./g, '')
    .trim()
    .substring(0, 255); // Limit filename length
}

// Zod schema for file upload validation
export const createFileUploadSchema = (config: FileValidationConfig = {}) => {
  return z.object({
    file: z
      .any()
      .refine(
        (file) => file instanceof File,
        'Please select a valid file'
      )
      .refine(
        (file) => {
          const result = validateFile(file, config);
          return result.isValid;
        },
        (file) => {
          const result = validateFile(file, config);
          return result.errors.join(', ') || 'File validation failed';
        }
      ),
  });
};

// Common validation configurations
export const IMAGE_UPLOAD_CONFIG: FileValidationConfig = {
  allowedTypes: ['image'],
  maxSize: 5 * 1024 * 1024, // 5MB
  maxWidth: 2048,
  maxHeight: 2048,
};

export const DOCUMENT_UPLOAD_CONFIG: FileValidationConfig = {
  allowedTypes: ['document'],
  maxSize: 10 * 1024 * 1024, // 10MB
};

export const AVATAR_UPLOAD_CONFIG: FileValidationConfig = {
  allowedTypes: ['image'],
  maxSize: 2 * 1024 * 1024, // 2MB
  maxWidth: 512,
  maxHeight: 512,
};
