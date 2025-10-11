const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const mesInput = document.getElementById("mes");
const filtroMesInput = document.getElementById("filtroMes");
const botaoAdicionar = document.getElementById("adicionar");
const lista = document.getElementById("lista");
const total = document.getElementById("total");

let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

function salvarLocal() {
  localStorage.setItem("despesas", JSON.stringify(despesas));
}

function atualizarLista() {
  lista.innerHTML = "";
  const mesSelecionado = filtroMesInput.value;
  let totalMes = 0;

  despesas
    .filter((d) => !mesSelecionado || d.mes === mesSelecionado)
    .forEach((d, i) => {
      const li = document.createElement("li");
      li.textContent = `${d.descricao} - R$ ${d.valor.toFixed(2)} (${d.mes})`;

      const editarBtn = document.createElement("button");
      editarBtn.textContent = "Editar";
      editarBtn.style.backgroundColor = "#673ab7";
      editarBtn.style.color = "white";
      editarBtn.onclick = () => editarDespesa(i);

      const excluirBtn = document.createElement("button");
      excluirBtn.textContent = "Excluir";
      excluirBtn.style.backgroundColor = "#f44336";
      excluirBtn.style.color = "white";
      excluirBtn.onclick = () => excluirDespesa(i);

      li.appendChild(editarBtn);
      li.appendChild(excluirBtn);
      lista.appendChild(li);

      totalMes += d.valor;
    });

  total.textContent = `Total: R$ ${totalMes.toFixed(2)}`;
}

function adicionarDespesa() {
  const descricao = descricaoInput.value.trim();
  const valor = parseFloat(valorInput.value);
  const mes = mesInput.value;

  if (!descricao || isNaN(valor) || !mes) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  despesas.push({ descricao, valor, mes });
  salvarLocal();
  atualizarLista();
  descricaoInput.value = "";
  valorInput.value = "";
  mesInput.value = "";
}

function excluirDespesa(i) {
  despesas.splice(i, 1);
  salvarLocal();
  atualizarLista();
}

function editarDespesa(i) {
  const novaDescricao = prompt("Nova descrição:", despesas[i].descricao);
  const novoValor = parseFloat(prompt("Novo valor:", despesas[i].valor));

  if (novaDescricao && !isNaN(novoValor)) {
    despesas[i].descricao = novaDescricao;
    despesas[i].valor = novoValor;
    salvarLocal();
    atualizarLista();
  }
}

botaoAdicionar.onclick = adicionarDespesa;
filtroMesInput.onchange = atualizarLista;

atualizarLista();
