"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
const databaseUrl = process.env['MONGODB_URI'] || process.env['DATABASE_URL'];
if (!databaseUrl) {
    throw new Error('MONGODB_URI or DATABASE_URL must be set in the environment');
}
exports.default = (0, config_1.defineConfig)({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'ts-node ./prisma/seed.ts',
    },
    datasource: {
        url: databaseUrl,
    },
});
//# sourceMappingURL=prisma.config.js.map