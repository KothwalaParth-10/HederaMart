# HederaMart - Decentralized Marketplace on Hedera

HederaMart is a decentralized e-commerce platform built on the Hedera network, enabling secure peer-to-peer transactions using HBAR cryptocurrency. The platform features a smart contract-based escrow system, seamless HashPack wallet integration, and transparent transaction records.

## Features

- 🛍️ **Decentralized Marketplace**: List and browse products with detailed information
- 💰 **HBAR Payments**: Secure transactions using Hedera's native cryptocurrency
- 🔒 **Smart Contract Escrow**: Automated escrow system for safe trading
- 👛 **HashPack Integration**: Easy wallet connection and transaction signing
- 📝 **Transaction Records**: All transactions stored on Hedera for transparency
- 🖼️ **File Storage**: Product images stored using Hedera File Service
- 🎨 **Modern UI**: Beautiful and responsive design with Tailwind CSS
- ⚡ **Real-time Updates**: Instant transaction status updates

## Prerequisites

- Node.js v14 or higher
- HashPack wallet browser extension
- HBAR tokens for transactions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hederamart.git
cd hederamart
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_MARKETPLACE_CONTRACT_ID=your_contract_id
```

4. Start the development server:
```bash
npm start
```

## Smart Contract

The marketplace smart contract (`Marketplace.sol`) includes:

- Product listing management
- Escrow system for secure transactions
- Platform fees handling
- Dispute resolution mechanism
- Admin controls for platform management

## Architecture

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Hedera Network
- **Smart Contract**: Solidity
- **Wallet**: HashPack Integration
- **File Storage**: Hedera File Service

## Security Features

- Non-custodial transactions
- Smart contract-based escrow
- Automated fund release
- Dispute resolution system
- Rate limiting
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hedera Network
- HashPack Wallet
- OpenZeppelin Contracts
- React.js Community
- Tailwind CSS Team

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/hederamart](https://github.com/yourusername/hederamart)
