import { Inter, Lusitana, Poppins } from 'next/font/google';
 
export const inter = Inter({ subsets: ['latin'] });

export const poppins = Poppins({
    weight: ["400", "600", "800"],
    subsets: ['latin'],
})

export const lusitana = Lusitana({ 
    weight: ["400", "700"],
    subsets: ['latin'],
});