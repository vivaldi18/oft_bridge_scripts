// bridge-oft.js
// Ethers v6
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const CONFIG = {
  RPC_URL: process.env.RPC_URL || "https://bsc-dataseed1.binance.org",
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  OFT_ADDRESS: process.env.OFT_ADDRESS || "0xYourOFTAddressOnSourceChain",
  TO: process.env.TO || "0xYourRecipientOnDestination",
  DST_EID: Number(process.env.DST_EID || 30388),
  AMOUNT: process.env.AMOUNT || "1000000000000000",
  OPTIONS_HEX: process.env.OPTIONS_HEX || "0x",
  GAS_LIMIT: process.env.GAS_LIMIT ? Number(process.env.GAS_LIMIT) : undefined,
};

const OFT_ABI = [
  "function quoteSend(uint32 dstEid, bytes32 to, uint256 amount, bytes options) view returns (uint256 nativeFee, uint256 zroFee)",
  "function send(uint32 dstEid, bytes32 to, uint256 amount, bytes options) payable",
  "function decimals() view returns (uint8)",
];

function evmAddressToBytes32(addr) {
  return ethers.zeroPadValue(addr, 32);
}

async function main() {
  if (!CONFIG.PRIVATE_KEY) throw new Error("PRIVATE_KEY belum di-set di .env");

  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const wallet = new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
  const oft = new ethers.Contract(CONFIG.OFT_ADDRESS, OFT_ABI, wallet);

  const toBytes32 = evmAddressToBytes32(CONFIG.TO);

  const [nativeFee] = await oft.quoteSend(
    CONFIG.DST_EID,
    toBytes32,
    CONFIG.AMOUNT,
    CONFIG.OPTIONS_HEX
  );

  console.log("Quoted native fee (wei):", nativeFee.toString());

  const tx = await oft.send(
    CONFIG.DST_EID,
    toBytes32,
    CONFIG.AMOUNT,
    CONFIG.OPTIONS_HEX,
    {
      value: nativeFee,
      gasLimit: CONFIG.GAS_LIMIT,
    }
  );

  console.log("Tx sent:", tx.hash);
  const rcpt = await tx.wait();
  console.log("Tx confirmed in block", rcpt.blockNumber);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
