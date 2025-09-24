import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getBackendUrl } from '@shared/config';

export default function HomeScreen() {
  const [status, setStatus] = useState('Cargando...');

  useEffect(() => {
    fetch(`${getBackendUrl()}/ping`)
      .then(res => res.ok ? res.json() : Promise.reject('Respuesta no válida'))
      .then(data => {
        if (data.status === 'ok') {
          setStatus('✅ Conectado al backend con éxito');
        } else {
          setStatus(`⚠️ Respuesta inesperada: ${JSON.stringify(data)}`);
        }
      })
      .catch((err) => {
        console.error('Error al conectar con el backend:', err);
        setStatus('❌ Error de conexión');
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Estado del backend:</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  status: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
});