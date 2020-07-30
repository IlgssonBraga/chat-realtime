const generateMessage = text => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

export { generateMessage };
