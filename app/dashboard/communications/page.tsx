"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, MessageSquare, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAgentSession } from "@/lib/storage";
import { api } from "@/lib/api";
import type { Communication, User } from "@/lib/api";
import { CommunicationsList } from "./components/CommunicationsList";
import { CommunicationModal } from "./components/CommunicationModal";
import {
  CommunicationFilters,
  type CommTypeFilter,
  type CommStatusFilter,
} from "./components/CommunicationFilters";

function CommunicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [communications, setCommunications] = useState<Communication[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [agentId, setAgentId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CommTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<CommStatusFilter>("all");

  const { toast } = useToast();

  const defaultUserId = searchParams.get("userId") ?? "";

  useEffect(() => {
    const session = getAgentSession();
    const id = session?.agentId ?? "";
    setAgentId(id);
    loadData(id);

    if (defaultUserId) setModalOpen(true);
  }, []);

  const loadData = async (id: string) => {
    setIsLoading(true);
    try {
      const [commsData, usersData] = await Promise.all([
        api.getCommunications(id ? { agentId: id } : undefined),
        api.getUsers(id || undefined),
      ]);
      setCommunications(commsData);
      setUsers(usersData);
    } catch {
      toast({ title: "Error", description: "Failed to load data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (toUserId: string, message: string, type: string) => {
    setIsSending(true);
    try {
      const newComm = await api.sendCommunication({
        toUserId,
        message,
        type,
        fromAgentId: agentId || undefined,
      });
      setCommunications((prev) => [newComm, ...prev]);
      setModalOpen(false);
      toast({ title: "Sent!", description: "Your message was sent successfully." });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const filtered = useMemo(() => {
    return communications.filter((c) => {
      const user = users.find((u) => u.id === c.toUserId);
      const userName = user?.fullName ?? "";
      const matchSearch =
        !search ||
        userName.toLowerCase().includes(search.toLowerCase()) ||
        c.message.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || c.type === typeFilter;
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [communications, users, search, typeFilter, statusFilter]);

  return (
    <DashboardLayout type="agent">
      <div className="space-y-6">
        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E9521C] font-medium text-sm mb-6 group transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#E9521C]/10 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-black">Communications</h1>
            <p className="text-gray-500 mt-1">Send and track messages to your customers</p>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-[#E9521C] hover:bg-[#d4471a] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </motion.div>

        {/* Filters */}
        <CommunicationFilters
          search={search}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          isLoading={isLoading}
          onSearchChange={setSearch}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onRefresh={() => loadData(agentId)}
        />

        {/* Communications list */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#E9521C]" />
              Message History
            </CardTitle>
            <CardDescription>
              {filtered.length} message{filtered.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">Loading…</div>
            ) : (
              <CommunicationsList communications={filtered} users={users} />
            )}
          </CardContent>
        </Card>

        {/* Compose modal */}
        <CommunicationModal
          open={modalOpen}
          users={users}
          defaultUserId={defaultUserId}
          isSending={isSending}
          onClose={() => setModalOpen(false)}
          onSend={handleSend}
        />
      </div>
    </DashboardLayout>
  );
}

export default function CommunicationsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout type="agent">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E9521C] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading communications...</p>
          </div>
        </div>
      </DashboardLayout>
    }>
      <CommunicationsContent />
    </Suspense>
  );
}