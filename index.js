const express = require('express')
const app = express()
const port = 2000
const { guardarUsuario, getUsuarios, editUsuario, eliminarUsuario, registrarTransferencia, getTransferencias } = require('./consultas')

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})  

app.post("/usuario", async(req, res) => {
    try {        
        const usuario = req.body
        const result = await guardarUsuario(usuario)
        res.status(201).send(result)

    } catch (error) {
        res.status(500).send(error)  
    }
})

app.get("/usuarios", async(req, res) => {
    try {
        const usuarios = await getUsuarios();
        res.json(usuarios)

    } catch (error) {
        res.status(500).send(error)
    }
})

app.put("/usuario", async(req, res) => {
    try {
        const data = Object.values(req.body)
        data.push(req.query.id)
        const result = await editUsuario(data)
        res.status(201).send(result) 
    } catch (error) {
        console.log(error)
    }
})

app.delete("/usuario", async(req, res) => {
    try {
        const { id } = req.query
        await eliminarUsuario(id)
        res.send("Usuario eliminado con éxito")
    } catch (error) {
        res.status(500).send(error)        
    }
}) 

app.post("/transferencia", async(req, res) => {
    try {
        const data = Object.values(req.body)
        await registrarTransferencia(data)
        res.status(201).send("Transacción creada")
    } catch (error) {
        res.status(500).send(error)        
    }
}) 

app.get("/transferencias", async(req, res) => {
    try {      
        const result = await getTransferencias()
        res.status(201).send(result)
    } catch (error) {
        res.status(500).send(error)        
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))