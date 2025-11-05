const userService = require('../services/userService');

test('Deve retornar lista de usuários', () => {
  const result = userService.getAllUsers();
  expect(Array.isArray(result)).toBe(true);
});