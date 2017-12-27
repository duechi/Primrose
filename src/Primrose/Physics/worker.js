import EngineServer from "./EngineServer";

const server = new EngineServer(postMessage);
onmessage = (evt) => server.recv(evt.data);