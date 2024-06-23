import { Request, Response } from 'express';
import todoSchema from '../models/todoSchema';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await todoSchema.find({});
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
      res.status(200).json({ success: true, message: 'Todo updated successfully', data: editTodo });
    } else {
      res.status(404).json({ success: false, message: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
