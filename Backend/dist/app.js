"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_middleware_1 = require("./middlewares/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./config/database");
const app = (0, express_1.default)();
// Connect to Database
(0, database_1.connectDB)();
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Routes
app.use('/api', routes_1.default);
// Error Handling
app.use(error_middleware_1.errorHandler);
exports.default = app;
