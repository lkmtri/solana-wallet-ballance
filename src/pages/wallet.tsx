import { SolanaWalletProvider } from "@/components/ApplicationContext";
import { Balance } from "@/components/Balance";

export default function Wallet() {
  return (
    <SolanaWalletProvider>
      <Balance />
    </SolanaWalletProvider>
  );
}
