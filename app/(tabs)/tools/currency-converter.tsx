import { APIgetCurrencies } from "@/api/tools/APIcurrency";
import CurrencySelection from "@/components/CurrencySelection";
import Currencies from "@/constants/currencies";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [originalCurrency, setOriginalCurrency] = useState(Currencies[0]);
  const [convertedCurrency, setConvertedCurrency] = useState(Currencies[32]);
  const [exchangeRate, setExchangeRate] = useState(0);

  // Function to handle conversion
  const handleExchange = async () => {
    try {
      const rate = await APIgetCurrencies(
        originalCurrency.abbreviation.toLowerCase(),
        convertedCurrency.abbreviation.toLowerCase(),
      );

      if (rate) {
        setExchangeRate(rate);
        if (amount) {
          setConvertedAmount((parseFloat(amount) * exchangeRate).toFixed(2));
        } else {
          setConvertedAmount("0");
        }
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  // Debounce effect: runs only after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount) handleExchange();
    }, 600);

    return () => clearTimeout(timer);
  }, [amount, originalCurrency]);

  // Function to swap currencies
  const swapCurrencies = () => {
    setOriginalCurrency(convertedCurrency);
    setConvertedCurrency(originalCurrency);
    setAmount(convertedAmount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.originalCurrencyBox}>
        <CurrencySelection
          onSelect={(currency) => setOriginalCurrency(currency)}
          initial={originalCurrency}
        />

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Insert amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </SafeAreaView>

      {/* Swap Button */}
      <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
        <Ionicons name="swap-vertical" size={20} color="#563d30" />
      </TouchableOpacity>

      <SafeAreaView style={styles.convertedCurrencyBox}>
        <CurrencySelection
          onSelect={(currency) => setConvertedCurrency(currency)}
          initial={convertedCurrency}
        />
        {/* Result Display */}
        <Text style={styles.resultText}>
          {convertedAmount ? `${convertedAmount}` : "Converted amount"}
        </Text>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  originalCurrencyBox: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "white",
    marginBottom: 20,
  },
  convertedCurrencyBox: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
  },
  input: {
    height: 50,
    fontSize: 25,
    width: "100%",
    textAlign: "center",
    color: "#563d30",
    paddingTop: 10,
    marginBottom: 30,
  },
  resultText: {
    color: "#563d30",
    height: 50,
    fontSize: 25,
    textAlign: "center",
    marginVertical: 10,
  },
  swapButton: {
    backgroundColor: "#e5dacb",
    borderRadius: 100,
    padding: 20,
    position: "absolute",
    top: 120,
    zIndex: 1,
  },
  swapText: {
    fontSize: 24,
    paddingHorizontal: 8,
    color: "white",
    fontWeight: "bold",
  },
});
