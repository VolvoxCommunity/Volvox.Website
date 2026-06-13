import { DISCORD_URL, SITE_URL } from "@/lib/constants";
import type { VisitorIntent } from "./types";

export const DISCORD_INVITE = DISCORD_URL;
export const TEAM_PAGE = `${SITE_URL}/team`;
export const PRODUCTS_PAGE = `${SITE_URL}/products`;
export const BLOG_PAGE = `${SITE_URL}/blog`;
export const MENTORSHIP_SECTION = `${SITE_URL}/#mentorship`;
export const HIRING_EMAIL = "bill@volvox.dev";

const ctas: Record<
  VisitorIntent,
  {
    welcomeIntro: string;
    afterTeamMember: (name: string) => string;
    afterProduct: (name: string) => string;
    afterBlog: (title: string) => string;
    afterCommunity: () => string;
    noMatch: () => string;
    fallback: () => string;
  }
> = {
  beginner: {
    welcomeIntro: `If you're new to coding, you're in the right place — most of our Discord started exactly there.`,
    afterTeamMember: (name) =>
      `${name} runs beginner-friendly office hours in our Discord. Drop in with your first question.`,
    afterProduct: (name) =>
      `Products like ${name} are open source — reading the code is one of the fastest ways to learn how real apps get built.`,
    afterBlog: (title) =>
      `If you enjoyed “${title},” check the author’s other posts — they're written for people learning in public.`,
    afterCommunity: () =>
      `Our Discord has a dedicated #beginners channel. No question is too small — Bill and the mentors answer daily.`,
    noMatch: () =>
      `If you're learning to code, the #beginners channel in our Discord is the warmest place to start.`,
    fallback: () =>
      `**Next step:** hop into the Discord — it's where most of the magic happens for new devs. → ${DISCORD_INVITE}`,
  },
  professional: {
    welcomeIntro: `We have an active open-source org, technical deep-dives on the blog, and Discord channels per stack.`,
    afterTeamMember: (name) =>
      `${name} is the person to ping for collaboration. Their GitHub + Discord are on their profile.`,
    afterProduct: (name) =>
      `${name} is open source — PRs welcome. Tag the maintainer in your first issue.`,
    afterBlog: (title) =>
      `“${title}” is the kind of write-up we publish monthly. Subscribe via RSS or follow the blog page.`,
    afterCommunity: () =>
      `Our Discord has channels per stack (#react, #next, #mobile, #ai, etc.). DM any mentor to start a thread.`,
    noMatch: () =>
      `For technical work, the open-source repos under our GitHub org are the fastest way to collaborate.`,
    fallback: () =>
      `**Next step:** join the Discord to start contributing, or browse the open-source org. → ${DISCORD_INVITE}`,
  },
  hirer: {
    welcomeIntro: `I'll surface hireable team members with their portfolios, contact channels, and the fastest path to Bill (CEO).`,
    afterTeamMember: (name) =>
      `${name} is open to work — tap the Hire button on their card or DM them on LinkedIn.`,
    afterProduct: (name) =>
      `The team behind ${name} is the same team you'd be hiring. Bill is the fastest route to scope an engagement.`,
    afterBlog: (title) =>
      `If the engineering voice in “${title}” is what you need on your team, I'll match you with the right author.`,
    afterCommunity: () =>
      `For hires, email Bill directly: ${HIRING_EMAIL}. Or view the team page for all hireable members.`,
    noMatch: () =>
      `For hiring, the team page lists who's available — and Bill is the fastest route for a warm intro.`,
    fallback: () =>
      `**Next step:** view the team page to shortlist candidates, or email Bill (CEO) at ${HIRING_EMAIL} for a warm intro.`,
  },
};

export function ctaFor(intent: VisitorIntent) {
  return ctas[intent];
}
