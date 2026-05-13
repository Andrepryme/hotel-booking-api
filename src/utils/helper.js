const UAParser = require('ua-parser-js');

function getRequestMeta(req) {
  const ip_address =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress;

  const user_agent = req.headers['user-agent'];

  const parser = new UAParser(user_agent);
  const result = parser.getResult();

  const device_name =
    result.device.model ||
    result.os.name ||
    result.browser.name ||
    "Unknown";

  return {
    ip_address,
    user_agent,
    device_name,
  };
}

module.exports = { 
  getRequestMeta
};