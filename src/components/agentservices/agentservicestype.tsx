'use client'

import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { DataTableContext, ServicesContext } from "../context/DataTableContext";

interface AllAgentServicesProps {
    onRequest: (serviceName: string) => void;
}

export default function AllAgentServices({ onRequest }: AllAgentServicesProps) {

    const { allServices, setAllServices } = useContext(ServicesContext);


    return (
        <div>
            <div>
                <div className="grid gap-8 justify-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                    {allServices.map((service: any, index: any) => (
                        <div
                            key={index}
                            className="transform p-7 text-center rounded-xl bg-[#333333] shadow-xl transition duration-300 hover:scale-105"
                        >
                            <h2 className="text-xl font-semibold text-white mb-1">{service.ServiceName}</h2>
                            <p className="text-gray-200 text-sm mb-4">{service.ServiceDescription}</p>
                            <div>
                                <Button className="w-36 cursor-pointer" type="button" onClick={() => onRequest(service.ServiceName)}
                                >
                                    Request
                                </Button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
