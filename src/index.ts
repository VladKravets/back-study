import {app} from "./app";
import bodyParser from "body-parser";

const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

