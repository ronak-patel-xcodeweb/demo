'use client'

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export default function SpinnerComponent({className}:any) {

    return (<>
            <div className={cn("absolute inset-0 flex justify-center items-center z-10", className)}>
                <Spinner className="size-14" />
            </div>
        </>)
}