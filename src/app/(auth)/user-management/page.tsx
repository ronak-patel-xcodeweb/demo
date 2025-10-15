'use client'

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTableContext } from "@/components/context/DataTableContext";
import SpinnerComponent from "@/components/spinner/spinner";
import bcrypt from "bcryptjs";
import ConfirmationAlert from "@/components/confiramtion-alert/ConfirmationAlert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type userForm = {
  Id: any;
  Last_Name: string;
  name: string;
  First_Name: string;
  email: string;
  role: string;
  password: string;
  active: boolean;
  phoneNumber: string;
  isDeleted: boolean;
};

export default function UserManagement() {

  const { dataTables, setDataTables } = useContext(DataTableContext);
  const limit = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const isFetchingRef = useRef(false);
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [totalData, setTotalData] = useState(0);
  const [isConfiramtion, setIsConfiramtion] = useState(false);
  const [deletIndex, setDeletIndex] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);



  const form = useForm<userForm>({
    defaultValues: {
      role: "Admin",
      active: true,
      isDeleted: false,
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      fetchUser(0, false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText]);


  const toggleUserStatus = async (index: number, set: boolean) => {
    const userTableId = dataTables.find((t: any) => t?.table_name === "User");
    const updated = [...users];
    updated[index].active = set;

    const payload = {
      Id: users[index].Id,
      active: set ? 1 : 0
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    formData.append("userTableId", userTableId?.id);
    const res = await fetch('/api/userUpdate', {
      method: 'PATCH',
      body: formData
    })
    if (res?.ok) {
      toast.success(`User status has been ${set ? 'Activate' : 'Deactivate'}`, {
        style: {
          background: set ? 'green' : 'red',
        },
      })
      setUsers(updated)
    }

  };
  const fetchUser = async (currentOffset: number, append: boolean) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
    const res = await fetch(`/api/getUser?condition=(role,eq,Admin)~and(name,like,${searchText})&userTableId=${userTableId}&limit=${limit}&offset=${currentOffset}`);
    const userData = await res.json();
    setTotalData(userData?.pageInfo?.totalRows)

    if (userData?.list?.length < limit) {
      setHasMore(false);
    }

    if (append) {
      setUsers(prev => [...prev, ...userData?.list]);
    }
    else {
      setUsers(userData?.list);
    }

    setIsLoading(false);
    isFetchingRef.current = false;
  };

  const onSubmit = async (data: userForm) => {
    const userTableId = dataTables.find((t: any) => t?.table_name === "User");

    if (editingIndex !== null) {
      const updated: any = [...users];
      const formData = new FormData();
      const payload = {
        Id: data.Id,
        First_Name: data.First_Name,
        Last_Name: data.Last_Name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        name: `${data.First_Name} ${data.Last_Name}`
      }
      formData.append("data", JSON.stringify(payload));
      formData.append("userTableId", userTableId?.id);

      const res = await fetch('/api/userUpdate', {
        method: 'PATCH',
        body: formData
      })
      if (res?.ok) {
        toast.success("User has been successfully updated.", {
          style: {
            background: 'green',
          },
        })
        setOffset(0);
        setHasMore(true);
        fetchUser(0, false);
        setEditingIndex(null);
      }

    } else {
      const formData = new FormData();
      const password = await bcrypt.hashSync(`${data.First_Name}@${new Date().getFullYear()}`);

      console.log(`${data.First_Name}@${new Date().getFullYear()}`)
      const payload = {
        First_Name: data.First_Name,
        Last_Name: data.Last_Name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: "Admin",
        isDeleted: 0,
        active: 1,
        password: password,
        name: `${data.First_Name} ${data.Last_Name}`
      }
      formData.append("data", JSON.stringify(payload));
      formData.append("userTableId", userTableId?.id);

      const res = await fetch('/api/AddUser', {
        method: 'POST',
        body: formData
      })
      if (res?.ok) {
        toast.success("User has been successfully added.", {
          style: {
            background: 'green',
          },
        })
        setOffset(0);
        setHasMore(true);
        fetchUser(0, false);
        setEditingIndex(null);
        form.reset();
        setOpen(false);
      }
    }



  };

  const deleteUser = async (index: number | null) => {
    if (index) {

      const userTableId = dataTables.find((t: any) => t?.table_name === "User");

      const payload = {
        Id: users[index].Id,
        isDeleted: 1
      }
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      formData.append("userTableId", userTableId?.id);
      const res = await fetch('/api/userUpdate', {
        method: 'PATCH',
        body: formData
      })
      if (res?.ok) {
        toast.success("User has been successfully deleted.", {
          style: {
            background: "red",
          },
        })
        setOffset(0);
        setHasMore(true);
        fetchUser(0, false);
        setEditingIndex(null);
      }
    }
  };

  const editUser = (index: number) => {
    const user = users[index];
    form.reset(user);
    setEditingIndex(index);
    setOpen(true);
  };

  useEffect(() => {
    const userTableId = dataTables?.find((t: any) => t?.table_name === "User")?.id;
    if (userTableId) {
      setOffset(0);
      setHasMore(true);
      setUsers([]);
      isFetchingRef.current = false;
      fetchUser(0, false);
    }
  }, [dataTables])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          !isFetchingRef.current &&
          users?.length < totalData
        ) {
          const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
          if (userTableId) {
            const newOffset = offset + limit;
            setOffset(newOffset);
            fetchUser(newOffset, true);
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, offset, dataTables]);
  const openViewUser = (user: any) => {
    setViewUser(user);
    setIsViewOpen(true);
  };

  return (
    <div >
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

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingIndex !== null ? 'Edit User' : 'Add User'}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="First_Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input required placeholder="Enter First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="Last_Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input required placeholder="Enter Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" required placeholder="Enter Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input required type="number" placeholder="Phone Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" className="cursor-pointer">
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


      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {users?.map((user, index) => (
          !user.isDeleted && (
            <div
              key={index}
              className="bg-card text-card-foreground flex flex-col rounded-xl border p-4 shadow-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between pb-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  {user?.name}
                </h2>

                <div className="flex  justify-start gap-2 rounded-lg ">
                  <button
                    className="flex items-center hover:bg-gray-700 rounded-lg transition-colors text-left cursor-pointer"
                    onClick={() => {
                      setDeletIndex(index);
                      setIsConfiramtion(true);
                    }}
                  >
                    <Trash2 width={20} height={20} className="text-red-500" />
                  </button>
                  <Switch
                    className="cursor-pointer alert-dialog "
                    checked={user.active}
                    onCheckedChange={(checked) => toggleUserStatus(index, checked)}
                  />
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-2">Email: {user.email}</p>
              <p className="text-gray-300 text-sm mb-2">Phone: {user.phoneNumber}</p>


              <div className="flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <EllipsisVertical className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 bg-card text-white rounded-xl shadow-lg border">
                    <div className="flex flex-col gap-1">

                      <div className="px-2 py-1 font-semibold  tracking-wide">
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

              </div>       </div>
          )
        ))}
      </div>
      <div ref={observerTarget} className="h-10 w-full" />

      {isLoading && <SpinnerComponent />}

      {!hasMore && users?.length > 0 && (
        <div className="text-center text-gray-400 py-8">
        </div>
      )}
      {isConfiramtion && (
        <ConfirmationAlert handleClose={(data) => {
          if (data) {
            deleteUser(deletIndex);
          }
          setDeletIndex(null);
          setIsConfiramtion(false);
        }
        } showDialog={true} title="Do you want to delete this user?" />
      )}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          <Separator />
          {viewUser && (
            <div className="space-y-4 text-sm text-gray-200">
              <div><p><strong>Full Name:</strong> {viewUser.name}</p></div>
              <div> <p><strong>First Name:</strong> {viewUser.First_Name}</p></div>
              <div><p><strong>Last Name:</strong> {viewUser.Last_Name}</p></div>
              <div>   <p><strong>Email:</strong> {viewUser.email}</p></div>
              <div><p><strong>Phone Number:</strong> {viewUser.phoneNumber}</p></div>
              <div> <p><strong>Role:</strong> {viewUser.role}</p></div>
              <div>   <p><strong>Status:</strong>  {viewUser.active ? (
                <span className="ml-1 bg-green-800 text-center text-white p-1 rounded-sm">Active</span>
              ) :
                <span className="ml-1 bg-red-800 text-center text-white p-1 rounded-sm">Deactivate</span>
              }</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div >
  );
}