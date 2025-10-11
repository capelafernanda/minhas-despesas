const descricaoInput = document.getElementById("descricao");
const valorInput = document.getElementById("valor");
const mesInput = document.getElementById("mes");
const filtroMesInput = document.getElementById("filtroMes");
const botaoAdicionar = document.getElementById("adicionar");
const lista = document.getElementById("lista");
const totalSpan = document.getElementById("total");
const ctx = document.getElementById("grafico").getContext("2d");

let despesas = JSON.parse(localStorage.getItem("despesas")) || [];
let editandoId = null;
let grafico;

// Atualiza gráfico
function atualizarGrafico() {
  const totaisPorMes = {};

  despesas.forEach((d) => {
    if (!totaisPorMes[d.mes]) totaisPorMes[d.mes] = 0;
    totaisPorMes[d.mes] += d.valor;
  });

  const meses = Object.keys(totaisPorMes).sort();
  const valores = meses.map((m) => totaisPorMes[m]);

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: meses.map((m) => m.split("-").reverse().join("/")), // mostra como mm/aaaa
      datasets: [{
        label: "Total de gastos (R$)",
        data: valores,
        backgroundColor: "#d63384",
        borderRadius: 8,
      }],
    },
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

// Atualiza tela
function atualizarTela(mesSelecionado = "") {
  lista.innerHTML = "";
  let total = 0;

  const despesasFiltradas = mesSelecionado
    ? despesas.filter((d) => d.mes === mesSelecionado)
    : despesas;

  despesasFiltradas.forEach((item) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = `${item.descricao} - R$ ${item.valor.toFixed(2)} (${item.mes})`;

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-editar");
    btnEditar.addEventListener("click", () => editarDespesa(item.id));

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn-excluir");
    btnExcluir.addEventListener("click", () => excluirDespesa(item.id));

    li.appendChild(span);
    li.appendChild(btnEditar);
    li.appendChild(btnExcluir);
    lista.appendChild(li);

    total += item.valor;
  });

  totalSpan.textContent = total.toFixed(2);
  atualizarGrafico();
}

// Salvar no localStorage
function salvarDados() {
  localStorage.setItem("despesas", JSON.stringify(despesas));
}

// Adicionar ou editar
botaoAdicionar.addEventListener("click", () => {
  const descricao = descricaoInput.value.trim();
  const valor = parseFloat(valorInput.value);
  const mes = mesInput.value;

  if (descricao === "" || isNaN(valor) || mes === "") {
    alert("Por favor, preencha todos os campos corretamente!");
    return;
  }

  if (editandoId) {
    const index = despesas.findIndex((d) => d.id === editandoId);
    despesas[index] = { id: editandoId, descricao, valor, mes };
    editandoId = null;
    botaoAdicionar.textContent = "Adicionar";
  } else {
    const novaDespesa = { id: Date.now(), descricao, valor, mes };
    despesas.push(novaDespesa);
  }

  salvarDados();
  atualizarTela(filtroMesInput.value);

  descricaoInput.value = "";
  valorInput.value = "";
  mesInput.value = "";
});

// Editar
function editarDespesa(id) {
  const despesa = despesas.find((d) => d.id === id);
  descricaoInput.value = despesa.descricao;
  valorInput.value = despesa.valor;
  mesInput.value = despesa.mes;
  editandoId = id;
  botaoAdicionar.textContent = "Salvar";
}

// Excluir
function excluirDespesa(id) {
  if (confirm("Deseja realmente excluir esta despesa?")) {
    despesas = despesas.filter((d) => d.id !== id);
    salvarDados();
    atualizarTela(filtroMesInput.value);
  }
}

// Filtro por mês
filtroMesInput.addEventListener("change", () => {
  atualizarTela(filtroMesInput.value);
});

// Carregar ao abrir
atualizarTela();

// Registrar o Service Worker para o app funcionar offline
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registrado com sucesso!"))
    .catch(error => console.log("Falha ao registrar o Service Worker:", error));
}
