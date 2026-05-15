const BASE_URL = 'https://www.skanema.com'

export default function sitemap() {
  return [
    {
      url         : BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority    : 1,
    },
    {
      url         : `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority    : 0.3,
    },
  ]
}
