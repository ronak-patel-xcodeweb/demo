'use client'

import { DataTableContext } from "@/components/context/DataTableContext";
import TacticalMapView from "@/components/map/tactical-map-view";
import { useContext, useEffect, useState } from "react";

export default function Dashboard1() {
  const { dataTables, setDataTables } = useContext(DataTableContext);
  const [agentCountyWise, setAgentCountyWise] = useState<any>();
  const fetchAgent = async () => {
    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
    const agentRequestId = dataTables.find((t: any) => t?.table_name === "AgentRequests")?.id;
    if (!userTableId) return;

    const res = await fetch(`/api/getAgentByCountry?userTableId=${userTableId}&agentRequestId=${agentRequestId}&condition=(role,eq,Agent)~and(agent_status,eq,Approved)`);
    const users = await res.json();
    setAgentCountyWise(users)
  };

  useEffect(() => {
    fetchAgent()
  }, [dataTables])
  return <>
    <TacticalMapView themeColor="ol_bw" agent={agentCountyWise} mapColor="#33333388" /></>;
}
