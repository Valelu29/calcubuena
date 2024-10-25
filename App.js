import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import { create, all } from 'mathjs';

const math = create(all);

const { width } = Dimensions.get('window');

// Función para convertir grados a radianes
const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const App = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleInput = (value) => {
    setInput(input + value);
  };

  const calculateResult = () => {
    try {
      let modifiedInput = input
        .replace(/sin\((\d+)\)/g, (_, degrees) => `sin(${degreesToRadians(parseFloat(degrees))})`)
        .replace(/cos\((\d+)\)/g, (_, degrees) => `cos(${degreesToRadians(parseFloat(degrees))})`)
        .replace(/tan\((\d+)\)/g, (_, degrees) => `tan(${degreesToRadians(parseFloat(degrees))})`)
        .replace(/(\d+)%/g, (_, number) => `(${number} / 100)`);

      // Validación de raíces cuadradas negativas
      const sqrtMatches = modifiedInput.match(/sqrt\(([^)]+)\)/);
      if (sqrtMatches) {
        const numberInsideSqrt = parseFloat(sqrtMatches[1]);
        if (numberInsideSqrt < 0) {
          throw new Error('Raíz cuadrada de un número negativo');
        }
      }

      // Validación de división entre 0
      if (/\/0(?!\d)/.test(modifiedInput)) {  // Busca divisiones exactas entre 0
        throw new Error('División entre cero');
      }

      const evaluatedResult = math.evaluate(modifiedInput);
      setResult(evaluatedResult.toString());
    } catch (error) {
      console.error(error);

      // Manejo de errores con diferentes mensajes
      if (error.message === 'Raíz cuadrada de un número negativo') {
        setResult('Error: Raíz cuadrada de un número negativo No es un número');
      } else if (error.message === 'División entre cero') {
        setResult('Error: División entre cero Indeterminado');
      } else {
        setResult('Error'); // Otro error general
      }
    }
  };

  const clearInput = () => {
    setInput('');
    setResult('');
  };

  // Función para borrar el último carácter
  const deleteLastChar = () => {
    setInput(input.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Calculadora Científica</Text>
      <TextInput style={styles.input} value={input} placeholder="0" editable={false} />
      <Text style={styles.result}>{result}</Text>
      <View style={styles.buttonsContainer}>
        {[1, 2, 3, '+'].map((item, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handleInput(item.toString())}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}

        {[4, 5, 6, '-'].map((item, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handleInput(item.toString())}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}

        {[7, 8, 9, '*'].map((item, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handleInput(item.toString())}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}

        {['C', 'x', '%', '/'].map((op, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => op === 'C' ? clearInput() : op === 'x' ? deleteLastChar() : handleInput(op)}>
            <Text style={styles.buttonText}>{op}</Text>
          </TouchableOpacity>
        ))}

        {['sin', 'cos', 'tan', 'sqrt'].map((func, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handleInput(`${func}(`)}>
            <Text style={styles.buttonText}>{func}</Text>
          </TouchableOpacity>
        ))}

        {['log', 'e', 'π', '^'].map((func, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handleInput(func)}>
            <Text style={styles.buttonText}>{func}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={calculateResult}>
          <Text style={styles.buttonText}>=</Text>
        </TouchableOpacity>

        {['(', ')'].map((item, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handleInput(item.toString())}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}

        {[0].map((item, index) => (
          <TouchableOpacity key={index} style={styles.button} onPress={() => handleInput(item.toString())}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={() => handleInput('.')}>
          <Text style={styles.buttonText}>.</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#96c3eb',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    fontSize: 32,
    textAlign: 'right',
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 2,
  },
  result: {
    fontSize: 20,
    textAlign: 'right',
    marginBottom: 0,
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: (width - 50) / 4, // Ajusta para 4 columnas
    marginVertical: 10,
    marginHorizontal: 5,
    padding: 15, // Reducir padding para móviles
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18, // Tamaño de fuente reducido para móviles
    color: 'black',
  },
});

export default App;
