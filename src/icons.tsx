import type { ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Wheat, Leaf, Sailboat, Droplet, Dam, TextSearch, ArrowUp, type LucideProps } from 'lucide-react'

export type PointShape = 'cerchio' | 'quadrato' | 'circle' | 'square'

export function getPointShape(point: { forma?: PointShape; shape?: PointShape }): 'square' | 'circle' {
  const shape = (point.forma || point.shape || '').toLowerCase().trim()
  return shape === 'quadrato' || shape === 'square' ? 'square' : 'circle'
}

export function getPointColor(point: { colore?: string; color?: string }, fallback = '#3c7d61'): string {
  return point.colore || point.color || fallback
}

export type PointIconType =
  | 'grano'
  | 'foglia'
  | 'barca'
  | 'goccia'
  | 'diga'
  | 'dam'
  | 'text-search'
  | 'textsearch'
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
  diga: Dam,
  dam: Dam,
  'text-search': TextSearch,
  textsearch: TextSearch,
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

const directionDeg: Record<string, number> = {
  nord: 0,
  'nord-est': 45,
  est: 90,
  'sud-est': 135,
  sud: 180,
  'sud-ovest': 225,
  ovest: 270,
  'nord-ovest': 315,
  north: 0, ne: 45, east: 90, se: 135,
  south: 180, sw: 225, west: 270, nw: 315,
}

export function getArrowDeg(direzione: string | number): number {
  if (typeof direzione === 'number') return direzione
  return directionDeg[(direzione as string).toLowerCase().trim()] ?? 0
}

export function getArrowSvg(direzione: string | number, size = 28, color = '#2d665b'): string {
  const deg = getArrowDeg(direzione)
  const svg = renderToStaticMarkup(<ArrowUp size={size} strokeWidth={2.5} color={color} />)
  // wrap in a rotating div
  return `<div style="transform:rotate(${deg}deg); display:flex; align-items:center; justify-content:center;">${svg}</div>`
}
