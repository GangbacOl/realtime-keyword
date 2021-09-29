import { PORT_NAME } from "../constants.js";

const portRouter = async (port) => {
  const portName = msg.name;

  switch (portName) {
    case PORT_NAME:
      port.onMessage.addListener(ptbRouter);
    default:
      break;
  }
};

export default portRouter;
