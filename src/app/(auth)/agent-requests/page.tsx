'use client'

import { useContext, useEffect, useRef, useState } from "react";
import { DataTableContext, ServicesContext } from "@/components/context/DataTableContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EllipsisVertical, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConfirmationAlert from "@/components/confiramtion-alert/ConfirmationAlert";
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function AgentRequests() {
  const { dataTables } = useContext(DataTableContext);
  const { allServices } = useContext(ServicesContext);

  const [agentRequestedData, setAgentRequestedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const [viewAgentRequest, setviewAgentRequest] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const initialFetchDone = useRef(false);
  const isFetching = useRef(false);
  const [isConfiramtion, setIsConfiramtion] = useState(false);
  const [paymentForUserId, setPaymentForUserId] = useState<any>();
  const router = useRouter();

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const limit = 10;

  const fetchRequests = async (pageNum = 1, append = false) => {
    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
    const agentRequestId = dataTables.find((t: any) => t?.table_name === "AgentRequests")?.id;
    if (!userTableId || !agentRequestId || isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/getAgentRequests?userTableId=${userTableId}&agentRequestId=${agentRequestId}&page=${pageNum}&limit=${limit}`
      );
      const data = await res.json();

      const newList = data?.list || [];
      setAgentRequestedData((prev) => (append ? [...prev, ...newList] : newList));

      if (!data?.pageInfo || data?.pageInfo?.isLastPage) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    if (!initialFetchDone.current && dataTables.length > 0) {
      fetchRequests(1, false);
      initialFetchDone.current = true;
    }
  }, [dataTables]);

  useEffect(() => {
    if (!observerTarget.current || !initialFetchDone.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetching.current) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchRequests(nextPage, true);
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, isLoading, page]);

  useEffect(() => {
    return () => {
      setAgentRequestedData([]);
      setPage(1);
      setHasMore(true);
      setIsLoading(false);
      initialFetchDone.current = false;
      isFetching.current = false;
    };
  }, []);

  const openviewAgentRequest = (user: any) => {
    setviewAgentRequest(user);
    setIsViewOpen(true);
  };

  const getServiceName = (agent: any, id: any) => {
    const data = allServices.find((data: any) => data?.Id == id)
    if (agent?.Schedule?.meetingType === "Remote") {
      return 'Meeting – Remote'
    }
    if (agent?.Schedule?.meetingType === "Physical") {
      return 'Meeting – Physical'
    }
    return data?.ServiceName
  }

  const getServicePrice = (agent: any, id: any) => {
    const data = allServices.find((data: any) => data?.Id == id)
    if (agent?.Schedule?.meetingType === "Remote") {
      return data?.Remote_Price
    }
    return data?.Price
  }

  const paymentProcess = async () => {
    const formData = new FormData();
    const agentRequestTableId = dataTables.find((t: any) => t?.table_name === "AgentRequests")?.id;
    const paymentTableId = dataTables.find((t: any) => t?.table_name === "Payment")?.id;
    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
    const payload = {
      Id: paymentForUserId?.AgentId,
      agentRequestTableId,
      paymentTableId,
      userTableId,
      amount: paymentForUserId?.amount,
      stripeAccountId: paymentForUserId?.stripeAccountId,
      serviceName: paymentForUserId?.serviceName
    }
    formData.append("data", JSON.stringify(payload))
    const res = await fetch('/api/stripe/createStripeInstance', {
      method: 'POST',
      body: formData
    })
    const bodydata = await res.json();
    router.push(bodydata.url)
  }
  // useEffect(() => {

  //   if (sessionId) {
  //     const fetchPaymentDetails = async () => {
  //       const res = await fetch(`/api/stripe/payment-status?session_id=${sessionId}`);
  //       const paymentData = await res.json();
  //       if(paymentData){
  //         router.push('/agent-requests');
  //       }
  //       // if (paymentData) {
  //       //   const formData = new FormData();
  //       //   const payload = {
  //       //     Id: paymentData?.metadata?.paymentForUserId,
  //       //     PaymentId: paymentData?.id,
  //       //     amount: paymentData?.payment_intent?.amount,
  //       //     payment_method_types: paymentData?.payment_intent?.payment_method_types[0],
  //       //   }
  //       //   formData.append("data", JSON.stringify(payload))
  //       //   formData.append("agentRequestTableId", paymentData?.metadata?.agentRequestTableId)
  //       //   formData.append("paymentTableId", paymentData?.metadata?.paymentTableId)
  //       //   const resPayment = await fetch('/api/stripe/AddPayment', {
  //       //     method: 'POST',
  //       //     body: formData
  //       //   })
  //       //   if (resPayment.ok) {
  //       //     router.push('/agent-requests')
  //       //     setAgentRequestedData([]);
  //       //     fetchRequests(1, false);
  //       //     toast.success(`Payment successfully.`, {
  //       //     })
  //       //   }
  //       // }
  //     }
  //     fetchPaymentDetails();
  //   }
  // }, [sessionId]);



  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      if (status === 'success') {
        setIsSuccessDialogOpen(true);
      } else if (status === 'cancel') {
        setIsCancelDialogOpen(true);
      }
    }
  }, []);

  return <div>
    <div className="text-xl font-bold m-3">
      Agent Requests
    </div>

    <div>
      <div className="
          grid 
          gap-8 
          justify-center
grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]
        ">
        {agentRequestedData?.map((agent: any, index: any) => (
          <div
            key={`${agent?.id || index}-${index}`}
            className="bg-card text-card-foreground md:max-w-[25rem] flex flex-col rounded-xl border p-4 shadow-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >

            <div className="flex items-center justify-between pb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                {agent.userName}
              </h2>

              <div className="flex items-center gap-3  rounded-lg">

                <Popover>
                  <PopoverTrigger asChild>
                    <button className=":bg-gray-700 rounded transition-colors">
                      <EllipsisVertical className="cursor-pointer w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 bg-card text-white rounded-xl shadow-lg border">
                    <div className="flex flex-col gap-1">
                      <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left cursor-pointer"
                        onClick={() => openviewAgentRequest(agent)}
                      >
                        <Eye width={16} height={16} className="text-blue-500" />
                        <span className="text-sm">View Detail</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <p className="text-gray-300 text-sm mb-2">Service: {getServiceName(agent, agent?.Service)}</p>
              <p className="text-gray-300 text-sm mb-3">
                Payment: {(agent?.payment == "" || agent?.payment == undefined || agent?.payment == null) ? "Pending" : "Paid"}
              </p>
              <p className="text-gray-300 text-sm">
                <span className="pr-1">Status:</span>
                {agent?.Agent_Status == "Accepted" && (
                  <span className="bg-green-800 text-white p-2 rounded-sm">{agent?.Agent_Status}</span>
                )}
                {agent?.Agent_Status == "Pending" && (
                  <span className="bg-indigo-800 text-white p-2 rounded-sm">{agent?.Agent_Status}</span>
                )}
                {agent?.Agent_Status == "Rejected" && (
                  <span className="bg-red-800 text-white p-2 rounded-sm">{agent?.Agent_Status}</span>
                )}
              </p>
            </div>

            <div className="mt-5 flex justify-end items-center gap-2">
              {(agent?.payment == "" || agent?.payment == undefined || agent?.payment == null) && agent?.Agent_Status != "Pending" && (
                <div>
                  {(agent?.stripeAccountId == "" || agent?.stripeAccountId == undefined || agent?.stripeAccountId == null) || !agent?.payoutsEnabled ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="w-36 cursor-not-allowed opacity-60">
                            Pay Now
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          {`${agent?.userName} has not set up the payout account`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>) :
                    (
                      <Button onClick={() => { setIsConfiramtion(true); setPaymentForUserId({ stripeAccountId: agent?.stripeAccountId, AgentId: agent?.Id, serviceName: getServiceName(agent, agent?.Service), amount: getServicePrice(agent, agent?.Service) }) }} className="w-36 cursor-pointer" type="submit">
                        Pay Now
                      </Button>
                    )}

                </div>

              )}

            </div>
          </div>
        ))}
        {isLoading &&
          [...Array(6)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="bg-card text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3">
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-60 mb-2" />
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-8 w-10 ml-auto mt-2" />
            </div>
          ))}
        {!isLoading && agentRequestedData?.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No data found
          </div>
        )}
      </div>


      <div ref={observerTarget} className="h-10 w-full" />
    </div>

    <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
      <DialogContent
        className="sm:max-w-2/3 flex justify-center  p-0 bg-transparent border-0 shadow-none overflow-auto">
        <div className="bg-[#101113] rounded-2xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,.55)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a3e45] scrollbar-track-transparent">
          <DialogHeader className="p-4">
            <DialogTitle>Agent Request Details</DialogTitle>
          </DialogHeader>
          <Separator />
          {viewAgentRequest && (
            <div className="">
              <div className="m-2 bg-[#0f1012]/40 rounded-2xl border border-white/10 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] overflow-y-auto">
                <dl className="divide-y divide-white/10 text-sm sm:text-base">

                  {/* Row Template */}
                  <div className="py-3 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Agent Name</dt>
                    <dd className="text-white/90">{viewAgentRequest?.userName || "—"}</dd>
                  </div>
                  <div className="py-3 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Service</dt>
                    <dd className="text-white/90">{getServiceName(viewAgentRequest, viewAgentRequest?.Service) || "—"}</dd>
                  </div>

                  <div className="py-3 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Payment</dt>
                    <dd className="text-white/90">{(viewAgentRequest?.payment == "" || viewAgentRequest?.payment == undefined || viewAgentRequest?.payment == null) ? "Pending" : "Paid"}</dd>
                  </div>
                  <div className="py-3 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Status</dt>
                    <dd className="text-white/90 m-1">                   <p className="text-gray-300 text-sm">
                      {viewAgentRequest?.Agent_Status == "Accepted" && (
                        <span className="bg-green-800 text-white p-2 rounded-sm">{viewAgentRequest?.Agent_Status}</span>
                      )}
                      {viewAgentRequest?.Agent_Status == "Pending" && (
                        <span className="bg-indigo-800 text-white p-2 rounded-sm">{viewAgentRequest?.Agent_Status}</span>
                      )}
                      {viewAgentRequest?.Agent_Status == "Rejected" && (
                        <span className="bg-red-800 text-white p-2 rounded-sm">{viewAgentRequest?.Agent_Status}</span>
                      )}
                    </p>
                    </dd>
                  </div>
                  <div className="py-3 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Payment</dt>
                    <dd className="text-white/90">{(viewAgentRequest?.payment == "" || viewAgentRequest?.payment == undefined || viewAgentRequest?.payment == null) ? "Pending" : "Paid"}</dd>
                  </div>

                </dl>
              </div>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>

    {isConfiramtion && (
      <ConfirmationAlert
        handleClose={(confirmed) => {
          if (confirmed) {
            paymentProcess();
          }
          setIsConfiramtion(false);
        }}
        showDialog={true}
        title="Click confirm to continue. Payment will be processed later."
      />
    )}
    <Dialog open={isSuccessDialogOpen} onOpenChange={(data) => {
      setIsSuccessDialogOpen(data)
      if (!data) {
        router.push("/agent-requests");
      }
    }}>
      <DialogContent className="sm:max-w-md text-white border  rounded-2xl p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Payment Successful 🎉</DialogTitle>
        </DialogHeader>
        <p className="mt-3 text-sm text-green-500">
          Your payment was processed successfully.
        </p>
        <Button
          className="mt-4 bg-white cursor-pointer"
          onClick={() => {
            setIsSuccessDialogOpen(false);
            router.push('/agent-requests');
          }}
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>

    <Dialog open={isCancelDialogOpen} onOpenChange={(data) => {
      setIsCancelDialogOpen(data)
      if (!data) {
        router.push("/agent-requests");
      }
    }}>
      <DialogContent className="sm:max-w-md  text-white border  rounded-2xl p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Payment Canceled ❌</DialogTitle>
        </DialogHeader>
        <p className="mt-3 text-sm text-red-500">
          Your payment was canceled. You can try again later.
        </p>
        <Button
          className="mt-4 bg-white"
          onClick={() => {
            setIsCancelDialogOpen(false);
            router.push('/agent-requests');
          }}
        >
          Go Back
        </Button>
      </DialogContent>
    </Dialog>

  </div>;
}