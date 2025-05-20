import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Search, PlusSquare, ListChecks, AlertTriangle } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Found Items",
    href: "/found-items",
    icon: Search, // Using Search icon for browsing found items
  },
  {
    title: "Lost Items",
    href: "/lost-items",
    icon: ListChecks, // Using ListChecks for browsing lost item posts
  },
  {
    title: "Submit Found Item",
    href: "/found-items/new",
    icon: PlusSquare,
  },
  {
    title: "Post Lost Item",
    href: "/lost-items/new",
    icon: AlertTriangle, // Using AlertTriangle for posting a lost item
  },
];

export const siteConfig = {
  name: "CampusFinds - Amity University Punjab",
  description: "Your Amity University Punjab lost and found portal.",
  url: "https://your-deployed-url.com", // Replace with your actual URL after deployment
  ogImage: "https://your-deployed-url.com/og.jpg", // Replace
  links: {
    // Add relevant links if any
  },
};
