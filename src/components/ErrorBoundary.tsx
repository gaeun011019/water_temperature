import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('화면 렌더링 오류', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error">
          <h1>화면을 표시하지 못했습니다</h1>
          <p>저장된 정보는 그대로 유지됩니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.</p>
          <button className="primary-action" onClick={() => window.location.reload()} type="button">새로고침</button>
        </main>
      )
    }
    return this.props.children
  }
}
