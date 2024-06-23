import express from 'express';
import { getUsers,deleteUser,createUser, editUser, login } from '../controller/userController';

const router = express.Router();

router.get('/users', getUsers);
router.post('/users/create', createUser);
router.delete('/users/delete/:id', deleteUser);
router.put('/users/update/:id', editUser);
router.post('/login', login);

export default router;
