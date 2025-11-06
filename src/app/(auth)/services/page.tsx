'use client'

import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DataTableContext, ServicesContext } from "@/components/context/DataTableContext";
import { Skeleton } from "@/components/ui/skeleton";
import SpinnerComponent from "@/components/spinner/spinner";

export default function AllServices() {
  const { data: session }: any = useSession();
  const [editIndex, setEditIndex] = useState<string | null>(null);
  const { dataTables } = useContext(DataTableContext);
  const { allServices, setAllServices } = useContext(ServicesContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const expandedServices = allServices.flatMap((service: any) => {
    if (service.ServiceName === "Meeting – Remote/Physical") {
      return [
        {
          ...service,
          DisplayName: "Meeting – Remote",
          key: `${service.Id}-remote`,
          priceField: "Remote_Price",
          PriceValue: service.Remote_Price ?? "",
        },
        {
          ...service,
          DisplayName: "Meeting – Physical",
          key: `${service.Id}-physical`,
          priceField: "Price",
          PriceValue: service.Price ?? "",
        },
      ];
    } else {
      return [
        {
          ...service,
          DisplayName: service.ServiceName,
          key: `${service.Id}`,
          priceField: "Price",
          PriceValue: service.Price ?? "",
        },
      ];
    }
  });

  const handlePriceChange = (key: string, newPrice: string) => {
    const updated = allServices.map((s: any) => {
      if (key.includes(`${s.Id}-remote`)) return { ...s, Remote_Price: newPrice };
      if (key.includes(`${s.Id}-physical`)) return { ...s, Price: newPrice };
      if (key === `${s.Id}`) return { ...s, Price: newPrice };
      return s;
    });
    setAllServices(updated);
  };

  const updatePrice = async (service: any, key: string) => {
    setIsLoading(true)
    const formData = new FormData();
    const serviceTableId = dataTables.find((t: any) => t?.table_name === "Services")?.id;

    const payload: any = { Id: service.Id };
    if (key.includes("remote")) payload.Remote_Price = service.Remote_Price;
    else payload.Price = service.Price;

    formData.append("data", JSON.stringify(payload));
    formData.append("tableId", serviceTableId);

    const res = await fetch("/api/updateData", { method: "PATCH", body: formData });

    if (res?.ok) {
      setIsLoading(false)
      toast.success(
        `Price updated for ${service.ServiceName === "Meeting – Remote/Physical"
          ? key.includes("remote")
            ? "Meeting – Remote"
            : "Meeting – Physical"
          : service.ServiceName
        }.`,
        { style: { background: "green" } }
      );
    }

    setEditIndex(null);
  };

  return (
    <div>
      <div className="md:flex justify-between items-center m-3">
        <h1 className="text-xl font-bold">Available Services</h1>
      </div>

      <div className="grid gap-8 justify-center grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]">
        {expandedServices?.map((service: any) => (
          <div
            key={service.key}
            className="text-center bg-card text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            {session?.user?.role === "Admin" && (
              <div className="flex justify-end mb-2">
                <Pencil
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  color="#00CEC8"
                  onClick={() => setEditIndex(service.key)}
                />
              </div>
            )}

            <h2 className="text-xl font-semibold text-white mb-1">{service.DisplayName}</h2>
            <p className="text-gray-200 text-sm mb-4">{service.ServiceDescription}</p>

            {editIndex === service.key ? (
              <div className="mt-5">
                <div className="rounded-xl border border-line bg-input px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-200 text-sm">Price</span>
                    <input
                      type="number"
                      value={
                        service.priceField === "Remote_Price"
                          ? service.Remote_Price ?? ""
                          : service.Price ?? ""
                      }
                      onChange={(e) => handlePriceChange(service.key, e.target.value)}
                      className="w-full text-center bg-transparent outline-none text-brand font-semibold tracking-wide
                        [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-gray-200 text-sm">$</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[#00CEC8] text-3xl font-bold mb-4">
                $
                {service.priceField === "Remote_Price"
                  ? service.Remote_Price ?? "-"
                  : service.Price ?? "-"}
              </p>
            )}

            {editIndex === service.key && (
              <div className="flex justify-center mt-5">
                <Button
                  className="w-36 cursor-pointer h-11"
                  onClick={() => updatePrice(service, service.key)}
                >
                  <span className="font-bold">Update Price</span>
                </Button>
              </div>
            )}
          </div>
        ))}

        {allServices.length === 0 &&
          [...Array(3)].map((_, i) => (
            <div
              key={`skeleton - ${i}`}
              className="bg-card text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm flex items-center"
            >
              <div className="flex items-center justify-between pb-3">
                <Skeleton className="h-6 w-40" />
              </div>
              <Skeleton className="h-4 w-48 mb-2 flex items-center" />
              <Skeleton className="h-4 w-48 mb-2 flex items-center" />
            </div>
          ))}
      </div>
      {isLoading && (
        <SpinnerComponent />
      )}
    </div>
  );
}
