import { emitArgs } from "./socket-io";

export const globalLog = (...args: any[]) => {
  console.log(...args);
  emitArgs("console_message", ...args);
};
