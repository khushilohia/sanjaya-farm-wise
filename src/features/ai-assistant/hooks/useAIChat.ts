import { useMutation } from "@tanstack/react-query";
import { askAI } from "@/api/serverFns";

export function useAIChat() {
  return useMutation({
    mutationFn: (params: {
      question: string;
      context: string;
      language: string;
    }) => askAI({ data: params }),
  });
}
