import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daniansyah Chusyaidin | Fullstack & Mobile Engineer',
    short_name: 'DC Portfolio',
    description: 'High-fidelity portfolio for Daniansyah Chusyaidin - Fullstack & Mobile Engineer.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#0b0d10',
    theme_color: '#06b6d4',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
