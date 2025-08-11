import { ErrorCode } from '@app/domain/enums';

export const error = {
  [ErrorCode.GENERIC_ERROR]:
    'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde ou entre em contato com o suporte.',
  [ErrorCode.INTERNAL_SERVER_ERROR]:
    'Erro interno do servidor. Tente novamente mais tarde.',
  [ErrorCode.BAD_REQUEST]:
    'A requisição está malformada ou faltam parâmetros obrigatórios.',
  [ErrorCode.UNAUTHORIZED]:
    'Você não está autorizado para realizar essa ação. Faça login e tente novamente.',
  [ErrorCode.FORBIDDEN]: 'Você não tem permissão para acessar este recurso.',
  [ErrorCode.NOT_FOUND]: 'O recurso solicitado não foi encontrado.',
  [ErrorCode.CONFLICT]: 'Ocorreu um conflito com o estado atual do recurso.',
  [ErrorCode.UNPROCESSABLE_ENTITY]:
    'A requisição foi bem formatada, mas contém erros semânticos e não pôde ser processada.',
  [ErrorCode.TOO_MANY_REQUESTS]:
    'Você fez muitas requisições em um curto período. Por favor, tente novamente mais tarde.',
  [ErrorCode.MISSING_OR_INVALID_PARAMS]:
    'Alguns parâmetros obrigatórios estão ausentes ou inválidos. Verifique sua requisição e tente novamente.',
  [ErrorCode.INVALID_TOKEN]: 'O token fornecido é inválido ou expirou.',
  [ErrorCode.USER_UNAUTHORIZED]: 'O usuário não foi encontrado.',
  [ErrorCode.USER_EXISTS]: 'O usuário já está cadastrado.',
  [ErrorCode.USER_NOT_FOUND]: 'O usuário não foi encontrado.',
  [ErrorCode.USER_NOT_FOUND_OR_PASSWORD]: 'O usuário ou senha incorretos.',
  [ErrorCode.USER_BLOCK]: 'Usuário bloqueado.',
  [ErrorCode.BAD_GATEWAY]: 'Serviço indisponível.',
  [ErrorCode.FAILED_DEPENDENCY]:
    'Não foi possível obter definições devido a uma falha no serviço externo.',
  [ErrorCode.WORD_NOT_FOUND]: 'Palavra não encontrada.',

  [ErrorCode.WORD_FAVORITE_EXISTS]: 'Palavra já favoritada.',
};
