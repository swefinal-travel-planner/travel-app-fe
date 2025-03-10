import { APIgetCurrencies } from "@/api/tools/APIcurrency";
import CurrencySelection from "@/components/CurrencySelection";
import Currencies from "@/constants/currencies";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
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
    }, 700);

    return () => clearTimeout(timer);
  }, [amount, originalCurrency]);

  // Function to swap currencies
  const swapCurrencies = () => {
    setOriginalCurrency(convertedCurrency);
    setConvertedCurrency(originalCurrency);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.originalCurrencyBox}>
        <CurrencySelection
          onSelect={(currency) => setOriginalCurrency(currency)}
          initial={originalCurrency}
        />

        {/* Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
      </SafeAreaView>

      {/* Swap Button */}
      <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
        <Text style={styles.swapText}>⇅</Text>
      </TouchableOpacity>

      <SafeAreaView style={styles.convertedCurrencyBox}>
        <CurrencySelection
          onSelect={(currency) => setConvertedCurrency(currency)}
          initial={convertedCurrency}
        />
        {/* Result Display */}
        <Text style={styles.resultText}>
          {convertedAmount ? `${convertedAmount}` : `0`}
        </Text>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  originalCurrencyBox: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "white",
  },
  convertedCurrencyBox: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    margin: 10,
  },
  input: {
    height: 50,
    fontSize: 25,
    width: "100%",
    textAlign: "center",
    color: "#563d30",
  },
  resultText: {
    color: "#563d30",
    height: 50,
    fontSize: 25,
    textAlign: "center",
  },
  swapButton: {
    backgroundColor: "#007bff",
    borderRadius: 100,
  },
  swapText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});
