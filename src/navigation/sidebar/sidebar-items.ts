import {
  Fingerprint,
  LayoutDashboard,
  type LucideIcon,
  User,
  UserPlus
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
  role: string[];
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        role: ["Company"]
      },
      {
        title: "Agent Requests",
        url: "/agent-requests",
        icon: UserPlus,
        role: ["Company"]
      },
      {
        title: "Incoming Requests",
        url: "/service-requests",
        icon: LayoutDashboard,
        role: ["Agent"]
      },
      {
        title: "My Services",
        url: "/agent-services",
        icon: LayoutDashboard,
        role: ["Agent"]
      },
      {
        title: "User Management",
        url: "/user-management",
        icon: User,
        role: ["Admin"]
      },
      {
        title: "Registration Management",
        url: "/registration-management",
        icon: User,
        role: ["Admin"]
      },
      {
        title: "Services",
        url: "/services",
        icon: LayoutDashboard,
        role: ["Admin", "Company", "GovernmentBody"]
      },
      {
        title: "Request Info",
        url: "/request-info",
        icon: LayoutDashboard,
        role: ["GovernmentBody"]
      },
    ],
  }
];
