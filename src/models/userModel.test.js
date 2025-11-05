const mysql = require('mysql2/promise');
const userModel = require('./UserModel');

// Mock da conexão do MySQL
const mockExecute = jest.fn();
const mockEnd = jest.fn();
const mockConnection = { execute: mockExecute, end: mockEnd };

jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn(),
}));

describe('UserModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mysql.createConnection.mockResolvedValue(mockConnection);
  });

  test('getAllUsers deve retornar lista de usuários', async () => {
    const mockUsers = [{ id: 1, name: 'Marco' }];
    mockExecute.mockResolvedValueOnce([mockUsers]);
    const result = await userModel.getAllUsers();
    expect(result).toEqual(mockUsers);
    expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM users');
    expect(mockEnd).toHaveBeenCalled();
  });

  test('getUserById deve retornar um usuário pelo ID', async () => {
    const mockUser = [{ id: 2, name: 'Ana' }];
    mockExecute.mockResolvedValueOnce([mockUser]);
    const result = await userModel.getUserById(2);
    expect(result).toEqual(mockUser[0]);
    expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [2]);
  });

  test('createUser deve inserir e retornar novo usuário', async () => {
    const userData = { name: 'Carlos', email: 'c@a.com', phone: '9999' };
    mockExecute.mockResolvedValueOnce([{ insertId: 10 }]);
    const result = await userModel.createUser(userData);
    expect(result).toEqual({ id: 10, ...userData });
    expect(mockExecute).toHaveBeenCalledWith(
      'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
      [userData.name, userData.email, userData.phone]
    );
  });

  test('updateUser deve atualizar e retornar usuário', async () => {
    const updatedData = { name: 'João', email: 'j@o.com', phone: '8888' };
    mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const result = await userModel.updateUser(1, updatedData);
    expect(result).toEqual({ id: 1, ...updatedData });
    expect(mockExecute).toHaveBeenCalledWith(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [updatedData.name, updatedData.email, updatedData.phone, 1]
    );
  });

  test('deleteUser deve executar o DELETE corretamente', async () => {
    mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
    await userModel.deleteUser(3);
    expect(mockExecute).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [3]);
    expect(mockEnd).toHaveBeenCalled();
  });

  test('connectDB deve lançar erro se falhar', async () => {
    mysql.createConnection.mockRejectedValueOnce(new Error('Erro de conexão'));
    await expect(userModel.getAllUsers()).rejects.toThrow('Erro de conexão');
  });
});
