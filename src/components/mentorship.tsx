"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  Rocket,
  DiscordLogo,
  GithubLogo,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Mentor, Mentee } from "@/lib/types";
import confettiLib from "canvas-confetti";
import { DISCORD_URL, GITHUB_URL } from "@/lib/constants";

interface MentorshipProps {
  mentors: Mentor[];
  mentees: Mentee[];
}

/**
 * Render the Mentorship section showcasing program features, a mentors tab, a featured mentees tab, and a call-to-action.
 *
 * Renders animated overview cards, a tabbed list of mentor and mentee profile cards (with conditional empty-state messages), and action buttons including a Discord join button that triggers a confetti effect on click.
 *
 * @param mentors - Array of mentor objects used to render mentor profile cards and their details (avatar, name, role, bio, expertise, optional profile link).
 * @param mentees - Array of mentee objects used to render mentee profile cards and their details (avatar, name, goals, progress, optional profile link).
 * @returns The JSX element for the Mentorship section.
 */
export function Mentorship({ mentors, mentees }: MentorshipProps) {
  const handleDiscordClick = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    void confettiLib({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
    });
  };

  return (
    <section id="mentorship" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Mentorship Program
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn by doing. Contribute to real open-source projects with
            guidance from experienced developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
            <Card className="text-center border-primary/20 h-full">
              <CardHeader>
                <motion.div
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <GraduationCap
                    className="h-6 w-6 text-primary"
                    weight="fill"
                  />
                </motion.div>
                <CardTitle className="text-xl">Learn by Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Work on real-world projects and gain practical experience
                  while learning best practices.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="text-center border-secondary/20 h-full">
              <CardHeader>
                <motion.div
                  className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="h-6 w-6 text-secondary" weight="fill" />
                </motion.div>
                <CardTitle className="text-xl">1-on-1 Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get personalized mentorship from experienced developers who
                  care about your growth.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, rotate: -1 }}
          >
            <Card className="text-center border-accent/20 h-full">
              <CardHeader>
                <motion.div
                  className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Rocket className="h-6 w-6 text-accent" weight="fill" />
                </motion.div>
                <CardTitle className="text-xl">Launch Your Career</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build your portfolio, contribute to open source, and kickstart
                  your programming career.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs defaultValue="mentors" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="mentors" className="cursor-pointer">
              Our Mentors
            </TabsTrigger>
            <TabsTrigger value="mentees" className="cursor-pointer">
              Featured Mentees
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <Card
                  key={mentor.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback className="text-lg">
                          {mentor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1">
                          {mentor.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {mentor.role}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {mentor.bio}
                    </p>

                    <div className="mb-4">
                      <p className="text-xs font-medium mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise.slice(0, 4).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {mentor.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full gap-2 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary"
                      >
                        <a
                          href={mentor.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GithubLogo weight="fill" className="h-4 w-4" />
                          View Profile
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {mentors.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Our mentor team is growing. Check back soon!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="mentees">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentees.map((mentee) => (
                <Card
                  key={mentee.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={mentee.avatar} alt={mentee.name} />
                        <AvatarFallback className="text-lg">
                          {mentee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1">
                          {mentee.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          Mentee
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium mb-1">
                          Learning Goals:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {mentee.goals}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium mb-1">Progress:</p>
                        <p className="text-sm text-muted-foreground">
                          {mentee.progress}
                        </p>
                      </div>
                    </div>

                    {mentee.githubUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full gap-2 mt-4 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary"
                      >
                        <a
                          href={mentee.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <GithubLogo weight="fill" className="h-4 w-4" />
                          View Profile
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {mentees.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Be the first to join our mentorship program!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">
                Ready to Start Learning?
              </CardTitle>
              <CardDescription>
                Join our Discord community to connect with mentors and start
                your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" asChild className="gap-2">
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDiscordClick}
                  >
                    <DiscordLogo weight="fill" className="h-5 w-5" />
                    Join Discord
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" asChild className="gap-2">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubLogo weight="fill" className="h-5 w-5" />
                    Browse Projects
                  </a>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
