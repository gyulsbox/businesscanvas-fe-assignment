import { useMemo, useState } from 'react'
import type { Record } from '@/types/records.ts'

export const useMemberModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)

  const resetEditKeyAndRecord = (): void => {
    setEditingKey(null)
    setEditingRecord(null)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetEditKeyAndRecord()
  }

  const openEditModal = (record: Record) => {
    setEditingKey(record.id)
    setEditingRecord(record)
    showModal()
  }

  const modalState = useMemo<'add' | 'edit'>(
    () => (editingKey ? 'edit' : 'add'),
    [editingKey],
  )

  return {
    isModalOpen,
    modalState,
    showModal,
    openEditModal,
    closeModal,
    editingKey,
    editingRecord,
    resetEditKeyAndRecord,
  }
}
