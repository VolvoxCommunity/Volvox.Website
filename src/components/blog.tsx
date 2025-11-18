"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Eye } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { BlogPost } from "@/lib/types";

interface BlogProps {
  posts: BlogPost[];
}

export function Blog({ posts }: BlogProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogViews, setBlogViews] = useState<Record<string, number>>({});

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setBlogViews((currentViews) => ({
      ...(currentViews || {}),
      [post.id]: ((currentViews || {})[post.id] || 0) + 1,
    }));
  };

  const getPostViews = (postId: string): number => {
    return (blogViews || {})[postId] || 0;
  };

  return (
    <section id="blog" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Blog</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and stories from the Volvox team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
                onClick={() => handlePostClick(post)}
              >
                <motion.div
                  className="aspect-video bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden border-b border-border"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-bold text-foreground/5">
                      {post.title.charAt(0)}
                    </div>
                  </div>
                </motion.div>

                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={post.author.avatar}
                        alt={post.author.name}
                      />
                      <AvatarFallback>
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {post.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {post.author.role}
                      </p>
                    </div>
                  </div>

                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {post.excerpt}
                  </CardDescription>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {getPostViews(post.id)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No blog posts yet. Our team is working on great content!
            </p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedPost.author.avatar}
                      alt={selectedPost.author.name}
                    />
                    <AvatarFallback>
                      {selectedPost.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {selectedPost.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPost.author.role}
                    </p>
                  </div>
                </div>

                <DialogTitle className="text-2xl md:text-3xl">
                  {selectedPost.title}
                </DialogTitle>

                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedPost.readTime}
                  </span>
                  <span>
                    {new Date(selectedPost.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {getPostViews(selectedPost.id)} views
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-3">
                  {selectedPost.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>

              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {selectedPost.content}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
