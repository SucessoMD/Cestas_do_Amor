const carrinho = [];
const ADMIN_PASSWORD = 'qedesobsh@000192'; // Você pode alterar essa senha depois

// Gerenciamento de estoque
let estoque = JSON.parse(localStorage.getItem('estoque')) || {};

// Inicializa o estoque se não existir
function inicializarEstoque() {
  const cestas = document.querySelectorAll('.card');
  cestas.forEach(cesta => {
    const nome = cesta.querySelector('.card-title').textContent;
    if (!(nome in estoque)) {
      estoque[nome] = true; // true = disponível, false = esgotado
    }
  });
  atualizarBotoesEstoque();
  salvarEstoque();
}

function salvarEstoque() {
  localStorage.setItem('estoque', JSON.stringify(estoque));
}

function atualizarBotoesEstoque() {
  const cestas = document.querySelectorAll('.card');
  cestas.forEach(cesta => {
    const nome = cesta.querySelector('.card-title').textContent;
    const botaoComprar = cesta.querySelector('button');
    const disponivel = estoque[nome];

    if (!disponivel) {
      botaoComprar.textContent = 'ESGOTADO';
      botaoComprar.disabled = true;
      botaoComprar.classList.remove('btn-outline-primary');
      botaoComprar.classList.add('btn-secondary');
    } else {
      botaoComprar.textContent = 'Adicionar ao Carrinho';
      botaoComprar.disabled = false;
      botaoComprar.classList.add('btn-outline-primary');
      botaoComprar.classList.remove('btn-secondary');
    }
  });
}

function toggleModoAdmin() {
  const senha = prompt('Digite a senha de administrador:');
  if (senha === ADMIN_PASSWORD) {
    const cestas = document.querySelectorAll('.card');
    cestas.forEach(cesta => {
      const nome = cesta.querySelector('.card-title').textContent;
      const botaoComprar = cesta.querySelector('button');
      
      // Adiciona botão de toggle estoque
      if (!cesta.querySelector('.btn-toggle-estoque')) {
        const btnToggleEstoque = document.createElement('button');
        btnToggleEstoque.className = 'btn btn-sm btn-warning mt-2 btn-toggle-estoque';
        btnToggleEstoque.textContent = estoque[nome] ? 'Marcar Esgotado' : 'Marcar Disponível';
        btnToggleEstoque.onclick = () => toggleEstoque(nome, btnToggleEstoque);
        cesta.querySelector('.card-body').appendChild(btnToggleEstoque);
      }
    });
  } else {
    alert('Senha incorreta!');
  }
}

function toggleEstoque(nomeCesta, botaoToggle) {
  estoque[nomeCesta] = !estoque[nomeCesta];
  botaoToggle.textContent = estoque[nomeCesta] ? 'Marcar Esgotado' : 'Marcar Disponível';
  atualizarBotoesEstoque();
  salvarEstoque();
}

function adicionarAoCarrinho(botao) {
  const item = botao.closest('.card');
  const nome = item.querySelector('.card-title').textContent;
  
  // Verifica se está disponível antes de adicionar
  if (!estoque[nome]) {
    exibirNotificacao(`${nome} está esgotado!`);
    return;
  }
  
  const preco = parseFloat(item.querySelector('.fw-bold').textContent.replace('R$', '').replace(',', '.'));

  carrinho.push({ nome, preco });
  atualizarCarrinho();

  exibirNotificacao(`${nome} foi adicionado ao carrinho!`);
}

function atualizarCarrinho() {
  const lista = document.getElementById('itens-carrinho');
  const totalEl = document.getElementById('total');
  const linkWhatsApp = document.getElementById('whatsapp-link');

  lista.innerHTML = '';
  let total = 0;

  carrinho.forEach(item => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;

    // Botão remover
    const btnRemover = document.createElement('button');
    btnRemover.className = 'btn btn-sm btn-danger ms-2';
    btnRemover.innerHTML = '<i class="fas fa-trash"></i>';
    btnRemover.onclick = function() {
      removerDoCarrinho(item);
    };
    
    li.appendChild(btnRemover);
    lista.appendChild(li);
    total += item.preco;
  });

  totalEl.textContent = `Total: R$ ${total.toFixed(2)}`;

  const texto = encodeURIComponent(
    'Olá! Gostaria de comprar:\n' +
    carrinho.map(i => `- ${i.nome} (R$ ${i.preco})`).join('\n') +
    `\nTotal: R$ ${total.toFixed(2)}`
  );

  linkWhatsApp.href = `https://wa.me/47984810792?text=${texto}`;
}

function removerDoCarrinho(itemRemover) {
  const index = carrinho.indexOf(itemRemover);
  if (index > -1) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    exibirNotificacao(`${itemRemover.nome} removido do carrinho.`);
  }
}

function exibirNotificacao(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast-notificacao';
  toast.textContent = mensagem;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Inicializa o estoque quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  inicializarEstoque();
});
