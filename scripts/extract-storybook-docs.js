#!/usr/bin/env node

/**
 * Extract Storybook Documentation to MkDocs
 * 
 * This script extracts MDX files from Storybook and converts them
 * to Markdown files suitable for MkDocs documentation.
 */

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
/* eslint-enable @typescript-eslint/no-require-imports */

// Configuration
const STORYBOOK_DIR = path.join(__dirname, '..', 'src', 'stories');
const COMPONENT_DIR = path.join(__dirname, '..', 'src', 'components');
const DOCS_DIR = path.join(__dirname, '..', 'docs', 'development');
const OUTPUT_FILE = path.join(DOCS_DIR, 'component-library.md');

/**
 * Extract component information from TypeScript files
 */
function extractComponentInfo(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const componentName = path.basename(filePath, '.tsx');
    
    // Extract JSDoc comments
    const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
    const jsdocMatches = [...content.matchAll(jsdocRegex)];
    
    // Extract prop types from TypeScript interfaces
    const interfaceRegex = /interface\s+(\w+Props?)\s*{([^}]+)}/g;
    const interfaceMatches = [...content.matchAll(interfaceRegex)];
    
    // Extract component export
    const exportRegex = /export\s+(?:default\s+)?(?:function\s+)?(\w+)/g;
    const exportMatch = exportRegex.exec(content);
    
    return {
      name: componentName,
      description: jsdocMatches[0] ? jsdocMatches[0][1].replace(/\*/g, '').trim() : '',
      interfaces: interfaceMatches.map(match => ({
        name: match[1],
        properties: parseProps(match[2])
      })),
      exportName: exportMatch ? exportMatch[1] : componentName
    };
  } catch (error) {
    console.error(`Error extracting component info from ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Parse TypeScript props from interface string
 */
function parseProps(propsString) {
  const props = [];
  const propRegex = /(\w+)(\?)?:\s*([^;]+);?/g;
  let match;
  
  while ((match = propRegex.exec(propsString)) !== null) {
    props.push({
      name: match[1],
      optional: match[2] === '?',
      type: match[3].trim(),
      description: '' // Could be enhanced to extract JSDoc for props
    });
  }
  
  return props;
}

/**
 * Process MDX files from Storybook
 */
function processMDXFiles() {
  const mdxFiles = [];
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.mdx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        mdxFiles.push({
          name: path.basename(file, '.mdx'),
          path: filePath,
          content: content
        });
      }
    }
  }
  
  if (fs.existsSync(STORYBOOK_DIR)) {
    scanDirectory(STORYBOOK_DIR);
  }
  
  return mdxFiles;
}

/**
 * Extract component files for documentation
 */
function getComponentFiles() {
  const components = [];
  
  function scanComponents(dir, relativePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const fullRelativePath = path.join(relativePath, file);
      
      if (stat.isDirectory()) {
        scanComponents(filePath, fullRelativePath);
      } else if (file.endsWith('.tsx') && !file.includes('.test.') && !file.includes('.stories.')) {
        const componentInfo = extractComponentInfo(filePath);
        if (componentInfo) {
          components.push({
            ...componentInfo,
            path: fullRelativePath,
            category: getComponentCategory(fullRelativePath)
          });
        }
      }
    }
  }
  
  scanComponents(COMPONENT_DIR);
  return components;
}

/**
 * Determine component category based on file path
 */
function getComponentCategory(filePath) {
  const pathParts = filePath.split(path.sep);
  if (pathParts.length > 1) {
    return pathParts[0]; // First directory (ui, forms, layout, etc.)
  }
  return 'components';
}

/**
 * Generate Markdown documentation
 */
function generateDocumentation() {
  const mdxFiles = processMDXFiles();
  const components = getComponentFiles();
  
  // Group components by category
  const componentsByCategory = components.reduce((acc, component) => {
    const category = component.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {});
  
  // Generate documentation content
  let documentation = `---
title: Component Library
description: Complete reference for The Best Nexus Letters UI components
---

# Component Library

This page provides comprehensive documentation for all components in The Best Nexus Letters design system. Components are organized by category and include usage examples, props documentation, and accessibility guidelines.

!!! tip "Storybook Integration"
    This documentation is automatically generated from Storybook stories and component TypeScript definitions. For interactive examples, visit our [Storybook](http://localhost:6006).

## Overview

Our component library includes:

`;

  // Add overview statistics
  const totalComponents = components.length;
  const categoriesCount = Object.keys(componentsByCategory).length;
  
  documentation += `- **${totalComponents} Components** across ${categoriesCount} categories
- **TypeScript** definitions for all components  
- **Storybook** integration for interactive development
- **Accessibility** features built-in
- **Theme** support across all components

## Component Categories

`;

  // Generate category sections
  for (const [category, categoryComponents] of Object.entries(componentsByCategory)) {
    documentation += `### ${category.charAt(0).toUpperCase() + category.slice(1)} Components

`;
    
    for (const component of categoryComponents) {
      documentation += generateComponentSection(component);
    }
  }
  
  // Add MDX content if available
  if (mdxFiles.length > 0) {
    documentation += `
## Additional Documentation

The following additional documentation is available from Storybook:

`;
    
    for (const mdxFile of mdxFiles) {
      documentation += `- **${mdxFile.name}**: Extracted from Storybook stories
`;
    }
  }
  
  // Add footer
  documentation += `
---

## Development Guidelines

### Adding New Components

1. Create component file in appropriate category directory
2. Add TypeScript interface for props
3. Create Storybook story with examples
4. Add tests for component behavior
5. Update this documentation (automatically generated)

### Component Standards

- **TypeScript**: All components must have TypeScript definitions
- **Props Interface**: Clear interface with JSDoc comments
- **Accessibility**: WCAG 2.1 AA compliance
- **Testing**: Unit tests and Storybook stories required
- **Theming**: Support for all 5 platform themes

### Resources

- **[Storybook](http://localhost:6006)** - Interactive component development
- **[Design System](../architecture/design-system.md)** - Design principles and guidelines
- **[Testing Guide](TESTING.md)** - Component testing strategies
- **[Accessibility Guide](../reference/accessibility.md)** - Accessibility requirements

---

*This documentation is automatically generated from component source code and Storybook stories.*  
*Last updated: ${new Date().toISOString().split('T')[0]}*
`;

  return documentation;
}

/**
 * Generate documentation section for a single component
 */
function generateComponentSection(component) {
  let section = `#### ${component.name}

`;

  if (component.description) {
    section += `${component.description}

`;
  }

  // Add basic usage example
  section += `**Usage:**

\`\`\`tsx
import { ${component.exportName} } from '@/components/${component.category}/${component.name}';

// Basic usage
<${component.exportName} />
\`\`\`

`;

  // Add props documentation if available
  if (component.interfaces.length > 0) {
    section += `**Props:**

`;
    
    for (const interface of component.interfaces) {
      if (interface.properties.length > 0) {
        section += `| Prop | Type | Required | Description |
|------|------|----------|-------------|
`;
        
        for (const prop of interface.properties) {
          const required = prop.optional ? 'No' : 'Yes';
          section += `| \`${prop.name}\` | \`${prop.type}\` | ${required} | ${prop.description || 'No description available'} |
`;
        }
        
        section += `
`;
      }
    }
  }

  return section;
}

/**
 * Ensure docs directory exists
 */
function ensureDocsDirectory() {
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('🔄 Extracting component documentation from Storybook...');
  
  try {
    ensureDocsDirectory();
    const documentation = generateDocumentation();
    
    // Write documentation file
    fs.writeFileSync(OUTPUT_FILE, documentation);
    
    console.log(`✅ Component documentation generated successfully!`);
    console.log(`📄 Output: ${OUTPUT_FILE}`);
    console.log(`🔗 Components documented: ${getComponentFiles().length}`);
    
    // Also update the docs index with component count
    console.log('📝 Documentation generated and ready for MkDocs');
    
  } catch (error) {
    console.error('❌ Error generating component documentation:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  extractComponentInfo,
  processMDXFiles,
  generateDocumentation
};
