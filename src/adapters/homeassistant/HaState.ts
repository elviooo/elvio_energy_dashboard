export type HaState = {
  entity_id: string;
  state: string; // kommt immer als string
  attributes?: Record<string, any>;
  last_updated?: string;
};
