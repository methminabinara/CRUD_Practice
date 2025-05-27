'use client'

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditUserPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setName(data.name)
        setEmail(data.email)
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch(`/api/user/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error?.[0]?.message || "Something went wrong")
    } else {
      router.push("/users")
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  )
}
