import { useState } from 'react'
import { MetricCard } from '../../components/MetricCard'
import { TemperatureProfileChart } from '../../components/TemperatureProfileChart'
import { getForecast, getLargeTemperatureDrops, getProfileToDepth, getTemperatureRange, isTemperatureDataStale, type DivePlan, type DiveSiteTemperature, type EquipmentItem } from '../../domain/waterTemperature'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

interface DashboardPageProps {
  selectedSite?: DiveSiteTemperature
  equipment: EquipmentItem[]
  isSaved: boolean
  onSearch: () => void
  onToggleSaved: () => void
  onSavePlan: (plan: Omit<DivePlan, 'id' | 'createdAt'>) => void
}

export function DashboardPage({ selectedSite, equipment, isSaved, onSearch, onToggleSaved, onSavePlan }: DashboardPageProps) {
  const [selectedDate, setSelectedDate] = useState(selectedSite?.forecasts[0]?.date ?? '')
  const [maxDepth, setMaxDepth] = useState(20)
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>([])
  const [memo, setMemo] = useState('')
  const isOnline = useOnlineStatus()
  if (!selectedSite) {
    return <main><header className="page-header"><p>데이터 없음</p><h1>등록된 포인트가 없습니다</h1><p>포인트 목록을 확인한 뒤 다시 시도해 주세요.</p></header><button className="primary-action" onClick={onSearch} type="button">포인트 찾기</button></main>
  }

  const availableDate = selectedSite.forecasts.some((item) => item.date === selectedDate) ? selectedDate : selectedSite.forecasts[0]?.date ?? ''
  const forecast = getForecast(selectedSite, availableDate)
  const profile = getProfileToDepth(forecast, maxDepth)
  const range = getTemperatureRange(profile)
  const drops = getLargeTemperatureDrops(profile)
  const isStale = isTemperatureDataStale(selectedSite.updatedAt)

  const toggleEquipment = (id: string) => {
    setSelectedEquipmentIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  return (
    <main>
      <header className="hero compact-hero">
        <div><p>다이빙 전 수온 확인</p><h1>{selectedSite.siteName}</h1><span>{selectedSite.areaName}</span></div>
        <button className="text-action" onClick={onSearch} type="button">포인트 변경</button>
      </header>

      {!isOnline && <aside className="offline-notice">오프라인 상태입니다. 기기에 저장된 선택 정보와 내장 목업을 표시합니다.</aside>}
      <aside className="mock-notice">현재 장소와 수치는 화면 확인용 목업입니다. 실제 다이빙 판단에 사용할 수 없습니다.</aside>
      {isStale && <aside className="stale-notice" role="alert">갱신 후 6시간이 지난 정보입니다. 최신 정보인지 확인해 주세요.</aside>}

      <section className="control-panel" aria-label="다이빙 조건">
        <label><span>다이빙 날짜</span><select disabled={selectedSite.forecasts.length === 0} value={availableDate} onChange={(event) => setSelectedDate(event.target.value)}>{selectedSite.forecasts.map((item) => <option key={item.date} value={item.date}>{item.date}</option>)}</select></label>
        <label><span>예상 최대 수심 <strong>{maxDepth}m</strong></span><input max="30" min="10" onChange={(event) => setMaxDepth(Number(event.target.value))} step="5" type="range" value={maxDepth} /></label>
      </section>

      <section aria-labelledby="temperature-title">
        <div className="section-heading"><h2 id="temperature-title">예상 수온</h2>{forecast && <span className={`data-badge ${forecast.kind}`}>{forecast.kind === 'observation' ? '최근 관측 참고' : '모델 예측'}</span>}</div>
        <div className="metric-grid"><MetricCard label="표층" value={range ? `${range.max} °C` : '-'} /><MetricCard label={`${maxDepth}m 이내 최저`} value={range ? `${range.min} °C` : '-'} /></div>
        {profile.length > 0 ? <TemperatureProfileChart profile={profile} /> : <p className="empty-state">선택한 날짜와 수심에 표시할 수온 데이터가 없습니다.</p>}
        {drops.length > 0 && <div className="temperature-alert"><strong>수온 변화가 큰 구간</strong>{drops.map((drop) => <span key={drop.toDepth}>{drop.fromDepth}m → {drop.toDepth}m에서 {drop.drop.toFixed(1)}°C 하락</span>)}</div>}
      </section>

      <section className="source-card" aria-labelledby="source-title">
        <h2 id="source-title">데이터 확인</h2>
        <dl><div><dt>출처</dt><dd>{selectedSite.sourceLabel}</dd></div><div><dt>기준 위치와 거리</dt><dd>{selectedSite.referenceDistanceKm}km</dd></div><div><dt>갱신 시각</dt><dd>{new Date(selectedSite.updatedAt).toLocaleString('ko-KR')}</dd></div><div><dt>좌표</dt><dd>{selectedSite.latitude}, {selectedSite.longitude}</dd></div></dl>
        <p>포인트에서 직접 측정한 값이 아닙니다. 현장 브리핑과 개인 장비 기준을 함께 확인하세요.</p>
      </section>

      <section className="plan-form" aria-labelledby="plan-title">
        <div className="section-heading"><h2 id="plan-title">이 조건으로 계획 저장</h2><button className="inline-action" onClick={onToggleSaved} type="button">{isSaved ? '★ 저장됨' : '☆ 포인트 저장'}</button></div>
        <fieldset><legend>가져갈 장비</legend><div className="chip-list">{equipment.map((item) => <label className={selectedEquipmentIds.includes(item.id) ? 'is-checked' : ''} key={item.id}><input checked={selectedEquipmentIds.includes(item.id)} onChange={() => toggleEquipment(item.id)} type="checkbox" />{item.name}</label>)}</div></fieldset>
        <label className="memo-field"><span>메모</span><textarea onChange={(event) => setMemo(event.target.value)} placeholder="동행 숍, 집합 시간 등" value={memo} /></label>
        <button className="primary-action" disabled={!forecast || profile.length === 0} onClick={() => onSavePlan({ siteId: selectedSite.id, date: availableDate, maxDepthMeters: maxDepth, equipmentIds: selectedEquipmentIds, memo })} type="button">다이빙 계획 저장</button>
      </section>
    </main>
  )
}
