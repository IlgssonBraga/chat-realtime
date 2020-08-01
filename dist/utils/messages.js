Object.defineProperty(exports, '__esModule', { value: true });
const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (username, url) => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  };
};

exports.generateMessage = generateMessage;
exports.generateLocationMessage = generateLocationMessage;
