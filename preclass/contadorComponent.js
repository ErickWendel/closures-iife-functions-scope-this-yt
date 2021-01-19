// Immediately Invoked Function Expression ou IFFE
// também é uma closure
// encapsulamos todo o nosso código em uma funçao e expomos somente via window, para
// nao ter variavel global perdida

(() => {
    const BTN_REINICIAR = 'btnReiniciar'
    const ID_CONTADOR = 'contador'
    const VALOR_CONTADOR = 100
    const PERIODO_INTERVALO = 10

    class ContadorComponent {
        constructor() {
            this.iniciar()
        }

        atualizarTexto = ({ elementoContador, contador }) => () => {
            const identificadorNoTexto = "$$contador"
            const textoPadrao = `Começando em <strong>${identificadorNoTexto}</strong> segundos...`
            elementoContador.innerHTML = textoPadrao.replace(identificadorNoTexto, contador.valor--)
        }

        agendarParadaContador({ elementoContador, idDoIntervalo }) {
            return () => {
                clearInterval(idDoIntervalo)
                // deixamos sem texto
                elementoContador.innerHTML = ""
                this.desabilitarBotao(false)
            }
        }

        prepararBotao(elementoBotao, iniciarFn) {
            elementoBotao.addEventListener('click', iniciarFn.bind(this))

            return (valor = true) => {
                const atributo = 'disabled'

                if (valor) {
                    elementoBotao.setAttribute(atributo, valor)
                    return;
                }

                elementoBotao.removeAttribute(atributo)

            }
        }

        prepararContadorProxy() {
            const handler = {
                set: (currentContext, propertyKey, newValue) => {
                    console.log(currentContext, propertyKey, newValue)

                    if (!currentContext.valor) {
                        currentContext.efetuarParada()
                    }

                    currentContext[propertyKey] = newValue
                    return true
                },
            }

            const contador = new Proxy({
                valor: VALOR_CONTADOR,
                efetuarParada: () => { },
            }, handler)

            return contador
        }

        iniciar() {
            console.log('iniciou!')
            // 1o
            const executarEmCada = PERIODO_INTERVALO
            const elementoContador = document.getElementById(ID_CONTADOR)

            const contador = this.prepararContadorProxy()
            const argumentos = { elementoContador, contador }

            const fn = this.atualizarTexto(argumentos)
            const idDoIntervalo = setInterval(fn, executarEmCada)


            {
                // 3o
                const elementoBotao = document.getElementById(BTN_REINICIAR)
                const desabilitarBotao = this.prepararBotao(elementoBotao, this.iniciar)
                desabilitarBotao()

                // 2o
                // const desabilitarBotao = () => { console.log('parou!') }

                const argumentos = { elementoContador, idDoIntervalo }
                const pararContadorFn = this.agendarParadaContador.apply({ desabilitarBotao }, [argumentos])
                contador.efetuarParada = pararContadorFn
            }
        }

    }

    window.ContadorComponent = ContadorComponent
})()
