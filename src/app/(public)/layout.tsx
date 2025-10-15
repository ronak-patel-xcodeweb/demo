"use client";

import { DataTableContext } from "@/components/context/DataTableContext";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";



export default function Layout({ children }: { children: ReactNode }) {
  const [dataTables, setDataTables] = useState<any>([]);

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

  return (
    <div>
      <DataTableContext.Provider value={{ dataTables, setDataTables }}>
        {children}
      </DataTableContext.Provider>
    </div>
  );
}
