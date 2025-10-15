'use client'

import { useState } from 'react';
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "../ui/alert-dialog";

interface ConfirmationData {
    title: string;
    showDialog: boolean; 
    handleClose: (confirm:boolean) => void;
}

export default function ConfirmationAlert({ title, showDialog,handleClose }: ConfirmationData) {
    const [isOpen, setIsOpen] = useState(showDialog); 

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={()=>handleClose(false)}>No</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>handleClose(true)}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
