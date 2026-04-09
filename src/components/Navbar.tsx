interface NavbarProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function Navbar({ sidebarCollapsed, onToggleSidebar }: NavbarProps) {
  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-left">
        <button
          className="navbar-menu-btn"
          onClick={onToggleSidebar}
          title={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
          id="navbar-menu-btn"
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <div className="navbar-brand">
          <span className="navbar-logo">🌿</span>
          <div className="navbar-title-wrap">
            <span className="navbar-title">Indonesia Wetland GIS</span>
            <span className="navbar-subtitle">Spatial Data Visualization</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-badge">
          <span className="navbar-badge-dot" />
          Live
        </div>
      </div>
    </header>
  )
}
