import log from "loglevel";

log.setDefaultLevel("info"); // Уровень логирования по умолчанию

const enableLogging = () => log.setLevel("info");
const disableLogging = () => log.setLevel("silent");

export { log, enableLogging, disableLogging };
