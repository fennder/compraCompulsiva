const Analytics = {
            logs: [],
            startTime: Date.now(),
            
            init() {
                this.log("Sessão iniciada anonimamente.");
                this.bindEvents();
                this.trackScroll();
                this.startCountdown();
                this.socialProofCycle();
                
                // Exibe logs
                document.getElementById('log-content').innerHTML = `<div>[0.0s] Aguardando interações...</div>`;
            },

            log(msg) {
                const time = ((Date.now() - this.startTime) / 1000).toFixed(1);
                const entry = `[${time}s] ${msg}`;
                this.logs.unshift(entry);
                const container = document.getElementById('log-content');
                if (container) {
                    container.innerHTML = this.logs.slice(0, 10).map(l => `<div class="mb-1">${l}</div>`).join('');
                }
            },

            bindEvents() {
                document.querySelectorAll('[data-track]').forEach(el => {
                    el.addEventListener('click', () => this.log(`Clique: ${el.getAttribute('data-track')}`));
                });

                document.querySelectorAll('section').forEach(section => {
                    const observer = new IntersectionObserver(entries => {
                        if (entries[0].isIntersecting) this.log(`Foco: ${section.id || 'Início'}`);
                    }, { threshold: 0.5 });
                    observer.observe(section);
                });
            },

            trackScroll() {
                let thresholds = [25, 50, 75, 100];
                window.addEventListener('scroll', () => {
                    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
                    if (thresholds.includes(scrollPercent)) {
                        this.log(`Leitura: ${scrollPercent}% concluída`);
                        thresholds = thresholds.filter(t => t !== scrollPercent);
                    }
                });
            },

            startCountdown() {
                let time = 597; // 9:57 em segundos
                const display = document.getElementById('countdown');
                setInterval(() => {
                    let minutes = Math.floor(time / 60);
                    let seconds = time % 60;
                    display.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    if (time > 0) time--;
                }, 1000);
            },

            socialProofCycle() {
                const names = [
                    {n: "Ana Silva", i: "AS"},
                    {n: "Carlos Mendonça", i: "CM"},
                    {n: "Beatriz Santos", i: "BS"},
                    {n: "Marcos Oliveira", i: "MO"}
                ];
                let idx = 0;
                const pop = document.getElementById('social-proof-pop');
                
                setInterval(() => {
                    const person = names[idx];
                    document.getElementById('sp-name').innerText = person.n;
                    document.getElementById('sp-initials').innerText = person.i;
                    
                    pop.classList.remove('opacity-0', 'translate-y-10');
                    setTimeout(() => {
                        pop.classList.add('opacity-0', 'translate-y-10');
                    }, 4000);
                    
                    idx = (idx + 1) % names.length;
                    this.log(`Interesse: Novo aluno inscrito.`);
                }, 12000);
            }
        };

        function redirectToKiwify(url) {
            Analytics.log("Preparando Checkout Seguro...");
            setTimeout(() => window.location.href = url, 800);
        }

        document.addEventListener('DOMContentLoaded', () => Analytics.init());