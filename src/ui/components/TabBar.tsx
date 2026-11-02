// trussel: T-KDV8X8JD1M@1
import { NavLink, useLocation } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Home', icon: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /> },
  {
    to: '/history',
    label: 'History',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: (
      <>
        <path d="M3 19l6-6 4 4 8-9" />
        <path d="M15 8h6v6" />
      </>
    ),
  },
  { to: '/library', label: 'Library', icon: <path d="M2 12h3M19 12h3M5 8v8M19 8v8M8 6v12M16 6v12M8 12h8" /> },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
      </>
    ),
  },
] as const;

// Implements C-40A37181K1 TabBar.
// trussel: T-NQJ20J0N56@1
export function TabBar(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <nav className="tabbar" aria-label="Main">
      {TABS.map((tab) => {
        const homeActive = tab.to === '/' && (pathname === '/' || pathname.startsWith('/routines'));
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) => `tab${isActive || homeActive ? ' is-active' : ''}`}
            aria-current={homeActive ? 'page' : undefined}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {tab.icon}
            </svg>
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
