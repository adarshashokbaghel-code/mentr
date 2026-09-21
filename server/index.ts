import app from "./app";
import { config } from "./config";
import { warmSnapGradeOcr } from "./services/snap-grade-image";

warmSnapGradeOcr();

app.listen(config.port, () => {
  console.log(`Mentr API running on http://localhost:${config.port}`);
});
