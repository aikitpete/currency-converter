import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { convert, currencyCodes, formatAmount, parseAmount } from './src/rates';
import { loadRates } from './src/ratesService';

export default function App() {
  const [data, setData] = useState(null);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amountText, setAmountText] = useState('1');
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('USD');
  const appState = useRef(AppState.currentState);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await loadRates({ storage: AsyncStorage });
      setData(result.data);
      setSource(result.source);
      setError(null);
      setFrom((current) => (result.data.rates[current] ? current : result.data.base));
      setTo((current) => (result.data.rates[current] ? current : Object.keys(result.data.rates)[1]));
    } catch (loadError) {
      setError('Could not load exchange rates. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', (next) => {
      if (/inactive|background/.test(appState.current) && next === 'active') {
        refresh();
      }
      appState.current = next;
    });
    return () => subscription.remove();
  }, [refresh]);

  const codes = useMemo(() => (data ? currencyCodes(data) : []), [data]);
  const amount = parseAmount(amountText);
  const result = data ? convert(data, from, to, amount) : null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.title}>Currency Converter</Text>

        {loading && !data && <ActivityIndicator size="large" style={styles.spinner} />}

        {error && !data && (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
            <Pressable accessibilityRole="button" onPress={refresh} style={styles.button}>
              <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {data && (
          <View style={styles.card}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amountText}
              onChangeText={setAmountText}
              keyboardType="decimal-pad"
              accessibilityLabel="Amount"
            />

            <Text style={styles.label}>From</Text>
            <Picker selectedValue={from} onValueChange={setFrom} accessibilityLabel="From currency">
              {codes.map((code) => <Picker.Item key={code} label={code} value={code} />)}
            </Picker>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Swap currencies"
              onPress={() => { setFrom(to); setTo(from); }}
              style={styles.swap}
            >
              <Text style={styles.swapText}>⇅ Swap</Text>
            </Pressable>

            <Text style={styles.label}>To</Text>
            <Picker selectedValue={to} onValueChange={setTo} accessibilityLabel="To currency">
              {codes.map((code) => <Picker.Item key={code} label={code} value={code} />)}
            </Picker>

            <Text style={styles.result} accessibilityLiveRegion="polite">
              {result === null ? '–' : `${formatAmount(result)} ${to}`}
            </Text>
            <Text style={styles.status}>
              {source === 'cached' ? 'Offline: showing saved rates' : 'Live rates'}
              {data.date ? ` from ${data.date}` : ''} (ECB reference rates)
            </Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: '700', marginVertical: 16 },
  spinner: { marginTop: 48 },
  center: { alignItems: 'center', marginTop: 48, gap: 16 },
  error: { textAlign: 'center', color: '#b3261e' },
  card: { gap: 4 },
  label: { marginTop: 12, color: '#5b6573', fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#d8dde4', borderRadius: 8, padding: 12, fontSize: 20 },
  swap: { alignSelf: 'center', padding: 8 },
  swapText: { color: '#0b6bcb', fontSize: 16 },
  result: { marginTop: 24, fontSize: 32, fontWeight: '700', textAlign: 'center' },
  status: { marginTop: 8, textAlign: 'center', color: '#5b6573', fontSize: 12 },
  button: { backgroundColor: '#0b6bcb', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 28 },
  buttonText: { color: '#fff', fontSize: 18 },
});
