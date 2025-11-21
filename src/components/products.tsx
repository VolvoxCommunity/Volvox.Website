"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GithubLogo, ArrowUpRight, CheckCircle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Product } from "@/lib/types";

interface ProductsProps {
  products: Product[];
}

export function Products({ products }: ProductsProps) {
  const product = products[0];

  if (!product) {
    return (
      <section id="products" className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No product available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Featured Product
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crafted with precision, built to support recovery journeys.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-2 hover:border-primary/30 overflow-hidden bg-card/80 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-0">
              <motion.div
                className="aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-[120px] md:text-[180px] font-bold text-foreground/5"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {product.name.charAt(0)}
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
              </motion.div>

              <div className="flex flex-col">
                <CardHeader className="pb-4 pt-6 md:pt-8 px-6 md:px-8">
                  <CardTitle className="text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-3 leading-relaxed">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-7 px-6 md:px-8">
                  <div>
                    <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <span className="h-px w-4 bg-primary/50" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="px-3 py-1 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <span className="h-px w-4 bg-primary/50" />
                      Key Features
                    </h4>
                    <ul className="space-y-3">
                      {product.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start gap-3 group/item"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <CheckCircle
                            weight="fill"
                            className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform"
                          />
                          <span className="text-sm leading-relaxed">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="gap-3 pt-6 pb-6 md:pb-8 px-6 md:px-8">
                  {product.githubUrl && (
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="flex-1 gap-2 group/btn hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                    >
                      <a
                        href={product.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubLogo
                          weight="fill"
                          className="h-5 w-5 group-hover/btn:scale-110 transition-transform"
                        />
                        View Code
                      </a>
                    </Button>
                  )}
                  {product.demoUrl && (
                    <Button
                      size="lg"
                      asChild
                      className="flex-1 gap-2 group/btn shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                    >
                      <a
                        href={product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Try Demo
                        <ArrowUpRight
                          weight="bold"
                          className="h-5 w-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                        />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </div>
            </div>

            {product.longDescription && (
              <div className="border-t-2 border-border/50 bg-gradient-to-br from-muted/40 to-muted/20 backdrop-blur-sm p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  {product.longDescription}
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
