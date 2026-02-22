"use client"

import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  size?: "sm" | "default" | "lg"
  text?: string
}

const sizeMap = {
  sm: "h-4 w-4",
  default: "h-8 w-8",
  lg: "h-12 w-12",
}

export function Loading({ className, size = "default", text }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeMap[size])} />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}
