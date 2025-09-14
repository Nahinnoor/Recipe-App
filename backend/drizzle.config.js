import { ENV } from "./src/config/env.js";

//define the schema and the migrations and the database credentials
export default {
    schema: "./src/db/schema.js",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: ENV.DATABASE_URL,
    },
};