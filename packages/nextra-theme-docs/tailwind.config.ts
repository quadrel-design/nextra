import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const makePrimaryColor: any =
  (val: number) =>
  ({ opacityValue }: { opacityValue?: string }): string => {
    const h = 'var(--nextra-primary-hue)'
    const s = 'var(--nextra-primary-saturation)'
    const _l = 'var(--nextra-primary-lightness)'
    const l = val ? `calc(${_l} + ${val}%)` : _l
    return 'hsl(' + h + s + l + (opacityValue ? ` / ${opacityValue}` : '') + ')'
  }
export default {
  prefix: '_',
  content: [
    './src/**/*.{ts,tsx}',
    '../nextra/src/client/icons/*.svg',
    '../nextra/src/client/mdx-components.tsx',
    '../nextra/src/client/{components,mdx-components}/**/*.tsx'
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    fontSize: {
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem'
    },
    letterSpacing: {
      tight: '-0.015em'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      gray: colors.gray,
      slate: colors.slate,
      neutral: colors.neutral,
      red: colors.red,
      orange: colors.orange,
      blue: colors.blue,
      yellow: colors.yellow,
      primary: {
        50: makePrimaryColor(52),
        100: makePrimaryColor(49),
        200: makePrimaryColor(41),
        300: makePrimaryColor(32),
        400: makePrimaryColor(21),
        500: makePrimaryColor(5),
        600: makePrimaryColor(0),
        700: makePrimaryColor(-6),
        750: makePrimaryColor(-10),
        800: makePrimaryColor(-13),
        900: makePrimaryColor(-21)
      }
    }
  },
  darkMode: ['class', 'html[class~="dark"]']
} satisfies Config
