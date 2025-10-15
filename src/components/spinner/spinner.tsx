'use client'

import { Spinner } from "@/components/ui/spinner";

export default function SpinnerComponent() {

    return (<>
            <div className="absolute inset-0 flex justify-center items-center z-10">
                <Spinner className="w-24 h-24" />
            </div>
        </>)
}