import React from "react";

/**
 * Reusable PageHeader component for every dashboard page.
 * Follows the AURA OS design system exactly.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}) {
  return (
    <div className={`aura-page-header ${className}`}>
      <div className="aura-page-header-left">
        {eyebrow && <span className="aura-eyebrow">{eyebrow}</span>}
        <h1 className="aura-page-title">{title}</h1>
        {description && (
          <p className="aura-page-description">{description}</p>
        )}
      </div>

      {actions && (
        <div className="aura-page-header-actions">{actions}</div>
      )}
    </div>
  );
}
