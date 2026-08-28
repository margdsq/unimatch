/**
 * PostCSS pipeline for the Next.js production build.
 * Tailwind v4 is applied through this file so Vercel and `next build`
 * can compile `app/globals.css` without relying on the Vite/vinext config.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
