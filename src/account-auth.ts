import {promises as fs} from 'fs';
import * as path from 'path';
import * as process from 'process';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { GoogleSheets } from "../config/config.json"

// If modifying scopes, delete token.json.
const SCOPES = GoogleSheets.scopes;

const TOKEN_PATH = path.join(process.cwd(), 'creds', 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'creds', 'credentials.json');

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: OAuth2Client | JSONClient) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

export async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  let oauth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (oauth.credentials) {
    await saveCredentials(oauth);
  }
  return oauth;
}
