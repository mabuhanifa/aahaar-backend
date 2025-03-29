// const db = {
//   dbPrefix: process.env.DB_PREFIX || 'mongodb+srv://',
//   dbUser: process.env.DB_USER || 'root',
//   dbHost: process.env.DB_HOST || 'localhost',
//   dbPort: parseInt(process.env.DB_PORT, 10) || 27017,
//   dbName: process.env.DB_NAME || 'test',
//   password: process.env.DB_PASSWORD || 'secret',
// };

// let uri: string;

// if (process.env.DB_URL) {
//   uri = process.env.DB_URL;
// } else if (db.dbPrefix.includes('+srv://')) {
//   uri = `${db.dbPrefix}${db.dbUser}:${db.password}@${db.dbHost}/${db.dbName}`;
// } else {
//   uri = `${db.dbPrefix}${db.dbUser}:${db.password}@${db.dbHost}:${db.dbPort}/${db.dbName}`;
// }
// export const MongoConfig = () => ({
//   uri,
// });

// export default MongoConfig;

const dbConfig = {
  uri: `${process.env.MONGO_URI}/${process.env.MONGO_DB}` || 'localhost',
};
export default dbConfig;
