import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RedCross Blood Bank',
    short_name: 'Blood Bank',
    description: 'Blood Bank Management System',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#b70100',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: '192x192 512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}
