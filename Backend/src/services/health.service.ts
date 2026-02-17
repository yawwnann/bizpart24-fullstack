export class HealthService {
  public getHealth() {
    return {
      success: true,
      message: 'Server is healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
