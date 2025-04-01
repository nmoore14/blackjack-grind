import type { LucideIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  tags?: string[]
  status?: string
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  tags,
  status,
}: FeatureCardProps) {
  return (
    <Link to={href} className="feature-card block">
      {status && <span className="feature-status">{status}</span>}
      <div className="feature-icon">
        <Icon />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      {tags && tags.length > 0 && (
        <div className="feature-tags">
          {tags.map((tag) => (
            <span key={tag} className="feature-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
} 