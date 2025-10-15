'use client'

import { Button } from "@/components/ui/button";

export default function AgentServices() {

  const AgentServices = [
    {
      clientName: 'ABC',
      servicesName: 'Consultation',
      status: 'Scheduled'
    },
    {
      clientName: 'XYZ',
      servicesName: 'Consultation',
      status: 'Upcoming'
    },
  ]


  return <div>
    <div className="text-3xl font-bond">
      My Services
    </div>
    <div className="p-10">
      <div className="
          grid 
          gap-8 
          justify-center
          grid-cols-[repeat(auto-fit,minmax(250px,1fr))] 
        ">
        {AgentServices.map((agentServices, index) => (
          <div
            key={index}
            className="transform p-5 md:w-2/3 rounded-xl  bg-[#333333] shadow-xl transition duration-300 hover:scale-105"
          >
            <div>
              <p className="text-gray-200 text-sm mb-4">Cliet Name: {agentServices.servicesName}</p>
              <p className="text-gray-200 text-sm mb-4">Service: {agentServices.servicesName}</p>
              <p className="text-gray-200 text-sm mb-4 ">Status:
                {agentServices.status == 'Scheduled' ? (<span className="ml-2 bg-green-800 text-white p-2 rounded-sm">{agentServices.status}</span>
                ) : (<span className="ml-2 bg-indigo-800  text-white p-2 rounded-sm">{agentServices.status}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}
