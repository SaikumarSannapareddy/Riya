// Dark Theme System with Auto-Updating
export const darkThemeColors = {
  primary: {
    main: '#7C3AED', // Purple-600
    light: '#8B5CF6', // Purple-500
    dark: '#6D28D9', // Purple-700
    darker: '#5B21B6', // Purple-800
    hover: '#4C1D95', // Purple-900
  },
  blue: {
    main: '#2563EB', // Blue-600
    light: '#3B82F6', // Blue-500
    dark: '#1D4ED8', // Blue-700
    darker: '#1E40AF', // Blue-800
    hover: '#1E3A8A', // Blue-900
  },
  gray: {
    dark: '#374151', // Gray-700
    darker: '#1F2937', // Gray-800
    darkest: '#111827', // Gray-900
    medium: '#6B7280', // Gray-500
    light: '#9CA3AF', // Gray-400
  },
  white: {
    main: '#FFFFFF',
    off: '#F9FAFB',
    light: '#F3F4F6',
  },
  button: {
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    secondary: '#2563EB',
    secondaryHover: '#1D4ED8',
    danger: '#DC2626',
    dangerHover: '#B91C1C',
    success: '#059669',
    successHover: '#047857',
    warning: '#D97706',
    warningHover: '#B45309',
  }
};

export const darkThemeClasses = {
  bgPrimary: 'bg-purple-600',
  bgPrimaryLight: 'bg-purple-500',
  bgPrimaryDark: 'bg-purple-700',
  bgPrimaryDarker: 'bg-purple-800',
  bgBlue: 'bg-blue-600',
  bgBlueLight: 'bg-blue-500',
  bgBlueDark: 'bg-blue-700',
  bgBlueDarker: 'bg-blue-800',
  textWhite: 'text-white',
  textPrimary: 'text-purple-600',
  textBlue: 'text-blue-600',
  hoverPrimary: 'hover:bg-purple-700',
  hoverBlue: 'hover:bg-blue-700',
  shadowMedium: 'shadow-md',
};

export const darkButtonClasses = {
  primary: `${darkThemeClasses.bgPrimary} ${darkThemeClasses.textWhite} ${darkThemeClasses.hoverPrimary} transition duration-300`,
  secondary: `${darkThemeClasses.bgBlue} ${darkThemeClasses.textWhite} ${darkThemeClasses.hoverBlue} transition duration-300`,
  danger: 'bg-red-600 text-white hover:bg-red-700 transition duration-300',
  success: 'bg-green-600 text-white hover:bg-green-700 transition duration-300',
  warning: 'bg-amber-600 text-white hover:bg-amber-700 transition duration-300',
};

export default darkThemeColors; 