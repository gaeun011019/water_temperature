export type AppView = 'dashboard' | 'search' | 'saved'

interface BottomNavProps {
  current: AppView
  onChange: (view: AppView) => void
}

const items: Array<{ id: AppView; label: string }> = [
  { id: 'dashboard', label: '홈' },
  { id: 'search', label: '포인트 찾기' },
  { id: 'saved', label: '저장' },
]

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {items.map((item) => (
        <button
          className={current === item.id ? 'is-active' : ''}
          key={item.id}
          onClick={() => onChange(item.id)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
