export interface ResponsePixPaymentWebhook {
  pix: PixPaymentWebhook[];
}

export interface PixPaymentWebhook {
  endToEndId: string;
  txid: string;
  chave: string;
  valor: string;
  horario: string;
  infoPagador: string;
  gnExtras: GnExtraPixPaymentWebhook;
}

interface PagadorGnExtraPixPaymentWebhook {
  nome: string;
  cnpj: string;
  codigoBanco: string;
}
interface GnExtraPixPaymentWebhook {
  pagador: PagadorGnExtraPixPaymentWebhook;
}
