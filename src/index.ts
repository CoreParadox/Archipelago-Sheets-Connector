import { request } from "undici";
import { google } from "googleapis";
import Log from "./log";
import { authorize } from "./account-auth";
import { service_auth } from "./service-auth";
import { Archipelago, GoogleSheets } from "../config/config.json";

const headers = { Cookie: Archipelago.cookie };
const url = `https://archipelago.gg/log/${Archipelago.roomId}`;

async function run() {
  updateValues((await getLog()).asArray);
}

async function getLog() {
  const { body } = await request(url, { headers });
  return new Log(await body.text());
}

async function getService(accountAuth = false) {
  let auth = accountAuth ? await authorize() : service_auth;
  return google.sheets({ version: "v4", auth });
}

async function updateValues(values: string[][], accountAuth = false) {
  const service = await getService(accountAuth);

  try {
    const result = await service.spreadsheets.values.update({
      spreadsheetId: GoogleSheets.spreadsheetId,
      range: `${GoogleSheets.sheetName}!${GoogleSheets.range}`,
      valueInputOption: GoogleSheets.valueInputOption,
      requestBody: { values, majorDimension: "ROWS" },
    });

    console.log("%d cells updated.", result.data.updatedCells);

    return result;
  } catch (err) {
    throw err;
  }
}

run();
