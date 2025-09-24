import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getBackendUrl } from '@shared/config';

export default function App() {
  const [status, setStatus] = useState('Cargando...');

  useEffect(() => {
    fetch(`${getBackendUrl()}/ping`)
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('Error de conexión'));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Estado del backend: {status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});