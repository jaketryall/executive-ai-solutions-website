'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { useEffect } from 'react'

export default function StudioPage() {
  useEffect(() => {
    // Remove dark mode classes that conflict with Sanity Studio
    document.documentElement.classList.remove('dark')
    document.body.className = ''
    
    return () => {
      // Restore dark mode when leaving studio
      document.documentElement.classList.add('dark')
    }
  }, [])
  
  return <NextStudio config={config} />
}