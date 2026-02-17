"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
class HealthController {
    constructor() {
        this.check = (req, res, next) => {
            try {
                res.status(200).json({
                    success: true,
                    message: 'Server is healthy',
                    timestamp: new Date().toISOString(),
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.HealthController = HealthController;
