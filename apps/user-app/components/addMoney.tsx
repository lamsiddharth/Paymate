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

const addMoneySchema = z.object({
  amount: z.string(),
  bank: z.string(),
});

export const AddMoney = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const provider = "SBI";
  // 1. Define your form.
  const form = useForm<z.infer<typeof addMoneySchema>>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      amount: "",
      bank: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof addMoneySchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    const res = await createOnRampTransaction(provider, Number(values.amount));

    setLoading(false);
    router.refresh();

    if (res?.error) {
      setError("not sufficient money in bank");
      toast({
        title: "Insufficient bank balance",
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
      <div className="text-white text-3xl mb-5 ">Add Money</div>
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
                <FormLabel className="text-white">amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    {...field}
                    className="text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">bank</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{loading ? "wait..." : "Add Money"}</Button>
        </form>
      </Form>
    </div>
  );
};
