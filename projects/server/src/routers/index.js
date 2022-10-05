// const usersRouter = require("./usersRouter");
const router = require('express').Router();

// Type router here ⬇️
// EXAMPLE : router.use("/users", usersRouter);

// APKG1-4 
const authRouter = require('./auth');
const userRouter = require('./user');
// APKG1-20
const categoryRouter = require('./category');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use("/category", categoryRouter);


module.exports = router;