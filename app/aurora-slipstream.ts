// app/aurora-slipstream.ts
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import {
  createPublicClient,
  http,
  formatEther,
  isAddress,
  parseAbi,
  formatUnits,
} from "viem";
import { base, baseSepolia } from "viem/chains";

type Net = {
  chain: typeof base;
  chainId: number;
  rpc: string;
  explorer: string;
  label: string;
};

const NETWORKS: Net[] = [
  {
    chain: baseSepolia,
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    label: "Base Sepolia",
  },
  {
    chain: base,
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    label: "Base Mainnet",
  },
];

let active = NETWORKS[0];

const sdk = new CoinbaseWalletSDK({
  appName: "Aurora Slipstream (Built for Base)",
  appLogoUrl: "https://base.org/favicon.ico",
});

const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
]);

const out = document.createElement("pre");
out.style.whiteSpace = "pre-wrap";
out.style.background = "#0b0f1a";
out.style.color = "#dbe7ff";
out.style.padding = "14px";
out.style.borderRadius = "12px";
out.style.minHeight = "360px";

function print(lines: string[]) {
  out.textContent = lines.join("\n");
}

function client() {
  return createPublicClient({ chain: active.chain, transport: http(active.rpc) });
}

function toAddr(v: string): `0x${string}` {
  if (!isAddress(v)) throw new Error("Invalid address");
  return v as `0x${string}`;
}

async function connectWallet() {
  const provider = sdk.makeWeb3Provider(active.rpc, active.chainId);
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("No address returned");

  const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
  const bal = await client().getBalance({ address: toAddr(address) });

  print([
    "Wallet connected",
    `Network: ${active.label}`,
    `chainId: ${parseInt(chainHex, 16)}`,
    `Address: ${address}`,
    `ETH balance: ${formatEther(bal)} ETH`,
    `${active.explorer}/address/${address}`,
  ]);
}

async function latestBlock() {
  const b = await client().getBlock();
  print([
    "Latest block",
    `Network: ${active.label}`,
    `Block: ${b.number}`,
    `Timestamp: ${b.timestamp}`,
    `Gas used: ${b.gasUsed}`,
    `${active.explorer}/block/${b.number}`,
  ]);
}

async function readEth(addr: string) {
  const a = toAddr(addr);
  const bal = await client().getBalance({ address: a });
  print([
    "ETH balance",
    `Network: ${active.label}`,
    `Address: ${a}`,
    `Balance: ${formatEther(bal)} ETH`,
    `${active.explorer}/address/${a}`,
  ]);
}

async function readErc20(token: string, holder: string) {
  const t = toAddr(token);
  const h = toAddr(holder);

  const c = client();
  const [name, symbol, decimals, supply, bal] = await Promise.all([
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "name" }),
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "symbol" }),
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "decimals" }),
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "totalSupply" }),
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "balanceOf", args: [h] }),
  ]);

  const d = Number(decimals);
  print([
    "ERC-20 snapshot",
    `Network: ${active.label}`,
    `Token: ${t}`,
    `Holder: ${h}`,
    `Name: ${String(name)}`,
    `Symbol: ${String(symbol)}`,
    `Total supply: ${formatUnits(supply as bigint, d)}`,
    `Holder balance: ${formatUnits(bal as bigint, d)}`,
    `${active.explorer}/address/${t}`,
  ]);
}

function toggleNetwork() {
  active = active.chainId === 84532 ? NETWORKS[1] : NETWORKS[0];
  print([`Switched to ${active.label}. Reconnect wallet.`]);
}

function mount() {
  const root = document.createElement("div");
  root.style.maxWidth = "1120px";
  root.style.margin = "24px auto";
  root.style.fontFamily = "system-ui";

  const h1 = document.createElement("h1");
  h1.textContent = "Aurora Slipstream";

  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.flexWrap = "wrap";
  controls.style.gap = "10px";
  controls.style.marginBottom = "12px";

  function btn(label: string, fn: () => void | Promise<void>) {
    const b = document.createElement("button");
    b.textContent = label;
    b.onclick = () => Promise.resolve(fn()).catch(e => print([String(e)]));
    return b;
  }

  const inputAddr = document.createElement("input");
  inputAddr.placeholder = "0x… address";
  inputAddr.style.minWidth = "360px";

  const inputToken = document.createElement("input");
  inputToken.placeholder = "0x… ERC-20 token";

  controls.append(
    btn("Connect Wallet", connectWallet),
    btn("Toggle Network", toggleNetwork),
    btn("Latest Block", latestBlock),
  );

  root.append(
    h1,
    controls,
    inputAddr,
    btn("Read ETH", () => readEth(inputAddr.value)),
    inputToken,
    btn("Read ERC-20", () => readErc20(inputToken.value, inputAddr.value)),
    out,
  );

  document.body.appendChild(root);
  print(["Ready", `Active network: ${active.label}`, "Connect wallet to begin"]);
}

mount();
