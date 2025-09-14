import { createTheme } from '@mui/material/styles';

// Create theme function that adapts to current CSS variables
export const createCustomTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#22c55e", // Green color
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            backgroundColor: "hsl(var(--muted)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "hsl(var(--border))",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "hsl(var(--border))",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "hsl(var(--primary))",
              borderWidth: "2px",
            },
          },
          input: {
            color: "hsl(var(--foreground)) !important",
            fontSize: "18px",
            fontWeight: "600",
            textAlign: "center",
            padding: "16px",
            "&::placeholder": {
              color: "hsl(var(--muted-foreground)) !important",
              opacity: "1 !important",
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: "hsl(var(--foreground)) !important",
          },
          input: {
            color: "hsl(var(--foreground)) !important",
            "&::placeholder": {
              color: "hsl(var(--muted-foreground)) !important",
              opacity: "1 !important",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-input": {
              color: "hsl(var(--foreground)) !important",
            },
            "& .MuiFormLabel-root": {
              color: "hsl(var(--muted-foreground)) !important",
            },
            "& .MuiFormLabel-root.Mui-focused": {
              color: "hsl(var(--primary)) !important",
            },
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            "& .MuiSvgIcon-root": {
              color: "hsl(var(--foreground)) !important",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "#374151 !important", // Solid gray background
            backdropFilter: "none !important",
            border: "2px solid hsl(var(--border))",
            borderRadius: "16px !important",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1) !important",
            color: "white !important",
            opacity: "1 !important",
          },
        },
      },
      MuiClock: {
        styleOverrides: {
          root: {
            backgroundColor: "hsl(var(--popover)) !important",
          },
          clock: {
            backgroundColor: "transparent !important",
          },
        },
      },
      MuiClockNumber: {
        styleOverrides: {
          root: {
            color: "hsl(var(--foreground)) !important",
            "&.Mui-selected": {
              backgroundColor: "hsl(var(--primary)) !important",
              color: "hsl(var(--primary-foreground)) !important",
            },
          },
        },
      },
      MuiClockPointer: {
        styleOverrides: {
          root: {
            backgroundColor: "hsl(var(--primary)) !important",
          },
          thumb: {
            backgroundColor: "hsl(var(--primary)) !important",
            borderColor: "hsl(var(--primary)) !important",
          },
        },
      },
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: "hsl(var(--muted)) !important",
            color: "hsl(var(--foreground)) !important",
          },
        },
      },
      MuiPickersToolbarText: {
        styleOverrides: {
          root: {
            color: "hsl(var(--foreground)) !important",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "hsl(var(--foreground)) !important",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "hsl(var(--foreground)) !important",
          },
        },
      },
      MuiPickersPopper: {
        styleOverrides: {
          root: {
            zIndex: 9999,
            "& .MuiPaper-root": {
              backgroundColor: "#374151 !important", // Solid gray background
              backdropFilter: "none !important",
              border: "2px solid hsl(var(--border))",
              borderRadius: "16px !important",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1) !important",
              maxHeight: "400px",
              overflow: "auto",
              scrollBehavior: "smooth",
            },
          },
        },
      },
      MuiPickersLayout: {
        styleOverrides: {
          root: {
            backgroundColor: "#374151 !important", // Solid gray background
            backdropFilter: "none !important",
            "& .MuiPickersLayout-contentWrapper": {
              backgroundColor: "#374151 !important", // Solid gray background
            },
          },
        },
      },
      MuiMultiSectionDigitalClock: {
        styleOverrides: {
          root: {
            backgroundColor: "#374151 !important", // Solid gray background
            "& .MuiMultiSectionDigitalClockSection-root": {
              backgroundColor: "#374151 !important", // Solid gray background
              maxHeight: "300px",
              overflowY: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#4B5563", // Darker gray for scrollbar track
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "hsl(var(--primary))",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "hsl(var(--primary))",
                },
              },
            },
            "& .MuiMultiSectionDigitalClockSection-item": {
              backgroundColor: "transparent !important",
              color: "white !important", // White text for hours, minutes, seconds
              fontWeight: "600 !important",
              fontSize: "16px !important",
              padding: "12px 16px !important",
              margin: "2px 8px !important",
              borderRadius: "8px !important",
              transition: "all 0.2s ease !important",
              "&:hover": {
                backgroundColor: "#4B5563 !important", // Darker gray on hover
                color: "white !important",
                fontWeight: "700 !important",
              },
              "&.Mui-selected": {
                backgroundColor: "hsl(var(--primary)) !important",
                color: "white !important", // White text for selected item
                fontWeight: "700 !important",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15) !important",
              },
            },
          },
        },
      },
      MuiDigitalClock: {
        styleOverrides: {
          root: {
            backgroundColor: "#374151 !important", // Solid gray background
            maxHeight: "300px",
            overflowY: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#4B5563", // Darker gray for scrollbar track
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "hsl(var(--primary))",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "hsl(var(--primary))",
              },
            },
          },
          list: {
            backgroundColor: "#374151 !important", // Solid gray background
          },
          item: {
            backgroundColor: "transparent !important",
            color: "white !important", // White text for hours, minutes, seconds
            fontWeight: "600 !important",
            fontSize: "16px !important",
            padding: "12px 16px !important",
            margin: "2px 8px !important",
            borderRadius: "8px !important",
            transition: "all 0.2s ease !important",
            "&:hover": {
              backgroundColor: "#4B5563 !important", // Darker gray on hover
              color: "white !important",
              fontWeight: "700 !important",
            },
            "&.Mui-selected": {
              backgroundColor: "hsl(var(--primary)) !important",
              color: "white !important", // White text for selected item
              fontWeight: "700 !important",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15) !important",
            },
          },
        },
      },
    },
  });
};
