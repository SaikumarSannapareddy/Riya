// Get user by ID (GET /user/:id)
const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../Models/user-register'); // Import your User model
const router = express.Router();


  