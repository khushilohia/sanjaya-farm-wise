import { useMutation } from "@tanstack/react-query";
import { askAI } from "@/backend/api/serverFns";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export function useAIChat() {
  return useMutation({
    mutationFn: (params: {
      question: string;
      context: string;
      language: string;
      history?: ChatTurn[];
    }) => askAI({ data: params }),
  });
}
