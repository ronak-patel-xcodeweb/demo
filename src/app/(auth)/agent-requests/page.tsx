'use client'

import { Button } from "@/components/ui/button";

export default function AgentRequests() {

  const agentRequestedData = [
    {
      name: 'Jessica',
      age: '32',
      service_type: 'Consultation',
      status: 'Accepted',
      payment: 'pending'
    },
    {
      name: 'Mark',
      age: '25',
      service_type: 'Meeting',
      status: 'Ongoing',
      payment: 'Done'
    },
    {
      name: 'David',
      age: '25',
      service_type: 'Subscription',
      status: 'Rejected',
      payment: 'Auto-billed'
    }
  ]


  return <div>
    <div className="text-xl font-bold m-3">
      Agent Requests
    </div>
    <div >
      <div className="
          grid 
          gap-8 
          justify-center
          grid-cols-[repeat(auto-fit,minmax(250px,1fr))] 
        ">
        {agentRequestedData.map((agent, index) => (
          <div
            key={index}
            className="bg-card text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">{agent.name}</h2>
              <p className="text-gray-400  mb-2">Age: {agent.age}</p>

              <p className="text-gray-300 mb-2">
                <span className="font-medium text-gray-400">Service:</span> {agent.service_type}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-medium text-gray-400">Payment:</span> {agent.payment}
              </p>
              <p className="text-gray-300 font-bold">
                <span className="font-medium text-gray-400 pr-1">Status:</span>
                {agent.status == "Accepted" && (
                  <span className="bg-green-800 text-white p-2 rounded-sm">{agent.status}</span>
                )}
                {agent.status == "Ongoing" && (
                  <span className="bg-indigo-800 text-white p-2 rounded-sm">{agent.status}</span>
                )}
                {agent.status == "Rejected" && (
                  <span className="bg-red-800 text-white p-2 rounded-sm">{agent.status}</span>
                )}
              </p>
            </div>

            <div className="mt-3 flex justify-end">
              {agent.payment == "pending" && (
                <Button className="w-36 cursor-pointer" type="submit" >
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}
