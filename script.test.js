const messages = require('./script');

test('the list has dairy-free', () => {
  expect(messages).toContain('dairy-free');
});