import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as Web3 from "@solana/web3.js";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

const inter = Inter({ subsets: ["latin"] });

const schema = z.object({
  address: z.string().min(1, { message: "Address is required." }),
});

type Schema = z.infer<typeof schema>;

export function BalanceCheck() {
  const { register, handleSubmit, formState } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const [balance, setBalance] = useState<number>();

  const onSubmit = async (values: Schema) => {
    try {
      const { address } = values;
      const publicKey = new Web3.PublicKey(address);
      const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
      const balance = await connection.getBalance(publicKey);
      setBalance(balance);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className={inter.className}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="border-2 border-gray-950 p-2 focus:border-blue-50 rounded-sm"
          placeholder="Enter SOL address"
          {...register("address")}
        />
        <button
          className="bg-pink-500 rounded-lg p-2 px-4 text-cyan-50"
          type="submit"
        >
          Check balance
        </button>
        {formState.errors.address && <p>{formState.errors.address.message}</p>}
      </form>
      {balance !== undefined && <p>Balance: {balance} SOL</p>}
    </main>
  );
}
