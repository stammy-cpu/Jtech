export default {
  plugins: {
    tailwindcss: {
      config: './tailwind.config.ts',
    },
    autoprefixer: {
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'],
    },
  },
}
