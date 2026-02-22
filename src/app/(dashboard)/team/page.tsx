"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Plus, Shield, UserPlus, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getInitials } from "@/lib/utils"
import { ROLES } from "@/lib/constants"

interface TeamMember {
  id: string
  role: string
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
    status: string
  }
}

const roleBadgeColors: Record<string, string> = {
  OWNER: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  ADMIN: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  AGENT: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  VIEWER: "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
}

export default function TeamPage() {
  const { data: session } = useSession()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("AGENT")
  const [sending, setSending] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const userRole = (session?.user as { role?: string })?.role

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/team/invite")
      if (res.ok) {
        const data = await res.json()
        setMembers(data.data || [])
      }
    } catch {
      // Handle silently
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    try {
      setSending(true)
      setInviteSuccess(false)
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      })

      if (res.ok) {
        setInviteSuccess(true)
        setInviteEmail("")
        setInviteRole("AGENT")
        setTimeout(() => {
          setDialogOpen(false)
          setInviteSuccess(false)
        }, 1500)
      }
    } catch {
      // Handle silently
    } finally {
      setSending(false)
    }
  }

  const canInvite = userRole === "OWNER" || userRole === "ADMIN"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team</h2>
          <p className="text-muted-foreground">
            Manage your team members and invite new agents.
          </p>
        </div>

        {canInvite && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <UserPlus className="h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address *</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.filter((r) => r.value !== "OWNER").map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {inviteSuccess && (
                  <p className="text-sm text-green-600">Invitation sent successfully!</p>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!inviteEmail.trim() || sending}>
                    {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Invite
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Team members */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              No team members found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Members ({members.length})
            </CardTitle>
            <CardDescription>
              People who have access to your support workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.user.avatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(member.user.name || member.user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.user.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={roleBadgeColors[member.role] || ""}
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      {ROLES.find((r) => r.value === member.role)?.label || member.role}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        member.user.status === "active"
                          ? "border-green-300 text-green-600"
                          : "border-gray-300 text-gray-500"
                      }
                    >
                      {member.user.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
