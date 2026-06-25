import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function ComponentesBotoes({ numero, style, texto, onPress }) {
  return (
    <TouchableOpacity style={[styles.botao, style]} onPress={onPress}>
      {/* A ordem do array de estilos é importante para a prop 'texto' sobrescrever o fontSize padrão */}
      <Text style={[styles.texto, texto]}>
        {numero}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    margin: 3.5,
    backgroundColor: '#505050',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
  },
  texto: {
    color: 'white',
    fontSize: 33,
  },
});