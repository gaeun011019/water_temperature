import { useState } from 'react'
import { getTemperatureRange, type DiveSiteTemperature } from '../../domain/waterTemperature'

interface SiteSearchPageProps { sites: DiveSiteTemperature[]; selectedSiteId: string; onSelect: (siteId: string) => void }

export function SiteSearchPage({ sites, selectedSiteId, onSelect }: SiteSearchPageProps) {
  const [query, setQuery] = useState('')
  const [comparisonIds, setComparisonIds] = useState<string[]>([])
  const filteredSites = sites.filter((site) => `${site.siteName} ${site.areaName}`.toLowerCase().includes(query.trim().toLowerCase()))
  const comparedSites = comparisonIds.map((id) => sites.find((site) => site.id === id)).filter((site): site is DiveSiteTemperature => Boolean(site))
  const toggleComparison = (id: string) => setComparisonIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 2 ? [...current, id] : [current[1], id])

  return (
    <main>
      <header className="page-header"><p>다이빙 준비</p><h1>포인트 찾기</h1><p>포인트를 선택하거나 최대 두 곳의 목업 수온을 비교하세요.</p></header>
      <label className="search-field"><span>지역 또는 포인트</span><input onChange={(event) => setQuery(event.target.value)} placeholder="예: 동해, 제주" type="search" value={query} /></label>

      {comparedSites.length === 2 && <section className="compare-panel"><div className="section-heading"><h2>포인트 비교</h2><span>같은 날짜 목업</span></div><div className="compare-grid">{comparedSites.map((site) => { const range = getTemperatureRange(site.forecasts[0]?.profile ?? []); return <article key={site.id}><strong>{site.siteName}</strong><span>최저 {range ? `${range.min}°C` : '데이터 없음'}</span><span>기준 거리 {site.referenceDistanceKm}km</span><span>{site.sourceLabel}</span></article> })}</div></section>}

      <section className="site-list" aria-label="검색 결과">
        {filteredSites.map((site) => { const range = getTemperatureRange(site.forecasts[0]?.profile ?? []); return (
          <article className={`site-card ${selectedSiteId === site.id ? 'is-selected' : ''}`} key={site.id}>
            <button className="site-select" onClick={() => onSelect(site.id)} type="button"><span className="site-card-heading"><strong>{site.siteName}</strong><small>{site.areaName}</small></span><span className="site-card-temperature">{range ? `${range.min}–${range.max} °C` : '-'}</span><span className="site-card-meta">기준 위치에서 {site.referenceDistanceKm}km · 목업</span></button>
            <label className="compare-check"><input checked={comparisonIds.includes(site.id)} onChange={() => toggleComparison(site.id)} type="checkbox" />비교하기</label>
          </article>
        )})}
        {filteredSites.length === 0 && <p className="empty-state">검색 결과가 없습니다. 실제 데이터 연결 후에는 조회 실패와 데이터 없음 상태도 이 영역에 표시됩니다.</p>}
      </section>
    </main>
  )
}
