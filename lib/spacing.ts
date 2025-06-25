// Consistent spacing system based on 4px increments
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "2rem", // 32px
  "4xl": "2.5rem", // 40px
  "5xl": "3rem", // 48px
  "6xl": "4rem", // 64px
} as const

export const containerPadding = {
  mobile: "px-4 py-4", // 16px
  tablet: "px-6 py-6", // 24px
  desktop: "px-8 py-8", // 32px
} as const

export const cardPadding = {
  sm: "p-4", // 16px
  md: "p-6", // 24px
  lg: "p-8", // 32px
} as const

export const buttonPadding = {
  sm: "px-3 py-2", // 12px x 8px
  md: "px-4 py-3", // 16px x 12px
  lg: "px-6 py-4", // 24px x 16px
} as const
