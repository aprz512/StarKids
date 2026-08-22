"use client"

import { useState, useEffect, useCallback } from "react"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { createReward, updateReward, deleteReward, approveRedemption, rejectRedemption } from "@/lib/actions/shop"
import { cn } from "@/lib/utils"
import { CardSkeleton } from "@/components/ui/Skeleton"

const CATEGORIES = [
  { value: "TOY", label: "🧸 玩具", color: "text-candy-pink" },
  { value: "SNACK", label: "🍬 零食", color: "text-candy-orange" },
  { value: "PRIVILEGE", label: "👑 特权", color: "text-candy-purple" },
  { value: "EXPERIENCE", label: "🎡 体验", color: "text-candy-blue" },
  { value: "MONEY", label: "💰 零花钱", color: "text-candy-green" },
  { value: "DIGITAL", label: "🎵 数字", color: "text-admin-primary" },
  { value: "OTHER", label: "📦 其他", color: "text-warm-500" },
]

type RewardData = {
  id: string
  name: string
  description: string | null
  points: number
  category: string
  status: string
  isFeatured: boolean
  remainingStock: number
  stock: number
  maxPerPerson: number
  cooldownDays: number
  tags: string
}

type RedemptionData = {
  id: string
  pointsSpent: number
  kidMessage: string | null
  reward: { name: string; points: number }
  member: { nickname: string }
  createdAt: string
}

