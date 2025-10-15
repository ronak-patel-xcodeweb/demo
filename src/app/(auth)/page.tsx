'use client'

import { createContext, ReactNode, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AccountSwitcher } from "@/components/sidebar/account-switcher";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { DataTableContext, ServicesContext } from "@/components/context/DataTableContext";



export default function ChildLayout({ children, session }: { children: ReactNode, session: Session }) {
  const [dataTables, setDataTables] = useState<any>([]);
  const [allServices, setAllServices] = useState<any>([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch("/api/datatables");
        if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setDataTables(data);
      } catch (error) {
        console.error("Error fetching datatable:", error);
      }
    };
    fetchTables();
  }, []);

  useEffect(() => {
    if (dataTables?.find((t: any) => t?.table_name === "Services")?.id) {
      fetchServices();
    }

  }, [dataTables])

  const fetchServices = async () => {
    console.log(dataTables)
    const tableId = dataTables?.find((t: any) => t?.table_name === "Services")?.id;
    const res = await fetch(`/api/getData?tableId=${tableId}`);
    const data = await res.json()
    setAllServices(data)
  }


  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const users = [{
    id: (session.user as any).id || "1",
    name: (session.user as any).name,
    username: (session.user as any).name,
    email: (session.user as any).email,
    role: (session.user as any).role,
  }];


  return (
    <SessionProvider>
      <ServicesContext.Provider value={{ allServices, setAllServices }}>
        <DataTableContext.Provider value={{ dataTables, setDataTables }}>
          <SidebarProvider defaultOpen>
            <AppSidebar variant="inset" collapsible="icon" />
            <SidebarInset
              data-content-layout="centered"
              className={cn(
                "bg-background relative flex flex-col w-full h-screen overflow-hidden",
                "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl"
              )}
            >
              <header className="flex h-12 shrink-0 items-center gap-2 border-b">
                <div className="flex w-full items-center justify-between px-4 lg:px-6">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1 cursor-pointer" />
                    <Separator orientation="vertical" className="mx-2 h-4" />
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <AccountSwitcher users={users} />
                  </div>
                </div>
              </header>
              <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </DataTableContext.Provider>
      </ServicesContext.Provider>
    </SessionProvider>

  );
}
