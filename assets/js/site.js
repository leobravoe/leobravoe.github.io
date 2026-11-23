// Scripts do site. Carregado com defer, depois do jQuery e do Bootstrap.
// Tooltips, modal da imagem ampliada e o interruptor de tema claro/escuro.
$(document).ready(function () {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Click to show images on Modal
    // A galeria do modal e a lista de imagens do carrossel em que se clicou,
    // para dar para avancar e voltar sem fechar o modal.
    let galeria = [];
    let atual = 0;
    let carrosselAberto = null;

    // mantem o carrossel na mesma imagem do modal, para o modal fechar
    // exatamente onde o visitante parou.
    // Chamar .to() durante uma troca de slide enfileira a chamada no
    // Bootstrap, e cliques rapidos acabam em indices trocados. Entao aqui
    // so uma troca corre por vez: ao terminar, mira de novo no indice
    // atual, que a essa altura ja e o ultimo pedido.
    let trocandoSlide = false;

    function sincronizaCarrossel() {
        if (!carrosselAberto || trocandoSlide) return;
        const itens = carrosselAberto.querySelectorAll('.carousel-item');
        const ativo = [...itens].findIndex(e => e.classList.contains('active'));
        if (ativo === atual) return;
        trocandoSlide = true;
        carrosselAberto.addEventListener('slid.bs.carousel', function () {
            trocandoSlide = false;
            sincronizaCarrossel();
        }, { once: true });
        bootstrap.Carousel.getOrCreateInstance(carrosselAberto).to(atual);
    }

    // Troca de imagem com o mesmo deslizar do carrossel: duas imagens
    // empilhadas, a que entra vem do lado para onde se esta indo e a que
    // sai vai para o lado oposto. A duracao acompanha o .6s do Bootstrap.
    const DURACAO = 600;
    let frente = document.getElementById('modalImage').parentElement;
    let fundo = document.getElementById('modalImageB').parentElement;
    let mostrando = -1;
    let direcao = 1;
    let animando = false;

    function posiciona(el, lado, comTransicao) {
        el.classList.toggle('desliza', !!comTransicao);
        el.style.transform = 'translateX(' + (lado * 100) + '%)';
    }

    function animaModal() {
        if (animando || mostrando === atual || !galeria.length) return;
        const alvo = atual;

        if (mostrando < 0) {
            // abrindo o modal: entra direto, sem deslizar
            frente.firstElementChild.src = galeria[alvo];
            frente.classList.add('ativa');
            fundo.classList.remove('ativa');
            posiciona(frente, 0, false);
            posiciona(fundo, 1, false);
            mostrando = alvo;
            return;
        }

        animando = true;
        fundo.firstElementChild.src = galeria[alvo];
        posiciona(fundo, direcao, false);
        void fundo.offsetWidth; // aplica a posicao inicial antes de animar
        posiciona(frente, -direcao, true);
        posiciona(fundo, 0, true);
        frente.classList.remove('ativa');
        fundo.classList.add('ativa');

        setTimeout(function () {
            const t = frente;
            frente = fundo;
            fundo = t;
            fundo.classList.remove('desliza');
            animando = false;
            mostrando = alvo;
            animaModal(); // alcanca o alvo se ele mudou no meio do caminho
        }, DURACAO);
    }

    function mostraNoModal(indice, lado) {
        if (!galeria.length) return;
        atual = (indice + galeria.length) % galeria.length;
        if (lado) direcao = lado;
        sincronizaCarrossel();
        animaModal();
    }

    $('.carousel-item img').on('click', function () {
        const carrossel = $(this).closest('.carousel');
        carrosselAberto = carrossel.length ? carrossel[0] : null;
        const imagens = carrossel.length ? carrossel.find('.carousel-item img') : $(this);
        galeria = imagens.map((i, el) => $(el).attr('src')).get();
        $('#modalPrev, #modalNext').toggleClass('d-none', galeria.length < 2);
        mostraNoModal(imagens.index(this));
        $('#imageModal').modal('show');
    });

    // cliques rapidos podem deixar uma troca de slide pela metade; ao fechar,
    // garante que o carrossel esta na imagem que estava no modal
    $('#imageModal').on('hidden.bs.modal', function () {
        sincronizaCarrossel();
        mostrando = -1;
    });

    $('#modalPrev, #modalNext').on('click', function () {
        const lado = this.id === 'modalNext' ? 1 : -1;
        mostraNoModal(atual + lado, lado);
    });

    // clicar em qualquer lugar do modal fecha, menos nos botoes de navegacao
    $('#imageModal').on('click', function (e) {
        if ($(e.target).closest('#modalPrev, #modalNext').length) return;
        $(this).modal('hide');
    });

    $(document).on('keydown', function (e) {
        if (galeria.length < 2 || !$('#imageModal').hasClass('show')) return;
        if (e.key === 'ArrowRight') mostraNoModal(atual + 1, 1);
        if (e.key === 'ArrowLeft') mostraNoModal(atual - 1, -1);
    });
});
// Botão light e dark mode
(function () {
    const root = document.documentElement;
    const sw = document.getElementById('themeSwitch');
    const sun = document.getElementById('iconSun');
    const moon = document.getElementById('iconMoon');

    function paint(theme) {
        const isLight = theme === 'light';

        // switch amarelo quando light
        sw.classList.toggle('bg-warning', isLight);
        sw.classList.toggle('border-warning', isLight);

        // switch amarelo quando dark
        sw.classList.toggle('bg-secondary', !isLight);
        sw.classList.toggle('border-secondary', !isLight);

        // feedback nos ícones (opcional, mas fica bonito)
        sun.classList.toggle('text-warning', isLight);
        moon.classList.toggle('opacity-50', isLight);
        sun.classList.toggle('opacity-50', !isLight);
        moon.classList.toggle('text-info', !isLight);
    }

    function setTheme(theme) {
        root.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        // aqui definimos: checked = LIGHT
        sw.checked = (theme === 'light');
        paint(theme);
    }

    // inicializa de acordo com o tema atual
    setTheme(root.getAttribute('data-bs-theme') || 'light');

    // alterna: checked = light, unchecked = dark
    sw.addEventListener('change', () => setTheme(sw.checked ? 'light' : 'dark'));
})();
