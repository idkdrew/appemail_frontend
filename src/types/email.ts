export interface Draft {
  rascunhoId: number;
  assunto: string;
  emailDestinatario: string;
  corpo: string;
}

export interface Email {
  emailId: number;
  assunto: string;
  emailRemetente: string;
  emailDestinatario: string;
  corpo: string;
  status: 'enviado' | 'lido' | 'nao_lido';
  dataEnvio: string;
}

export interface CreateDraftRequest {
  assunto: string;
  emailDestinatario: string;
  corpo: string;
}

export interface UpdateDraftRequest {
  rascunhoId: number;
  assunto: string;
  emailDestinatario: string;
  corpo: string;
}

export interface SendEmailRequest {
  assunto: string;
  emailDestinatario: string;
  corpo: string;
}