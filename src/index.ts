import express from "express";
import { AddressInfo } from "net";
import dotenv from "dotenv";
import cors from "cors";

import { userRouter } from "./router/userRouter";
import { musicRouter } from './router/musicRouter';

dotenv.config();

export const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/user', userRouter);
app.use('/music', musicRouter);

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Servidor rodando em http://localhost:${address.port}`);
  } else {
    console.error(`Falha ao rodar o servidor.`);
  }
});