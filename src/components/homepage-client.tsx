"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { BlogPost, Product } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HomepageClientProps {
  blogPosts: BlogPost[]
  products: Product[]
}

export function HomepageClient({ blogPosts, products }: HomepageClientProps) {
  const [currentSection, setCurrentSection] = useState('home')

  const handleNavigate = (section: string) => {
    setCurrentSection(section)

    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const element = document.getElementById(section)
      if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['products', 'blog', 'mentorship', 'about']
      const scrollPosition = window.scrollY + 200

      if (window.scrollY < 300) {
        setCurrentSection('home')
        return
      }

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section)
            return
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navigation onNavigate={handleNavigate} currentSection={currentSection} />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24">
          <h1 className="text-5xl font-bold mb-6 text-primary">
            Volvox
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Software Development & Learning Community
          </p>
          <p className="mt-4 text-lg max-w-3xl">
            Building great software while fostering the next generation of developers
            through mentorship and open source.
          </p>
        </section>

        {/* Products Section */}
        <section id="products" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Products</h2>
          <div className="grid gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-border rounded-lg p-6 bg-card"
              >
                <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <div className="flex gap-4">
                  {product.githubUrl && (
                    <a
                      href={product.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub →
                    </a>
                  )}
                  {product.demoUrl && (
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline"
                    >
                      Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Blog</h2>
          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="border border-border rounded-lg p-6 bg-card hover:border-primary/50 transition-colors"
              >
                <Link href={`/blog/${post.slug}`} className="block group">
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <span>{post.author.name}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="group-hover:text-primary">
                    Read more →
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Mentorship Section */}
        <section id="mentorship" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Mentorship</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              Our mentorship program pairs experienced developers with those starting their journey.
              Learn by contributing to real open source projects with expert guidance.
            </p>
            <p className="mt-4">
              Join our Discord community to get started with mentorship opportunities.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">About</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">
              Founded on January 2, 2020 by Bill Chirico, Volvox is a software
              development company with a unique mission: building great software while
              fostering the next generation of developers.
            </p>
            <p className="mt-4">
              We combine professional product development with mentorship and open
              source education, creating a community where everyone can learn, grow,
              and contribute.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} Volvox. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
