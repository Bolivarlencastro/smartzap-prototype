import * as cypressConfig from './cypress.config.js';
const mobileConfig = { ...cypressConfig.default, viewportWidth: 414, viewportHeight: 736 };
export default mobileConfig;
