export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    role: string
    avatar: string
  }
  date: string
  tags: string[]
  readTime: string
  slug: string
  views?: number
}

export interface Product {
  id: string
  name: string
  description: string
  longDescription: string
  techStack: string[]
  features: string[]
  githubUrl?: string
  demoUrl?: string
  image: string
}

export interface Mentor {
  id: string
  name: string
  avatar: string
  role: string
  expertise: string[]
  bio: string
  githubUrl?: string
}

export interface Mentee {
  id: string
  name: string
  avatar: string
  goals: string
  progress: string
  githubUrl?: string
}
