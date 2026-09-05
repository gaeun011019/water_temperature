export class AppError extends Error {
  constructor(message: string, readonly statusCode: number, readonly code: string) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = '요청한 데이터를 찾지 못했습니다.') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class ProviderUnavailableError extends AppError {
  constructor(message = '외부 수온 데이터를 불러오지 못했습니다.') {
    super(message, 503, 'PROVIDER_UNAVAILABLE')
  }
}
