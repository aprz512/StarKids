"use client"

import { useState, useEffect, useCallback } from "react"
import { ClipboardList } from "lucide-react"
import { createTask, updateTask, deleteTask, approveTask, rejectTask } from "@/lib/actions/tasks"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { CardSkeleton } from "@/components/ui/Skeleton"

const EMOJI_PRESETS = ["🪥", "📖", "🧹", "🏃", "✏️", "🎨", "🎹", "📚", "🥦", "🧸", "🎒", "🛏️", "🍽️", "👀", "🌙", "👕", "🙏", "🤝", "💧", "🚲"]

const CATEGORIES = [
  { value: "HABIT", label: "习惯" },
  { value: "HOUSEWORK", label: "家务" },
  { value: "STUDY", label: "学习" },
  { value: "EXERCISE", label: "运动" },
  { value: "SOCIAL", label: "社交" },
  { value: "CREATIVE", label: "创意" },
  { value: "OTHER", label: "其他" },
]

type TaskData = {
  id: string
  name: string
  description: string | null
  icon: string | null
  category: string
  type: string
  difficulty: string
  points: number
  autoApprove: boolean
  status: string
  maxDaily: number
  weekDays: string
  assignees: { id: string; nickname: string }[]
  completions: { member: { nickname: string }; status: string }[]
}

type CompletionData = {
  id: string
  date: string
  task: { name: string; icon: string | null; points: number }
  member: { nickname: string }
}

