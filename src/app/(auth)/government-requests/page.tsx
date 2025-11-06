'use client'

import { DataTableContext } from "@/components/context/DataTableContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EllipsisVertical, Eye, Info } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";

export default function GovernmentRequests() {
    const { dataTables } = useContext(DataTableContext);
    const observerTarget = useRef<HTMLDivElement | null>(null);
    const [requestedData, setRequestedData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isFetching = useRef(false);
    const initialFetchDone = useRef(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [viewRequest, setviewRequest] = useState<any>();

    const limit = 10;


    const fetchRequests = async (pageNum = 1, append = false) => {
        const inquiryTableId = dataTables.find((t: any) => t?.table_name === "GovernmentBodyInquiry")?.id;
        const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
        if (!inquiryTableId || isFetching.current) return;

        isFetching.current = true;
        setIsLoading(true);

        try {
            const res = await fetch(
                `/api/GetInquiry?inquiryTableId=${inquiryTableId}&userTableId=${userTableId}&page=${pageNum}&limit=${limit}`
            );
            const data = await res.json();

            const newList = data?.list || [];
            setRequestedData((prev) => (append ? [...prev, ...newList] : newList));
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
            setRequestedData([]);
            setPage(1);
            setHasMore(true);
            setIsLoading(false);
            initialFetchDone.current = false;
            isFetching.current = false;
        };
    }, []);


    return <div>
        <div className="md:flex justify-between items-center m-3">
            <h1 className="text-xl font-bold">Requested Services</h1>

        </div>
        <div>
            <div>
                <div
                    className={`grid gap-8 ${requestedData?.length === 2
                        ? "grid-cols-[repeat(auto-fit,minmax(20rem,0fr))]"
                        : "justify-center grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]"
                        }`}
                >
                    {requestedData?.map((request, index) => (
                        <div
                            key={index}
                            className="bg-card text-card-foreground md:max-w-[25rem] flex flex-col rounded-xl border p-4 shadow-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div className="mb-4 flex-grow">
                                <div className="flex items-center justify-between pb-3">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        {request.requestTitle}
                                    </h2>
                                    <div className="flex items-center gap-3 rounded-lg">
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
                                                        onClick={() => {
                                                            setIsViewOpen(true);
                                                            setviewRequest(request);
                                                        }}
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

                                    <p className="text-gray-300 text-sm mb-2">
                                        Purpose: {request.purpose}
                                    </p>
                                    <p
                                        className="text-gray-300 text-sm mb-2 line-clamp-2 cursor-pointer"
                                    >Description:
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>

                                                    <span> {request.description}</span>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs">
                                                    {request.description}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </p>
                                    <p className="text-gray-300 text-sm mb-2">
                                        Requester: {request.name}
                                    </p>
                                    <p className="text-gray-300 text-sm mb-2">
                                        Requester Email: {request.email}
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
                                <div className="flex justify-between mb-2">
                                    <Skeleton className="h-4 w-60" />
                                    <Skeleton className="h-7 w-7" />
                                </div>
                                <Skeleton className="h-4 w-60 mb-2" />
                                <Skeleton className="h-4 w-48 mb-2" />

                            </div>
                        ))}
                </div>

                <div ref={observerTarget} className="h-10 w-full" />
                {!isLoading && requestedData?.length === 0 && (
                    <div className="text-center text-gray-400 py-10">
                        No data found
                    </div>
                )}
            </div>
        </div>
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
            <DialogContent
                className="sm:max-w-1/3 flex justify-center  p-0 bg-transparent border-0 shadow-none overflow-auto">
                <div className="bg-[#101113] rounded-2xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,.55)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a3e45] scrollbar-track-transparent">
                    <DialogHeader className="p-4">
                        <DialogTitle>Request Details</DialogTitle>
                    </DialogHeader>
                    <Separator />
                    {viewRequest && (
                        <div className="">
                            <div className="m-2 bg-[#0f1012]/40 rounded-2xl border border-white/10 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] overflow-y-auto">
                                <dl className="divide-y divide-white/10 text-sm sm:text-base">
                                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                                        <dt className="font-semibold text-white/90">Title</dt>
                                        <dd className="text-white/90">{viewRequest?.requestTitle || "—"}</dd>
                                    </div>
                                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                                        <dt className="font-semibold text-white/90">Purpose</dt>
                                        <dd className="text-white/90">{viewRequest?.purpose || "—"}</dd>
                                    </div>
                                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                                        <dt className="font-semibold text-white/90">Description</dt>
                                        <dd className="text-white/90 line-clamp-2 cursor-pointer">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span>                       {viewRequest?.description || "—"}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs">
                                                        {viewRequest?.description || "—"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider></dd>
                                    </div>
                                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                                        <dt className="font-semibold text-white/90">Requester</dt>
                                        <dd className="text-white/90">{viewRequest?.name || "—"}</dd>
                                    </div>
                                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                                        <dt className="font-semibold text-white/90">Requester Email</dt>
                                        <dd className="text-white/90">{viewRequest?.email || "—"}</dd>
                                    </div>

                                </dl>
                            </div>
                        </div>
                    )}
                </div>


            </DialogContent>
        </Dialog>
    </div >;
}