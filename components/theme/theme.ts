import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';

const theme = extendTheme({
  colors: {
    blue: {
      50: '#E6F2FF',
      100: '#CCE5FF',
      200: '#99CBFF',
      300: '#66B2FF',
      400: '#3399FF',
      500: '#0078D7', 
      600: '#0060B0',
      700: '#004888',
      800: '#003161',
      900: '#001B39',
    },
    orange: {
      50: '#FFF2E6',
      100: '#FFE5CC',
      200: '#FFCC99',
      300: '#FFB266',
      400: '#FF9933',
      500: '#FF8C00', 
      600: '#CC7000',
      700: '#995400',
      800: '#663800',
      900: '#331C00',
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  },
  fonts: {
    heading: 'var(--font-inter), sans-serif',
    body: 'var(--font-inter), sans-serif',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('white', 'gray.900')(props),
        color: mode('gray.800', 'white')(props),
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: StyleFunctionProps) => ({
          bg: props.colorScheme === 'blue' ? 'blue.500' : 
               props.colorScheme === 'orange' ? 'orange.500' : 
               `${props.colorScheme}.500`,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'blue' ? 'blue.600' : 
                 props.colorScheme === 'orange' ? 'orange.600' : 
                 `${props.colorScheme}.600`,
            _disabled: {
              bg: props.colorScheme === 'blue' ? 'blue.500' : 
                   props.colorScheme === 'orange' ? 'orange.500' : 
                   `${props.colorScheme}.500`,
            },
          },
          _active: {
            bg: props.colorScheme === 'blue' ? 'blue.700' : 
                 props.colorScheme === 'orange' ? 'orange.700' : 
                 `${props.colorScheme}.700`,
          },
        }),
        outline: (props: StyleFunctionProps) => ({
          border: '2px solid',
          borderColor: props.colorScheme === 'blue' ? 'blue.500' : 
                       props.colorScheme === 'orange' ? 'orange.500' : 
                       `${props.colorScheme}.500`,
          color: props.colorScheme === 'blue' ? 'blue.500' : 
                 props.colorScheme === 'orange' ? 'orange.500' : 
                 `${props.colorScheme}.500`,
          _hover: {
            bg: props.colorScheme === 'blue' ? 'blue.50' : 
                 props.colorScheme === 'orange' ? 'orange.50' : 
                 `${props.colorScheme}.50`,
          },
          _active: {
            bg: props.colorScheme === 'blue' ? 'blue.100' : 
                 props.colorScheme === 'orange' ? 'orange.100' : 
                 `${props.colorScheme}.100`,
          },
        }),
      },
      defaultProps: {
        colorScheme: 'blue',
        size: 'md',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
          p: 4,
        },
        header: {
          pb: 2,
        },
        body: {
          py: 2,
        },
        footer: {
          pt: 2,
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderRadius: 'md',
            _focus: {
              borderColor: 'blue.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
            },
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
  },
  breakpoints: {
    sm: '30em',    
    md: '48em',    
    lg: '62em',    
    xl: '80em',    
    '2xl': '96em', 
  },
});

export default theme;