import { defineConfig } from 'tsup'
import packageJson from './package.json'

export const defaultEntry = [
  'src/**/*.{ts,tsx}',
  '!**/*.d.ts',
  '!**/__tests__',
  '!**/*.{test,spec}.{ts,tsx}'
]

export default defineConfig([
  {
    name: packageJson.name,
    entry: defaultEntry,
    format: 'esm',
    dts: true,
    outExtension: () => ({ js: '.js' }),
    bundle: false
  },
  {
    name: `${packageJson.name}/css`,
    entry: ['src/style.css']
  }
])
