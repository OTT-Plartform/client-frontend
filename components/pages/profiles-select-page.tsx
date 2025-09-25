"use client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { showSnackbar } from "@/store/slices/uiSlice"
import { useDispatch } from "react-redux"
import { api, setActiveProfileId } from "@/lib/api"
import { Plus, Check, User as UserIcon } from "lucide-react"

interface ProfileItem {
  id: number
  profile_name: string
  display_name?: string
  first_name?: string
  last_name?: string
  avatar_url?: string | null
  avatar_color?: string | null
  is_primary?: boolean
  is_child_profile?: boolean
}

export default function ProfilesSelectPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<ProfileItem[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [manageMode, setManageMode] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<{ profile_name: string; first_name: string; last_name: string; avatar_color: string }>({ profile_name: "", first_name: "", last_name: "", avatar_color: "#4ECDC4" })
  const [newProfile, setNewProfile] = useState({
    profile_name: "",
    first_name: "",
    last_name: "",
    avatar_color: "#4ECDC4",
    is_child: false,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.listProfiles()
        const list = res?.data?.profiles || []
        setProfiles(list)
      } catch (e: any) {
        const msg = e?.message || "Failed to load profiles"
        dispatch(showSnackbar({ message: msg, type: "error" }))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [dispatch])

  useEffect(() => {
    if (!loading && profiles.length === 0) {
      setIsCreateOpen(true)
    }
  }, [loading, profiles])

  const initials = (p: ProfileItem) => {
    const name = p.display_name || p.profile_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "U"
    const parts = name.trim().split(/\s+/)
    const first = parts[0]?.[0] || "U"
    const second = parts[1]?.[0] || ""
    return (first + second).toUpperCase()
  }

  const selectProfile = async (id: number) => {
    try {
      setActiveProfileId(id)
      dispatch(showSnackbar({ message: "Profile selected", type: "success" }))
      router.push("/")
    } catch (e: any) {
      dispatch(showSnackbar({ message: e?.message || "Failed to select profile", type: "error" }))
    }
  }

  const beginEdit = (p: ProfileItem) => {
    setEditingId(p.id)
    setEditDraft({
      profile_name: p.display_name || p.profile_name,
      first_name: p.first_name || "",
      last_name: p.last_name || "",
      avatar_color: p.avatar_color || "#4ECDC4",
    })
  }

  const saveEdit = async () => {
    if (!editingId) return
    try {
      await api.updateProfileById(editingId, {
        profile_name: editDraft.profile_name,
        first_name: editDraft.first_name || undefined,
        last_name: editDraft.last_name || undefined,
        avatar_color: editDraft.avatar_color,
      })
      const list = (await api.listProfiles())?.data?.profiles || []
      setProfiles(list)
      setEditingId(null)
      dispatch(showSnackbar({ message: "Profile updated", type: "success" }))
    } catch (e: any) {
      dispatch(showSnackbar({ message: e?.message || "Failed to update profile", type: "error" }))
    }
  }

  const deleteProfile = async (id: number) => {
    try {
      await api.deleteProfile(id)
      const list = (await api.listProfiles())?.data?.profiles || []
      setProfiles(list)
      dispatch(showSnackbar({ message: "Profile removed", type: "success" }))
    } catch (e: any) {
      dispatch(showSnackbar({ message: e?.message || "Failed to remove profile", type: "error" }))
    }
  }

  const createProfile = async () => {
    if (!newProfile.profile_name?.trim()) {
      dispatch(showSnackbar({ message: "Profile name is required", type: "error" }))
      return
    }
    try {
      setIsSubmitting(true)
      const body: any = {
        profile_name: newProfile.profile_name.trim(),
        first_name: newProfile.first_name?.trim() || undefined,
        last_name: newProfile.last_name?.trim() || undefined,
        avatar_color: newProfile.avatar_color,
        parental_controls: newProfile.is_child ? { is_child: true } : undefined,
      }
      const res = await api.createProfile(body)
      const created = (res as any)?.data?.profile || null
      if (created?.id) {
        setActiveProfileId(Number(created.id))
        dispatch(showSnackbar({ message: "Profile created", type: "success" }))
        router.push("/")
      } else {
        // Fallback: reload list
        const list = (await api.listProfiles())?.data?.profiles || []
        setProfiles(list)
        if (list.length > 0) {
          setActiveProfileId(Number(list[0].id))
          router.push("/")
        }
      }
    } catch (e: any) {
      dispatch(showSnackbar({ message: e?.message || "Failed to create profile", type: "error" }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading profiles...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <Card className="bg-black/50 border-white/10 backdrop-blur-2xl rounded-3xl">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-3xl font-bold">Who is watching?</CardTitle>
              <CardDescription className="text-gray-300">Select a profile to continue</CardDescription>
            </CardHeader>
            <CardContent>
              {profiles.length > 0 && !isCreateOpen && editingId === null ? (
                <div className="flex items-center justify-between mb-6">
                  <div className="text-gray-300 text-sm">Profiles: {profiles.length}</div>
                  <div className="flex gap-3">
                    <button
                      className={`h-12 w-12 rounded-full flex items-center justify-center shadow-md transition-all ${manageMode ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
                      onClick={() => { setManageMode(!manageMode); setEditingId(null) }}
                      title={manageMode ? "Done" : "Manage Profiles"}
                    >
                      {manageMode ? (
                        <span className="text-sm font-semibold">Done</span>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                      )}
                    </button>
                    <button
                      className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:opacity-90 transition"
                      onClick={() => setIsCreateOpen(true)}
                      title="Add Profile"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : null}
            {profiles.length > 0 && !isCreateOpen && editingId === null ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {profiles.map((p) => {
                  const isEditing = editingId === p.id && manageMode
                  return (
                    <div key={p.id} className="group relative">
                      <div
                        className={`relative border-2 rounded-3xl p-6 transition-all duration-300 ${
                          manageMode ? "cursor-default" : "cursor-pointer"
                        } ${"border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"}`}
                        onClick={() => { if (!manageMode) selectProfile(p.id) }}
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-24 h-24 rounded-2xl flex items-center justify-center ring-2 ring-white/10" style={{ background: p.avatar_color || "#4ECDC4" }}>
                            <Avatar className="w-24 h-24 rounded-2xl">
                              <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                                {initials(p)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        {!isEditing ? (
                          <div className="text-center">
                            <p className="text-white font-semibold truncate max-w-[10rem]">{p.display_name || p.profile_name}</p>
                            {p.is_primary ? (
                              <Badge className="mt-1 bg-blue-600 text-white">Primary</Badge>
                            ) : null}
                          </div>
                        ) : (
                          <></>
                        )}
                          {manageMode && !isEditing ? (
                            <button
                              className="absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white"
                              onClick={() => { beginEdit(p); }}
                              title="Edit"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                            </button>
                          ) : null}
                          <div className="absolute inset-0 rounded-3xl pointer-events-none ring-0 group-hover:ring-2 ring-blue-600/40 transition" />
                        </div>
                      </div>
                    </div>
                  )
                })}
                {!manageMode && (
                  <button onClick={() => setIsCreateOpen(true)} className="group">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg group-hover:opacity-90">
                        <Plus className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-300 group-hover:text-white">Add Profile</p>
                    </div>
                  </button>
                )}
              </div>
            ) : editingId !== null ? (
              <div className="max-w-md mx-auto">
                <div className="mb-6 text-center">
                  <p className="text-white text-lg font-semibold">Edit profile</p>
                  <p className="text-gray-300 text-sm">Update profile details</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Profile Name</Label>
                    <Input
                      value={editDraft.profile_name}
                      onChange={(e) => setEditDraft({ ...editDraft, profile_name: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white rounded-full h-12 px-4"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">First Name</Label>
                      <Input
                        value={editDraft.first_name}
                        onChange={(e) => setEditDraft({ ...editDraft, first_name: e.target.value })}
                        className="bg-gray-800/50 border-gray-700 text-white rounded-full h-12 px-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Last Name</Label>
                      <Input
                        value={editDraft.last_name}
                        onChange={(e) => setEditDraft({ ...editDraft, last_name: e.target.value })}
                        className="bg-gray-800/50 border-gray-700 text-white rounded-full h-12 px-4"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Avatar Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={editDraft.avatar_color}
                        onChange={(e) => setEditDraft({ ...editDraft, avatar_color: e.target.value })}
                        className="h-12 w-20 p-1 bg-gray-800/50 border-gray-700 rounded-full"
                      />
                      <div className="flex-1 h-12 bg-gray-800/50 border border-gray-700 rounded-full flex items-center px-4">
                        <span className="text-white text-sm">{editDraft.avatar_color}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={saveEdit}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-semibold"
                    >
                      Update Profile
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="h-12 w-12 rounded-full text-blue-400 border-blue-500/40 hover:bg-blue-500/10"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
                <div className="mb-6 text-center">
                  <p className="text-white text-lg font-semibold">Create a profile</p>
                  <p className="text-gray-300 text-sm">Add a profile to start watching</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Profile Name</Label>
                    <Input
                      placeholder="e.g. Blessing"
                      value={newProfile.profile_name}
                      onChange={(e) => setNewProfile({ ...newProfile, profile_name: e.target.value })}
                      className="bg-gray-800/50 border-gray-700 text-white rounded-full h-12 px-4"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">First Name</Label>
                      <Input
                        value={newProfile.first_name}
                        onChange={(e) => setNewProfile({ ...newProfile, first_name: e.target.value })}
                        className="bg-gray-800/50 border-gray-700 text-white rounded-full h-12 px-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Last Name</Label>
                      <Input
                        value={newProfile.last_name}
                        onChange={(e) => setNewProfile({ ...newProfile, last_name: e.target.value })}
                        className="bg-gray-800/50 border-gray-700 text-white rounded-full h-12 px-4"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Avatar Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="color"
                        value={newProfile.avatar_color}
                        onChange={(e) => setNewProfile({ ...newProfile, avatar_color: e.target.value })}
                        className="h-12 w-20 p-1 bg-gray-800/50 border-gray-700 rounded-full"
                      />
                      <div className="flex-1 h-12 bg-gray-800/50 border border-gray-700 rounded-full flex items-center px-4">
                        <span className="text-white text-sm">{newProfile.avatar_color}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={createProfile}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Profile"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                      className="h-12 w-12 rounded-full text-white border-white/20 hover:bg-white/10"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


