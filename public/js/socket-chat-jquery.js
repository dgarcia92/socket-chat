

var params = new URLSearchParams(window.location.search);
let divUsuarios = $("#divUsuarios");
let formEnviar = $("#formEnviar");
let txtMensaje = $("#txtMensaje");
let divChatbox = $("#divChatbox");

let user = params.get('nombre');
let sala = params.get('sala');




function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}



//Funciones para renderizar usuarios
function renderizarUsuarios( personas ){

    console.log( personas );

    let html =`<li>
                    <a href="javascript:void(0)" class="active"> Chat de <span> ${sala}</span></a>
                </li>`;

    
        personas.forEach(persona  => {
            
            html += `<li>
                        <a data-id = '${persona.id}' href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre}<small class="text-success">online</small></span></a>
                    </li>`;
        });


        divUsuarios.html( html );
}


//Listeners
divUsuarios.on('click', 'a', function(){

    let id = $(this).attr('data-id');

    if( id )
    {
        console.log( id );
    }

});


formEnviar.on('submit', function(e){
    e.preventDefault();

   if((txtMensaje.val()).length === 0)
   {
        return;
   }

   console.log('enviandoo...');
   // Enviar información
    socket.emit('crearMensaje', {
        nombre: user,
        mensaje: txtMensaje.val()
    }, function(resp) {
         console.log('respuesta server: ', resp);

         txtMensaje.val('').focus();

         renderisarMensajes( resp, true );
         
         scrollBottom();
    });

});


function renderisarMensajes( mensaje, yo = false)
{

    let chatRow = ``;
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ":" + fecha.getMinutes();

    let adminClass =  mensaje.nombre === "Administrador" ? 'danger' : 'info';
    let img = mensaje.nombre === "Administrador" ? '' : '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    if(!yo){
        chatRow = ` <li class = "animated fadeIn">
                            ${img}
                            <div class="chat-content">
                                <h5>${mensaje.nombre }</h5>
                                <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                            </div>
                            <div class="chat-time">${hora}/div>
                        </li>`;
    }
    else{
        chatRow = ` <li class="reverse">
                        <div class="chat-content">
                            <h5>${mensaje.nombre }</h5>
                            <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                        </div>
                        <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                        <div class="chat-time">${hora}</div>
                    </li>`;       
    }
    
     divChatbox.append( chatRow);
}


