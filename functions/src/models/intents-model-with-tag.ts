import { IntentsModel } from "../services/tokens.service";

export interface IntentsModelWithTag {
  intentsModel: IntentsModel;
  tag?: string;
}
