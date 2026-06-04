import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ROUTES, APP_NAME } from '@/lib/constants'

const navLinks = [
  { to: ROUTES.HOME,    label: 'Beranda' },
  { to: ROUTES.CATALOG, label: 'Katalog' },
  { to: ROUTES.EXPORT,  label: 'Ekspor' },
  { to: ROUTES.ABOUT,   label: 'Tentang' },
  { to: ROUTES.CONTACT, label: 'Kontak' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="h-16 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-50 shadow-sm">
      <nav
        className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between"
        aria-label="Navigasi utama"
      >
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-extrabold text-xl text-primary">
          <span className="text-2xl" aria-hidden="true">🐠</span>
          <span>{APP_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === ROUTES.HOME}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-bg-light text-primary'
                      : 'text-gray-600 hover:text-primary hover:bg-bg-light'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-bg-light"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-16 inset-x-0 bg-white border-b border-blue-50 shadow-lg z-40"
        >
          <ul className="flex flex-col px-4 py-3 gap-1" role="list">
            {navLinks.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === ROUTES.HOME}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                      isActive
                        ? 'bg-bg-light text-primary'
                        : 'text-gray-600 hover:text-primary hover:bg-bg-light'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

    </header>
  )
}

export default Navbar
