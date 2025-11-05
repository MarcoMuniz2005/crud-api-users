const userService = require('../services/userService');

test('Deve retornar lista de usuários', () => {
  const result = userService.getAllUsers();
  expect(Array.isArray(result)).toBe(true);
});

const userModel = require('../models/UserModel');

jest.mock('../models/UserModel', () => ({
  getAllUsers: jest.fn(),
  saveUsers: jest.fn(),
}));

describe('UserService (teste de cobertura)', () => {
  afterEach(() => jest.clearAllMocks());

  test('listUsers - deve retornar lista de usuários', () => {
    const fakeUsers = [{ id: 1, name: 'Ana' }];
    userModel.getAllUsers.mockReturnValue(fakeUsers);

    const result = userService.listUsers();

    expect(userModel.getAllUsers).toHaveBeenCalled();
    expect(result).toEqual(fakeUsers);
  });

  test('getUserById - deve retornar usuário existente', () => {
    const fakeUsers = [{ id: 1, name: 'Bruno' }];
    userModel.getAllUsers.mockReturnValue(fakeUsers);

    const user = userService.getUserById(1);

    expect(user).toEqual(fakeUsers[0]);
  });

  test('getUserById - deve retornar undefined se não encontrado', () => {
    userModel.getAllUsers.mockReturnValue([{ id: 1, name: 'Bruno' }]);
    const result = userService.getUserById(2);
    expect(result).toBeUndefined();
  });

  test('createUser - deve criar novo usuário', () => {
    const fakeUsers = [{ id: 1, name: 'Carlos' }];
    userModel.getAllUsers.mockReturnValue(fakeUsers);

    const newUser = userService.createUser({ name: 'Daniel' });

    expect(newUser).toEqual({ id: 2, name: 'Daniel' });
    expect(userModel.saveUsers).toHaveBeenCalledWith([
      { id: 1, name: 'Carlos' },
      { id: 2, name: 'Daniel' },
    ]);
  });

  test('updateUser - deve atualizar usuário existente', () => {
    const fakeUsers = [{ id: 1, name: 'Eva' }];
    userModel.getAllUsers.mockReturnValue(fakeUsers);

    const updated = userService.updateUser(1, { name: 'Eva Nova' });

    expect(updated).toEqual({ id: 1, name: 'Eva Nova' });
    expect(userModel.saveUsers).toHaveBeenCalled();
  });

  test('updateUser - deve lançar erro se usuário não encontrado', () => {
    userModel.getAllUsers.mockReturnValue([]);
    expect(() => userService.updateUser(99, { name: 'Inexistente' }))
      .toThrow('Usuário não encontrado.');
  });

  test('deleteUser - deve deletar usuário existente', () => {
    const fakeUsers = [{ id: 1, name: 'João' }];
    userModel.getAllUsers.mockReturnValue(fakeUsers);

    userService.deleteUser(1);

    expect(userModel.saveUsers).toHaveBeenCalledWith([]);
  });

  test('deleteUser - deve lançar erro se usuário não encontrado', () => {
    const fakeUsers = [{ id: 1, name: 'João' }];
    userModel.getAllUsers.mockReturnValue(fakeUsers);

    expect(() => userService.deleteUser(99))
      .toThrow('Usuário não encontrado.');
  });
});
