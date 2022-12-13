import { GoogleAuth } from 'google-auth-library';
import * as path from 'path';
import * as process from 'process';
import { GoogleSheets } from "../config/config.json"

export const service_auth = new GoogleAuth({
    keyFile: path.join(process.cwd(), "creds", "service-account.json"),
    scopes: GoogleSheets.scopes,
});
