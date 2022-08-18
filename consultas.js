const {Pool} = require("pg")

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    password:"753951",
    database:"bancosolar",
    port:5432
})

const guardarUsuario = async (usuario) => {
    const values = Object.values(usuario)
    const consulta = {
        text: "INSERT INTO usuarios (nombre, balance) values ($1, $2)",
        values
    }

    const result = await pool.query(consulta)
    return result
}
const getUsuarios = async () => {
    const { rows } = await pool.query("SELECT * FROM usuarios")
    return rows  
}

const editUsuario = async (usuario) => {
    
    const consulta = {
        text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
        values: usuario
    }
    const { rows } =  await pool.query(consulta)
    return rows
}

const eliminarUsuario = async (id) => {
    const { rows } = await pool.query(`DELETE FROM usuarios WHERE id = ${id}`)
    return rows
}

const  registrarTransferencia = async (transferencia) => {
   
    const SQLidEmisor = {
        text: "SELECT id from usuarios WHERE nombre = $1",
        values: [transferencia[0]]
    };

    const SQLidReceptor = {
        text: "SELECT id from usuarios WHERE nombre = $1",
        values: [transferencia[1]]
    };

    const idEmisor = await pool.query(SQLidEmisor)
    const idReceptor = await pool.query(SQLidReceptor)
    
    transferencia[0] = idEmisor.rows[0].id
    transferencia[1] = idReceptor.rows[0].id
    console.log(transferencia)

    const crearTransferencia = {
        text: "INSERT INTO transferencias(emisor, receptor, monto, fecha) values($1, $2, $3, NOW())",
        values: [transferencia[0],transferencia[1],transferencia[2]]
    }
    
    const actualizarEmisor = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2",
        values: [transferencia[2],transferencia[0]]
    }

    const actualizarReceptor = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2",
        values: [transferencia[2],transferencia[1]]
    } 

      try {
        await pool.query("BEGIN");
        await pool.query(crearTransferencia);
        await pool.query(actualizarEmisor);
        await pool.query(actualizarReceptor);
        await pool.query("COMMIT");
        return true;
    } catch (error) {
        await pool.query("ROLLBACK");
        throw error;         
    }     
}

const getTransferencias = async () => {
    const consulta = {
        text: "SELECT * FROM transferencias",
        rowMode: "array"
    }

    const { rows } = await pool.query(consulta)
    return rows 
}

module.exports = { guardarUsuario, getUsuarios, editUsuario, eliminarUsuario, registrarTransferencia, getTransferencias }