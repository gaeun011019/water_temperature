import { MetricCard } from '../../components/MetricCard'
import { getLowestTemperature, getSurfaceTemperature, type DiveSiteTemperature } from '../../domain/waterTemperature'

interface DashboardPageProps {
  selectedSite?: DiveSiteTemperature
  onSearch: () => void
}

export function DashboardPage({ selectedSite, onSearch }: DashboardPageProps) {
  const surfaceTemperature = selectedSite ? getSurfaceTemperature(selectedSite) : undefined
  const lowestTemperature = selectedSite ? getLowestTemperature(selectedSite) : undefined

  return (
    <main>
      <header className="hero">
        <p>다이빙 전 수온 확인</p>
        <h1>포인트와 수심에 맞춰<br />다이빙을 준비하세요.</h1>
        <button className="primary-action" onClick={onSearch} type="button">다이빙 포인트 찾기</button>
      </header>

      <section aria-labelledby="site-title">
        <div className="section-heading">
          <h2 id="site-title">선택한 포인트</h2>
          <span>{selectedSite?.areaName ?? '선택 전'}</span>
        </div>
        {selectedSite ? (
          <>
            <div className="site-summary">
              <strong>{selectedSite.siteName}</strong>
              <small>{selectedSite.sourceLabel} · 실제 정보 아님</small>
            </div>
            <div className="metric-grid">
              <MetricCard label="표층 수온" value={surfaceTemperature === undefined ? '-' : `${surfaceTemperature} °C`} />
              <MetricCard label="최저 수온" value={lowestTemperature === undefined ? '-' : `${lowestTemperature} °C`} />
            </div>
          </>
        ) : (
          <p className="empty-state">다이빙 포인트를 선택하면 수심별 수온을 확인할 수 있습니다.</p>
        )}
      </section>
    </main>
  )
}

