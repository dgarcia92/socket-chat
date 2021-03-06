const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades')

const usuarios = new Usuarios();


io.on('connection', (client) => {


    client.on('entrarChat', ( data, callback ) => {

        if(!data.nombre || !data.sala)
        {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }


        //Para conectar a una sala
        client.join(data.sala);
        

        let personas = usuarios.agregarPersona( client.id, data.nombre, data.sala );

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala( data.sala) );
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Server', `${data.nombre} Se unió`));

        callback( usuarios.getPersonasPorSala( data.sala) );
        
    });


    client.on('crearMensaje', ( data, callback ) => {

       let persona = usuarios.getPersona( client.id);

       let mensaje = crearMensaje(persona.nombre, data.mensaje);
       client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
       callback( mensaje);
    });



    client.on('disconnect', () =>{
       let personaBorrada = usuarios.borrarPersona( client.id );

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Server', `${personaBorrada.nombre} salió`));

        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala( personaBorrada.sala) );
    }); 



    //Mensaje privado

    client.on('mensajePrivado', data => {
        
        //se manda el mensaje con el id en especifico
        let persona = usuarios.getPersona(  client.id );
        client.broadcast.to( data.para ).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje ));

    });




    
});