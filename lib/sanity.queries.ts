import { client } from './sanity'

// Service queries
export async function getServices() {
  return await client.fetch(`
    *[_type == "service"] | order(order asc) {
      _id,
      title,
      description,
      slug,
      icon,
      tags,
      features,
      isLarge,
      order
    }
  `)
}

// Team member queries
export async function getTeamMembers() {
  return await client.fetch(`
    *[_type == "teamMember"] | order(order asc) {
      _id,
      name,
      role,
      bio,
      image,
      initials,
      social,
      order
    }
  `)
}

// FAQ queries
export async function getFAQs() {
  return await client.fetch(`
    *[_type == "faq"] | order(order asc) {
      _id,
      question,
      answer,
      category,
      order
    }
  `)
}

// Testimonial queries
export async function getTestimonials() {
  return await client.fetch(`
    *[_type == "testimonial"] {
      _id,
      quote,
      author,
      role,
      company,
      image,
      rating,
      featured,
      metrics
    }
  `)
}

export async function getFeaturedTestimonial() {
  return await client.fetch(`
    *[_type == "testimonial" && featured == true][0] {
      _id,
      quote,
      author,
      role,
      company,
      image,
      rating,
      metrics
    }
  `)
}