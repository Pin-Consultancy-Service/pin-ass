import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PIN Consultancy Services - Professional Exam Tutoring Nigeria',
    short_name: 'PIN Consultancy',
    description: 'Expert ICAN, ACCA, CITN exam tutoring and business consultancy services in Nigeria',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    icons: [
      {
        src: '/images/pin-logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/pin-logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'business', 'finance'],
    lang: 'en-NG',
    dir: 'ltr',
  }
}
