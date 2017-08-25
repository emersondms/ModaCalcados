/*==================== LOGIN ====================*/
function login() {
	$("#form_login").submit(function() {
		if ((($("#input_login").val() == "admin") &&  
			 ($("#input_senha").val() == "admin"))) {
			location.href = "paginas/menu_adm.html";
		} else if (buscarUsuario()) {
			location.href = "paginas/menu_user.html";
		} else {
			alert('Usuário ou senha inválidos.'); 
		}
	});
}

var user, tbUsuarios = localStorage.getItem("tbUsuarios");
tbUsuarios = JSON.parse(tbUsuarios);
if (tbUsuarios == null) tbUsuarios = [];

function buscarUsuario() {
	var usuarioEncontrado = false;
	for (var i in tbUsuarios) { 
		user = JSON.parse(tbUsuarios[i]);
		if (($("#input_login").val() === user.login) &&
			($("#input_senha").val() === user.senha)) {
			usuarioEncontrado = true;
		}
	}
	return usuarioEncontrado;
}

/*==================== MENU ====================*/
function addUsuario() {
	//Verifica pelo login se o usuário já existe.
	var usuarioExistente = false;
	for (var i in tbUsuarios) { 
	    user = JSON.parse(tbUsuarios[i]);
	    if ($("#login_usuario").val() === user.login) {
	    	alert('Usuário já existente.');
	    	usuarioExistente = true; break;
	    }
	}

	//Verifica se o 'dialog-usuario' tem algum campo vazio.
	var campoVazio = false;
	if (($("#login_usuario").val()         == "") ||
		($("#senha_usuario").val()         == "") ||
		($("#confirm_senha_usuario").val() == "")) {
		campoVazio = true;
		alert('Preencha todos os campos.');
	}

	/*Se as condições acima forem falsas, adiciona
	o novo usuário na 'tbUsuarios'.*/
	if (!usuarioExistente && !campoVazio) {
	    if (($("#senha_usuario").val() === $("#confirm_senha_usuario").val())) {
			var usuario = JSON.stringify({ 
				login : $("#login_usuario").val(), 
				senha : $("#senha_usuario").val()
			});
			tbUsuarios.push(usuario); 
			localStorage.setItem("tbUsuarios", JSON.stringify(tbUsuarios));
			dialogUsuario.dialog("close");
			//Limpa os campos do formulário
			$("#login_usuario").val(""); 
			$("#senha_usuario").val(""); 
			$("#confirm_senha_usuario").val("");
			alert('Novo usuário cadastrado!');
		} else {
			alert('As senhas não conferem.');
		}
	}
}

window.onload = function() {

	$("#button_venda").click(function() {
		location.href = "vendas.html"; 
	});

	$("#button_estoque").click(function() {
		location.href = "estoque.html"; 
	});

	$("#button_sobre").click(function() {
		dialogSobre.dialog("open");
	});

	$("#button_usuario").click(function() {
		dialogUsuario.dialog("open");
	});

	$("#button_sair, #button_sair_user").click(function() {
		location.href = "../index.html"; 
	});

	dialogSobre = $("#dialog-sobre").dialog({
     	autoOpen: false,
      	height: 510,
      	width: 510,
      	modal: true,
      	buttons: {
        	"OK": function() {
         		dialogSobre.dialog("close");
        	}
      	}
    });

	dialogUsuario = $("#dialog-usuario").dialog({
     	autoOpen: false,
      	height: 405,
      	width: 530,
      	modal: true,
      	buttons: {
        	"Salvar": addUsuario,
        	"Cancelar": function() {
         		dialogUsuario.dialog("close");
        	}
      	}
    });

}