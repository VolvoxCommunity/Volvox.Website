import { Product } from "@/lib/types";

export const products: Product[] = [
  {
    id: "1",
    name: "12-Step Tracker",
    description:
      "A comprehensive mobile app for tracking your 12-step recovery journey with daily reflections, progress monitoring, and community support.",
    longDescription:
      "The 12-Step Tracker is a thoughtfully designed mobile application that helps individuals in recovery programs track their progress through the 12 steps. Built with React Native and Expo, it provides a seamless cross-platform experience for both iOS and Android users.",
    techStack: ["React Native", "Expo", "TypeScript", "AsyncStorage"],
    features: [
      "Track progress through all 12 steps",
      "Daily reflection and journaling",
      "Milestone celebrations and reminders",
      "Clean, intuitive mobile interface",
    ],
    githubUrl: "https://github.com/BillChirico/12-Step-Tracker",
    demoUrl: "https://twelve-step-tracker.expo.app/",
    image: "",
  },
];
