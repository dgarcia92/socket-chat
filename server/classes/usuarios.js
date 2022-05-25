
class Usuarios {

    constructor(){
        this.personas = [];
    }


    agregarPersona(id, nombre, sala){

        let persona = { id, nombre, sala };
        this.personas.push( persona );
        
        return this.personas;
    }


    getPersona( id )
    {
        /* La funcion filter regresa un arreglo por eso se pone [0] al final para obtener la primera posición */
        let persona = this.personas.filter( persona => {
                return persona.id === id;
        })[0];

        return persona;
    }

    getPersonas()
    {
        return this.personas;
    }


    getPersonasPorSala( sala )
    {
        let personasEnSala = this.personas.filter( persona => {
            return persona.sala === sala;
        });

        return personasEnSala;
    }

    borrarPersona( id )
    {
        let personaBorrada = this.getPersona ( id ); //Buscamos la persona a borrar

        const nuevoArreglo = this.personas.filter( persona => {
            return persona.id != id;
        });   //Solo regresa un arreglo con las personas que no tengan el ID envíado

        this.personas = nuevoArreglo;

        return personaBorrada;  //Retornamos la persona borrada
    }

}


module.exports  = {
    Usuarios
}