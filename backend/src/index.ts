import { app } from "./app";
import { config } from "./utils/config";

app.listen(config.port, () => {
  console.log(`IncidentHub running on http://localhost:${config.port}`);
});
