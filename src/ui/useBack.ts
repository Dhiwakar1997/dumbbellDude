import { useLocation, useNavigate } from 'react-router-dom';

/**
 * A "Back" action for screens that can be opened directly (a shared link, a reload, a new tab): steps back
 * through the app's own history when there is some, and otherwise goes to `fallback` instead of leaving the app.
 */
export function useBack(fallback: string): () => void {
  const navigate = useNavigate();
  const location = useLocation();
  // React Router gives the first entry of a session the key "default": there is no in-app page behind it.
  const opened = location.key === 'default';
  return () => (opened ? navigate(fallback, { replace: true }) : navigate(-1));
}
