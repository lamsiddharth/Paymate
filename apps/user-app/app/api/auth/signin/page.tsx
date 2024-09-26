"use client"
import { signIn } from 'next-auth/react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
   phoneno: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export default function Home() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneno: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      phone: values.phoneno,
      password: values.password,
    });

    setLoading(false);

    if (res?.error) {
      setError('Invalid phone number or password');
        toast({
            title: "Invalid Password or Phone Number"
        })
    } else {
      setError('');
       router.push("/dashboard");
      toast({
        title: "Successfully Logged In"
    })
    }

    console.log(values)
  }

  return (
    <div className="flex  justify-center items-center h-screen">

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="phoneno"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
              <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    
          </div>
  )
}