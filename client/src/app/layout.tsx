import './globals.css';

export const metadata = {
    title: 'Serona'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {/* <div id = 'box-1280' />
                <div id = 'box-1024' />
                <div id = 'box-768' />
                <div id = 'box-480' /> */}
                {children}
            </body>
        </html>
    );
}
