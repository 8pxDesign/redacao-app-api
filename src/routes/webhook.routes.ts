import { FastifyInstance } from "fastify";
import { PaymentController } from "../modules/Payment/Payment.controller";
import { ResponsePixPaymentWebhook } from "../modules/Payment/Payment.service.type";

export default async function (app: FastifyInstance) {
  const paymentController = new PaymentController();
  app.get("/", async (request, reply) => {
    return reply.status(200).send({
      status: "Webhook server running",
      routes: ["/webhook/pix"],
    });
  });

  app.post("/", async (request, reply) => {
    return reply.status(200).send({ success: true });
  });

  app.post("/pix", async (request, reply) => {
    reply.header("x-skip-mtls-checking", "true");
    console.log("=== WEBHOOK RECEIVE EVENT ===");
    console.log("Headers:", request.headers);
    console.log("Body:", JSON.stringify(request.body, null, 2));

    try {
      const { pix } = request.body as ResponsePixPaymentWebhook;

      if (pix && Array.isArray(pix)) {
        console.log("Starting payment process...");
        for (const transaction of pix) {
          if (transaction.txid) {
            await paymentController.payRedacao(transaction.txid);
          }
        }
      }

      return reply.status(200).send({ success: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      return reply.status(200).send({ success: false });
    }
  });
}
