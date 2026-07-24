"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Check, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Confetti } from "@/components/ui/confetti"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import type { ObligationInstance, TaskInstance } from "@/hooks/use-obligations-v2"

interface TaskCardProps {
  instance: ObligationInstance
  onToggleTask: (taskInstanceId: string, completed: boolean) => void
  onDelete: (instanceId: string) => void
}

export function TaskCard({ instance, onToggleTask, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(instance.tasks.length === 0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const prevCompletedRef = useRef(0)

  const completedCount = instance.tasks.filter(t => t.completed).length
  const totalCount = instance.tasks.length
  const allCompleted = totalCount > 0 && completedCount === totalCount

  useEffect(() => {
    if (completedCount === totalCount && totalCount > 0 && prevCompletedRef.current < totalCount) {
      setShowConfetti(true)
    }
    prevCompletedRef.current = completedCount
  }, [completedCount, totalCount])

  return (
    <>
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className={cn(
        "rounded-2xl border-2 transition-all duration-300 overflow-hidden",
        allCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "border-border"
      )}>
      <div className="flex items-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center gap-4 p-4 text-left"
        >
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
            allCompleted
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
              : "bg-muted"
          )}>
            {allCompleted ? (
              <Check className="h-5 w-5" />
            ) : (
              <span className="text-lg">{instance.templateEmoji}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium",
              allCompleted && "text-muted-foreground line-through"
            )}>
              {instance.templateName}
            </p>
            {totalCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {completedCount}/{totalCount} tareas
              </p>
            )}
          </div>

          {totalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          )}
        </button>

        <button
          onClick={() => setConfirmDelete(true)}
          className="p-2 mr-2 text-muted-foreground hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded && instance.tasks.length > 0 && (
        <div className="border-t border-border/50 px-4 pb-4 space-y-2">
          {instance.tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
          ))}
        </div>
      )}
    </div>

    <ConfirmDialog
      open={confirmDelete}
      title="Eliminar obligación"
      message={`¿Eliminar "${instance.templateName}" de este día?`}
      onConfirm={() => { onDelete(instance.id); setConfirmDelete(false) }}
      onCancel={() => setConfirmDelete(false)}
    />
    </>
  )
}

function TaskItem({ task, onToggle }: { task: TaskInstance; onToggle: (id: string, completed: boolean) => void }) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = useCallback(() => {
    if (!task.completed) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 400)
    }
    onToggle(task.id, !task.completed)
  }, [task.id, task.completed, onToggle])

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200",
        task.completed
          ? "bg-emerald-500/5"
          : "hover:bg-muted/50",
        isAnimating && "scale-[1.02]"
      )}
    >
      <div className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
        task.completed
          ? "bg-emerald-500 text-white"
          : "border-2 border-muted-foreground/30 bg-background"
      )}>
        {task.completed && <Check className="h-4 w-4" />}
      </div>

      <span className="text-sm">{task.taskEmoji}</span>

      <span className={cn(
        "flex-1 text-sm transition-all duration-300",
        task.completed && "text-muted-foreground line-through"
      )}>
        {task.taskName}
      </span>

      {task.completed && (
        <span className="text-xs text-emerald-600 font-medium">✓</span>
      )}
    </button>
  )
}
