import { techMap } from "@/constants/techMap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const techDescriptionMap: { [key: string]: string } = {
  // JavaScript
  javascript:
    "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
  js: "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",

  // TypeScript
  typescript:
    "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
  ts: "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",

  // React
  react:
    "React is a JavaScript library for building fast and interactive user interfaces, maintained by Meta.",

  // Next.js
  nextjs:
    "Next.js is a React framework that enables server-side rendering, static site generation, and powerful routing for modern web apps.",

  // Node.js
  nodejs:
    "Node.js is a runtime environment that lets you run JavaScript on the server, enabling full-stack JavaScript development.",

  // Python
  python:
    "Python is a high-level, versatile programming language known for its simplicity, readability, and wide range of applications.",

  // Java
  java: "Java is a robust, object-oriented programming language widely used in enterprise applications, Android development, and backend systems.",

  // C++
  cpp: "C++ is a powerful systems programming language used for performance-critical applications such as games, engines, and operating systems.",

  // Git
  git: "Git is a distributed version control system that helps developers track changes and collaborate on code effectively.",

  // Docker
  docker:
    "Docker is a platform for developing, shipping, and running applications inside lightweight, portable containers.",

  // MongoDB
  mongodb:
    "MongoDB is a NoSQL document-oriented database designed for scalability, flexibility, and ease of development.",

  // MySQL
  mysql:
    "MySQL is a widely used open-source relational database management system known for its reliability and performance.",

  // PostgreSQL
  postgresql:
    "PostgreSQL is an advanced, open-source relational database known for its robustness, extensibility, and SQL compliance.",

  // AWS
  aws: "Amazon Web Services (AWS) is a comprehensive cloud computing platform offering infrastructure, storage, databases, and AI services.",
};

export const getTechDescription = (techName: string): string => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return (
    techDescriptionMap[normalizedTechName] ||
    `${techName} is a technology or tool widely used in web development, providing valuable features and capabilities.`
  );
};

export const getDeviconClassName = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return `${techMap[normalizedTechName]} colored ` || "devIcon-devicon-plain";
};

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};
