import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function MoneyExchangeScreen() {
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [originalCurrency, setOriginalCurrency] = useState("USD");
  const [convertedCurrency, setConvertedCurrency] = useState("EUR");
  const exchangeRate = 1.1; // Example: USD to EUR

  // Function to handle conversion
  const handleExchange = () => {
    const converted = parseFloat(amount) * exchangeRate;
    setConvertedAmount(isNaN(converted) ? "" : converted.toFixed(2));
  };

  // Debounce effect: runs only after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount) handleExchange();
    }, 300); // Waits for 500ms before executing

    return () => clearTimeout(timer); // Clear timeout if user types again
  }, [amount]);

  // List of currencies
  const currencies = [
    { label: "USD", value: "USD" },
    { label: "EUR", value: "EUR" },
    { label: "JPY", value: "JPY" },
    { label: "GBP", value: "GBP" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.originalCurrencyBox}>
        {/* Currency picker */}
        <Picker
          selectedValue={originalCurrency}
          onValueChange={(itemValue) => setOriginalCurrency(itemValue)}
          style={styles.picker}
        >
          {currencies.map((currency) => (
            <Picker.Item
              key={currency.value}
              label={currency.label}
              value={currency.value}
            />
          ))}
        </Picker>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder={`Enter amount in ${originalCurrency}`}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <Ionicons name="checkmark-circle" size={32} color="green" />
      <View style={styles.convertedCurrencyBox}>
        <Picker
          selectedValue={convertedCurrency}
          onValueChange={(itemValue) => setConvertedCurrency(itemValue)}
          style={styles.picker}
        >
          {currencies.map((currency) => (
            <Picker.Item
              key={currency.value}
              label={currency.label}
              value={currency.value}
            />
          ))}
        </Picker>
        {/* Result Display */}
        <Text style={styles.resultText}>
          {convertedAmount
            ? `${convertedAmount} ${convertedCurrency}`
            : "Converted amount in " + convertedCurrency}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  originalCurrencyBox: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "lightblue",
    padding: 10,
  },
  convertedCurrencyBox: {
    width: "100%",
    borderRadius: 20,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
  },
  input: {
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    textAlign: "right",
    fontSize: 16,
  },
  resultText: {
    fontSize: 16,
    textAlign: "right",
    margin: 10,
  },
});
