// import path from "path";
import { env } from ".";

export default {
  sandbox: false,
  client_id: env.EFI_BANK_API_CLIENT_ID,
  client_secret: env.EFI_BANK_API_CLIENT_SECRET,
  certificate: env.EFI_CERT_BASE64,
  cert_base64: true,
};
