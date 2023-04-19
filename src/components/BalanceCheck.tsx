import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as Web3 from "@solana/web3.js";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const schema = z.object({
  address: z.string(),
});

type Schema = z.infer<typeof schema>;

export function BalanceCheck() {
  const { register, handleSubmit } = useForm<Schema>();
  const [balance, setBalance] = useState<number>();

  const onSubmit = async (values: Schema) => {
    const { address } = values;
    const publicKey = new Web3.PublicKey(address);
    const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
    setBalance(await connection.getBalance(publicKey));
  };

  return (
    <main className={inter.className}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("address")} />
        <button type="submit">Check balance</button>
      </form>
      {balance !== undefined && <p>{balance}</p>}
    </main>
  );
}
