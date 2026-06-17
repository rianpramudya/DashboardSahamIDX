# IDX Dashboard

A comprehensive Indonesian Stock Market visualization dashboard built with Next.js 14, featuring real-time data from Yahoo Finance, beautiful interactive charts, bilingual support (English & Bahasa Indonesia), and dark/light theme.

## Features

- **Real-time Data**: Live stock data from Yahoo Finance API
- **6 Interactive Charts**: Line (IHSG), Bar (Top Movers), Doughnut (Sector), Bar (Volume), Scatter (Vol vs Change), Line (Stock Price)
- **Dark/Light Theme**: Seamless theme switching with animated transitions
- **Bilingual**: English & Bahasa Indonesia support via next-intl
- **Responsive**: Mobile-first design with bottom navigation for mobile
- **KPI Cards**: Animated count-up statistics
- **Auto Refresh**: Automatic data refresh every 60 seconds
- **Export**: Download data in CSV/JSON format
- **Glassmorphism UI**: Modern glass-effect card design
- **Particle Animation**: Floating particle background

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **Chart.js** with react-chartjs-2
- **Framer Motion** animations
- **next-intl** internationalization
- **next-themes** dark/light mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd idx-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
idx-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # Localized routes (en, id)
│   │   ├── api/stock/          # API routes for Yahoo Finance proxy
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Root redirect
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Navbar, Footer, MobileNav
│   │   ├── shared/             # Reusable components
│   │   ├── charts/             # Chart.js components
│   │   ├── sections/           # Page sections
│   │   └── animations/         # Animation components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── types/                  # TypeScript types
│   ├── data/                   # Static data
│   ├── context/                # React context providers
│   └── i18n/                   # next-intl translations
├── public/                     # Static assets
└── package.json
```

## Data

The dashboard tracks 15 Indonesian blue-chip stocks:

- **BBCA** - Bank Central Asia
- **BBRI** - Bank Rakyat Indonesia
- **BMRI** - Bank Mandiri
- **TLKM** - Telkom Indonesia
- **ASII** - Astra International
- **GOTO** - GoTo Gojek Tokopedia
- **UNVR** - Unilever Indonesia
- **PGAS** - Perusahaan Gas Negara
- **ANTM** - Aneka Tambang
- **PTBA** - Bukit Asam
- **INDF** - Indofood Sukses Makmur
- **ICBP** - Indofood CBP Sukses
- **KLBF** - Kalbe Farma
- **SMGR** - Semen Indonesia
- **EXCL** - XL Axiata

## API Routes

- `GET /api/stock/[ticker]` - Get stock quote and history
- `POST /api/stock/batch` - Get multiple stock quotes

## License

This project is for educational purposes only. Not financial advice.

## Disclaimer

Data provided by Yahoo Finance. This application is for educational and informational purposes only. It does not constitute financial advice. Always do your own research before making investment decisions.
