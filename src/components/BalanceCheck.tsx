import { Inter } from "next/font/google";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as Web3 from "@solana/web3.js";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

  useEffect(() => {
    const keypair = Web3.Keypair.generate();

    const publicKey = keypair.publicKey.toString();
    const privateKey = keypair.secretKey.toString();

    const instruction = Web3.SystemProgram.createAccount({
      fromPubkey: keypair.publicKey,
      newAccountPubkey: keypair.publicKey,
      lamports: LAMPORTS_PER_SOL * 1000,
      space: 999999,
      programId: Web3.SystemProgram.programId,
    });
    const transaction = new Web3.Transaction();
    transaction.add(instruction);
    const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
    Web3.sendAndConfirmTransaction(connection, transaction, [keypair])
      .then(console.log)
      .catch(console.error);
    console.log({ publicKey, privateKey });
  }, []);

  const onSubmit = async (values: Schema) => {
    try {
      const { address } = values;
      const publicKey = new Web3.PublicKey(address);
      const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"));
      const balance = await connection.getBalance(publicKey);
      const accountInfo = await connection.getAccountInfo(publicKey);
      setBalance(balance);
      console.log(accountInfo);
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
