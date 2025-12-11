"use client";
import { useForm, SubmitHandler } from "react-hook-form";
// room_id : String,name : String,total_pool : u64,deadline : i64, vote_threshold : u8
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TrustplayProgram } from "../target/types/trustplay_program";

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.trustplayProgram as Program<TrustplayProgram>;

interface Inputs {
  room_id: string;
  name: string;
  total_pool: number;
  vote_threshold: number;
}
export default function Page() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {};

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>room_id</label>
      <input {...register("room_id")} />
      <label>total_pool</label>
      <input {...register("total_pool")} />
      <label>Deadline</label>
      <input {...register("deadline")} />
      <label>vote_threshold</label>
      <input {...register("vote_threshold")} />

      <input type="submit" />
    </form>
  );
}
