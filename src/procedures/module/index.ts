import Logger from "utils/logger";
import nluProcedures from "./defs/nlu";
import emailProcedures from "./defs/email";
import ProcedureInterfacer from "procedures/interfacer";
import type { ProcedureArgs, ProcedureFunction } from "./index.d";

const actions = new ProcedureInterfacer().actionsInterface;

export const procedures: {
  [key: string]: ProcedureFunction;
} = {
  ...nluProcedures,
  ...emailProcedures,
};

export const useProcedure = async (
  procedureName: string,
  props: ProcedureArgs
) => {
  const procedure = procedures[procedureName];
  if (!procedure) {
    console.error(`Procedure ${procedureName} not found`);
    return null;
  }
  return await procedure(props);
};

export const getProcedure = (procedureName: string) => {
  return procedures[procedureName];
};

const triggerLogger = new Logger("triggers");
export const triggerActionFromActionString = async (
  actionString: string,
  action_args: { [key: string]: any }
) => {
  const actionResponse = await actions.performAction(actionString, action_args);
  if (!actionResponse) {
    triggerLogger.error(
      `Action '${actionString}' failed when called by trigger. See args:`,
      JSON.stringify(action_args)
    );
    return false;
  }
  triggerLogger.info(
    `Action '${actionString}' called by trigger. See args:`,
    JSON.stringify(action_args)
  );
  // sendEmail({
  //   subject: `Action '${actionString}' called by trigger`,
  //   html: `Action '${actionString}' called by trigger. See args: ${JSON.stringify(
  //     action_args
  //   )}`,
  // });

  return true;
};

export default procedures;
