import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { PublicKey } from "@solana/web3.js";

const queryKeys = {
  balance: (publicKey: PublicKey | null) =>
    ["wallet-balance", publicKey] as [string, PublicKey | null],
};

export function useWalletBalance() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { data: balance, ...query } = useQuery(
    queryKeys.balance(wallet.publicKey),
    ({ queryKey }) => {
      if (!queryKey[1]) return;
      return connection.getBalance(queryKey[1]);
    }
  );

  return { wallet, balance, ...query };
}
