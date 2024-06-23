import { Request, Response } from 'express';
import userSchema from '../models/userSchema';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userSchema.find({});
    res.json({ success: true, message: 'Users fetched successfully', data: users });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


  
  export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedUser = await userSchema.findByIdAndDelete(id);
      if (deletedUser) {
        res.status(200).json({ success: true, message: 'User deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting User:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };


  export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      const newUser = await userSchema.create({ email, password: hashedPassword });
  
      // Generate JWT token
      const token = jwt.sign({ email, hashedPassword }, process.env.JWT_SECRET||'1234567890' , { expiresIn: '1h' });
  
      // Set the token as a cookie
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Max age set to 1 hour
  
      // Send the response
      res.status(201).json({ success: true, message: 'User Created Successfully', data: newUser,token });
  
    } catch (error) {
      console.error('Error creating User:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await userSchema.findOne({ email });
  
      // If user not found, return error
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
  
      // Compare the password provided with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      // If password is invalid, return error
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
  
      // Set the token as a cookie
      res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Max age set to 1 hour
  
      // Send success response with token
      res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  


  
  export const editUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Extracting the ID from request parameters
      const { email, password } = req.body;
      console.log(email, password);
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user with the hashed password
      const updatedUser = await userSchema.findByIdAndUpdate(
        id,
        { email, password: hashedPassword },
        { new: true }
      );
  
      res.status(200).json({ success: true, message: 'User Updated Successfully', data: updatedUser });
  
    } catch (error) {
      console.error('Error updating User:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
 
  