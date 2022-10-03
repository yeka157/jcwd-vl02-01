// const usersRouter = require("./usersRouter");
const router = require('express').Router();

// Type router here ⬇️
// EXAMPLE : router.use("/users", usersRouter);

// APKG1-4 
const authRouter = require('./auth');
router.use('/auth', authRouter);

// APKG1-20
const categoryRouter = require('./category');
router.use("/category", categoryRouter);


module.exports = router;