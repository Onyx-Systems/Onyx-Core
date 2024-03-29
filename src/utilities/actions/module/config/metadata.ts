import { config } from "dotenv";
import { checkActionExists } from "../utils";
import { writeFileSync } from "fs";
import ActionsInterfacer from "../../interfacer";
import { formatJSON } from "libs/prettier";

config();

const interpretation = new ActionsInterfacer().interpretationInterface;

const basePath = "storage/actions/metadata";

export const generateMetaData = async () => {
  try {
    // TODO: Endpoints for these aren't always gonna be accessible on startup if the other servers are down, so we need to handle that
    generateUnsupportedActions();
    generateUnsupportedActionsWithoutResponse();
  } catch (err) {
    console.error(err);
  }
};

const generateUnsupportedActions = async () => {
  try {
    const existingActions = await interpretation.getExistingActions();
    const unsupportedActions: string[] = [];
    existingActions.forEach((action: string) => {
      if (!checkActionExists(action)) {
        unsupportedActions.push(action);
      }
    });
    const pathToFile = `${basePath}/unsupported_actions.json`;
    const formatted = formatJSON(JSON.stringify(unsupportedActions, null, 2));
    writeFileSync(pathToFile, formatted);

    return unsupportedActions;
  } catch (err) {
    console.error("Error generating unsupported actions:", err);
    return [];
  }
};

const generateUnsupportedActionsWithoutResponse = async () => {
  try {
    const existingActions =
      await interpretation.getExistingActionsWithoutResponse();
    const unsupportedActions: string[] = [];
    existingActions.forEach((action: string) => {
      if (!checkActionExists(action)) {
        unsupportedActions.push(action);
      }
    });
    const pathToFile = `${basePath}/unsupported_actions_without_response.json`;
    const formatted = formatJSON(JSON.stringify(unsupportedActions, null, 2));
    writeFileSync(pathToFile, formatted);

    return unsupportedActions;
  } catch (err) {
    console.error(err);
    return [];
  }
};
