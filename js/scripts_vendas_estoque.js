//Faz o campo 'preco_novo_produto' aceitar somente números e o ponto (.).
function somenteNumeros(e) {
    var tecla = (window.event) ? event.keyCode: e.which;   
    if ((tecla > 45 && tecla < 58)) return true;
    else if (tecla===8 || tecla===0) return true;
    else return false;  
}

window.onload = function() {
	
/*==================== ARQUIVO ====================*/
	$(".li_menu").click(function() {
		window.history.back();
	});

	$(".li_sair").click(function() {
		location.href = "../index.html";
	});

/*==================== VENDAS ====================*/
 	$("#button_search").click(function() {
 		buscarProduto("vendas");
 	});

 	$("#button_cancelar_venda").click(function() {
 		$("#tabela_vendas tr td").remove();
 		$("#total").text("Total: R$ "); total=0;
 	});

 	$("#button_confirmar_venda").click(function() {
 		confirmarVenda();
 	});

/*==================== ESTOQUE ====================*/
	//localStorage.removeItem("tbProdutos");
	var total=0, subtotal=0, prod,
	tbProdutos = localStorage.getItem("tbProdutos");
	tbProdutos = JSON.parse(tbProdutos);
	if (tbProdutos == null) tbProdutos = [];
	
//CADASTRAR PRODUTO
	$("#li_cadastrar").click(function() {
      	dialogProduto.dialog("open");
    });

	function addProduto() { 
		//Verifica pelo código se o produto já existe.
		var produtoExistente = false;
	    for (var i in tbProdutos) { 
	    	prod = JSON.parse(tbProdutos[i]);
	    	if ($("#cod_novo_produto").val() == prod.codigo) {
	    		alert('Código já existente.');
	    		produtoExistente = true; break;
	    	}
		}
		
		//Verifica se o 'form_cadastrar_produto' tem algum campo vazio.
		var campoVazio = false;
		if (($("#cod_novo_produto").val()   == "") ||
			($("#nome_novo_produto").val()  == "") ||
			($("#preco_novo_produto").val() == "") ||
			($("#qtd_novo_produto").val()   == "")) {
			campoVazio = true;
			alert('Preencha todos os campos.');
		}

		/*Se as condições acima forem falsas, adiciona
		o novo produto na 'tbProdutos'.*/
		if (!produtoExistente && !campoVazio) {
			var produto = JSON.stringify({ 
	    		codigo : $("#cod_novo_produto").val(), 
	    		nome :   $("#nome_novo_produto").val().toLowerCase(), 
	    		preco :  $("#preco_novo_produto").val(), 
	    		qtd :    $("#qtd_novo_produto").val() 
    		}); 
	    	tbProdutos.push(produto); 
	    	localStorage.setItem("tbProdutos", JSON.stringify(tbProdutos)); 
	    	$("#tabela_produtos tbody").append( 
		        "<tr>" +
		          	"<td>" + $("#cod_novo_produto").val()   + "</td>" +
		          	"<td>" + $("#nome_novo_produto").val()  + "</td>" +
		          	"<td>" + $("#preco_novo_produto").val() + "</td>" +
		          	"<td>" + $("#qtd_novo_produto").val()   + "</td>" +
		        "</tr>" 
		    );
		    dialogProduto.dialog("close");
		    //Limpa os campos do formulário
		    $("#cod_novo_produto").val("");  $("#nome_novo_produto").val(""); 
			$("#preco_novo_produto").val(""); $("#qtd_novo_produto").val(""); 
		    alert('Produto cadastrado!');
		}
    }

    dialogProduto = $("#dialog-cadastrar_produto").dialog({
     	autoOpen: false,
      	height: 520,
      	width: 520,
      	modal: true,
      	buttons: {
        	"Salvar": addProduto,
        	"Cancelar": function() {
         		dialogProduto.dialog("close");
        	}
      	}
    });

//BUSCAR PRODUTO
   	$("#button_buscar").click(function() {
		buscarProduto("produtos"); 
	});

    function buscarProduto(tabela) {
    	var produtoEncontrado = false;
	    for (var i in tbProdutos) { 
	    	prod = JSON.parse(tbProdutos[i]);
	    	if (tabela === "produtos") {
	    	/*Se o parametro passado na chamada do método for 'produtos', 
    		procura o produto pelo nome e o apresenta na 'tabela_produtos'.*/
			    if ($("#input_produto").val().toLowerCase() === prod.nome) {
				    $("#tabela_produtos tbody").append( 
						"<tr>" +
						    "<td>" + prod.codigo + "</td>" +
						    "<td>" + prod.nome   + "</td>" +
						    "<td>" + prod.preco  + "</td>" +
						    "<td>" + prod.qtd    + "</td>" +
						"</tr>" 
					);
					produtoEncontrado = true; break;
			    }
			} else if (tabela === "vendas") {
			/*Se o parametro passado na chamada do método for 'vendas', procura 
			o produto pelo código e o apresenta na 'tabela_vendas', com o valor do 
			subtotal calculado de acordo com a quantidade inserida.*/
	    		if ($("#input_codigo").val() === prod.codigo) {
	    			$("#span_qtd").show();
					$("#button_add").click(function() {
						var qtd = parseInt($("#input_qtd").val());
						var preco = parseFloat(prod.preco);
						subtotal = qtd * preco;
						total += subtotal;
						$("#span_qtd").hide();
						$("#total").text("Total: R$ " + total.toFixed(2));
			    		$("#tabela_vendas tbody").append( 
							"<tr>" +
							    "<td>"    + prod.codigo         + "</td>" +
							    "<td>"    + prod.nome           + "</td>" +
							    "<td>"    + qtd                 + "</td>" +
							    "<td>R$ " + prod.preco          + "</td>" +
							    "<td>R$ " + subtotal.toFixed(2) + "</td>" +
							"</tr>" 
						);
						prod = null;
			    	});
	    			produtoEncontrado = true; break;
	    		}
	    	}
	    } 
	    if (!produtoEncontrado) {
    		$("#span_qtd").hide();
    		alert('Produto não encontrado.');
    	} 
	} 

//EDITAR PRODUTO
	$("#li_editar").click(function() {
		editarProduto();
	});

	function editarProduto() {
		//Faz os campos da 'tabela_produtos' ficarem editáveis (menos o código).
		$("#tabela_produtos tr td + td").attr("contenteditable", "true");
		$("#button_confirmar_estoque").click(function() {
			var codProduto = $("#tabela_produtos").find("td:eq(0)").html();
			for (var i in tbProdutos) { 
	    		prod = JSON.parse(tbProdutos[i]);
	    		if (prod.codigo == codProduto) {
	    			var prodEditado = JSON.stringify({
	    				codigo: codProduto,
	    				nome:   $("#tabela_produtos").find("td:eq(1)").html(),
	    				preco:  $("#tabela_produtos").find("td:eq(2)").html(),
	    				qtd:    $("#tabela_produtos").find("td:eq(3)").html()
	    			});
	    			tbProdutos[i] = prodEditado;
	    			localStorage.setItem("tbProdutos", JSON.stringify(tbProdutos)); 
	    			$("#tabela_produtos tr td + td").attr("contenteditable", "false");
	    			alert('Produto editado!');
	    		}
	    	}
		});
	}

//REMOVER PRODUTO
	$("#li_remover").click(function() {
		removerProduto();
	});

	function removerProduto() {
		var codProduto = $("#tabela_produtos").find("td:eq(0)").html();
		for (var i in tbProdutos) { 
	    	prod = JSON.parse(tbProdutos[i]);
	    	if (prod.codigo == codProduto) {
	    		var confirmacao = confirm(
	    			"Você tem certeza que quer excluir o produto " + prod.nome + "?"
	    		);
	    		if (confirmacao) {
	    			tbProdutos.splice(i, 1);
	    			localStorage.setItem("tbProdutos", JSON.stringify(tbProdutos));
	    			$("#tabela_produtos tr td").remove(); 
	    			alert('Produto excluído!');
	    		}
	    	}
	    }
	}

//CONFIRMAR VENDA
	function confirmarVenda() {
		var tabelaVendas = $("#tabela_vendas tbody");
		var vendaConcluida = true;
		//Percorre todos as linhas (produtos) adicionadas na 'tabela_vendas'.
		tabelaVendas.find("tr").each(function() {
			var tr = $(this).find("td"),
			codProduto = tr.eq(0).text(),
			qtdProduto = parseInt(tr.eq(2).text());
			for (var i in tbProdutos) {
				prod = JSON.parse(tbProdutos[i]);
				if (prod.codigo == codProduto) {
					var novaQtd = parseInt(prod.qtd) - qtdProduto;
					/*Substitui a quantidade do produto 
					se a nova quantidade for maior que 0.*/
					if (novaQtd >= 0) {
						var prodEditado = JSON.stringify({
	    					codigo: codProduto,
	    					nome:   prod.nome,
	    					preco:  prod.preco,
	    					qtd:    novaQtd
	    				});
	    				tbProdutos[i] = prodEditado;
					} else {
						alert(
							"Quantidade insuficiente do produto " 
							+prod.nome+ " para efetuar a venda.\n" + "Disponíveis " 
							+prod.qtd + " unidades no estoque."
						); 
 						vendaConcluida = false; 
					}
				}
			}
		});
		//Conclui a venda se a variável 'vendaConcluida' for true.
		if (vendaConcluida) {
			$("#tabela_vendas tr td").remove();
			localStorage.setItem("tbProdutos", JSON.stringify(tbProdutos));
			alert('Venda concluída!'); 
			$("#total").text("Total: R$ "); total=0;
		} else {
			$("#tabela_vendas tr td").remove(); 
			$("#total").text("Total: R$ "); total=0;
		}
	}

}