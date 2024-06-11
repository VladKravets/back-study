import {app} from "./app";
import bodyParser from "body-parser";
import {runDb} from "./repositories/db";

const port = process.env.PORT || 3000

app.use(bodyParser.json())


const startApp=async ()=>{
    await runDb()
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
}

startApp()