export default function AdminShopPage() {
  const router = useRouter()
  const [rewards, setRewards] = useState<RewardData[]>([])
  const [pendingRedemptions, setPendingRedemptions] = useState<RedemptionData[]>([])
  const [activeTab, setActiveTab] = useState<"rewards" | "review">("rewards")
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/shop")
      if (res.ok) {
        const data = await res.json()
        setRewards(data.rewards || [])
        setPendingRedemptions(data.pendingRedemptions || [])
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
      await createReward(formData)
      setShowForm(false)
      setEditId(null)
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
      await updateReward(formData)
      setShowForm(false)
      setEditId(null)
      form.reset()
      fetchData()
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定要删除这个商品吗？")) return
    await deleteReward(id)
    fetchData()
    router.refresh()
  }

  async function handleApprove(id: string) {
    await approveRedemption(id)
    fetchData()
    router.refresh()
  }

  async function handleReject(id: string) {
    await rejectRedemption(id)
    fetchData()
    router.refresh()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-warm-800"><ShoppingCart className="w-6 h-6 text-brand-500" />积分商城</h1>
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-warm-800"><ShoppingCart className="w-6 h-6 text-brand-500" />积分商城</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditId(null)
          }}
          className="h-10 px-5 btn-gradient rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
        >
          + 添加商品
        </button>
      </div>

      <div className="flex gap-1 bg-warm-100 p-1 rounded-xl w-fit">
        {[
          { key: "rewards", label: "商品列表" },
          { key: "review", label: `待审核 (${pendingRedemptions.length})` },
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

      {showForm && (
        <RewardForm
          key={editId ?? "new"}
          initial={editId ? rewards.find((r) => r.id === editId) ?? null : null}
          onSubmit={editId ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false)
            setEditId(null)
          }}
          error={error}
        />
      )}

      {activeTab === "rewards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.length === 0 ? (
            <div className="col-span-full text-center py-12 text-warm-400">
              <p className="text-4xl mb-2">🛒</p>
              <p>商城还是空的，添加一些商品吧！</p>
            </div>
          ) : (
            rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-xl border border-warm-200 shadow-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-warm-800">{reward.name}</h3>
                    <p className="text-sm text-warm-400 mt-0.5">
                      {CATEGORIES.find((c) => c.value === reward.category)?.label}
                    </p>
                  </div>
                  {reward.isFeatured && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-500">推荐</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-kids text-xl text-candy-orange">{reward.points} ⭐</span>
                  {reward.stock > 0 && (
                    <span className="text-xs text-warm-400">库存: {reward.remainingStock}/{reward.stock}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(reward.id)
                      setShowForm(true)
                    }}
                    className="flex-1 h-8 border border-warm-200 rounded-lg text-xs text-warm-500 hover:border-admin-primary hover:text-admin-primary transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(reward.id)}
                    className="flex-1 h-8 border border-warm-200 rounded-lg text-xs text-warm-500 hover:border-candy-red hover:text-candy-red transition-colors"
                  >
                    移除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "review" && (
        <div className="space-y-3">
          {pendingRedemptions.length === 0 ? (
            <div className="text-center py-12 text-warm-400">
              <p className="text-4xl mb-2">✅</p>
              <p>没有待审核的兑换申请</p>
            </div>
          ) : (
            pendingRedemptions.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-warm-200 shadow-card p-4 flex items-center gap-4">
                <div className="text-3xl">🎁</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-warm-800">{r.reward.name}</h3>
                  <p className="text-sm text-warm-400">
                    {r.member.nickname} · {r.pointsSpent}⭐
                    {r.kidMessage && ` · "${r.kidMessage}"`}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleApprove(r.id)} className="h-9 px-4 bg-candy-green text-white rounded-xl text-sm font-semibold hover:brightness-110">✅ 通过</button>
                  <button onClick={() => handleReject(r.id)} className="h-9 px-4 bg-candy-red/10 text-candy-red rounded-xl text-sm font-semibold hover:bg-candy-red/20">❌ 拒绝</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function RewardForm({
  initial,
  onSubmit,
  onCancel,
  error,
}: {
  initial: RewardData | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  error?: string
}) {
  const isEdit = !!initial
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl border border-warm-200 shadow-card p-5 space-y-4">
      <h3 className="font-semibold text-warm-700">{isEdit ? "编辑商品" : "添加新商品"}</h3>
      {error && <div className="bg-candy-red/10 text-candy-red text-sm rounded-xl p-3">{error}</div>}

      {isEdit && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">商品名称 *</label>
          <input name="name" required defaultValue={initial?.name} placeholder="如：遥控汽车" className="w-full h-10 px-3 rounded-lg border border-warm-200 text-sm focus:border-admin-primary focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">分类</label>
          <select name="category" defaultValue={initial?.category ?? "TOY"} className="w-full h-10 px-3 rounded-lg border border-warm-200 text-sm focus:border-admin-primary focus:outline-none">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">所需积分 *</label>
          <input name="points" type="number" defaultValue={initial?.points ?? 50} min={1} className="w-full h-10 px-3 rounded-lg border border-warm-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">库存 (0=不限)</label>
          <input name="stock" type="number" defaultValue={initial?.stock ?? 0} min={0} className="w-full h-10 px-3 rounded-lg border border-warm-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">每人限购</label>
          <input name="maxPerPerson" type="number" defaultValue={initial?.maxPerPerson ?? 0} min={0} className="w-full h-10 px-3 rounded-lg border border-warm-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-warm-600 mb-1">冷却天数</label>
          <input name="cooldownDays" type="number" defaultValue={initial?.cooldownDays ?? 0} min={0} className="w-full h-10 px-3 rounded-lg border border-warm-200 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-warm-600 mb-1">描述</label>
          <input name="description" defaultValue={initial?.description ?? ""} placeholder="商品描述..." className="w-full h-10 px-3 rounded-lg border border-warm-200 text-sm focus:border-admin-primary focus:outline-none" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" name="isFeatured" value="true" id="isFeatured" defaultChecked={initial?.isFeatured ?? false} className="rounded" />
        <label htmlFor="isFeatured" className="text-sm text-warm-600">推荐商品 (显示在商城首页)</label>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="h-10 px-5 btn-gradient rounded-xl text-sm font-semibold hover:brightness-110 transition-all">
          {isEdit ? "保存修改" : "添加商品"}
        </button>
        <button type="button" onClick={onCancel} className="h-10 px-5 bg-warm-100 text-warm-600 rounded-xl text-sm hover:bg-warm-200 transition-colors">取消</button>
      </div>
    </form>
  )
}
