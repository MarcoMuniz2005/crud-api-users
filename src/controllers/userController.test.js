const userController = require('../controllers/userController');

test('Deve verificar se a função getAll é definida', () => {
  expect(typeof userController.getAll).toBe('function');
});


const userModel = require('../models/UserModel');
const userController = require('../controllers/userController');


const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};


jest.mock('../models/UserModel', () => ({
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

describe('UserController (cobertura de teste)', () => {

  afterEach(() => jest.clearAllMocks());

  test('listUsers - sucesso', async () => {
    const req = {}, res = mockResponse();
    const users = [{ id: 1, name: 'Ana' }];
    userModel.getAllUsers.mockResolvedValue(users);

    await userController.listUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  test('getUserById - sucesso', async () => {
    const req = { params: { id: '1' } }, res = mockResponse();
    const user = { id: 1, name: 'Bruno' };
    userModel.getUserById.mockResolvedValue(user);

    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('createUser - sucesso', async () => {
    const req = { body: { name: 'Carla' } }, res = mockResponse();
    const newUser = { id: 2, name: 'Carla' };
    userModel.createUser.mockResolvedValue(newUser);

    await userController.createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
  });

  test('updateUser - sucesso', async () => {
    const req = { params: { id: '3' }, body: { name: 'Diego' } }, res = mockResponse();
    const updated = { id: 3, name: 'Diego' };
    userModel.updateUser.mockResolvedValue(updated);

    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  test('deleteUser - sucesso', async () => {
    const req = { params: { id: '4' } }, res = mockResponse();
    userModel.deleteUser.mockResolvedValue();

    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  // Um teste genérico de erro para cobrir blocos catch
  test('qualquer função - erro genérico', async () => {
    const req = { params: { id: '1' }, body: {} }, res = mockResponse();
    userModel.getAllUsers.mockRejectedValue(new Error('Falha geral'));

    await userController.listUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Falha geral' });
  });

});
