export class HealthResponse {
  message: string;
  status: string;
  level: number;
}

export class HealthCheckResponse {
  message: string;
  status: string;
  level: number;
  info: string;
  error: string;
}
