import { useState, type FormEvent } from 'react'
import type { DiveLog, DivePlan, DiveSiteTemperature, EquipmentItem } from '../../domain/waterTemperature'
import { createId } from '../../utils/createId'

interface SavedSitesPageProps { sites: DiveSiteTemperature[]; savedSites: DiveSiteTemperature[]; equipment: EquipmentItem[]; plans: DivePlan[]; logs: DiveLog[]; onAddEquipment: (item: EquipmentItem) => void; onRemoveEquipment: (id: string) => void; onAddLog: (log: DiveLog) => void }

export function SavedSitesPage({ sites, savedSites, equipment, plans, logs, onAddEquipment, onRemoveEquipment, onAddLog }: SavedSitesPageProps) {
  const [equipmentName, setEquipmentName] = useState('')
  const [formError, setFormError] = useState('')
  const [logSiteId, setLogSiteId] = useState(sites[0]?.id ?? '')
  const [logDate, setLogDate] = useState('2026-09-05')
  const [logDepth, setLogDepth] = useState(20)
  const [logTemperature, setLogTemperature] = useState(18)
  const [comfort, setComfort] = useState<DiveLog['comfort']>('comfortable')
  const [logMemo, setLogMemo] = useState('')

  const addEquipment = (event: FormEvent) => {
    event.preventDefault()
    const name = equipmentName.trim()
    if (!name) return setFormError('추가할 장비 이름을 입력해 주세요.')
    if (equipment.some((item) => item.name.toLowerCase() === name.toLowerCase())) return setFormError('이미 등록된 장비입니다.')
    onAddEquipment({ id: createId(), name, category: 'accessory' })
    setEquipmentName('')
    setFormError('')
  }
  const addLog = (event: FormEvent) => {
    event.preventDefault()
    if (!logSiteId || !sites.some((site) => site.id === logSiteId)) return setFormError('기록할 포인트를 선택해 주세요.')
    if (!logDate) return setFormError('다이빙 날짜를 입력해 주세요.')
    if (!Number.isFinite(logDepth) || logDepth <= 0 || logDepth > 100) return setFormError('최대 수심은 0m보다 크고 100m 이하여야 합니다.')
    if (!Number.isFinite(logTemperature) || logTemperature < -2 || logTemperature > 40) return setFormError('수온은 -2°C에서 40°C 사이로 입력해 주세요.')
    onAddLog({ id: createId(), siteId: logSiteId, date: logDate, maxDepthMeters: logDepth, lowestTemperatureCelsius: logTemperature, equipmentIds: [], comfort, memo: logMemo.trim() })
    setLogMemo('')
    setFormError('')
  }
  const siteName = (id: string) => sites.find((site) => site.id === id)?.siteName ?? '알 수 없는 포인트'
  const equipmentNames = (ids: string[]) => ids.map((id) => equipment.find((item) => item.id === id)?.name).filter(Boolean).join(' · ') || '선택 안 함'

  return (
    <main>
      <header className="page-header"><p>나의 다이빙 준비</p><h1>계획과 기록</h1><p>이 기기에만 저장되는 목업 기능입니다.</p></header>
      {formError && <aside className="form-error" role="alert">{formError}</aside>}

      <section><div className="section-heading"><h2>저장한 포인트</h2><span>{savedSites.length}개</span></div>{savedSites.length ? <div className="simple-list">{savedSites.map((site) => <article key={site.id}><strong>{site.siteName}</strong><span>{site.areaName}</span></article>)}</div> : <p className="empty-state">저장한 포인트가 없습니다.</p>}</section>

      <section><div className="section-heading"><h2>다이빙 계획</h2><span>{plans.length}개</span></div>{plans.length ? <div className="simple-list">{plans.map((plan) => <article key={plan.id}><strong>{siteName(plan.siteId)} · {plan.date}</strong><span>최대 {plan.maxDepthMeters}m · {equipmentNames(plan.equipmentIds)}</span>{plan.memo && <small>{plan.memo}</small>}</article>)}</div> : <p className="empty-state">홈에서 조건과 장비를 선택해 첫 계획을 저장해보세요.</p>}</section>

      <section><div className="section-heading"><h2>내 장비</h2><span>{equipment.length}개</span></div><div className="equipment-list">{equipment.map((item) => <span key={item.id}>{item.name}<button aria-label={`${item.name} 삭제`} onClick={() => onRemoveEquipment(item.id)} type="button">×</button></span>)}</div><form className="inline-form" onSubmit={addEquipment}><input maxLength={40} onChange={(event) => setEquipmentName(event.target.value)} placeholder="장비 이름" value={equipmentName} /><button type="submit">추가</button></form></section>

      <section><div className="section-heading"><h2>다이빙 후 기록</h2><span>직접 입력</span></div>{sites.length === 0 ? <p className="empty-state">등록된 포인트가 없어 기록을 추가할 수 없습니다.</p> : <form className="log-form" onSubmit={addLog}><label><span>포인트</span><select onChange={(event) => setLogSiteId(event.target.value)} value={logSiteId}>{sites.map((site) => <option key={site.id} value={site.id}>{site.siteName}</option>)}</select></label><label><span>날짜</span><input onChange={(event) => setLogDate(event.target.value)} required type="date" value={logDate} /></label><div className="form-row"><label><span>최대 수심(m)</span><input max="100" min="0.1" onChange={(event) => setLogDepth(Number(event.target.value))} required step="0.1" type="number" value={logDepth} /></label><label><span>최저 수온(°C)</span><input max="40" min="-2" onChange={(event) => setLogTemperature(Number(event.target.value))} required step="0.1" type="number" value={logTemperature} /></label></div><label><span>체감</span><select onChange={(event) => setComfort(event.target.value as DiveLog['comfort'])} value={comfort}><option value="cold">추웠음</option><option value="comfortable">적당했음</option><option value="warm">따뜻했음</option></select></label><label><span>메모</span><textarea maxLength={500} onChange={(event) => setLogMemo(event.target.value)} placeholder="착용 장비나 현장 상황" value={logMemo} /></label><button className="primary-action" type="submit">기록 저장</button></form>}</section>

      <section><div className="section-heading"><h2>최근 실제 기록</h2><span>{logs.length}개</span></div>{logs.length ? <div className="simple-list">{logs.map((log) => <article key={log.id}><strong>{siteName(log.siteId)} · {log.date}</strong><span>{log.maxDepthMeters}m · 최저 {log.lowestTemperatureCelsius}°C · {log.comfort === 'cold' ? '추웠음' : log.comfort === 'warm' ? '따뜻했음' : '적당했음'}</span>{log.memo && <small>{log.memo}</small>}</article>)}</div> : <p className="empty-state">다이빙 후 확인한 값을 직접 기록할 수 있습니다.</p>}<p className="safety-copy">개인 기록은 장비 추천이 아닙니다. 실제 준비는 교육받은 기준과 현장 안내를 따르세요.</p></section>
    </main>
  )
}
