function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="nav-brand">HealthSync</div>
      <div className="nav-menu">
        {user ? (
          <>
            <span className="nav-item">
              Hi, {user.name || 'User'}
            </span>
            <span className="nav-item" onClick={onLogout}>
              Logout
            </span>
          </>
        ) : (
          <span className="nav-item">Smart Healthcare Management</span>
        )}
      </div>
    </header>
  )
}

export default Navbar