import { useWalletBalance } from "@/hooks/useWalletBalance";

export function Balance() {
  const { wallet, isLoading, balance } = useWalletBalance();

  if (isLoading || !wallet.connected) return null;

  return <p>Balance: {balance} SOL</p>;
}
