import type { ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Wheat, Leaf, Sailboat, Droplet, type LucideProps } from 'lucide-react'

export type PointIconType =
  | 'grano'
  | 'foglia'
  | 'barca'
  | 'goccia'
  | 'wheat'
  | 'leaf'
  | 'boat'
  | 'drop'
  | 'droplet'

const iconMap: Record<string, ComponentType<LucideProps>> = {
  grano: Wheat,
  wheat: Wheat,
  foglia: Leaf,
  leaf: Leaf,
  barca: Sailboat,
  boat: Sailboat,
  sailboat: Sailboat,
  goccia: Droplet,
  drop: Droplet,
  droplet: Droplet,
}

export function getPointIconComponent(icon: string): ComponentType<LucideProps> {
  const normalized = (icon || '').toLowerCase().trim()
  return iconMap[normalized] || Droplet
}

export function PointIcon({
  icon,
  size = 16,
  className = '',
}: {
  icon: string
  size?: number
  className?: string
}) {
  const Icon = getPointIconComponent(icon)
  return <Icon size={size} className={className} />
}

export function getPointIconSvg(icon: string, size = 16): string {
  const Icon = getPointIconComponent(icon)
  return renderToStaticMarkup(<Icon size={size} strokeWidth={2.2} />)
}
