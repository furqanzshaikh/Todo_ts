import express from 'express';
import { getTodos, createTodo, deleteTodo, updateTodo } from '../controller/todoControllers';
import authenticate from '../middleware/authentication';

const router = express.Router();

router.get('/todos', getTodos);
router.post('/todos/create',authenticate, createTodo);
router.delete('/todos/delete/:id', authenticate,deleteTodo);
router.put('/todos/update/:id',authenticate, updateTodo);

export default router;

