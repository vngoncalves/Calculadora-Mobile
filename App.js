import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Botao from './src/componentes/ComponenteBotoes';

export default function App() {
  const [visor, setVisor] = useState('0');

  // Lista de operadores para verificação rápida
  const operadores = ['+', '-', '*', '/'];

  const clicarBotao = (valor) => {
    let visorAtual = visor === 'Erro' ? '0' : visor;

    // Função interna para limpar a expressão antes de calcular
    const prepararExpressao = (exp) => {
      if (operadores.includes(exp.slice(-1)) || exp.slice(-1) === ',') {
        exp = exp.slice(0, -1);
      }
      return exp.replace(/,/g, '.');
    };

    if (valor === 'AC') {
      setVisor('0');
      return;
    } 
    
    if (valor === 'X') {
      if (visorAtual.length === 1) {
        setVisor('0');
      } else {
        setVisor(visorAtual.slice(0, -1));
      }
      return;
    }

    // --- LÓGICA DA PORCENTAGEM CORRIGIDA PARA CÁLCULOS REAIS ---
    if (valor === '%') {
      const partes = visorAtual.split(/([\+\-\*\/])/);
      let ultimoElemento = partes[partes.length - 1];

      // Só aplica se o último elemento for um número válido (não vazio e não operador)
      if (ultimoElemento !== '' && !operadores.includes(ultimoElemento)) {
        try {
          const numeroLimpo = ultimoElemento.replace(',', '.');
          const percentValue = parseFloat(numeroLimpo);
          let valorCalculado;

          if (partes.length >= 3) {
            const operador = partes[partes.length - 2];
            
            // Se for soma ou subtração, calcula a porcentagem relativa ao valor anterior
            if (operador === '+' || operador === '-') {
              const expressaoBase = partes.slice(0, partes.length - 2).join('').replace(/,/g, '.');
              const base = new Function(`return ${expressaoBase}`)();
              valorCalculado = (base * percentValue) / 100;
            } else {
              // Se for multiplicação ou divisão, calcula a porcentagem absoluta
              valorCalculado = percentValue / 100;
            }
          } else {
            // Se houver apenas um número na tela
            valorCalculado = percentValue / 100;
          }

          // Evita dízimas estranhas do JS (ex: 0.30000000004)
          valorCalculado = parseFloat(valorCalculado.toFixed(10));
          
          // Substitui o valor na expressão e atualiza o visor
          partes[partes.length - 1] = String(valorCalculado).replace('.', ',');
          setVisor(partes.join(''));
        } catch {
          setVisor('Erro');
        }
      }
      return;
    }

    // --- LÓGICA DO MAIS/MENOS AJUSTADA ---
    if (valor === '+/-') {
      const partes = visorAtual.split(/([\+\-\*\/])/);
      let ultimoElemento = partes[partes.length - 1];

      if (ultimoElemento !== '' && !operadores.includes(ultimoElemento)) {
        try {
          const numeroLimpo = ultimoElemento.replace(',', '.');
          const invertido = parseFloat(numeroLimpo) * -1;
          partes[partes.length - 1] = String(invertido).replace('.', ',');
          setVisor(partes.join(''));
        } catch {
          setVisor('Erro');
        }
      }
      return;
    }

    if (valor === '=') {
      try {
        const expressaoPronta = prepararExpressao(visorAtual);
        const resultadoBruto = new Function(`return ${expressaoPronta}`)();
        const resultadoLimpo = parseFloat(resultadoBruto.toFixed(10));
        setVisor(String(resultadoLimpo).replace(/\./g, ','));
      } catch {
        setVisor('Erro');
      }
      return;
    }

    // Lógica de digitação de operadores
    if (operadores.includes(valor)) {
      const ultimoCaracter = visorAtual.slice(-1);
      
      if (operadores.includes(ultimoCaracter)) {
        setVisor(visorAtual.slice(0, -1) + valor);
      } else if (ultimoCaracter === ',') {
        setVisor(visorAtual.slice(0, -1) + valor);
      } else {
        setVisor(visorAtual + valor);
      }
      return;
    }

    // Lógica de digitação da vírgula
    if (valor === ',') {
      const partes = visorAtual.split(/[\+\-\*\/]/);
      const numeroAtual = partes[partes.length - 1];
      
      if (!numeroAtual.includes(',')) {
        setVisor(visorAtual + valor);
      }
      return;
    }

    // Lógica de digitação de números
    if (visorAtual === '0') {
      setVisor(valor);
    } else {
      setVisor(visorAtual + valor);
    }
  };

  const formatarVisor = (texto) => {
    return texto
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/-/g, '−');
  };

  return (
    <View style={styles.container}>
      <View style={styles.calculadoraConteudo}>
        
        <View style={styles.visorContainer}>
          <Text style={styles.visorTexto} numberOfLines={1} adjustsFontSizeToFit>
            {formatarVisor(visor)}
          </Text>
        </View>

        <View style={styles.linha}>
          <Botao texto={{ fontSize: 35 }} style={styles.simbolos2} numero="⌫" onPress={() => clicarBotao('X')} />
          <Botao texto={{ fontSize: 30 }} style={styles.simbolos2} numero="AC" onPress={() => clicarBotao('AC')} />
          <Botao texto={{ fontSize: 35 }} style={styles.simbolos2} numero="%" onPress={() => clicarBotao('%')} />
          <Botao texto={{ fontSize: 45 }} style={styles.simbolos} numero="÷" onPress={() => clicarBotao('/')} />
        </View>

        <View style={styles.linha}>
          <Botao numero="7" onPress={() => clicarBotao('7')} />
          <Botao numero="8" onPress={() => clicarBotao('8')} />
          <Botao numero="9" onPress={() => clicarBotao('9')} />
          <Botao texto={{ fontSize: 45 }} style={styles.simbolos} numero="×" onPress={() => clicarBotao('*')} />
        </View>

        <View style={styles.linha}>
          <Botao numero="4" onPress={() => clicarBotao('4')} />
          <Botao numero="5" onPress={() => clicarBotao('5')} />
          <Botao numero="6" onPress={() => clicarBotao('6')} />
          <Botao texto={{ fontSize: 55 }} style={styles.simbolos} numero="−" onPress={() => clicarBotao('-')} />
        </View>

        <View style={styles.linha}>
          <Botao numero="1" onPress={() => clicarBotao('1')} />
          <Botao numero="2" onPress={() => clicarBotao('2')} />
          <Botao numero="3" onPress={() => clicarBotao('3')} />
          <Botao texto={{ fontSize: 45 }} style={styles.simbolos} numero="+" onPress={() => clicarBotao('+')} />
        </View>

        <View style={styles.linha}>
          <Botao texto={{ fontSize: 35 }} numero="±" onPress={() => clicarBotao('+/-')} />
          <Botao numero="0" onPress={() => clicarBotao('0')} />
          <Botao numero="," onPress={() => clicarBotao(',')} />
          <Botao texto={{ fontSize: 45 }} style={styles.simbolos} numero="=" onPress={() => clicarBotao('=')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculadoraConteudo: {
    width: 350, 
    alignItems: 'center',
  },
  visorContainer: {
    width: '100%', 
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-end', 
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  visorTexto: {
    color: 'white',
    fontSize: 70, 
    textAlign: 'right',
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  simbolos: {
    backgroundColor: 'orange',
  },
  simbolos2: {
    backgroundColor: '#979797',
  },
});