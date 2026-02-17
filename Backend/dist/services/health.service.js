"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
class HealthService {
    getHealth() {
        return {
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
        };
    }
}
exports.HealthService = HealthService;
