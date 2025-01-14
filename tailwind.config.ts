import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
	theme: {
		extend: {
		  colors: {
			main: 'var(--main)',
			overlay: 'var(--overlay)',
			bg: 'var(--bg)',
			bw: 'var(--bw)',
			blank: 'var(--blank)',
			text: 'var(--text)',
			mtext: 'var(--mtext)',
			border: 'var(--border)',
			ring: 'var(--ring)',
			ringOffset: 'var(--ring-offset)',
			
			secondaryBlack: '#212121', 
		  },
		  borderRadius: {
			base: '20px'
		  },
		  boxShadow: {
			shadow: 'var(--shadow)'
		  },
		  translate: {
			boxShadowX: '6px',
			boxShadowY: '6px',
			reverseBoxShadowX: '-6px',
			reverseBoxShadowY: '-6px',
		  },
		  fontWeight: {
			base: '400',
			heading: '900',
		  },
		},
	  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
