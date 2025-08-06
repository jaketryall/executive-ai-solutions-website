import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

// Read client for fetching content (no token needed for public datasets)
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Disable CDN to ensure fresh data
  perspective: 'published', // Only fetch published documents
  token: process.env.SANITY_API_READ_TOKEN, // Optional for private datasets
})

// Write client for mutations (creating/updating content)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // Required for mutations
})

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}