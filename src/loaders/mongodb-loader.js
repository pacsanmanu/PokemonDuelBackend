import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export default async function(config) {
	try{
		//const url = `mongodb://${config.host}:${config.port}/${config.dbname}`;
		const url = config.url;
		await mongoose.connect(url);
		logger.info(`Connected to Database: ${url}`);
	}catch (err) {
		logger.error('Error conecting to Database: ', err);
	}
}