import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.statusCard}>
        <Text style={styles.title}>🚀 Estado del Backend</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.status}>{status}</Text>
        </View>
        
        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📡 Configuración:</Text>
          <Text style={styles.infoText}>URL: {getBackendUrl()}</Text>
          <Text style={styles.infoText}>Endpoint: /ping</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    maxWidth: 350,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  status: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  infoContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});