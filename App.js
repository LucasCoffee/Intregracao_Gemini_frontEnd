import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Troque pelo IP do seu computador na rede (ipconfig no Windows).
// O celular e o computador precisam estar no mesmo Wi-Fi.
const API_URL = 'http://localhost:5050/';

export default function App() {
  const [assunto, setAssunto] = useState('');
  const [texto, setTexto] = useState('');
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    setErro('');
    setResposta('');

    if (!assunto.trim() || !texto.trim()) {
      setErro('Preencha o assunto e o texto antes de enviar.');
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assunto, texto }),
      });

      const dados = await res.json();

      if (!res.ok) {
        setErro(dados.mensagem || dados.error || 'Algo deu errado. Tente de novo.');
        return;
      }

      setResposta(dados.resposta);
    } catch {
      setErro('Não foi possível falar com o servidor. Tente mais tarde.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.titulo}>Simplificador</Text>
        <Text style={styles.intro}>
          Informe o assunto, cole o texto que você quer analisar e toque em
          enviar. A resposta aparece logo abaixo.
        </Text>

        <View style={styles.cartao}>
          <Text style={styles.rotulo}>Assunto</Text>
          <TextInput
            style={styles.campo}
            placeholder="Sobre o que é o texto?"
            placeholderTextColor="#8a95a8"
            value={assunto}
            onChangeText={setAssunto}
          />

          <Text style={styles.rotulo}>Texto</Text>
          <TextInput
            style={[styles.campo, styles.campoGrande]}
            placeholder="Cole ou escreva o texto aqui"
            placeholderTextColor="#8a95a8"
            value={texto}
            onChangeText={setTexto}
            multiline
            numberOfLines={6}
          />

          <Pressable
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={enviar}
            disabled={carregando}
          >
            <Text style={styles.botaoTexto}>
              {carregando ? 'Analisando...' : 'Enviar'}
            </Text>
          </Pressable>

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}
        </View>

        <View style={styles.cartao}>
          <Text style={styles.tituloResposta}>Resposta</Text>
          {resposta ? (
            <Text style={styles.respostaTexto}>{resposta}</Text>
          ) : (
            <Text style={styles.vazio}>O resultado vai aparecer aqui.</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#e9eef5',
  },
  conteudo: {
    paddingTop: 64,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '700',
    color: '#14213d',
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: '#55627a',
  },
  cartao: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cfd8e6',
    borderRadius: 24,
    padding: 20,
    gap: 8,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14213d',
  },
  campo: {
    fontSize: 16,
    color: '#14213d',
    backgroundColor: '#e9eef5',
    borderWidth: 1,
    borderColor: '#cfd8e6',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  campoGrande: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: '#2f4bff',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  erro: {
    color: '#b3261e',
    fontSize: 14,
    marginTop: 4,
  },
  tituloResposta: {
    fontSize: 17,
    fontWeight: '700',
    color: '#14213d',
  },
  respostaTexto: {
    fontSize: 16,
    lineHeight: 24,
    color: '#14213d',
  },
  vazio: {
    fontSize: 15,
    color: '#55627a',
  },
});