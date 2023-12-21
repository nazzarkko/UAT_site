// import { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER } from '../info/env';

import { createPool } from 'mysql2/promise';


const MYSQL_DATABASE = 'questions';
const MYSQL_HOST = 'database-1.cmdzkf13exnd.eu-north-1.rds.amazonaws.com';
const MYSQL_PASSWORD = '9NI034m9iolk3Irena';
const MYSQL_USER = 'client';


let globalPool = undefined;

export async function connect() {

    if (globalPool != undefined) {
        return globalPool;
    }

    globalPool = await createPool({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        connectionLimit: 20,
    });

    return globalPool;
}