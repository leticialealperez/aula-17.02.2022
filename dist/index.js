"use strict";
// CAPTURAR OS DADOS NECESSARIOS DA DOM
// ELEMENTO HTML E CRIAR AS VARIAVEIS QUE IRÃO ARMAZENAR ESSES DADOS
//let formulario:HTMLFormElement = document.querySelector("#formulario-cadastro")!;
let formulario = document.querySelector("#formulario-cadastro");
let inputCodigo = document.querySelector('#input-codigo');
let inputNome = document.querySelector('#input-nome');
let inputPreco = document.querySelector('#input-preco');
let inputPrime = document.querySelector('#input-prime');
let tabelaProdutos = document.querySelector('#tbody');
//EVENTOS
formulario.addEventListener('submit', (event) => {
    event.preventDefault();
    adicionarNovoProduto();
});
document.addEventListener('DOMContentLoaded', pegarNoStorage);
//FUNÇÕES 
function adicionarNovoProduto() {
    let codigoNoHTML = Number(inputCodigo.value);
    let nomeNoHTML = inputNome.value;
    let precoNoHTML = Number(inputPreco.value);
    let primeNoHTML = inputPrime.checked;
    if (codigoNoHTML === NaN) {
        alert("Código no formato incorreto!");
        return;
    }
    if (precoNoHTML === NaN) {
        alert("Formato do preço incorreto!");
        return;
    }
    let produto = {
        codigo: codigoNoHTML,
        nome: nomeNoHTML,
        preco: precoNoHTML,
        prime: primeNoHTML ? "Sim" : "Não"
    };
    let listaProdutos = buscarListaNoStorage();
    let existe = listaProdutos.some((produto) => produto.codigo === codigoNoHTML);
    if (existe) {
        alert("O código já foi cadastrado para outro produto!");
        inputCodigo.value = '';
        inputCodigo.focus();
        return;
    }
    listaProdutos.push(produto);
    preencherTabela(produto);
    formulario.reset();
    salvarNoStorage(listaProdutos);
}
function preencherTabela(produto) {
    /* tabelaProdutos.innerHTML = `
    <tr>
      <td>${produto.codigo}</td>
      <td>${produto.nome}</td>
      <td>${produto.preco}</td>
      <td>${produto.prime}</td>
    </tr>
    ` */
    let novaLinha = document.createElement('tr');
    let colunaCodigo = document.createElement('td');
    let colunaNome = document.createElement('td');
    let colunaPreco = document.createElement('td');
    let colunaPrime = document.createElement('td');
    let colunaAcoes = document.createElement('td');
    novaLinha.setAttribute('id', `${produto.codigo}`);
    novaLinha.setAttribute('class', 'registros');
    colunaCodigo.innerHTML = `${produto.codigo}`;
    colunaNome.innerHTML = produto.nome;
    colunaPreco.innerHTML = `${produto.preco}`;
    colunaPrime.innerHTML = `${produto.prime}`;
    colunaAcoes.innerHTML = `
                            <img type="button" width="40" src="../public/img/delet.svg" onclick="removerProduto(${produto.codigo})">
                          `;
    novaLinha.appendChild(colunaCodigo);
    novaLinha.appendChild(colunaNome);
    novaLinha.appendChild(colunaPreco);
    novaLinha.appendChild(colunaPrime);
    novaLinha.appendChild(colunaAcoes);
    tabelaProdutos.appendChild(novaLinha);
}
function salvarNoStorage(listaProdutos) {
    //setItem no localStorage
    localStorage.setItem('produtos', JSON.stringify(listaProdutos));
}
function pegarNoStorage() {
    //getItem
    let listaStorage = buscarListaNoStorage();
    if (listaStorage) {
        for (const produto of listaStorage) {
            preencherTabela(produto);
        }
    }
    return;
}
function removerProduto(codigo) {
    let listaProdutos = buscarListaNoStorage();
    let indiceEncontrado = listaProdutos.findIndex((produto) => produto.codigo === codigo);
    let confirma = confirm(`Você tem certeza que deseja excluir o produto código ${codigo}?`);
    if (confirma) {
        let linhasTabela = document.querySelectorAll('.registros');
        for (let linha of linhasTabela) {
            if (Number(linha.id) == codigo) {
                console.log(linha);
                tabelaProdutos.removeChild(linha);
                listaProdutos.splice(indiceEncontrado, 1);
                alert("Registro removido!");
            }
        }
        localStorage.clear();
        salvarNoStorage(listaProdutos);
    }
    return;
}
function buscarListaNoStorage() {
    let listaProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
    return listaProdutos;
}
