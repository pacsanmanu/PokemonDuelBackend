import express from "express";
import router from '../routes/index.js';
import { errorMiddleware } from "../middlewares/error-middleware.js";
import { morganMiddleware } from "../config/morgan.js";

export default function (server){
	// CONFIG
	server.use(express.json());
	server.use(express.urlencoded());
	// MDW
	server.use(morganMiddleware);
	// RUTAS
	server.use(router);
	// ERRORS
	server.use(errorMiddleware);
}