const mock = new Proxy({}, {
  get: () => {
    const f = () => {};
    f.__proto__ = mock;
    return f;
  },
});

module.exports = mock;
