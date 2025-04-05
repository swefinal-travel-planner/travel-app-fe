import { create } from "zustand";

interface Theme {
  colors: {
    normal: string;
    subtle1: string;
    subtle2: string;
    background: string;
    surface: string;
    primary: string;
    primarySubtle: string;
    black: string;
    white: string;
    text: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: number;
      medium: number;
      large: number;
    };
    fontWeight: {
      regular: string;
      bold: string;
    };
  };
  layout: {
    borderRadius: {
      small: number;
      medium: number;
      large: number;
    };
    spacing: {
      small: number;
      medium: number;
      large: number;
    };
    shadow: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  toggleTheme: () => void;
  themeMode: "light" | "dark";
}

export const useThemeStore = create<Theme>((set, get) => ({
  themeMode: "light",
  colors: {
    normal: "#563d30",
    subtle1: "#a68372",
    subtle2: "#d3b7a8",
    background: "#e5dacb",
    surface: "#fcf4e8",
    primary: "#3f6453",
    primarySubtle: "#eef8ef",
    black: "#000000",
    white: "#FFFFFF",
    text: "#000000",
    border: "#DDDDDD",
  },
  typography: {
    fontFamily: "System",
    fontSize: {
      small: 14,
      medium: 16,
      large: 20,
    },
    fontWeight: {
      regular: "normal",
      bold: "bold",
    },
  },
  layout: {
    borderRadius: {
      small: 4,
      medium: 8,
      large: 16,
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },

  // Function to toggle between light and dark themes
  toggleTheme: () => {
    const currentTheme = get().themeMode;
    set({
      themeMode: currentTheme === "light" ? "dark" : "light",
      colors:
        currentTheme === "light"
          ? {
              normal: "#563d30",
              subtle1: "#a68372",
              subtle2: "#d3b7a8",
              background: "#e5dacb",
              surface: "#fcf4e8",
              primary: "#3f6453",
              primarySubtle: "#eef8ef",
              black: "#000000",
              white: "#FFFFFF",
              text: "#000000",
              border: "#DDDDDD",
            }
          : {
              normal: "#d1a185",
              subtle1: "#755e46",
              subtle2: "#5a3f29",
              background: "#2c1f14",
              surface: "#3a2a1b",
              primary: "#5c8e73",
              primarySubtle: "#3c5749",
              black: "#000000",
              white: "#FFFFFF",
              text: "#e0e0e0",
              border: "#444444",
            },
    });
  },
}));
