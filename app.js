import express from "express";
import logger from "morgan";
import cors from "cors";

import { router as contactsRouter } from "./routes/api/contactsRouter.js";
import { router as usersRouter } from "./routes/api/usersRouter.js"

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
// this is the JSON parser middleware
app.use(express.json())

//tells Express to serve static files frm the public directory
// http://localhost:3000/avatar/medium.webp
// we need to acess the localhost port followed by the directory of the static file and the file name and extension
app.use(express.static("public"));

// initialize the base path for the contacts router
app.use('/api/contacts', contactsRouter);
app.use("/api/users", usersRouter);

// error handling using res.status()
// not found
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// server error
app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message })
})

export { app };
