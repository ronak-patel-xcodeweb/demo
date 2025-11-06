"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface IdentityDialogProps {
    open: boolean;
    onClose: () => void;
    user?: any;
    doc?: any
}

export default function IdentityDialog({ open, onClose, user, doc }: IdentityDialogProps) {
    const [currentDoc, setCurrentDoc] = useState<any>(doc);
    useEffect(() => {
        setCurrentDoc(doc);
    }, [doc]);
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Identity Document</DialogTitle>
                </DialogHeader>

                {currentDoc ? (
                    <div className="w-full">
                        {currentDoc?.mimetype?.startsWith("image/") ? (
                            <img
                                src={currentDoc?.signedUrl}
                                alt="Identity Document"
                                className="w-full h-[80vh] object-contain"
                            />
                        ) : (
                            <iframe
                                src={currentDoc?.signedUrl}
                                className="w-full h-[80vh] border-0"
                                title="Identity Document"
                            />
                        )}
                    </div>
                ) : (
                    <div className="w-full h-[80vh] flex items-center justify-center text-gray-500">
                        No document available
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
