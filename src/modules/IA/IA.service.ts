import { env } from "../../env";
import {
  ChatCompletionMessage,
  ChatCompletionRequest,
} from "./IA.service.type";

export class IAService {
  tries = 0;
  actualApi = env.IA_DEFAULT_API;
  rootApiUrl: string = env[`IA_${this.actualApi}_ROOT_API`];
  constructor() {}

  isDeepSeek() {
    return this.actualApi === `DEEP_SEEK`;
  }

  async chatCompletion(messages: ChatCompletionMessage[]): Promise<any> {
    try {
      const bodyData: ChatCompletionRequest = {
        messages,
        model: this.isDeepSeek() ? `deepseek-chat` : `gpt-4o-mini`,
        response_format: { type: `json_object` },
        temperature: 0.5,
      };

      const url = `${this.rootApiUrl}chat/completions`;
      console.log(`[IAService] Chamando ${this.actualApi}: ${url}`);

      const responseRequest = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env[`IA_${this.actualApi}_TOKEN`]}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!responseRequest.ok) {
        const errorResponse = await responseRequest.text();
        console.error(`[IAService] Erro ${responseRequest.status} (${this.actualApi}):`, errorResponse);
        throw new Error(
          `Erro HTTP ${responseRequest.status}: ${errorResponse}`,
        );
      }

      const response = await responseRequest.json();
      return response["choices"][0].message.content;
    } catch (e) {
      if (this.tries < 1) {
        this.tries += 1;
        this.changeRootApiUrl();
        return await this.chatCompletion(messages);
      }
      throw new Error("Todas as tentativas de requisição falharam.");
    }
  }

  changeRootApiUrl() {
    if (this.isDeepSeek()) {
      this.rootApiUrl = env.IA_GPT_ROOT_API;
      this.actualApi = `GPT`;
      return;
    }
    this.actualApi = `DEEP_SEEK`;
    this.rootApiUrl = env.IA_DEEP_SEEK_ROOT_API;
  }
}
