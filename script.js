document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const descricaoInput = document.getElementById("descricao");
  const valorInput = document.getElementById("valor");
  const mesInput = document.getElementById("mes");
  const filtroMesInput = document.getElementById("filtroMes");
  const botaoAdicionar = document.getElementById("adicionar");
  const lista = document.getElementById("lista");
  const total = document.getElementById("total");

  // Canvas do gráfico
  const canvas = document.getElementById("meuGrafico");
  if (!canvas) {
    console.error("Canvas 'meuGrafico' não encontrado!");
    return;
  }
  const ctx = canvas.getContext("2d");

  // Array de despesas
  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

  // Salvar no localStorage
  function salvarLocal() {
    localStorage.setItem("despesas", JSON.stringify(despesas));
  }

  // Atualiza lista, total e gráfico
  function atualizarLista() {
    lista.innerHTML = "";
    const mesSelecionado = filtroMesInput.value;
    let totalMes = 0;

    despesas
      .filter(d => !mesSelecionado || d.mes === mesSelecionado)
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

    atualizarGrafico(mesSelecionado);
  }

  // Adicionar despesa
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

  // Excluir despesa
  function excluirDespesa(i) {
    despesas.splice(i, 1);
    salvarLocal();
    atualizarLista();
  }

  // Editar despesa
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

  // Atualizar gráfico
  function atualizarGrafico(mesSelecionado) {
    const despesasFiltradas = despesas.filter(d => !mesSelecionado || d.mes === mesSelecionado);

    const labels = despesasFiltradas.map(d => d.descricao);
    const valores = despesasFiltradas.map(d => d.valor);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (valores.length === 0) return;

    const larguraBarra = 40;
    const espacamento = 20;
    const maxAltura = Math.max(...valores, 100);

    valores.forEach((v, i) => {
      const altura = (v / maxAltura) * 150;
      ctx.fillStyle = "#ff66b3";
      ctx.fillRect(i * (larguraBarra + espacamento), 160 - altura, larguraBarra, altura);
      ctx.fillStyle = "#000";
      ctx.fillText(labels[i], i * (larguraBarra + espacamento), 175);
      ctx.fillText(`R$${v.toFixed(2)}`, i * (larguraBarra + espacamento), 150 - altura);
    });
  }

  // Eventos
  botaoAdicionar.onclick = adicionarDespesa;
  filtroMesInput.onchange = atualizarLista;

  // Inicializa lista e gráfico
  atualizarLista();
});
