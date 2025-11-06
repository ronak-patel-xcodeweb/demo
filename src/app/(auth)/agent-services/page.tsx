'use client'

import { DataTableContext, ServicesContext } from "@/components/context/DataTableContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { EllipsisVertical, Eye } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

export default function AgentServiceRequests() {

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

  const limit = 10;

  const fetchRequests = async (pageNum = 1, append = false) => {
    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
    const agentRequestId = dataTables.find((t: any) => t?.table_name === "AgentRequests")?.id;
    if (!userTableId || !agentRequestId || isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/getServiceRequests?userTableId=${userTableId}&agentRequestId=${agentRequestId}&page=${pageNum}&limit=${limit}`
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

  const getServiceName = (id: any) => {
    const data = allServices.find((data: any) => data?.Id == id)
    return data?.ServiceName
  }
  return (
    <div>
      <div className="text-xl font-bold m-3">
        My Services
      </div>

      <div>
        <div
          className={`grid gap-8 ${agentRequestedData?.length === 2
            ? "grid-cols-[repeat(auto-fit,minmax(20rem,0fr))]"
            : "justify-center grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]"
            }`}
        >
          {agentRequestedData?.map((agent, index) => (
            <div
              key={index}
              className="bg-card md:max-w-[25rem] text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex-grow">
                <div className="flex items-center justify-between pb-3">
                  <p className="text-lg font-semibold text-white flex items-center gap-2">
                    <span className="text-gray-400">Client Name: </span>{agent.userName}
                  </p>

                  <div className="flex items-center rounded-lg">
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
                <div className="space-y-3">
                  <p className="text-gray-300 text-sm mb-2">Service: {getServiceName(agent?.Service)}</p>
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-300 text-sm pr-1">Schedule Status:</span>
                    {agent?.Schedule?.Scheduled == 1 && (
                      <>
                        <span className="bg-green-800 text-white p-2 rounded-sm">{agent?.Schedule?.Scheduled == 1 ? "Scheduled" : "Upcoming"}</span>
                      </>
                    )}
                    {agent?.Schedule?.Scheduled != 1 && (
                      <>
                        <span className="bg-blue-800 text-white p-2 rounded-sm">{agent?.Schedule?.Scheduled == 1 ? "Scheduled" : "Upcoming"}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading &&
            [...Array(6)].map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="bg-card text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm "
              >
                <Skeleton className="h-4 w-60 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
                <div className="flex gap-2 mt-auto">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            ))}
        </div>

        <div ref={observerTarget} className="h-10 w-full" />
        {!isLoading && agentRequestedData?.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No data found
          </div>
        )}
      </div>


      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent
          className="sm:max-w-2/3 flex justify-center  p-0 bg-transparent border-0 shadow-none overflow-auto">
          <div className="bg-[#101113] rounded-2xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,.55)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a3e45] scrollbar-track-transparent">
            <DialogHeader className="p-4">
              <DialogTitle>Service Requested Details</DialogTitle>
            </DialogHeader>
            <Separator />
            {viewAgentRequest && (
              <div className="">
                <div className="m-2 bg-[#0f1012]/40 rounded-2xl border border-white/10 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] overflow-y-auto">
                  <dl className="divide-y divide-white/10 text-sm sm:text-base">
                    {/* Row Template */}
                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Client Name</dt>
                      <dd className="text-white/90">{viewAgentRequest?.userName || "—"}</dd>
                    </div>
                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Service</dt>
                      <dd className="text-white/90">{getServiceName(viewAgentRequest?.Service) || "—"}</dd>
                    </div>
                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Message</dt>
                      <dd className="text-white/90">{viewAgentRequest?.message || "—"}</dd>
                    </div>

                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Payment</dt>
                      <dd className="text-white/90 break-all"> {viewAgentRequest?.payment ? "Paid" : "Pending"}</dd>
                    </div>

                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Schedule Status</dt>
                      <dd className="text-white/90 m-1">
                        <p className="text-gray-300 text-sm">
                          {viewAgentRequest?.Schedule?.Scheduled == 1 && (
                            <>
                              <span className="bg-green-800 text-white p-2 rounded-sm">{viewAgentRequest?.Schedule?.Scheduled == 1 ? "Scheduled" : "Upcoming"}</span>
                            </>
                          )}
                          {viewAgentRequest?.Schedule?.Scheduled != 1 && (
                            <>
                              <span className="bg-blue-800 text-white p-2 rounded-sm">{viewAgentRequest?.Schedule?.Scheduled == 1 ? "Scheduled" : "Upcoming"}</span>
                            </>
                          )}
                        </p>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>

        </DialogContent>
      </Dialog>
      {/* <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Service Requested Details</DialogTitle>
          </DialogHeader>

          <Separator />

          {viewAgentRequest && (
            <div className="space-y-4 text-sm text-gray-200">
              <div className="space-y-3">
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Client Name:</span> {viewAgentRequest?.userName}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Service:</span> {getServiceName(viewAgentRequest?.Service)}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Message:</span> {viewAgentRequest?.message}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Payment:</span>{' '}
                  {viewAgentRequest?.payment ? "Paid" : "Pending"}
                </p>
                <p >
                  {viewAgentRequest?.Schedule?.Scheduled == 1 && (
                    <>
                      <span className="font-medium text-gray-400 pr-1">Schedule Status:</span>
                      <span className="bg-green-800 text-white p-2 rounded-sm">{viewAgentRequest?.Schedule?.Scheduled == 1 ? "Scheduled" : "Upcoming"}</span>
                    </>
                  )}
                  {viewAgentRequest?.Schedule?.Scheduled != 1 && (
                    <>
                      <span className="font-medium text-gray-400 pr-1">Schedule Status:</span>
                      <span className="bg-blue-800 text-white p-2 rounded-sm">{viewAgentRequest?.Schedule?.Scheduled == 1 ? "Scheduled" : "Upcoming"}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
