function animateProgressBar() {
  const progressBar = document.querySelector('.progress');
  progressBar.style.width = '75%';
}

function getRandomIndex(max) {
  const crypto = window.crypto || window.msCrypto;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  return array[0] % max;
}

function getSplashScreenQuote() {
  const quotes = [
    {
      author: 'Nelson Mandela',
      quote: '"A educação é a arma mais poderosa que você pode usar para mudar o mundo."',
    },
    {
      author: 'Vidal Sassoon',
      quote: '"O único lugar onde o sucesso vem antes do trabalho é no dicionário."',
    },
    {
      author: 'Albert Einstein',
      quote: '"A criatividade é a inteligência se divertindo."',
    },
    {
      author: 'Paulo Freire',
      quote: '"Educação não transforma o mundo. Educação muda pessoas. Pessoas transformam o mundo."',
    },
    {
      author: 'Eleanor Roosevelt',
      quote: '"O futuro pertence àqueles que acreditam na beleza de seus sonhos."',
    },
    {
      author: 'C.S. Lewis',
      quote: '"Nunca se é velho demais para estabelecer um novo objetivo ou sonhar um novo sonho."',
    },
    {
      author: 'Provérbio Chinês',
      quote: '"O aprendizado é um tesouro que seguirá seu dono em qualquer lugar."',
    },
    {
      author: 'Albert Einstein',
      quote: '"A mente que se abre a uma nova ideia jamais voltará ao seu tamanho original."',
    },
    {
      author: 'Oprah Winfrey',
      quote: '"A educação é a chave para desbloquear o mundo, um passaporte para a liberdade."',
    },
    {
      author: 'Scott Adams',
      quote: '"A criatividade é permitir a si mesmo cometer erros. A arte é saber quais manter."',
    },
  ];

  const randomIndex = getRandomIndex(quotes.length);
  const randomPhrase = quotes[randomIndex];

  document.getElementById('quote').textContent = randomPhrase.quote;
  document.getElementById('author').innerHTML = `&mdash; ${randomPhrase.author}`;
}

animateProgressBar();
getSplashScreenQuote();
