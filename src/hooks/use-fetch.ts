/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { toast } from "./use-toast";

type FetchCallback<T> = (...args: any[]) => Promise<T>;

const useFetch = <T>(cb: FetchCallback<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any[]): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const res = await cb(...args);
      setData(res);
      return res;
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
