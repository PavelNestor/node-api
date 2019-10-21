import { PORT } from "babel-dotenv"
import app from './config/express';

app.listen(PORT, () => {
  console.log(`Server started and listening on port ${PORT}`);
});

export default app;
