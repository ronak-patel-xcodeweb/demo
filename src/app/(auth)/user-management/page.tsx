'use client'

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EllipsisVertical, Eye, Info, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTableContext } from "@/components/context/DataTableContext";
import ConfirmationAlert from "@/components/confiramtion-alert/ConfirmationAlert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SpinnerComponent from "@/components/spinner/spinner";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const userFormSchema = z.object({
  First_Name: z.string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),

  Last_Name: z.string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),

  email: z.string()
    .min(1, "This field is required.")
    .email("Please enter a valid email address"),

  phoneNumber: z.string()
    .min(1, "Phone number is required"),
  role: z.string().default("Admin"),
  active: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  Id: z.any().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;


export default function UserManagement() {
  const { dataTables } = useContext(DataTableContext);
  const limit = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const initialFetchDone = useRef(false);
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [totalData, setTotalData] = useState(0);
  const [isConfiramtion, setIsConfiramtion] = useState(false);
  const [isConfiramtionForStatus, setIsConfiramtionForStatus] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmationForStatus, setIsConfirmationForStatus] = useState(false);
  const [statusIndexData, setStatusIndexData] = useState<any>();
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      First_Name: "",
      Last_Name: "",
      email: "",
      phoneNumber: "",
      role: "Admin",
      active: true,
      isDeleted: false,
    },
  });

  const fetchUser = async (currentOffset: number, append: boolean) => {
    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
    if (!userTableId || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/getUser?condition=(role,eq,Admin)~and(name,like,${searchText})&sort=name&userTableId=${userTableId}&limit=${limit}&offset=${currentOffset}`
      );
      const userData = await res.json();

      setTotalData(userData?.pageInfo?.totalRows || 0);

      if (userData?.list?.length < limit) {
        setHasMore(false);
      }

      if (append) {
        setUsers(prev => [...prev, ...userData?.list]);
      } else {
        setUsers(userData?.list || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    const userTableId = dataTables?.find((t: any) => t?.table_name === "User")?.id;
    if (userTableId && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchUser(0, false);
    }
  }, [dataTables]);

  useEffect(() => {
    if (!initialFetchDone.current) return;

    const handler = setTimeout(() => {
      setUsers([]);
      setOffset(0);
      setHasMore(true);
      setTotalData(0);
      fetchUser(0, false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (!observerTarget.current || !initialFetchDone.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetchingRef.current &&
          users.length > 0 &&
          users.length < totalData
        ) {
          const newOffset = offset + limit;
          setOffset(newOffset);
          fetchUser(newOffset, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, offset, users.length, totalData]);

  useEffect(() => {
    return () => {
      setUsers([]);
      setOffset(0);
      setHasMore(true);
      setTotalData(0);
      setIsLoading(false);
      initialFetchDone.current = false;
      isFetchingRef.current = false;
    };
  }, []);

  const toggleUserStatus = async (index: number, set: boolean) => {
    setIsLoadingAdd(true);
    const userTableId = dataTables.find((t: any) => t?.table_name === "User");
    const updated = [...users];
    updated[index].active = set;
    const payload = {
      Id: users[index].Id,
      email: users[index].email,
      name: users[index].name,
      active: set ? 1 : 0
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    formData.append("userTableId", userTableId?.id);

    const res = await fetch('/api/userStatusUpdate', {
      method: 'PATCH',
      body: formData
    });

    if (res?.ok) {
      toast.success(`User status has been ${set ? 'activated' : 'deactivated'}`, {
        style: {
          background: set ? 'green' : 'red',
        },
      });
      setUsers(updated);
      setIsLoadingAdd(false);
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsLoadingAdd(true);
    const userTableId = dataTables.find((t: any) => t?.table_name === "User");
    setOpen(false);

    if (editingIndex !== null) {
      const formData = new FormData();
      const payload = {
        Id: data.Id,
        First_Name: data.First_Name,
        Last_Name: data.Last_Name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        name: `${data.First_Name} ${data.Last_Name}`
      };
      formData.append("data", JSON.stringify(payload));
      formData.append("userTableId", userTableId?.id);

      const res = await fetch('/api/userUpdate', {
        method: 'PATCH',
        body: formData
      });

      if (res?.ok) {
        setIsLoadingAdd(false);
        toast.success("User has been successfully updated.", {
          style: {
            background: 'green',
          },
        });
        setUsers([]);
        setOffset(0);
        setHasMore(true);
        setTotalData(0);
        fetchUser(0, false);
        setEditingIndex(null);
      }
    } else {
      const formData = new FormData();

      const payload = {
        First_Name: data.First_Name,
        Last_Name: data.Last_Name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: "Admin",
        isDeleted: 0,
        active: 1,
        name: `${data.First_Name} ${data.Last_Name}`
      };
      formData.append("data", JSON.stringify(payload));
      formData.append("userTableId", userTableId?.id);

      try {
        const res = await fetch('/api/AddUser', {
          method: 'POST',
          body: formData,
        });

        const responseData = await res.json();

        if (res.ok) {
          toast.success("User has been successfully added.", {
            style: { background: 'green' },
          });
          setUsers([]);
          setOffset(0);
          setHasMore(true);
          setTotalData(0);
          fetchUser(0, false);
          setEditingIndex(null);
          form.reset();
          setIsLoadingAdd(false);
        } else {
          toast.error(responseData.error || "Something went wrong.", {
            style: { background: 'red' },
          });
        }
      } catch (error: any) {
        toast.error(error.message || "Network error", {
          style: { background: 'red' },
        });
      }
    }
  };

  const deleteUser = async (index: number | null) => {
    setIsLoadingAdd(true);
    if (index === null) return;

    const userTableId = dataTables.find((t: any) => t?.table_name === "User");
    const payload = {
      Id: users[index].Id,
      isDeleted: 1
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    formData.append("userTableId", userTableId?.id);

    const res = await fetch('/api/userUpdate', {
      method: 'PATCH',
      body: formData
    });

    if (res?.ok) {
      toast.success("User has been successfully deleted.", {
        style: {
          background: "red",
        },
      });
      setUsers([]);
      setTotalData(0);
      setOffset(0);
      setHasMore(true);
      fetchUser(0, false);
      setEditingIndex(null);
      setIsLoadingAdd(false);
    }
  };

  const editUser = (index: number) => {
    const user = users[index];
    form.reset({
      First_Name: user.First_Name || "",
      Last_Name: user.Last_Name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber?.toString() || "",
      role: user.role || "Admin",
      active: user.active === 1 || user.active === true || user.active === "1",
      isDeleted: user.isDeleted === 1 || user.isDeleted === true || user.isDeleted === "1",
      Id: user.Id,
      name: user.name,
    });
    setEditingIndex(index);
    setOpen(true);
  };

  const openViewUser = (user: any) => {
    setViewUser(user);
    setIsViewOpen(true);
  };

  return (
    <div>
      <div className="md:flex justify-between items-center m-3">
        <h1 className="text-xl font-bold">User Management</h1>
        <div className="flex gap-2 mt-3 md:mt-0">
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-42"
          />
          <div>
            <Dialog
              open={open}
              onOpenChange={(val) => {
                if (!val) {
                  form.reset();
                  setEditingIndex(null);
                }
                setOpen(val);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => {
                    form.reset({
                      First_Name: "",
                      Last_Name: "",
                      email: "",
                      role: "Admin",
                      password: "",
                      active: true,
                      phoneNumber: "",
                      isDeleted: false
                    });
                    setEditingIndex(null);
                  }}
                >
                  Add User
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-1/3">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">{editingIndex !== null ? 'Edit User' : 'Add User'}</DialogTitle>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="First_Name"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm !text-white">First Name</FormLabel>
                            {fieldState.error && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs text-red-500">This field is required.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <FormControl>
                            <Input placeholder="Enter First Name" {...field}
                              className="w-full h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Last_Name"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm !text-white">Last Name</FormLabel>
                            {fieldState.error && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs text-red-500">This field is required.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <FormControl>
                            <Input placeholder="Enter Last Name" {...field} className="w-full h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm !text-white">Email</FormLabel>
                            {fieldState.error && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs text-red-500">{fieldState.error.message}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <FormControl>
                            <Input type="email" placeholder="Enter Email" {...field} className="w-full h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-sm !text-white">Phone Number</FormLabel>
                            {fieldState.error && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <p className="text-xs text-red-500">This field is required.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <FormControl>
                            <PhoneInput
                              placeholder="Enter phone number"
                              value={field.value || ""}
                              onChange={field.onChange}
                              defaultCountry="AE"
                              international
                              countryCallingCodeEditable={false}
                              className=" bg-black lg:w-[17rem] h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" className="cursor-pointer h-11 rounded-xl">
                        {editingIndex !== null ? 'Update User' : 'Add User'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-8 ${users?.length === 2
          ? "grid-cols-[repeat(auto-fit,minmax(20rem,0fr))]"
          : "justify-center grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]"
          }`}
      >        {users?.map(
        (user, index) =>
          !user.isDeleted && (
            <div
              key={user.Id || index}
              className="bg-card md:max-w-[25rem] text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between pb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  {user?.name}
                </h2>

                <div className="flex items-center gap-3  rounded-lg">
                  <button
                    className="flex items-center hover:bg-gray-700 rounded-lg transition-colors text-left cursor-pointer"
                    onClick={() => {
                      setDeleteIndex(index);
                      setIsConfiramtion(true);
                    }}
                  >
                    <Trash2 width={20} height={20} className="text-red-500" />
                  </button>
                  <Switch
                    className="cursor-pointer"
                    checked={user.active}
                    onCheckedChange={(checked) => {
                      setIsConfirmationForStatus(true)
                      setStatusIndexData({
                        index,
                        checked
                      })
                    }}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                        <EllipsisVertical className="cursor-pointer" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-card text-white rounded-xl shadow-lg border">
                      <div className="flex flex-col gap-1">
                        <div className="px-2 py-1 font-semibold tracking-wide">
                          Actions
                        </div>
                        <Separator />
                        <button
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left cursor-pointer"
                          onClick={() => openViewUser(user)}
                        >
                          <Eye width={16} height={16} className="text-blue-500" />
                          <span className="text-sm">View Detail</span>
                        </button>

                        <button
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left cursor-pointer"
                          onClick={() => editUser(index)}
                        >
                          <Pencil width={16} height={16} className="text-green-500" />
                          <span className="text-sm">Edit User</span>
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-2">Email: {user.email}</p>
              <p className="text-gray-300 text-sm mb-2">Phone: {user.phoneNumber}</p>  </div>
          )
      )}

        {isLoading &&
          [...Array(6)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="bg-card text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3">
                <Skeleton className="h-6 w-40" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-60 mb-2" />
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-8 w-10 ml-auto mt-2" />
            </div>
          ))}
      </div>

      <div ref={observerTarget} className="h-10 w-full" />

      {!isLoading && users?.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No users found
        </div>
      )}

      {isConfiramtion && (
        <ConfirmationAlert
          handleClose={(data) => {
            if (data) {
              deleteUser(deleteIndex);
            }
            setDeleteIndex(null);
            setIsConfiramtion(false);
          }}
          showDialog={true}
          title="Do you want to delete this user?"
        />
      )}
      {isLoadingAdd && (
        <SpinnerComponent />
      )}
      {isConfiramtionForStatus && (
        <ConfirmationAlert
          handleClose={(data) => {
            if (data) {
              deleteUser(deleteIndex);
            }
            setDeleteIndex(null);
            setIsConfiramtion(false);
          }}
          showDialog={true}
          title="Do you want to delete this user?"
        />
      )}

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent
          className="sm:max-w-2/3 flex justify-center  p-0 bg-transparent border-0 shadow-none overflow-auto">
          <div className="bg-[#101113] rounded-2xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,.55)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a3e45] scrollbar-track-transparent">
            <DialogHeader className="p-4">
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <Separator />
            {viewUser && (
              <div className="">
                <div className="m-2 bg-[#0f1012]/40 rounded-2xl border border-white/10 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] overflow-y-auto">
                  <dl className="divide-y divide-white/10 text-sm sm:text-base">

                    {/* Row Template */}
                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Full Name</dt>
                      <dd className="text-white/90">{viewUser.name || "—"}</dd>
                    </div>

                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">First Name</dt>
                      <dd className="text-white/90">{viewUser.First_Name || "—"}</dd>
                    </div>
                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Last Name</dt>
                      <dd className="text-white/90">{viewUser.Last_Name || "—"}</dd>
                    </div>

                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Email</dt>
                      <dd className="text-white/90 break-all">{viewUser.email || "—"}</dd>
                    </div>

                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Phone Number</dt>
                      <dd className="text-white/90">{viewUser.phoneNumber || "—"}</dd>
                    </div>

                    <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                      <dt className="font-semibold text-white/90">Role</dt>
                      <dd className="text-white/90">{viewUser.role}</dd>
                    </div>

                    <div className="py-2 px-2 grid grid-cols-[130px_auto] gap-3 items-center">
                      <dt className="font-semibold text-white/90">Status</dt>
                      <dd>
                        {viewUser.active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 text-green-400 px-3 py-1 text-sm font-semibold">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 text-red-400 px-3 py-1 text-sm font-semibold">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Inactive
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>

        </DialogContent>
      </Dialog>

      {isConfirmationForStatus && (
        <ConfirmationAlert
          handleClose={(data) => {
            if (data) {
              toggleUserStatus(statusIndexData?.index, statusIndexData?.checked)
            }
            setStatusIndexData(null);
            setIsConfirmationForStatus(false);
          }}
          showDialog={true}
          title={`Do you want to ${statusIndexData?.checked ? 'activate' : 'deactivate'} this user?`}
        />
      )}

    </div>
  );
}