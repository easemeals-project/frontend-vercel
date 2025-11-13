export const getErrorMessage = (msg: any) => {
  if (msg instanceof Error) return msg.message;
  if (msg?.message) return msg.message;
  if (typeof msg == "string") return msg;
  return "An error occured.";
};
