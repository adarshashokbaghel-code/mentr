import app from "./app";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`Mentr API running on http://localhost:${config.port}`);
});
