import { createTheme } from '@mui/material/styles';

// Create theme function that adapts to current CSS variables
export const createCustomTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#8b5cf6', // Purple color
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backgroundColor: 'hsl(var(--muted)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(var(--border))',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(var(--border))',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'hsl(var(--primary))',
              borderWidth: '2px',
            },
          },
          input: {
            color: 'hsl(var(--foreground)) !important',
            fontSize: '18px',
            fontWeight: '600',
            textAlign: 'center',
            padding: '16px',
            '&::placeholder': {
              color: 'hsl(var(--muted-foreground)) !important',
              opacity: '1 !important',
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: 'hsl(var(--foreground)) !important',
          },
          input: {
            color: 'hsl(var(--foreground)) !important',
            '&::placeholder': {
              color: 'hsl(var(--muted-foreground)) !important',
              opacity: '1 !important',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-input': {
              color: 'hsl(var(--foreground)) !important',
            },
            '& .MuiFormLabel-root': {
              color: 'hsl(var(--muted-foreground)) !important',
            },
            '& .MuiFormLabel-root.Mui-focused': {
              color: 'hsl(var(--primary)) !important',
            },
          },
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: {
            '& .MuiSvgIcon-root': {
              color: 'hsl(var(--foreground)) !important',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: 'hsl(var(--popover)) !important',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            color: 'hsl(var(--foreground)) !important',
          },
        },
      },
      MuiClock: {
        styleOverrides: {
          root: {
            backgroundColor: 'hsl(var(--popover)) !important',
          },
          clock: {
            backgroundColor: 'transparent !important',
          },
        },
      },
      MuiClockNumber: {
        styleOverrides: {
          root: {
            color: 'hsl(var(--foreground)) !important',
            '&.Mui-selected': {
              backgroundColor: 'hsl(var(--primary)) !important',
              color: 'hsl(var(--primary-foreground)) !important',
            },
          },
        },
      },
      MuiClockPointer: {
        styleOverrides: {
          root: {
            backgroundColor: 'hsl(var(--primary)) !important',
          },
          thumb: {
            backgroundColor: 'hsl(var(--primary)) !important',
            borderColor: 'hsl(var(--primary)) !important',
          },
        },
      },
      MuiPickersToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: 'hsl(var(--muted)) !important',
            color: 'hsl(var(--foreground)) !important',
          },
        },
      },
      MuiPickersToolbarText: {
        styleOverrides: {
          root: {
            color: 'hsl(var(--foreground)) !important',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: 'hsl(var(--foreground)) !important',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: 'hsl(var(--foreground)) !important',
          },
        },
      },
    },
  });
};
