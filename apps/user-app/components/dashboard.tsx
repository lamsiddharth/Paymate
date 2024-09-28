"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { updateInformation } from "@/lib/actions/updateInfo";
const updateInfoSchema = z.object({
  name: z.string(),
  email: z.string(),
  number: z.string(),
});

export const UpdateInfo = ({ user }: { user: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof updateInfoSchema>>({
    mode: "onChange",
    resolver: zodResolver(updateInfoSchema),
    defaultValues: {
      name: "", // Start with empty strings
      email: "",
      number: undefined,
    },
  });

  // 2. Use `reset` to update form values once `user` data is available
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "", // Provide fallback values
        email: user.email || "",
        number: user.number || undefined,
      });
    }
  }, [user]); // The form will reset when `user` changes

  // 3. Define a submit handler.
  async function onSubmit(values: z.infer<typeof updateInfoSchema>) {
    setLoading(true);
    const res = await updateInformation(values.email, values.name);
    setLoading(false);
    router.refresh();

    if (res?.error) {
      setError("error while uploading");
      toast({
        title: "Error While Uploading",
        description: error
      });
    } else {
      setError("");
      toast({
        title: "Updated successfully",
        description: error
      });
    }
  }

  return (
    <div className="flex flex-col justify-center w-80">
      <div className="text-white text-3xl mb-5" w-full></div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border-white"
        >
          <FormField
            disabled={loading}
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-xl">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className="text-white  w-80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={loading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-xl">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
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
            disabled={loading}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-xl">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="number" // Ensure input type is number
                    placeholder="Phone Number"
                    {...field}
                    className="text-white w-80"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">{loading ? "wait..." : "Update Info"}</Button>
        </form>
      </Form>
    </div>
  );
};
