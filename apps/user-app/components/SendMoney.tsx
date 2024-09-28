"use client";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createOnRampTransaction } from "@/lib/actions/createOnRampTransactions";
import { p2pTransfer } from "@/lib/actions/P2P";
const addMoneySchema = z.object({
  amount: z.string(),
  number: z.string(),
});

export const SendMoney = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof addMoneySchema>>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      amount: "",
      number: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addMoneySchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    const res = await p2pTransfer(values.number, Number(values.amount));
    console.log(res);
    setLoading(false);
    router.refresh();

    if (res?.error) {
      setError("not sufficient money in bank");
      toast({
        title: "error while transferring",
      });
    } else {
      setError("");
      toast({
        title: "Successfully Credited",
      });
    }

    console.log(values);
  }

  return (
    <div className="flex flex-col justify-center   ">
      <div className="text-white text-3xl mb-5 ">Transfer</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border-white"
        >
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-xl">Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    {...field}
                    className="text-white w-80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-xl">Number</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{loading ? "wait..." : "Send Money"}</Button>
        </form>
      </Form>
    </div>
  );
};
