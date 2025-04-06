## 🏗️ Built By DAO – Web3 Dashboard

A lightweight, front-end-only Next.js application that connects directly to Ethereum and L2s to display real-time token holdings, NFTs, and DAO participation data for members of the Built By DAO ecosystem. This dashboard runs lean with no backend, built for trustless visibility and modular growth.

visit: docs.builtbydao.com

---

## ✨ Features

- 🔐 Wallet connection (RainbowKit + Wagmi)  
- 💰 Live token balances (BLTBY, EQTBLT, others)  
- 🎟️ NFT display: Membership, Access, and Governance  
- 📊 Public DAO metrics (proposals, equity, participation)  
- 🔒 Admin metrics with access control  
- 💱 Token purchase + swap functionality (planned)  
- ⚡ 100% client-side / serverless, ready for AWS  

---

## 🧰 Tech Stack

- Framework: Next.js 14+ with App Router  
- Styling: Tailwind CSS + shadcn/ui  
- Web3: wagmi, viem, RainbowKit  
- Hosting: AWS (no Vercel)  
- Auth (optional): Sign-In with Ethereum (SIWE)  

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/marquisdavis/DashboardBLTBY.git
cd DashboardBLTBY
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to view your dashboard.

---

## 🗂️ Project Structure

```
src/
│
├─ app/
│   ├─ page.tsx            # Homepage (Dashboard)
│   └─ layout.tsx          # Global layout (providers, theming)
│
├─ components/
│   ├─ layout/             # Sidebar, topbar, dashboard shell
│   └─ ui/                 # Buttons, sheets, cards (shadcn)
│
├─ hooks/
│   ├─ useUSDCBalance.ts   # Reads wallet token balance
│   └─ useSiwe.ts          # Optional Ethereum auth logic
│
├─ public/
│   └─ builtbydao-logo.svg
```

---

## 🪙 Tokens + NFTs in Use

This dashboard is built to support and display:

| Token/NFT       | Type        | Purpose                                 |
|------------------|-------------|-----------------------------------------|
| `BLTBY`          | ERC-20      | Utility, rewards, staking (buyable)     |
| `EQTBLT`         | ERC-20      | Earned equity from rent/contribution    |
| Membership NFT   | ERC-721     | Soulbound onboarding + tier tracking    |
| Governance NFT   | ERC-721/SBT | Gated voting and proposal rights        |
| Access Tokens    | ERC-1155    | Events, spaces, resource permissions    |
| Investor NFTs    | ERC-721     | Admin-only, non-transferable            |

All reads use on-chain contract data. Contract addresses and ABIs are customizable.

---

## 📊 Metrics Pages

### Public Dashboard

- Total proposals (monthly)  
- Participation rate  
- EQTBLT issued  
- New members  
- Token distribution graphs  

### Admin Metrics (gated)

- Treasury balances (ETH, USDC)  
- Rent collection vs missed  
- Proposal + voting velocity  
- Equity accrual heatmaps  
- Onboarding funnel stats  

---

## 🧪 Future Enhancements

- BLTBY → USDC swap  
- Token reward claims  
- NFT badge view modes  
- Real-time token logs  
- Cohort-level performance breakdowns  

---

## 🛠️ Build & Deploy

```bash
npm run build
npm run start
```

You can deploy to AWS S3 + CloudFront, Vite SSR edge, or another static host. No server required.

---

## 🔐 Admin Access

The `/metrics/admin` route is gated by:  
- Admin NFT ownership  
- Allowlisted wallet addresses  

---

## 📄 License

MIT License

---

## 🌍 Part of the Built By DAO ecosystem

This dashboard is a digital tool in the broader mission to build community-owned housing, economic networks, and regenerative governance structures.

Visit docs.builtbydao.com for more.
