
import { Request, Response } from 'express';
import todoSchema from '../models/todoSchema';
import redisClient from '../redisClient';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = 'todos';
    const cachedTodos = await redisClient.get(cacheKey);

    if (cachedTodos) {
      res.json({ success: true, message: 'Todos fetched successfully from cache', data: JSON.parse(cachedTodos) });
      return;
    }

    const todos = await todoSchema.find({});
    await redisClient.set(cacheKey, JSON.stringify(todos));
    res.json({ success: true, message: 'Todos fetched successfully', data: todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const newTodo = await todoSchema.create({ title, description });

    // Invalidate the cache
    await redisClient.del('todos');

    res.status(201).json({ success: true, message: 'Todo created successfully', data: newTodo });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleteTodo = await todoSchema.findByIdAndDelete(id);
    if (deleteTodo) {
      // Invalidate the cache
      await redisClient.del('todos');

      res.status(200).json({ success: true, message: 'Todo deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const editTodo = await todoSchema.findByIdAndUpdate(id, { title, description }, { new: true });
    if (editTodo) {
      // Invalidate the cache
      await redisClient.del('todos');

      res.status(200).json({ success: true, message: 'Todo updated successfully', data: editTodo });
    } else {
      res.status(404).json({ success: false, message: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
