const grpc = require("grpc")

const protoLoader = require('@grpc/proto-loader')

const packageDef = protoLoader.loadSync("todo.proto", {})

const todoPackage = grpc.loadPackageDefinition(packageDef).todoPackage

text = process.argv.slice(2, process.argv.length).join(" ").trim()

const client = new todoPackage.Todo(
    "localhost:5000", 
    grpc.credentials.createInsecure()
)

client.createTodo({
    "id": -1,
    "text": text
}, (err, res) => {
    console.log("Received from server " + JSON.stringify(res))
})

// client.readTodos({}, (err, res) => {
//     if (!res.items)
//         res.items.forEach ( item => console.log(item))
// })

const call = client.readTodosStream()

call.on("data", item => {
    console.log("Receive item from server : ", JSON.stringify(item))
})

call.on("end", e => {
    console.log("Server Done")
})