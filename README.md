# OFT Bridge Scripts

Script ini membantu melakukan bridge token OFT via LayerZero dari BSC <-> 0G Mainnet (atau ETH).

## Struktur File
- `bridge-oft.js` : Script Node.js (Ethers.js v6) untuk eksekusi bridge langsung.
- `OFTBridgeHelper.sol` : Kontrak Solidity helper jika ingin bridging dari smart contract.
- `.env.example` : Contoh file konfigurasi environment.

## Persiapan
1. Install Node.js v18+
2. Clone atau extract repo ini
3. Jalankan:
   ```bash
   npm init -y
   npm install ethers dotenv
   ```
4. Salin `.env.example` menjadi `.env` dan isi variabel sesuai kebutuhan.

## Jalankan Script Bridge
```bash
node bridge-oft.js
```

## Variabel Penting
- `PRIVATE_KEY` : Private key wallet pengirim
- `RPC_URL` : RPC endpoint jaringan asal (mis. BSC RPC)
- `OFT_ADDRESS` : Alamat kontrak OFT di jaringan asal
- `TO` : Alamat tujuan di chain tujuan
- `DST_EID` : Endpoint ID tujuan (BSC=30102, ETH=30101, 0G=30388)
- `AMOUNT` : Jumlah token (dalam unit terkecil / decimals token)
- `OPTIONS_HEX` : Opsi adapterParams (default 0x)

## EID Mapping
- BNB Chain (BSC) = 30102
- Ethereum = 30101
- 0G Mainnet = 30388

## Setelah Bridge
Gunakan DEX resmi di 0G Mainnet:
👉 [https://jaine.app/swap](https://jaine.app/swap)
