"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  DollarSign,
  Eye,
  UserPlus,
  UserMinus,
  Pause,
  Play,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MotsheloGroup {
  id: string;
  name: string;
  description: string;
  monthlyContribution: number;
  currentBalance: number;
  totalMembers: number;
  status: string;
  createdAt: string;
  members?: MotsheloMember[];
}

interface MotsheloMember {
  id: string;
  user: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
  };
  totalPaid: number;
  payoutOrder: number;
}

export default function MotsheloPage() {
  const [groups, setGroups] = useState<MotsheloGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<MotsheloGroup | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    monthlyContribution: 100
  });
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
    loadUsers();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await fetch('/api/motshelo');
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load motshelo groups", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setAvailableUsers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const createGroup = async () => {
    try {
      const response = await fetch('/api/motshelo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGroup)
      });
      
      if (response.ok) {
        toast({ title: "Success", description: "Motshelo group created successfully" });
        setIsCreateModalOpen(false);
        setNewGroup({ name: "", description: "", monthlyContribution: 100 });
        loadGroups();
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.error || "Failed to create group", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create group", variant: "destructive" });
    }
  };

  const viewGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/motshelo/${groupId}`);
      const data = await response.json();
      setSelectedGroup(data);
      setIsViewModalOpen(true);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load group details", variant: "destructive" });
    }
  };

  const addMember = async (userId: string) => {
    if (!selectedGroup) return;
    
    try {
      const response = await fetch(`/api/motshelo/${selectedGroup.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        toast({ title: "Success", description: "Member added successfully" });
        viewGroup(selectedGroup.id);
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.error || "Failed to add member", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add member", variant: "destructive" });
    }
  };

  const removeMember = async (userId: string) => {
    if (!selectedGroup) return;
    
    try {
      const response = await fetch(`/api/motshelo/${selectedGroup.id}/members?userId=${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast({ title: "Success", description: "Member removed successfully" });
        viewGroup(selectedGroup.id);
      } else {
        toast({ title: "Error", description: "Failed to remove member", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove member", variant: "destructive" });
    }
  };

  const updateStatus = async (groupId: string, status: string) => {
    try {
      const response = await fetch(`/api/motshelo/${groupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        toast({ title: "Success", description: `Group ${status} successfully` });
        loadGroups();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'paused': return <Badge className="bg-yellow-500 text-white">Paused</Badge>;
      case 'completed': return <Badge className="bg-gray-500 text-white">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout type="agent">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E9521C] mx-auto"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="agent">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Motshelo / Savings Groups</h1>
            <p className="text-gray-600">Manage community savings groups and track contributions</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-[#E9521C] text-white hover:bg-black">
            <Plus className="h-4 w-4 mr-2" />
            Create New Group
          </Button>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => viewGroup(group.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-[#E9521C]/10 rounded-lg">
                  <Users className="h-5 w-5 text-[#E9521C]" />
                </div>
                {getStatusBadge(group.status)}
              </div>
              
              <h3 className="font-semibold text-black text-lg mb-2">{group.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{group.description || "No description"}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Contribution:</span>
                  <span className="font-medium text-black">BWP {group.monthlyContribution}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Balance:</span>
                  <span className="font-medium text-black">BWP {group.currentBalance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Members:</span>
                  <span className="font-medium text-black">{group.totalMembers}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-200"
                  onClick={(e) => { e.stopPropagation(); viewGroup(group.id); }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {group.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                    onClick={(e) => { e.stopPropagation(); updateStatus(group.id, 'paused'); }}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                {group.status === 'paused' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                    onClick={(e) => { e.stopPropagation(); updateStatus(group.id, 'active'); }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {groups.length === 0 && (
          <Card className="border-gray-200">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No motshelo groups yet</p>
              <Button onClick={() => setIsCreateModalOpen(true)} variant="link" className="text-[#E9521C] mt-2">
                Create your first group
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Group Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Motshelo Group</DialogTitle>
            <DialogDescription>
              Start a community savings group for your territory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Group Name</Label>
              <Input
                placeholder="e.g., Women's Empowerment Group"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the purpose of this motshelo..."
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Monthly Contribution (BWP)</Label>
              <Input
                type="number"
                placeholder="100"
                value={newGroup.monthlyContribution}
                onChange={(e) => setNewGroup({ ...newGroup, monthlyContribution: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={createGroup} className="bg-[#E9521C] text-white hover:bg-black">
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Group Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedGroup && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedGroup.name}</DialogTitle>
                <DialogDescription>{selectedGroup.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Monthly Contribution</p>
                    <p className="text-xl font-bold text-black">BWP {selectedGroup.monthlyContribution}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className="text-xl font-bold text-black">BWP {selectedGroup.currentBalance}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Members</p>
                    <p className="text-xl font-bold text-black">{selectedGroup.totalMembers}</p>
                  </div>
                </div>

                {/* Add Member */}
                <div>
                  <Label>Add Member</Label>
                  <div className="flex gap-2 mt-1">
                    <Select onValueChange={addMember}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.fullName} - {user.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Members List */}
                <div>
                  <h4 className="font-semibold text-black mb-2">Members ({selectedGroup.members?.length || 0})</h4>
                  <div className="space-y-2">
                    {selectedGroup.members?.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-black">{member.user.fullName}</p>
                          <p className="text-xs text-gray-500">{member.user.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Paid: BWP {member.totalPaid}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 h-6 px-2"
                            onClick={() => removeMember(member.user.id)}
                          >
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}