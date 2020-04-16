const app = require("express")()
const fs = require("fs")
const path = require("path")

app.route("/:file").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (fs.existsSync(path.join(__dirname, `/${req.params.file}`)))
    {
        res.setHeader("Cache-Control", "max-age=604800")
        res.sendFile(path.join(__dirname, `/${req.params.file}`))
    }
    else
    {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
        res.setHeader("Pragma", "no-cache") // HTTP 1.0.
        res.setHeader("Expires", "0") // Proxies.
        res.sendFile(path.join(__dirname, "index.html"))
    }
})

app.route("/.well-known/assetlinks.json").get((req, res) => res.sendFile(path.join(__dirname, "assetlinks.json")))

app.route("*").get((req, res) =>
{
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate") // HTTP 1.1.
    res.setHeader("Pragma", "no-cache") // HTTP 1.0.
    res.setHeader("Expires", "0") // Proxies.
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(3000, () => console.log(`Server is running ... `))