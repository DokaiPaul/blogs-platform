import {app} from "./settings";
import {runDB} from "./database/mongo-db";

const port = process.env.PORT ||3000;

const launchApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`App has been launched on port ${port}`);
    })
}

launchApp();