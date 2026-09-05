import { useState } from 'react'
import { BottomNav, type AppView } from './components/BottomNav'
import { mockSites } from './data/mockSites'
import type { DiveLog, DivePlan, EquipmentItem } from './domain/waterTemperature'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { SavedSitesPage } from './features/saved-sites/SavedSitesPage'
import { SiteSearchPage } from './features/site-search/SiteSearchPage'
import { useLocalStorage } from './hooks/useLocalStorage'
import { createId } from './utils/createId'

const defaultEquipment: EquipmentItem[] = [
  { id: 'equipment-5mm', name: '5mm 슈트', category: 'suit' },
  { id: 'equipment-hood', name: '후드', category: 'thermal' },
  { id: 'equipment-gloves', name: '장갑', category: 'accessory' },
]

const isString = (value: unknown): value is string => typeof value === 'string'
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString)
const isEquipmentArray = (value: unknown): value is EquipmentItem[] => Array.isArray(value) && value.every((item) => item && typeof item === 'object' && typeof (item as EquipmentItem).id === 'string' && typeof (item as EquipmentItem).name === 'string')
const isPlanArray = (value: unknown): value is DivePlan[] => Array.isArray(value) && value.every((item) => item && typeof item === 'object' && typeof (item as DivePlan).siteId === 'string' && Number.isFinite((item as DivePlan).maxDepthMeters))
const isLogArray = (value: unknown): value is DiveLog[] => Array.isArray(value) && value.every((item) => item && typeof item === 'object' && typeof (item as DiveLog).siteId === 'string' && Number.isFinite((item as DiveLog).lowestTemperatureCelsius))

export function App() {
  const [view, setView] = useState<AppView>('dashboard')
  const initialSiteId = mockSites[0]?.id ?? ''
  const [selectedSiteId, setSelectedSiteId, selectedSiteError] = useLocalStorage('water-temperature:selected-site', initialSiteId, isString)
  const [savedSiteIds, setSavedSiteIds, savedSitesError] = useLocalStorage<string[]>('water-temperature:saved-sites', initialSiteId ? [initialSiteId] : [], isStringArray)
  const [equipment, setEquipment, equipmentError] = useLocalStorage<EquipmentItem[]>('water-temperature:equipment', defaultEquipment, isEquipmentArray)
  const [plans, setPlans, plansError] = useLocalStorage<DivePlan[]>('water-temperature:plans', [], isPlanArray)
  const [logs, setLogs, logsError] = useLocalStorage<DiveLog[]>('water-temperature:logs', [], isLogArray)
  const selectedSite = mockSites.find((site) => site.id === selectedSiteId) ?? mockSites[0]
  const storageError = selectedSiteError ?? savedSitesError ?? equipmentError ?? plansError ?? logsError

  const selectSite = (siteId: string) => {
    setSelectedSiteId(siteId)
    setView('dashboard')
  }

  const toggleSavedSite = (siteId: string) => {
    setSavedSiteIds((current) => current.includes(siteId) ? current.filter((id) => id !== siteId) : [...current, siteId])
  }

  const savePlan = (plan: Omit<DivePlan, 'id' | 'createdAt'>) => {
    setPlans((current) => [{ ...plan, id: createId(), createdAt: new Date().toISOString() }, ...current])
    setView('saved')
  }

  return (
    <div className="app-shell">
      {storageError && <aside className="storage-error" role="alert">{storageError}</aside>}
      {view === 'dashboard' && (
        <DashboardPage
          equipment={equipment}
          isSaved={selectedSite ? savedSiteIds.includes(selectedSite.id) : false}
          onSavePlan={savePlan}
          onSearch={() => setView('search')}
          onToggleSaved={() => selectedSite && toggleSavedSite(selectedSite.id)}
          selectedSite={selectedSite}
        />
      )}
      {view === 'search' && <SiteSearchPage onSelect={selectSite} selectedSiteId={selectedSiteId} sites={mockSites} />}
      {view === 'saved' && (
        <SavedSitesPage
          equipment={equipment}
          logs={logs}
          onAddEquipment={(item) => setEquipment((current) => [...current, item])}
          onAddLog={(log) => setLogs((current) => [log, ...current])}
          onRemoveEquipment={(id) => setEquipment((current) => current.filter((item) => item.id !== id))}
          plans={plans}
          savedSites={mockSites.filter((site) => savedSiteIds.includes(site.id))}
          sites={mockSites}
        />
      )}
      <BottomNav current={view} onChange={setView} />
    </div>
  )
}
