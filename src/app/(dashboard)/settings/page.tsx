"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { Save, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PLANS, INTEGRATIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user as { name?: string; email?: string; orgName?: string; role?: string } | undefined
  const [saving, setSaving] = useState(false)

  // Profile state
  const [name, setName] = useState(user?.name || "")
  const [email] = useState(user?.email || "")

  // Notification preferences
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [browserNotifs, setBrowserNotifs] = useState(true)
  const [ticketAssigned, setTicketAssigned] = useState(true)
  const [ticketMention, setTicketMention] = useState(true)
  const [slaWarning, setSlaWarning] = useState(true)

  const handleSaveProfile = async () => {
    setSaving(true)
    // Simulate save
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
  }

  const integrationCategories = [
    { key: "messaging", label: "Messaging" },
    { key: "engineering", label: "Engineering" },
    { key: "meetings", label: "Meetings" },
    { key: "alerting", label: "Alerting" },
    { key: "crm", label: "CRM" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account, organization, and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label>Role</Label>
                <Badge variant="secondary">{user?.role || "Agent"}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Label>Organization</Label>
                <Badge variant="outline">{user?.orgName || "Organization"}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
                <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to be notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Channels</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifs}
                    onCheckedChange={setEmailNotifs}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Browser Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Show desktop notifications
                    </p>
                  </div>
                  <Switch
                    checked={browserNotifs}
                    onCheckedChange={setBrowserNotifs}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Events</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Ticket Assigned</p>
                    <p className="text-xs text-muted-foreground">
                      When a ticket is assigned to you
                    </p>
                  </div>
                  <Switch
                    checked={ticketAssigned}
                    onCheckedChange={setTicketAssigned}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Mentioned in Ticket</p>
                    <p className="text-xs text-muted-foreground">
                      When someone mentions you in a ticket
                    </p>
                  </div>
                  <Switch
                    checked={ticketMention}
                    onCheckedChange={setTicketMention}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">SLA Warning</p>
                    <p className="text-xs text-muted-foreground">
                      When a ticket is approaching its SLA deadline
                    </p>
                  </div>
                  <Switch
                    checked={slaWarning}
                    onCheckedChange={setSlaWarning}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <Card
                key={plan.value}
                className={cn(
                  "relative",
                  "popular" in plan && plan.popular && "border-primary shadow-md"
                )}
              >
                {"popular" in plan && plan.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    Popular
                  </Badge>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ${plan.price.monthly}
                    </span>
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-1.5 text-sm">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-muted-foreground"
                      >
                        <span className="mt-0.5 text-green-500">&#10003;</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={
                      "popular" in plan && plan.popular
                        ? "default"
                        : "outline"
                    }
                    className="w-full"
                    size="sm"
                  >
                    {plan.value === "FREE" ? "Current Plan" : "Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          {integrationCategories.map((cat) => {
            const items = INTEGRATIONS.filter((i) => i.category === cat.key)
            if (items.length === 0) return null
            return (
              <div key={cat.key} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat.label}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((integration) => (
                    <Card key={integration.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">
                              {integration.name}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {integration.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {integration.features.slice(0, 3).map((f) => (
                            <Badge
                              key={f}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {f}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 w-full"
                        >
                          Configure
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
