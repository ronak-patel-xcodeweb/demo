'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function AgentServiceRequests() {
  const initialData = [
    {
      id: 1,
      requester: 'ABC',
      service: 'Consultation',
      message: 'Discuss supply chain upgrades',
      status: 'schedule',
      accepted: false
    },
    {
      id: 1,
      requester: 'XYZ',
      service: 'Meeting',
      message: 'Strategic briefing',
      status: 'schedule',
      accepted: false
    },
    {
      requester: 'MNO',
      service: 'Subscription',
      message: 'Ongoing advisory',
      status: 'schedule',
      accepted: true
    },
  ]
  const [serviceRequestedData, setServiceRequestedData] = useState(initialData);


  const handleAccept = (requester: any, toastColor: string) => {
    const updatedData = serviceRequestedData.map(agent =>
      agent.requester === requester.requester
        ? { ...agent, accepted: true, status: 'OnGoing' }
        : agent
    );
    setServiceRequestedData(updatedData);
    toast.success(`You have successfully accepted the request from ${requester.requester}`, {
      style: {
        background: toastColor,
        color: 'black'
      },
    });
  };

  const handleReject = (requester: any, toastColor: string) => {
    const updatedData = serviceRequestedData.map(agent =>
      agent?.requester === requester?.requester
        ? { ...agent, accepted: false, status: 'Rejected' }
        : agent
    );
    setServiceRequestedData(updatedData);
    toast.success(`You have rejected the request from ${requester.requester}`, {
      style: {
        background: toastColor,
      },
    });
  };

  return (
    <div>
      <div className="text-3xl mb-6 font-bold">
        Incoming Requests
      </div>
      <div className="p-10">
        <div className="
            grid 
            gap-8 
            justify-center
            grid-cols-[repeat(auto-fit,minmax(250px,1fr))] 
          ">
          {serviceRequestedData.map((agent, index) => (
            <div
              key={index}
              className="transform p-5 rounded-xl bg-[#333333] shadow-xl transition duration-300 hover:scale-105"
            >
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  Requester: {agent.requester}
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-medium text-gray-400">Service:</span> {agent.service}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-gray-400">Message:</span> {agent.message}
                  </p>
                  {agent.accepted && (<p className="text-gray-300">
                    <span className="font-medium text-gray-400">Status:</span> {agent.status}
                  </p>)}
                  {!agent.accepted && agent.status == 'Rejected' && (
                    <p className="text-gray-300">
                      <span className="font-medium text-gray-400">Status:</span> {agent.status}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-5">
                {!agent.accepted && agent.status !== 'Rejected' && (<>
                  <Button
                    className="w-36 cursor-pointer"
                    onClick={() => handleAccept(agent, '#efefef')}
                  >
                    Accept
                  </Button>
                  <Button
                    className="w-36 cursor-pointer bg-card text-white hover:text-black"
                    onClick={() => handleReject(agent, 'bg-card')}
                  >
                    Reject
                  </Button>
                </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
