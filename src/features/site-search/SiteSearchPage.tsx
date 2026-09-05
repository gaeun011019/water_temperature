import type { DiveSiteTemperature } from '../../domain/waterTemperature'

interface SiteSearchPageProps {
  sites: DiveSiteTemperature[]
}

export function SiteSearchPage({ sites }: SiteSearchPageProps) {
  return (
    <main>
      <header className="page-header">
        <p>다이빙 준비</p>
        <h1>포인트 찾기</h1>
        <p>지역이나 다이빙 포인트 이름으로 수온 정보를 찾는 화면입니다.</p>
      </header>

      <label className="search-field">
        <span>지역 또는 포인트</span>
        <input disabled placeholder="데이터 연동 후 검색할 수 있어요" type="search" />
      </label>

      <section className="log-list" aria-label="검색 결과 예시">
        {sites.map((site) => (
          <article className="log-card" key={site.id}>
            <div><h2>{site.siteName}</h2><span>{site.areaName}</span></div>
            <dl>
              {site.profile.map((item) => (
                <div key={item.depthMeters}>
                  <dt>{item.depthMeters} m</dt>
                  <dd>{item.temperatureCelsius} °C</dd>
                </div>
              ))}
            </dl>
            <small>{site.sourceLabel} · 실제 정보 아님</small>
          </article>
        ))}
      </section>
    </main>
  )
}

