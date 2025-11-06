import {
  Fingerprint,
  LayoutDashboard,
  type LucideIcon,
  User,
  UserPlus,
  Banknote
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
        title: "Dashboard",
        url: "/service-requests",
        icon: LayoutDashboard,
        role: ["Agent"]
      },
      {
        title: "Stripe Account",
        url: "/stripe-account",
        icon: Banknote,
        role: ["Agent"]
      },
      // {
      //   title: "My Services",
      //   url: "/agent-services",
      //   icon: LayoutDashboard,
      //   role: ["Agent"]
      // },
      {
        title: "Registration Management",
        url: "/registration-management",
        icon: User,
        role: ["Admin"]
      },
      {
        title: "User Management",
        url: "/user-management",
        icon: User,
        role: ["Admin"]
      },
      {
        title: "Requested Services",
        url: "/government-requests",
        icon: User,
        role: ["Admin"]
      },
      {
        title: "Service Request",
        url: "/request-info",
        icon: LayoutDashboard,
        role: ["GovernmentBody"]
      }, {
        title: "Requested Services",
        url: "/requested-services",
        icon: LayoutDashboard,
        role: ["GovernmentBody"]
      },
      {
        title: "Services",
        url: "/services",
        icon: LayoutDashboard,
        role: ["Admin", "Company"]
      },
    ],
  }
];
