/** @type {import('next').NextConfig} */
const nextConfig = {
  // fonts and the logo used by the generated weekly image
  outputFileTracingIncludes: { '/weekly-image': ['./assets/fonts/*', './public/logo-mark.png'] },
};
export default nextConfig;
