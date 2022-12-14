import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import Category from './models/Category.js';
import Gym from './models/Gym.js';
import User from './models/User.js';

import { isAuthenticated } from './middleware/auth.js';

const router = Router();

router.get('/', (req, res) => res.redirect('/gyms.html'));

router.get('/gyms', isAuthenticated, async (req, res) => {
  try {
    const gyms = await Gym.readAll();

    res.json(gyms);
  } catch (error) {
    throw new Error('Error in list gyms');
  }
});

router.post('/gyms', isAuthenticated, async (req, res) => {
  try {
    const gym = req.body;

    const newGym = await Gym.create(gym);

    res.json(newGym);
  } catch (error) {
    throw new Error('Error in create gym');
  }
});

router.put('/gyms/:id', isAuthenticated, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const gym = req.body;

    const newGym = await Food.update(gym, id);

    if (newGym) {
      res.json(newGym);
    } else {
      res.status(400).json({ error: 'Gym not found.' });
    }
  } catch (error) {
    throw new Error('Error in update food');
  }
});

router.delete('/gyms/:id', isAuthenticated, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (await Food.destroy(id)) {
      res.status(204).send();
    } else {
      res.status(400).json({ error: 'Gym not found.' });
    }
  } catch (error) {
    throw new Error('Error in delete food');
  }
});

router.get('/categories', isAuthenticated, async (req, res) => {
  try {
    const categories = await Category.readAll();

    res.json(categories);
  } catch (error) {
    throw new Error('Error in list categories');
  }
});

router.post('/users', async (req, res) => {
  // aparentemente nao cadastrando usuario
  try {
    const user = req.body;

    const newUser = await User.create(user);

    res.json(newUser);
  } catch (error) {
    throw new Error('Error in create user');
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.readByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const { id: userId, password: hash } = user;

    const match = await bcrypt.compareSync(password, hash);

    if (match) {
      const token = jwt.sign(
        { userId },
        process.env.SECRET,
        { expiresIn: 3600 } // 1h
      );

      res.json({ auth: true, token });
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(401).json({ error: 'User not found' });
  }
});

router.use(function (req, res, next) {
  res.status(404).json({
    message: 'Content not found',
  });
});

router.use(function (error, req, res, next) {
  console.error(error.stack);

  res.status(500).json({
    message: 'Something broke!',
  });
});

export default router;
