'use client'

import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DataTableContext, ServicesContext } from "@/components/context/DataTableContext";

export default function AllServices() {

  const { data: session }: any = useSession();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { dataTables, setDataTables } = useContext(DataTableContext);
  const [serviceTableId, setServiceTableId] = useState<any>();

  const { allServices, setAllServices } = useContext(ServicesContext);


  const handlePriceChange = (index: number, newPrice: string) => {
    const updated = [...allServices];
    updated[index].Price = newPrice;
    setAllServices(updated);
  }

  const updatePrice = async () => {
    const formData = new FormData();
    if (editIndex != null) {
      const payload = {
        Id: allServices[editIndex].Id,
        Price: allServices[editIndex].Price
      }
      formData.append("data", JSON.stringify(payload));
      formData.append("tableId", serviceTableId);

      const res = await fetch('/api/updateData', {
        method: 'PATCH',
        body: formData
      })
      if (res?.ok) {
        toast.success(`You have successfully updated the Price for ${allServices[editIndex].ServiceName}.`, {
          style: {
            background: 'green',
          },
        })
      }
      setEditIndex(null);
    }

  }

  return (
    <div>
      <div className="text-3xl mb-6 font-bold">Available Services</div>
      <div className="p-10">
        <div className="grid gap-8 justify-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {allServices?.map((service: any, index: any) => (
            <div
              key={index}
              className="text-center bg-card text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              {session?.user?.role === "Admin" && (
                <div className="flex justify-end mb-2">
                  <Pencil
                    width={20}
                    height={20}
                    className="cursor-pointer"
                    color="#00CEC8"
                    onClick={() => setEditIndex(index)}
                  />
                </div>
              )}

              <h2 className="text-xl font-semibold text-white mb-1">{service?.ServiceName}</h2>
              <p className="text-gray-200 text-sm mb-4">{service?.ServiceDescription}</p>

              {editIndex === index ? (
                <Input
                  value={service?.Price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  className="mb-4 text-center text-3xl font-bold text-[#00CEC8]"
                />
              ) : (
                <p className="text-[#00CEC8] text-3xl font-bold mb-4">${service?.Price}</p>
              )}

              {editIndex === index && (
                <div className="flex justify-end">
                  <Button
                    className="w-36 cursor-pointer"
                    onClick={() => {
                      updatePrice()
                    }}
                  >
                    Update Price
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
