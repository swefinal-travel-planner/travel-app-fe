import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function MoneyExchange() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const exchangeRate = 1.1; // Example: USD to EUR

  const handleExchange = () => {
    const converted = parseFloat(amount) * exchangeRate;
    setConvertedAmount(converted.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Exchange</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount in USD"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Convert to EUR" onPress={handleExchange} />
      {convertedAmount && (
        <Text style={styles.result}>Converted: €{convertedAmount}</Text>
      )}
      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  result: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
});
