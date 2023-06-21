import mongoose from 'mongoose';
import colors from 'colors'
const DbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Databese connected to cluster ${connect.connection.host}`.bgYellow);
  } catch (error) {
    console.log(`Error while connecting to the database cluster`.bgRed)
  }
}

export default DbConnect