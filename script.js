const carrinho = [];
const ADMIN_PASSWORD = 'qedesobsh@000192';

function adicionarAoCarrinho(botao) {
  const item = botao.closest('.card');
  const nome = item.querySelector('.card-title').textContent;
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
