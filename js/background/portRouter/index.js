import { PORT_NAME } from "../constants.js";
import ptbRouter from "./popupToBackground.js";

const portRouter = async (port) => {
  const portName = port.name;

  switch (portName) {
    case PORT_NAME:
      port.onMessage.addListener(ptbRouter);
    default:
      break;
  }
};

export default portRouter;
