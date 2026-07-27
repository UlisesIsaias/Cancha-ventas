export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Cambiar tema"
      title={theme === 'dark' ? 'Modo claro (para mucha luz)' : 'Modo oscuro'}
    >
      <span className="knob">{theme === 'dark' ? '🌙' : '☀️'}</span>
    </button>
  )
}
