// CAPTURAR OS DADOS NECESSARIOS DA DOM
// ELEMENTO HTML E CRIAR AS VARIAVEIS QUE IRÃO ARMAZENAR ESSES DADOS

//let formulario:HTMLFormElement = document.querySelector("#formulario-cadastro")!;

let formulario = document.querySelector("#formulario-cadastro") as HTMLFormElement;
let inputCodigo = document.querySelector('#input-codigo') as HTMLInputElement;
let inputNome = document.querySelector('#input-nome') as HTMLInputElement;
let inputPreco = document.querySelector('#input-preco') as HTMLInputElement;
let inputPrime = document.querySelector('#input-prime') as HTMLInputElement;

let tabelaProdutos = document.querySelector('#tbody') as HTMLTableElement;

interface Produto {
  codigo: number,
  nome: string,
  preco: number,
  prime: string
}


//EVENTOS
formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  adicionarNovoProduto();
});

document.addEventListener('DOMContentLoaded', pegarNoStorage);


//FUNÇÕES 
function adicionarNovoProduto(){

  let codigoNoHTML: number = Number(inputCodigo.value);
  let nomeNoHTML: string = inputNome.value;
  let precoNoHTML: number = Number(inputPreco.value);
  let primeNoHTML: boolean = inputPrime.checked;

  if(codigoNoHTML === NaN){
    alert("Código no formato incorreto!");
    return
  }

  if(precoNoHTML === NaN) {
    alert("Formato do preço incorreto!");
    return
  }

  let produto: Produto = {
    codigo: codigoNoHTML,
    nome: nomeNoHTML,
    preco: precoNoHTML,
    prime: primeNoHTML? "Sim": "Não"
  }

  let listaProdutos: Produto[] = buscarListaNoStorage();

  let existe: boolean = listaProdutos.some((produto) => produto.codigo === codigoNoHTML);

  if(existe){
    alert("O código já foi cadastrado para outro produto!");
    inputCodigo.value = '';
    inputCodigo.focus();

    return
  }

  listaProdutos.push(produto);

  preencherTabela(produto);
  formulario.reset();
  salvarNoStorage(listaProdutos);

}

function preencherTabela(produto: Produto){

  /* tabelaProdutos.innerHTML = `
  <tr>
    <td>${produto.codigo}</td>
    <td>${produto.nome}</td>
    <td>${produto.preco}</td>
    <td>${produto.prime}</td>
  </tr>
  ` */
  let novaLinha: HTMLTableRowElement = document.createElement('tr');
  let colunaCodigo: HTMLTableCellElement = document.createElement('td');
  let colunaNome: HTMLTableCellElement = document.createElement('td');
  let colunaPreco: HTMLTableCellElement = document.createElement('td');
  let colunaPrime: HTMLTableCellElement = document.createElement('td');
  let colunaAcoes: HTMLTableCellElement = document.createElement('td');

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

function salvarNoStorage(listaProdutos: Produto[]){

  //setItem no localStorage
  localStorage.setItem('produtos', JSON.stringify(listaProdutos));

}

function pegarNoStorage(){
    //getItem
    let listaStorage: Produto[] = buscarListaNoStorage();

    if(listaStorage){
      for (const produto of listaStorage) {
        preencherTabela(produto);
      }
    
    }
    
    return  
}

function removerProduto(codigo: number){

    let listaProdutos: Produto[] = buscarListaNoStorage();
    let indiceEncontrado: number = listaProdutos.findIndex((produto) => produto.codigo === codigo);

    let confirma: boolean = confirm(`Você tem certeza que deseja excluir o produto código ${codigo}?`);

    if(confirma){
        let linhasTabela: NodeListOf<HTMLTableRowElement> = document.querySelectorAll('.registros');

        for(let linha of linhasTabela){
          
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

    return

    

}

function buscarListaNoStorage(): Produto[]{

  let listaProdutos: Produto[] = JSON.parse(localStorage.getItem('produtos')!) || [];

  return listaProdutos
}

