/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'glhtwgmqnhaaswddtdmm.supabase.co',
              pathname: '/storage/v1/object/public/avatars/**',
            },
            {
              protocol: 'https',
              hostname: 'glhtwgmqnhaaswddtdmm.supabase.co',
              pathname: '/storage/v1/object/public/posts/**',
            },
          ],      
    }
};

export default nextConfig;