export default function AdminTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<TaskData[]>([])
  const [pendingCompletions, setPendingCompletions] = useState<CompletionData[]>([])
  const [activeTab, setActiveTab] = useState<"tasks" | "review">("tasks")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [kids, setKids] = useState<{ id: string; nickname: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchKids = useCallback(async () => {
    try {
      const res = await fetch("/api/family/members")
      if (res.ok) {
        const data = await res.json()
        setKids((data.members || []).filter((m: any) => m.role === "KID"))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    fetchKids()
  }, [fetchKids])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks")
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
        setPendingCompletions(data.pending || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      await createTask(formData)
      setShowCreateForm(false)
      form.reset()
      fetchData()
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      await updateTask(formData)
      setShowCreateForm(false)
      setEditId(null)
      form.reset()
      fetchData()
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除这个任务吗？")) return
    await deleteTask(id)
    fetchData()
    router.refresh()
  }

  async function handleApprove(id: string) {
    await approveTask(id, "完成得很好！继续保持！🌟")
    fetchData()
    router.refresh()
  }

  async function handleReject(id: string) {
    await rejectTask(id, "需要再努力一点哦～")
    fetchData()
    router.refresh()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-warm-800"><ClipboardList className="w-6 h-6 text-brand-500" />任务管理</h1>
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-warm-800"><ClipboardList className="w-6 h-6 text-brand-500" />任务管理</h1>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm)
            setEditId(null)
          }}
          className="h-10 px-5 btn-gradient rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
        >
          + 创建任务
        </button>
      </div>

      <div className="flex gap-1 bg-warm-100 p-1 rounded-xl w-fit">
        {[
          { key: "tasks", label: "任务列表" },
          { key: "review", label: `待审核 (${pendingCompletions.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-white text-warm-800 shadow-sm"
                : "text-warm-500 hover:text-warm-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {showCreateForm && (
        <TaskForm
          key={editId ?? "new"}
          initial={editId ? tasks.find((t) => t.id === editId) ?? null : null}
          kids={kids}
          onSubmit={editId ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowCreateForm(false)
            setEditId(null)
          }}
          error={error}
        />
      )}

      {activeTab === "tasks" && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-warm-400">
              <p className="text-4xl mb-2">📋</p>
              <p>还没有创建任务，点击上方按钮创建第一个任务吧！</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-warm-200 shadow-card p-4 flex items-center gap-4"
              >
                <div className="text-3xl">{task.icon || "📌"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-warm-800">{task.name}</h3>
                    {task.type === "DAILY" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-500">每日</span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-500">
                      {CATEGORIES.find((c) => c.value === task.category)?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-warm-400">
                    <span>+{task.points}⭐</span>
                    {task.autoApprove && <span className="text-candy-green">自动通过</span>}
                    {task.assignees.length > 0 && (
                      <span>分配: {task.assignees.map((a) => a.nickname).join(", ")}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(task.id)
                      setShowCreateForm(true)
                    }}
                    className="h-8 px-3 border border-warm-200 rounded-lg text-xs text-warm-500 hover:border-admin-primary hover:text-admin-primary transition-colors"
                  >
                    编辑
                  </button>
                  <AssignDialog
                    taskId={task.id}
                    onAssign={() => {
                      fetchData()
                      router.refresh()
                    }}
                  />
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-warm-400 hover:bg-candy-red/10 hover:text-candy-red transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "review" && (
        <div className="space-y-3">
          {pendingCompletions.length === 0 ? (
            <div className="text-center py-12 text-warm-400">
              <p className="text-4xl mb-2">✅</p>
              <p>没有待审核的任务</p>
            </div>
          ) : (
            pendingCompletions.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-xl border border-warm-200 shadow-card p-4 flex items-center gap-4"
              >
                <div className="text-3xl">{comp.task.icon || "📌"}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-warm-800">{comp.task.name}</h3>
                  <p className="text-sm text-warm-400">
                    {comp.member.nickname} · {new Date(comp.date).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(comp.id)}
                    className="h-9 px-4 bg-candy-green text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
                  >
                    ✅ 通过
                  </button>
                  <button
                    onClick={() => handleReject(comp.id)}
                    className="h-9 px-4 bg-candy-red/10 text-candy-red rounded-xl text-sm font-semibold hover:bg-candy-red/20 transition-colors"
                  >
                    ❌ 拒绝
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function TaskForm({
  initial,
  kids,
  onSubmit,
  onCancel,
  error,
}: {
  initial?: TaskData | null
  kids: { id: string; nickname: string }[]
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  error?: string
}) {
  const isEdit = !!initial
  const isDaily = initial ? initial.type === "DAILY" : true
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl border border-warm-200 shadow-card p-5 space-y-4">
      <h3 className="font-semibold text-warm-700">{isEdit ? "编辑任务" : "创建新任务"}</h3>

      {error && (
        <div className="bg-candy-red/10 text-candy-red text-sm rounded-xl p-3">{error}</div>
      )}

      {isEdit && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">任务名称 *</label>
          <input
            name="name"
            required
            defaultValue={initial?.name}
            placeholder="如：刷牙"
            className="w-full h-10 px-3 rounded-lg border border-warm-200 text-warm-700 text-sm focus:border-admin-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">图标</label>
          <select name="icon" defaultValue={initial?.icon ?? ""} className="w-full h-10 px-3 rounded-lg border border-warm-200 text-warm-700 text-sm focus:border-admin-primary focus:outline-none">
            <option value="">选择图标</option>
            {EMOJI_PRESETS.map((emoji) => (
              <option key={emoji} value={emoji}>{emoji}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">分类</label>
          <select name="category" defaultValue={initial?.category ?? "HABIT"} className="w-full h-10 px-3 rounded-lg border border-warm-200 text-warm-700 text-sm focus:border-admin-primary focus:outline-none">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">积分</label>
          <input
            name="points"
            type="number"
            defaultValue={initial?.points ?? 5}
            min={1}
            className="w-full h-10 px-3 rounded-lg border border-warm-200 text-warm-700 text-sm focus:border-admin-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">难度</label>
          <select name="difficulty" defaultValue={initial?.difficulty ?? "EASY"} className="w-full h-10 px-3 rounded-lg border border-warm-200 text-warm-700 text-sm focus:border-admin-primary focus:outline-none">
            <option value="EASY">简单</option>
            <option value="MEDIUM">中等</option>
            <option value="HARD">困难</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-warm-600 mb-1">描述 (给小朋友看)</label>
          <input
            name="description"
            defaultValue={initial?.description ?? ""}
            placeholder="如：把牙齿刷得白白的，笑起来更自信！"
            className="w-full h-10 px-3 rounded-lg border border-warm-200 text-warm-700 text-sm focus:border-admin-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="isDaily" value="true" id="isDaily" defaultChecked={isDaily} className="rounded" />
        <label htmlFor="isDaily" className="text-sm text-warm-600">
          每日任务 (每天自动出现在小朋友的今日任务里)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-600 mb-1">发布给 (可多选)</label>
        {kids.length === 0 ? (
          <p className="text-xs text-warm-400">还没有小朋友，先在"家庭成员"里添加</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {kids.map((k) => (
              <label key={k.id} className="flex items-center gap-2 text-sm text-warm-700">
                <input
                  type="checkbox"
                  name="assigneeIds"
                  value={k.id}
                  defaultChecked={isEdit ? !!initial.assignees.some((a) => a.id === k.id) : true}
                  className="rounded"
                />
                {k.nickname}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="autoApprove" value="true" id="autoApprove" defaultChecked={initial?.autoApprove ?? false} className="rounded" />
        <label htmlFor="autoApprove" className="text-sm text-warm-600">自动通过 (不需要家长审核)</label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="h-10 px-5 btn-gradient rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
        >
          {isEdit ? "保存修改" : "创建任务"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-5 bg-warm-100 text-warm-600 rounded-xl text-sm hover:bg-warm-200 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  )
}

function AssignDialog({
  taskId,
  onAssign,
}: {
  taskId: string
  onAssign: () => void
}) {
  const [open, setOpen] = useState(false)
  const [members, setMembers] = useState<{ id: string; nickname: string }[]>([])
  const [selected, setSelected] = useState<string[]>([])

  async function loadMembers() {
    const res = await fetch("/api/family/members")
    if (res.ok) {
      const data = await res.json()
      setMembers((data.members || []).filter((m: any) => m.role === "KID"))
    }
  }

  function handleOpen() {
    setOpen(true)
    loadMembers()
  }

  async function handleSave() {
    const res = await fetch(`/api/tasks/${taskId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberIds: selected }),
    })
    if (res.ok) {
      setOpen(false)
      onAssign()
    }
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="h-8 px-3 border border-warm-200 rounded-lg text-xs text-warm-500 hover:border-admin-primary hover:text-admin-primary transition-colors"
      >
        分配
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-elevated p-6 w-full max-w-sm space-y-4">
        <h3 className="font-semibold text-warm-800">分配给家庭成员</h3>
        <div className="space-y-2">
          {members.map((m) => (
            <label key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(m.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelected([...selected, m.id])
                  } else {
                    setSelected(selected.filter((id) => id !== m.id))
                  }
                }}
                className="rounded"
              />
              <span className="text-sm text-warm-700">{m.nickname}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} className="flex-1 h-10 btn-gradient rounded-xl text-sm font-semibold">
            保存
          </button>
          <button onClick={() => setOpen(false)} className="flex-1 h-10 bg-warm-100 text-warm-600 rounded-xl text-sm">
            取消
          </button>
        </div>
      </div>
    </div>
  )
}
