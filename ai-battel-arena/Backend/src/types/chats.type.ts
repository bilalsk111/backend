type Judge = {
  solution_1_score: number;
  solution_2_score: number;
  solution_1_reasoning: string;
  solution_2_reasoning: string;
  winner: "solution_1" | "solution_2" | "tie";
};

type BattleResult = {
  solution_1: string;
  solution_2: string;
  judge: Judge;
};
type ChatMessage = {
  problem: string;
  result: BattleResult;
};
type APIResponse = {
  chatId: string;
  result: BattleResult;
};
type ChatStore = Record<string, ChatMessage[]>;

export type { BattleResult, ChatMessage, ChatStore, APIResponse };