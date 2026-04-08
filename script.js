document.addEventListener("DOMContentLoaded", () => {
  const descricaoInput = document.getElementById("descricao");
  const valorInput = document.getElementById("valor");
  const mesInput = document.getElementById("mes");
  const filtroMesInput = document.getElementById("filtroMes");
  const botaoAdicionar = document.getElementById("adicionar");
  const lista = document.getElementById("lista");
  const total = document.getElementById("total");
  const canvas = document.getElementById("meuGrafico");
  const ctx = canvas.getContext("2d");

  let despesas = JSON.parse(localStorage.getItem("despesas")) || [];

  function salvarLocal() {
    localStorage.setItem("despesas", JSON.stringify(despesas));
  }

  function atualizarLista() {
    lista.innerHTML = "";
    const mesSelecionado = filtroMesInput.value;
    let totalMes = 0;

    despesas
      .map((d, index) => ({ ...d, index }))
      .filter(d => !mesSelecionado || d.mes === mesSelecionado)
      .forEach(d => {
        const li = document.createElement("li");
        li.textContent = `${d.descricao} - R$ ${d.valor.toFixed(2)} (${d.mes})`;

        const editarBtn = document.createElement("button");
        editarBtn.textContent = "Editar";
        editarBtn.style.backgroundColor = "#6b7280";

        const excluirBtn = document.createElement("button");
        excluirBtn.textContent = "Excluir";
        excluirBtn.style.backgroundColor = "#dc2626";

        editarBtn.onclick = () => editarDespesa(d.index);
        excluirBtn.onclick = () => excluirDespesa(d.index);

        li.appendChild(editarBtn);
        li.appendChild(excluirBtn);
        lista.appendChild(li);

        totalMes += d.valor;
      });

    total.textContent = `Total: R$ ${totalMes.toFixed(2)}`;

    atualizarGrafico(mesSelecionado);
  }

  function adicionarDespesa() {
    const descricao = descricaoInput.value.trim();
    const valor = parseFloat(valorInput.value);
    const mes = mesInput.value;

    if (!descricao || isNaN(valor) || !mes) {
      alert("Preencha todos os campos!");
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

  function atualizarGrafico(mesSelecionado) {
    const despesasFiltradas = despesas.filter(d => !mesSelecionado || d.mes === mesSelecionado);

    const valores = despesasFiltradas.map(d => d.valor);
    const labels = despesasFiltradas.map(d => d.descricao);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (valores.length === 0) return;

    const larguraBarra = canvas.width / valores.length - 10;
    const max = Math.max(...valores);

    valores.forEach((v, i) => {
      const altura = (v / max) * 150;

      ctx.fillStyle = "#16a34a";
      ctx.fillRect(i * (larguraBarra + 10), 160 - altura, larguraBarra, altura);

      ctx.fillStyle = "#000";
      ctx.fillText(labels[i], i * (larguraBarra + 10) + larguraBarra / 2, 180);
    });
  }

  botaoAdicionar.onclick = adicionarDespesa;
  filtroMesInput.onchange = atualizarLista;

  atualizarLista();
});