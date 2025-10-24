// Color theme configuration for the application - Dark Theme Focus with Auto-Updating
export const themeColors = {
  // Primary purple theme - Dark variations
  primary: {
    main: '#7C3AED', // Purple-600 (darker)
    light: '#8B5CF6', // Purple-500
    dark: '#6D28D9', // Purple-700 (darker)
    darker: '#5B21B6', // Purple-800 (darkest)
    hover: '#4C1D95', // Purple-900 (very dark)
  },
  
  // White variations
  white: {
    main: '#FFFFFF',
    off: '#F9FAFB', // Gray-50
    light: '#F3F4F6', // Gray-100
  },
  
  // Blue variations - Dark focus
  blue: {
    main: '#2563EB', // Blue-600 (darker)
    light: '#3B82F6', // Blue-500
    dark: '#1D4ED8', // Blue-700 (darker)
    darker: '#1E40AF', // Blue-800 (darkest)
    hover: '#1E3A8A', // Blue-900 (very dark)
  },
  
  // Dark gray variations - Enhanced
  gray: {
    dark: '#374151', // Gray-700
    darker: '#1F2937', // Gray-800
    darkest: '#111827', // Gray-900
    medium: '#6B7280', // Gray-500
    light: '#9CA3AF', // Gray-400
    lighter: '#D1D5DB', // Gray-300
  },
  
  // Background colors - Dark theme
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    dark: '#1F2937',
    darker: '#111827',
  },
  
  // Text colors - Dark theme
  text: {
    primary: '#1F2937', // Gray-800
    secondary: '#6B7280', // Gray-500
    light: '#9CA3AF', // Gray-400
    white: '#FFFFFF',
    dark: '#111827', // Gray-900
  },
  
  // Button colors - Dark theme focus
  button: {
    primary: '#7C3AED', // Purple-600 (darker)
    primaryHover: '#6D28D9', // Purple-700
    secondary: '#2563EB', // Blue-600 (darker)
    secondaryHover: '#1D4ED8', // Blue-700
    danger: '#DC2626', // Red-600 (darker)
    dangerHover: '#B91C1C', // Red-700
    success: '#059669', // Green-600 (darker)
    successHover: '#047857', // Green-700
    warning: '#D97706', // Amber-600 (darker)
    warningHover: '#B45309', // Amber-700
  },
  
  // Border colors
  border: {
    light: '#E5E7EB', // Gray-200
    medium: '#D1D5DB', // Gray-300
    dark: '#9CA3AF', // Gray-400
  },
  
  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.25)',
  }
};

// CSS classes for easy application - Dark theme focus
export const themeClasses = {
  // Background classes - Dark theme
  bgPrimary: 'bg-purple-600',
  bgPrimaryLight: 'bg-purple-500',
  bgPrimaryDark: 'bg-purple-700',
  bgPrimaryDarker: 'bg-purple-800',
  bgWhite: 'bg-white',
  bgBlue: 'bg-blue-600',
  bgBlueLight: 'bg-blue-500',
  bgBlueDark: 'bg-blue-700',
  bgBlueDarker: 'bg-blue-800',
  bgGrayDark: 'bg-gray-700',
  bgGrayDarker: 'bg-gray-800',
  bgGrayDarkest: 'bg-gray-900',
  
  // Text classes - Dark theme
  textPrimary: 'text-purple-600',
  textPrimaryLight: 'text-purple-500',
  textPrimaryDark: 'text-purple-700',
  textWhite: 'text-white',
  textBlue: 'text-blue-600',
  textBlueLight: 'text-blue-500',
  textBlueDark: 'text-blue-700',
  textGrayDark: 'text-gray-700',
  textGrayMedium: 'text-gray-500',
  textGrayLight: 'text-gray-400',
  
  // Border classes
  borderPrimary: 'border-purple-600',
  borderBlue: 'border-blue-600',
  borderGray: 'border-gray-300',
  
  // Hover classes - Dark theme
  hoverPrimary: 'hover:bg-purple-700',
  hoverPrimaryLight: 'hover:bg-purple-600',
  hoverBlue: 'hover:bg-blue-700',
  hoverBlueLight: 'hover:bg-blue-600',
  hoverWhite: 'hover:bg-gray-50',
  
  // Focus classes
  focusPrimary: 'focus:ring-purple-600',
  focusBlue: 'focus:ring-blue-600',
  
  // Shadow classes
  shadowLight: 'shadow-sm',
  shadowMedium: 'shadow-md',
  shadowDark: 'shadow-lg',
};

// Button component classes for consistent styling
export const buttonClasses = {
  primary: `${themeClasses.bgPrimary} ${themeClasses.textWhite} ${themeClasses.hoverPrimary} transition duration-300`,
  secondary: `${themeClasses.bgBlue} ${themeClasses.textWhite} ${themeClasses.hoverBlue} transition duration-300`,
  danger: 'bg-red-600 text-white hover:bg-red-700 transition duration-300',
  success: 'bg-green-600 text-white hover:bg-green-700 transition duration-300',
  warning: 'bg-amber-600 text-white hover:bg-amber-700 transition duration-300',
  outline: `${themeClasses.borderPrimary} ${themeClasses.borderGray} text-gray-700 hover:bg-gray-50 transition duration-300`,
};

// Utility function to get color value
export const getColor = (colorPath: string, fallback: string = '#000000') => {
  const path = colorPath.split('.');
  let value: any = themeColors;
  
  for (const key of path) {
    value = value[key];
    if (value === undefined) {
      console.warn(`Color path "${colorPath}" not found, using fallback: ${fallback}`);
      return fallback;
    }
  }
  
  return value;
};

// Auto-updating theme system
export const themeSystem = {
  colors: themeColors,
  classes: themeClasses,
  buttonClasses,
  
  // Method to update theme colors and automatically update all components
  updateTheme: (newColors: Partial<typeof themeColors>) => {
    Object.assign(themeColors, newColors);
    // Trigger re-render for all components using this theme
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('themeUpdated', { detail: themeColors }));
    }
  },
  
  // Subscribe to theme changes
  subscribe: (callback: (colors: typeof themeColors) => void) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('themeUpdated', (event: any) => callback(event.detail));
    }
  },
  
  // Unsubscribe from theme changes
  unsubscribe: (callback: (colors: typeof themeColors) => void) => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('themeUpdated', (event: any) => callback(event.detail));
    }
  }
};

export default themeColors; 