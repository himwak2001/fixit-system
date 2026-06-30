import { extendTheme } from "@chakra-ui/react";

const FONT_STACK =
  "'Inter', system-ui, -apple-system, BlinkMacSystemFont, " +
  "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const MONO_STACK =
  "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace";

const theme = extendTheme({
  fonts: {
    heading: FONT_STACK,
    body: FONT_STACK,
    mono: MONO_STACK,
  },

  colors: {
    brand: {
      50: "#FFF7E6",
      100: "#FFECC4",
      200: "#FFD580",
      300: "#FFC147",
      400: "#FFB01A",
      500: "#FF9900",
      600: "#E68A00",
      700: "#CC7A00",
      800: "#A36200",
      900: "#7A4900",
    },
    navy: {
      50: "#E8EDF5",
      100: "#C5D0E3",
      500: "#2E4075",
      600: "#1A2332",
      700: "#131B27",
      800: "#0F172A",
      900: "#080D12",
    },
  },

  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },

  styles: {
    global: {
      "html, body": {
        fontFamily: FONT_STACK,
        bg: "#F4F6F9",
        color: "#16213E",
        /*
          These two lines are what makes Inter look sharp
          on Mac/Windows instead of blurry/heavy
        */
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      /*
        Force form elements to use Inter too.
        Chakra overrides these but the base Chakra Input/Select
        components already inherit correctly.
        This targets any raw HTML form elements.
      */
      "input, button, textarea, select": {
        fontFamily: `${FONT_STACK} !important`,
      },
    },
  },

  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "8px",
        letterSpacing: "-0.01em",
        fontFamily: FONT_STACK,
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === "brand" ? "brand.500" : undefined,
          color: "white",
          _hover: {
            bg: props.colorScheme === "brand" ? "brand.600" : undefined,
            transform: "translateY(-1px)",
            boxShadow: "0 4px 14px rgba(255,153,0,0.30)",
          },
          _active: {
            bg: props.colorScheme === "brand" ? "brand.700" : undefined,
            transform: "translateY(0)",
          },
          transition: "all 0.15s ease",
        }),
        ghost: {
          _hover: { bg: "rgba(255,153,0,0.08)" },
        },
        outline: {
          borderColor: "gray.200",
          _hover: {
            borderColor: "brand.500",
            bg: "transparent",
          },
        },
      },
      defaultProps: { colorScheme: "brand" },
    },

    Badge: {
      baseStyle: {
        borderRadius: "6px",
        fontWeight: "600",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontSize: "10px",
        fontFamily: FONT_STACK,
      },
    },

    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "#E2E8F0",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: FONT_STACK,
            _focus: {
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px #FF9900",
            },
            _placeholder: { color: "gray.400" },
          },
        },
      },
      defaultProps: { variant: "outline" },
    },

    Select: {
      variants: {
        outline: {
          field: {
            borderColor: "#E2E8F0",
            borderRadius: "8px",
            fontSize: "14px",
            fontFamily: FONT_STACK,
            _focus: {
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px #FF9900",
            },
          },
        },
      },
      defaultProps: { variant: "outline" },
    },

    Textarea: {
      variants: {
        outline: {
          borderColor: "#E2E8F0",
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily: FONT_STACK,
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px #FF9900",
          },
          _placeholder: { color: "gray.400" },
        },
      },
      defaultProps: { variant: "outline" },
    },

    Heading: {
      baseStyle: {
        fontFamily: FONT_STACK,
        letterSpacing: "-0.02em",
      },
    },

    Text: {
      baseStyle: {
        fontFamily: FONT_STACK,
      },
    },

    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: "16px",
          fontFamily: FONT_STACK,
        },
      },
    },

    Menu: {
      baseStyle: {
        list: {
          borderRadius: "10px",
          border: "1px solid",
          borderColor: "gray.100",
          boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
          py: 1,
        },
        item: {
          fontSize: "14px",
          fontFamily: FONT_STACK,
          _hover: { bg: "gray.50" },
        },
      },
    },

    shadows: {
      card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
      cardHover: "0 4px 14px rgba(0,0,0,0.10)",
      sidebar: "2px 0 8px rgba(0,0,0,0.15)",
    },
  },
});

export default theme;
