import express from "express";
import { authRouter } from "./auth";
import { docsRouter } from "./docs";
import CookieParser from 'cookie-parser';
import { globalOptions } from "./global-options";

export const app = express();
const address = globalOptions.serverOpts.address;
const port = globalOptions.serverOpts.port;

app.use(CookieParser());
app.use('/api/v1/docs', docsRouter);
app.use('/api/v1/auth', authRouter);

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://${address}:${port}`);
});
