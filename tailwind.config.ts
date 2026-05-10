import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      maxWidth: {
        mobile: "375px",
      },
      colors: {
        // 东方意境色彩体系 - 源自汝窑青瓷与传统宣纸
        "tianqing": "#A3B8C6",      // 天青色 - 源于汝窑瓷器，代表宁静、平和与自然
        "oupink": "#E6D5D5",        // 藕粉色 - 柔和、温暖的暖色，象征温柔、关怀与亲密
        "yuebai": "#F5F5F3",        // 月白色 - 如同月光般纯净，象征希望与启发
        "mibai": "#FDFBF8",         // 米白色 - 取自宣纸和亚麻的颜色，温润雅致
        primary: "#A3B8C6",
        secondary: "#E6D5D5",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "'PingFang SC'",
          "'Microsoft YaHei'",
          "'Hiragino Sans GB'",
          "'Microsoft Sans Serif'",
          "sans-serif"
        ],
        serif: [
          "Georgia",
          "Cambria",
          "'Times New Roman'",
          "Times",
          "'SimSun'",
          "'STSong'",
          "serif"
        ],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.75' }],
        'lg': ['1.125rem', { lineHeight: '1.75' }],
        'xl': ['1.25rem', { lineHeight: '1.75' }],
        '2xl': ['1.5rem', { lineHeight: '1.75' }],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(163, 184, 198, 0.07), 0 10px 20px -2px rgba(163, 184, 198, 0.04)',
        'medium': '0 4px 25px -5px rgba(163, 184, 198, 0.1), 0 10px 30px -5px rgba(163, 184, 198, 0.04)',
        'hover': '0 8px 35px -5px rgba(163, 184, 198, 0.12), 0 15px 40px -5px rgba(163, 184, 198, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
