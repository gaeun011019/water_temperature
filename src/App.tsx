import { useState } from 'react'
import { BottomNav, type AppView } from './components/BottomNav'
import { mockSites } from './data/mockSites'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { SavedSitesPage } from './features/saved-sites/SavedSitesPage'
import { SiteSearchPage } from './features/site-search/SiteSearchPage'

export function App() {
  const [view, setView] = useState<AppView>('dashboard')

  return (
    <div className="app-shell">
      {view === 'dashboard' && <DashboardPage selectedSite={mockSites[0]} onSearch={() => setView('search')} />}
      {view === 'search' && <SiteSearchPage sites={mockSites} />}
      {view === 'saved' && <SavedSitesPage />}
      <BottomNav current={view} onChange={setView} />
    </div>
  )
}
