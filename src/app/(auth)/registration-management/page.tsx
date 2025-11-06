'use client'

import IdentityDialog from "@/components/auth/identityView/identityView";
import ConfirmationAlert from "@/components/confiramtion-alert/ConfirmationAlert";
import { DataTableContext } from "@/components/context/DataTableContext";
import SpinnerComponent from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import bcrypt from "bcryptjs";
import { EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type agentForm = {
  pseudo_name: string;
  password: any;
};

function PremiumUserDetails({
  user,
  onApprove,
  onReject,
  onViewIdentity,
  identityUrl,
}: {
  user: any;
  onApprove: () => void;
  onReject: () => void;
  onViewIdentity: () => void;
  identityUrl?: any | null;
}) {
  if (!user) return null;

  const fullName = user.name ?? `${user.First_Name ?? ""} ${user.Last_Name ?? ""}`.trim();
  const firstName = user.First_Name ?? "";
  const lastName = user.Last_Name ?? "";
  const email = user.email ?? "";
  const phone = user.phoneNumber ?? "";
  const role = user.role ?? "—";
  const location = user.Agent?.location ?? "—";
  const companyName = user.Agent?.company_name ?? "—";
  const country = user.Agent?.agent_country ?? "—";
  const vat = user.Agent?.company_VAT ?? "—";
  const statusActive = !!user.active;
  const officer_designation = user?.GovernmentBody?.officer_designation;
  const officer_name = user?.GovernmentBody?.officer_name;
  const official_address = user?.GovernmentBody?.official_address;
  const department_name = user?.GovernmentBody?.department_name;


  return (
    <div className="bg-[#101113] rounded-2xl border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,.55)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#3a3e45] scrollbar-track-transparent">

      <DialogHeader className="p-4">
        <DialogTitle>Registration Details</DialogTitle>
      </DialogHeader>

      <Separator />

      <div className="flex flex-col max-h-[85vh] min-h-[400px]">
        {/* Content Section */}
        <div className="flex-grow px-4 lg:px-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 text-white p-4">

          {/* Left Side - Image / Document */}
          <div className="flex bg-[#0f1012]/80 border border-white/10 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] overflow-hidden">
            <div className="relative flex items-center justify-center bg-black w-full">
              {identityUrl ? (
                <div className="w-full">
                  {identityUrl?.mimetype?.startsWith("image/") ? (
                    <img
                      src={identityUrl?.signedUrl}
                      alt="Identity Document"
                      className="w-full h-auto max-h-[60vh] object-contain"
                    />
                  ) : (
                    <iframe
                      src={identityUrl?.signedUrl}
                      className="w-full h-[60vh] border-0"
                      title="Identity Document"
                    />
                  )}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center text-gray-500 py-20">
                  No document available
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_240px_at_20%_0%,#ffb40014,transparent)]" />
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="bg-[#0f1012]/40 rounded-2xl border border-white/10 p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] overflow-y-auto">
            <dl className="divide-y divide-white/10 text-sm sm:text-base">

              {/* Row Template */}
              <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                <dt className="font-semibold text-white/90">Full Name</dt>
                <dd className="text-white/90">{fullName || "—"}</dd>
              </div>

              {role == "Agent" && (
                <>
                  < div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">First Name</dt>
                    <dd className="text-white/90">{firstName || "—"}</dd>
                  </div>

                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Last Name</dt>
                    <dd className="text-white/90">{lastName || "—"}</dd>
                  </div></>
              )}
              {user.Agent?.pseudo_name && (
                <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                  <dt className="font-semibold text-white/90">Pseudo Name</dt>
                  <dd className="text-white/90">{user.Agent.pseudo_name}</dd>
                </div>
              )}


              {role == "GovernmentBody" && (
                <>
                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Department Name</dt>
                    <dd className="text-white/90">{department_name}</dd>
                  </div>
                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Location</dt>
                    <dd className="text-white/90">{official_address}</dd>
                  </div>
                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Officer Name</dt>
                    <dd className="text-white/90">{officer_name}</dd>
                  </div>

                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Officer Designation</dt>
                    <dd className="text-white/90">{officer_designation}</dd>
                  </div>
                </>
              )}
              <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                <dt className="font-semibold text-white/90">Email</dt>
                <dd className="text-white/90 break-all">{email || "—"}</dd>
              </div>

              <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                <dt className="font-semibold text-white/90">Phone Number</dt>
                <dd className="text-white/90">{phone || "—"}</dd>
              </div>

              <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                <dt className="font-semibold text-white/90">Role</dt>
                <dd className="text-white/90">{role}</dd>
              </div>

              {role == "Agent" && (
                <>
                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Location</dt>
                    <dd className="text-white/90">{location}</dd>
                  </div>
                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Country</dt>
                    <dd className="text-white/90">{country}</dd>
                  </div>
                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">Company Name</dt>
                    <dd className="text-white/90">{companyName}</dd>
                  </div>

                  <div className="py-2 px-2 grid grid-cols-[130px_1fr] gap-3">
                    <dt className="font-semibold text-white/90">VAT No</dt>
                    <dd className="text-white/90">{vat}</dd>
                  </div>
                </>
              )}

              <div className="py-2 px-2 grid grid-cols-[130px_auto] gap-3 items-center">
                <dt className="font-semibold text-white/90">Status</dt>
                <dd>
                  {statusActive ? (
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

              {/* Buttons Section */}
              {(user?.admin_confirm == null || user?.admin_confirm == 0) &&
                (user?.agent_status === "Pending" || !user?.agent_status) && (
                  <div className="py-2 px-2 grid grid-cols-[130px_auto]  items-center">
                    <dt className="font-semibold text-white/90"></dt>
                    <dd>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          type="button"
                          className="cursor-pointer h-9 rounded-xl w-24"
                          onClick={onApprove}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          className="cursor-pointer h-9 rounded-xl bg-[#2b2e34] text-white hover:bg-[#2b2e34] w-24"
                          onClick={onReject}
                        >
                          Reject
                        </Button>
                      </div>
                    </dd>
                  </div>
                )}
            </dl>
          </div>
        </div>
      </div >
    </div >

  );
}

export default function RegistrationManagement() {
  const [open, setOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<any | null>(null);
  const { dataTables } = useContext(DataTableContext);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const [totalData, setTotalData] = useState(0);
  const isFetchingRef = useRef(false);
  const initialFetchDone = useRef(false);
  const [isConfiramtion, setIsConfiramtion] = useState(false);
  const [deletIndex, setDeletIndex] = useState<number | null>(null);
  const [viewUser, setViewUser] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectRole, setSelectRole] = useState("Agent");
  const [selectStatus, setSelectStatus] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [agentId, setAgentID] = useState<any>();
  const [isConfirmationForStatus, setIsConfirmationForStatus] = useState(false);
  const [statusIndexData, setStatusIndexData] = useState<any>();
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);


  const form = useForm<agentForm>({
    defaultValues: {
      pseudo_name: "",
      password: ""
    },
  });

  const limit = 10;

  const fetchUser = async (currentOffset: number, append: boolean) => {
    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
    if (!userTableId || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/getUser?userTableId=${userTableId}&condition=(role,eq,${selectRole})~and(agent_status,like,${selectStatus})~and(name,like,${searchText})&limit=${limit}&offset=${currentOffset}`
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
    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
    if (userTableId && !initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchUser(0, false);
    }
  }, [dataTables]);

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
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;
    observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, offset, users.length, totalData]);

  useEffect(() => {
    if (!initialFetchDone.current) return;

    setUsers([]);
    setOffset(0);
    setHasMore(true);
    setTotalData(0);
    fetchUser(0, false);
  }, [selectRole, selectStatus]);

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

  const toggleUserAcceptence = async (Id: number, set: boolean, toastColor: string, data?: agentForm) => {
    setOpenApproveDialog(false);
    setIsLoadingAdd(true);
    const userTableId = dataTables.find((t: any) => t?.table_name === "User");
    const updated = [...users];
    const findUser = updated.find((data) => data.Id == Id);
    console.log(findUser)
    let password;
    if (findUser.role == "Agent") {
      password = `${findUser.First_Name}@${new Date().getFullYear()}`
    }
    if (findUser.role == "GovernmentBody") {
      password = `${findUser.name}@${new Date().getFullYear()}`
    }
    const updatedData = {
      id: Id,
      admin_confirm: 1,
      agent_status: set ? 'Approved' : 'Rejected',
      password: password,
      role: findUser.role
    };

    const formData = new FormData();
    if (data) {
      const agentTableId = dataTables.find((t: any) => t?.table_name === "Agent");
      const payload = {
        id: findUser.Agent.Id,
        pseudo_name: data.pseudo_name,
      };
      formData.append("agentData", JSON.stringify(payload));
      formData.append("agentTableId", agentTableId?.id);
    }

    formData.append("data", JSON.stringify(updatedData));
    formData.append("userTableId", userTableId?.id);

    try {
      const res = await fetch('/api/agentConfirmation', {
        method: 'PATCH',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || `Request failed with status ${res.status}`);
      }

      toast.success(`${findUser.name} has been ${set ? 'approved' : 'rejected'} successfully.`, {
        style: {
          background: toastColor,
          color: set ? 'black' : 'white'
        },
      });

      setUsers([]);
      setOffset(0);
      setHasMore(true);
      setTotalData(0);
      fetchUser(0, false);
      setIsViewOpen(false);
      setAgentID(null);
      form.reset();
      setIsLoadingAdd(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while updating user!", {
        style: {
          background: "#ff4d4f",
          color: "white",
        },
      });
    }
  };

  const openDocument = async (id: any, role: any) => {
    try {
      let res: any;
      if (role === "Agent") {
        res = await fetch(
          `/api/getData?tableId=${dataTables.find((t: any) => t?.table_name === "Agent")?.id}&condition=(Id,eq,${id})`
        );
        const agentResponse = await res.json();
        const attachments = agentResponse[0].identity_proof;
        if (attachments && attachments.length > 0) {
          setCurrentDoc(attachments[0]);
          setOpen(true);
        }
      }
      if (role === "GovernmentBody") {
        res = await fetch(
          `/api/getData?tableId=${dataTables.find((t: any) => t?.table_name === "GovernmentBody")?.id}&condition=(Id,eq,${id})`
        );
        const agentResponse = await res.json();
        const attachments = agentResponse[0].government_proof;
        if (attachments && attachments.length > 0) {
          setCurrentDoc(attachments[0]);
          setOpen(true);
        }
      }
    } catch (error) {
      setOpen(false);
      setCurrentDoc('');
    }
  };

  const fetchDocument = async (id: any, role: any) => {
    try {
      let res: any;
      if (role === "Agent") {
        res = await fetch(
          `/api/getData?tableId=${dataTables.find((t: any) => t?.table_name === "Agent")?.id}&condition=(Id,eq,${id})`
        );
        const agentResponse = await res.json();
        const attachments = agentResponse[0].identity_proof;
        if (attachments && attachments.length > 0) {
          setCurrentDoc(attachments[0]);
        }
      }
      if (role === "GovernmentBody") {
        res = await fetch(
          `/api/getData?tableId=${dataTables.find((t: any) => t?.table_name === "GovernmentBody")?.id}&condition=(Id,eq,${id})`
        );
        const agentResponse = await res.json();
        const attachments = agentResponse[0].government_proof;
        if (attachments && attachments.length > 0) {
          setCurrentDoc(attachments[0]);
        }
      }

    } catch (error) {
      setOpen(false);
      setCurrentDoc('');
    }
  };

  const toggleUserStatus = async (index: number, set: boolean) => {
    setIsLoadingAdd(true)
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
      setIsLoadingAdd(false)
      setUsers(updated);
    }
  };

  const deleteUser = async (index: number | null) => {
    setIsLoadingAdd(true)
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
    }
    setIsLoadingAdd(false)
  };

  const openViewUser = (user: any) => {
    setViewUser(user);
    setIsViewOpen(true);
  };

  const onSubmit = async (data: agentForm) => {
    toggleUserAcceptence(agentId, true, "#efefef", data);
  };

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
          <Select value={selectRole} onValueChange={setSelectRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={selectRole} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="GovernmentBody">Government Body</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={selectStatus} onValueChange={setSelectStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={selectStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div
          className={`grid gap-8 ${users?.length === 2
            ? "grid-cols-[repeat(auto-fit,minmax(20rem,0fr))]"
            : "justify-center grid-cols-[repeat(auto-fit,minmax(20rem,1fr))]"
            }`}
        >
          {users?.map((user, index) => (
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
                      className="flex items-center justify-center hover:bg-gray-700  rounded-lg transition-colors cursor-pointer"
                      onClick={() => {
                        setDeletIndex(index);
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
                        <button className=" hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center">
                          <EllipsisVertical className="cursor-pointer" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2 bg-card text-white rounded-xl shadow-lg border">
                        <div className="flex flex-col gap-1">
                          {/* <div className="px-2 py-1 font-semibold tracking-wide">Actions</div>
                          <Separator /> */}
                          <button
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left cursor-pointer"
                            onClick={() => {
                              openViewUser(user)
                              fetchDocument(user.role == "Agent" ? user?.Agent?.Id : user?.GovernmentBody?.Id, user.role == "Agent" ? "Agent" : "GovernmentBody")
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
                <p className="text-gray-300 text-sm mb-2">Email: {user.email}</p>
                <p className="text-gray-300 text-sm">Status: {user?.agent_status}</p>
                <p className="text-gray-300 text-sm mb-2">
                  Identity Document:
                  <Button
                    className="bg-card border text-white hover:bg-card ml-2 cursor-pointer"
                    onClick={() => openDocument(user.role == "Agent" ? user?.Agent?.Id : user?.GovernmentBody?.Id, user.role == "Agent" ? "Agent" : "GovernmentBody")}
                  >
                    View
                  </Button>
                </p>

                <div className="flex justify-center items-center w-full gap-2 mt-2">
                  {(user?.admin_confirm == null || user?.admin_confirm == 0) &&
                    (user?.agent_status == "Pending" || !user?.agent_status) && (
                      <div className="flex gap-2">
                        <Button
                          className="w-36 cursor-pointer"
                          onClick={() => {
                            if (user.role == "Agent") {
                              setOpenApproveDialog(true);
                              setAgentID(user.Id);
                            }
                            else if (user.role == "GovernmentBody") {
                              toggleUserAcceptence(user.Id, true, "#efefef");
                            }

                          }}
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
                </div>
              </div>
            )
          ))}

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
                    <Skeleton className="h-6 w-8 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-60 mb-2" />
                <Skeleton className="h-4 w-48 mb-2" />
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
      </div>

      <IdentityDialog
        open={open}
        doc={currentDoc}
        onClose={() => { setOpen(false); setCurrentDoc(null) }}
        user={viewUser}
      />

      {isConfiramtion && (
        <ConfirmationAlert
          handleClose={(data) => {
            if (data) {
              deleteUser(deletIndex);
            }
            setDeletIndex(null);
            setIsConfiramtion(false);
          }}
          showDialog={true}
          title="Do you want to delete this user?"
        />
      )}

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


      <Dialog open={isViewOpen} onOpenChange={(data) => {
        setIsViewOpen(data)
        setCurrentDoc(null)
      }}>
        <DialogContent className="sm:max-w-2/3 flex justify-center  p-0 bg-transparent border-0 shadow-none overflow-auto">
          {isViewOpen && (
            <PremiumUserDetails
              user={viewUser}
              identityUrl={currentDoc}
              onViewIdentity={() => {
                if (viewUser?.Agent?.Id) {
                  openDocument(viewUser.role == "Agent" ? viewUser?.Agent?.Id : viewUser?.GovernmentBody?.Id, viewUser.role == "Agent" ? "Agent" : "GovernmentBody");
                }
              }}
              onApprove={() => {
                if (viewUser.role == "Agent") {
                  setOpenApproveDialog(true);
                  setAgentID(viewUser?.Id);
                }
                else if (viewUser.role == "GovernmentBody") {
                  toggleUserAcceptence(viewUser.Id, true, "#efefef");
                }

              }}
              onReject={() => toggleUserAcceptence(viewUser?.Id, false, "bg-card")}
            />
          )}
        </DialogContent>
      </Dialog>


      <Dialog
        open={openApproveDialog}
        onOpenChange={(data) => {
          setOpenApproveDialog(data);
          form.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Agent Detail</DialogTitle>
          </DialogHeader>
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pseudo_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pseudo Name</FormLabel>
                    <FormControl>
                      <Input required placeholder="Enter Pseudo Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="cursor-pointer">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {isLoadingAdd && (
        <SpinnerComponent />
      )}
    </div>
  );
}