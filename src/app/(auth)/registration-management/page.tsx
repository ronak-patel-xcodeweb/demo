'use client'

import ConfirmationAlert from "@/components/confiramtion-alert/ConfirmationAlert";
import { DataTableContext } from "@/components/context/DataTableContext";
import SpinnerComponent from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import bcrypt from "bcryptjs";
import { EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { calculateActiveTickIndex } from "recharts/types/util/ChartUtils";
import { toast } from "sonner";


export default function RegistrationManagement() {

  const [open, setOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<any | null>(null);
  const { dataTables, setDataTables } = useContext(DataTableContext);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const [totalData, setTotalData] = useState(0);
  const isFetchingRef = useRef(false);
  const [isConfiramtion, setIsConfiramtion] = useState(false);
  const [deletIndex, setDeletIndex] = useState<number | null>(null);
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectRole, setSelectRole] = useState("Agent");
  const [searchText, setSearchText] = useState("");



  const limit = 10;

  const fetchUser = async (currentOffset: number, append: boolean) => {

    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    const res = await fetch(`/api/getUser?userTableId=${dataTables.find((t: any) => t?.table_name === "User")?.id}&condition=(role,eq,${selectRole})~and(name,like,${searchText})&limit=${limit}&offset=${currentOffset}`);
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
  }

  useEffect(() => {
    setIsLoading(true);
  }, [])

  useEffect(() => {
    if (dataTables.find((t: any) => t?.table_name === "User")?.id) {
      setOffset(0);
      setHasMore(true);
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
  const toggleUserAcceptence = async (Id: number, set: boolean, toastColor: string) => {
    const userTableId = dataTables.find((t: any) => t?.table_name === "User");
    const updated = [...users];

    const findUser = updated.find((data) => data.Id == Id)

    const password = await bcrypt.hashSync("xcode@123")
    const updatedData = {
      id: Id,
      admin_confirm: 1,
      agent_status: set ? 'Approved' : 'Rejected',
      password: set ? password : ''
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedData));
    formData.append("userTableId", userTableId?.id);
    const res = await fetch('/api/agentConfirmation', {
      method: 'PATCH',
      body: formData
    })
    if (res?.ok) {
      toast.success(`${findUser.name} has been ${set ? 'approved' : 'rejected'} successfully.`, {
        style: {
          background: toastColor,
          color: set ? 'black' : 'white'
        },
      })
      setOffset(0);
      setHasMore(true);
      fetchUser(0, false);
      setIsViewOpen(false)
    }
  };

  const openDocument = async (id: any) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/getData?tableId=${dataTables.find((t: any) => t?.table_name === "Agent")?.id}&condition=(Id,eq,${id})`);
      const agentResponse = await res.json();
      const attachments = agentResponse[0].identity_proof;
      if (attachments && attachments.length > 0) {
        setCurrentDoc(attachments[0]);
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      setCurrentDoc('');
    }
  };


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
      }
    }
  };
  const openViewUser = (user: any) => {
    setViewUser(user);
    setIsViewOpen(true);
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchUser(0, false);
  }, [selectRole]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      fetchUser(0, false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText]);

  return (
    <div>
      <div className="md:flex justify-between items-center m-3">
        <h1 className="text-xl font-bold">Registration Management</h1>
        <div className="flex gap-2 mt-3 md:mt-0">
          <Input
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-42"
          />
          <Select onValueChange={(value) => {
            setSelectRole(value)
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue defaultValue={selectRole} placeholder={selectRole} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup >
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="GovernmentBody">Government Body</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

        </div>
      </div>
      <div>
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
                <p className="text-gray-300 text-sm mb-2">Status: {user?.agent_status}</p>
                <p className="text-gray-300 text-sm mb-2">
                  Identity Document:
                  <Dialog
                    open={open}
                    onOpenChange={(isOpen) => {
                      setOpen(isOpen);
                      if (isOpen && user?.Agent?.identity_proof) {
                        openDocument(user.Agent.Id);
                      } else if (!isOpen) {
                        setCurrentDoc(null);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="cursor-pointer ml-2"
                      >
                        View
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[800px]">
                      <DialogHeader>
                        <DialogTitle>Identity Document</DialogTitle>
                      </DialogHeader>
                      {currentDoc ? (
                        <div className="w-full">
                          {currentDoc?.mimetype?.endsWith('image/') ? (
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
                </p>
                <div className="flex justify-end items-center w-full gap-2">
                  {(user?.admin_confirm == null || user?.admin_confirm == 0) &&
                    (user?.agent_status == "Pending" || !user?.agent_status) && (
                      <div className="flex gap-2">
                        <Button
                          className="w-36 cursor-pointer"
                          onClick={() => toggleUserAcceptence(user.Id, true, '#efefef')}
                        >
                          Approve
                        </Button>
                        <Button
                          className="w-36 cursor-pointer bg-[#333333] text-white hover:bg-[#333333]"
                          onClick={() => toggleUserAcceptence(user.Id, false, 'bg-card')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <EllipsisVertical className="cursor-pointer" />
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
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

              </div>

            )
          ))}
        </div>

        <div ref={observerTarget} className="h-10 w-full" />

        {isLoading && <SpinnerComponent />}

        {!hasMore && users?.length > 0 && (
          <div className="text-center text-gray-400 py-8">
          </div>
        )}
      </div>

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
              {viewUser.Agent.pseudo_name && (
                <div> <p><strong>Pseudo Name:</strong> {viewUser.Agent.pseudo_name}</p></div>
              )}
              <div><p><strong>Last Name:</strong> {viewUser.Last_Name}</p></div>
              <div>   <p><strong>Email:</strong> {viewUser.email}</p></div>
              <div><p><strong>Phone Number:</strong> {viewUser.phoneNumber}</p></div>
              <div> <p><strong>Role:</strong> {viewUser.role}</p></div>
              <div> <p><strong>Location:</strong> {viewUser.Agent.location}</p></div>
              <div> <p><strong>Company Name:</strong> {viewUser.Agent.company_name}</p></div>
              <div> <p><strong>Country:</strong> {viewUser.Agent.agent_country}</p></div>
              <div> <p><strong>VAT No:</strong> {viewUser.Agent.company_VAT}</p></div>
              <div>   <p><strong>Status:</strong>  {viewUser.active ? (
                <span className="ml-1 bg-green-800 text-center text-white p-1 rounded-sm">Active</span>
              ) :
                <span className="ml-1 bg-red-800 text-center text-white p-1 rounded-sm">Deactivate</span>
              }</p></div>


              <p className="text-gray-300 text-sm mb-2">
                Identity Document:
                <Dialog
                  open={open}
                  onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (isOpen && viewUser?.Agent?.identity_proof) {
                      openDocument(viewUser.Agent.Id);
                    } else if (!isOpen) {
                      setCurrentDoc(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="cursor-pointer ml-2"
                    >
                      View
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle>Identity Document</DialogTitle>
                    </DialogHeader>
                    {currentDoc ? (
                      <div className="w-full">
                        {currentDoc?.mimetype?.endsWith('image/') ? (
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
              </p>
              <div className="flex justify-center gap-2 mt-3">
                {(viewUser?.admin_confirm == null || viewUser?.admin_confirm == 0) &&
                  (viewUser?.agent_status == "Pending" || !viewUser?.agent_status) && (
                    <div className="flex gap-2">
                      <Button
                        className="w-36 cursor-pointer"
                        onClick={() => toggleUserAcceptence(viewUser.Id, true, '#efefef')}
                      >
                        Approve
                      </Button>
                      <Button
                        className="w-36 cursor-pointer bg-[#333333] text-white hover:bg-[#333333]"
                        onClick={() => toggleUserAcceptence(viewUser.Id, false, 'bg-card')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}