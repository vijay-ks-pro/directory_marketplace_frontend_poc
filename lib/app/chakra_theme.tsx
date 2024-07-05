
import { APP_BG_COLOR, APP_BORDER_COLOR, APP_PRIMARY_COLOR, APP_SECONDARY_COLOR } from './app_constants';
import { Inter, Kanit } from 'next/font/google';
import { extendTheme } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] });
const kanit = Kanit({ subsets: ['latin'], weight: ['500'] });

const getColor = (color: string) => {
    return [...Array(9).keys()].reduce((out, item) => { out[`${item+1}00`] = color; return out; }, {} as { [x: string]: string })
}

const fonts = {
    inter: inter.style.fontFamily,
    kanit: kanit.style.fontFamily,
    body: inter.style.fontFamily,
    heading: inter.style.fontFamily,
}

const colors = {
    brand: {
        primary: APP_PRIMARY_COLOR,
        secondary: APP_SECONDARY_COLOR,
        borderColor: APP_BORDER_COLOR,
        bgColor: APP_BG_COLOR
    },
    tableStripedColor: {
        50: "#f4f5f6",
        100: "#f4f5f6",
        200: "#f4f5f6",
        300: "#f4f5f6",
        400: "#f4f5f6",
        500: "#f4f5f6",
        600: "#f4f5f6",
        700: "#f4f5f6",
        800: "#f4f5f6",
        900: "#f4f5f6",
    },
    black: {
        50: "black",
        100: "black",
        200: "black",
        300: "black",
        400: "black",
        500: "black",
        600: "black",
        700: "black",
        800: "black",
        900: "black",
    },
}

const styles = {
    global: {
        html: {
            scrollBehavior: 'smooth',
            scrollPadding: '80px'
        },
        body: {
            bg: APP_BG_COLOR
        }
    }
}

const components = {
    Button: {
        variants: {
            solid: {
                h: '50px',
                borderRadius: '8px',
                _hover: {},
                _focus: {}
            },
            outline: {
                h: '50px',
                borderRadius: '8px',
                borderColor: 'black',
                _hover: {},
                _focus: {}
            },
        }
    },
    FormLabel: {
        baseStyle: {
            mb: '12px',
            color: 'brand.text',
            fontSize: '14px'
        }
    },
    Heading: {
        baseStyle: {
            color: 'brand.heading',
            fontWeight: 'bold'
        }
    },
    Text: {
        baseStyle: {
            color: 'brand.text',
            fontSize: '14px'
        }
    },
    Input: {
        sizes: {
            md: {
              field: {
                borderRadius: "8px",
                minH: '45px'
              },
            },
        },
        variants: {
            outline: {
                field: {
                  border: "1px",
                  borderColor: "#cccccc",
                  _focus: {
                    borderColor: "#3898EC",
                    boxShadow: "none",
                  },
                  color: '#333333',
                  fontSize: '14px',
                  verticalAlign: 'middle',
                  _placeholder: { color: '#B7B7B7' }
                },
            },
        }
    },
    Select: {
        sizes: {
            md: {
              field: {
                borderRadius: "8px",
                minH: '45px'
              },
            },
        },
        variants: {
            outline: {
                field: {
                  border: "1px",
                  borderColor: "#cccccc",
                  _focus: {
                    borderColor: "#3898EC",
                    boxShadow: "none",
                  },
                  color: '#333333',
                  fontSize: '14px',
                  verticalAlign: 'middle',
                  _placeholder: { color: '#B7B7B7' }
                },
            },
        }
    },
    Textarea: {
        variants: {
            outline: {
                border: "1px",
                borderColor: "#cccccc",
                _focus: {
                borderColor: "#3898EC",
                boxShadow: "none",
                },
                color: '#333333',
                fontSize: '14px',
                verticalAlign: 'middle',
                _placeholder: { color: '#B7B7B7' }
            },
        }
    }
}

export const theme = extendTheme({ fonts, styles, colors, components })
