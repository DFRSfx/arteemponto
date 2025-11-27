declare const CreditCard3Ds: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["chave", "valor", "tds"];
        readonly properties: {
            readonly chave: {
                readonly type: "string";
                readonly description: "API Key";
                readonly examples: readonly ["xxxx-xxxx-xxxx-xxxx-xxxx"];
            };
            readonly valor: {
                readonly type: "number";
                readonly description: "Amount";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly id: {
                readonly type: "string";
                readonly description: "Identifier";
            };
            readonly tds: {
                readonly type: "integer";
                readonly description: "Mandatory to define this parameter as 1 (it forces the use of 3D Secure Technology)";
                readonly default: 1;
                readonly format: "int32";
                readonly minimum: -2147483648;
                readonly maximum: 2147483647;
            };
            readonly url_logotipo: {
                readonly type: "string";
                readonly description: "Use to define a custom imagem to show your payment request.";
            };
            readonly url_retorno: {
                readonly type: "string";
                readonly description: "Used to define the url to where the customer will be redirected he/she finishes the payment.";
            };
            readonly nome: {
                readonly type: "string";
                readonly description: "Customer's Name";
            };
            readonly email: {
                readonly type: "string";
                readonly description: "Customer's Email";
            };
            readonly lang: {
                readonly type: "string";
                readonly description: "Form Language (pt / en)";
                readonly default: "pt";
            };
            readonly comentario: {
                readonly type: "string";
                readonly description: "Optional text that will appear between the logo and the payment amount";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Success";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [true];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [0];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["OK"];
                    };
                    readonly valor: {
                        readonly type: "string";
                        readonly examples: readonly ["154.21000"];
                    };
                    readonly token: {
                        readonly type: "string";
                        readonly examples: readonly ["abc123"];
                    };
                    readonly referencia: {
                        readonly type: "string";
                        readonly examples: readonly ["000077275"];
                    };
                    readonly url: {
                        readonly type: "string";
                        readonly examples: readonly ["https://sandbox.eupago.pt/cc/form_cc.php?t=abc123"];
                    };
                };
            }, {
                readonly title: "Invalid API Key";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Chave de API inválida."];
                    };
                };
            }];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const MbWay: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["chave", "valor", "alias"];
        readonly properties: {
            readonly chave: {
                readonly type: "string";
                readonly description: "API Key";
                readonly examples: readonly ["xxxx-xxxx-xxxx-xxxx-xxxx"];
            };
            readonly valor: {
                readonly type: "number";
                readonly description: "Amount";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly id: {
                readonly type: "string";
                readonly description: "Identifier";
            };
            readonly alias: {
                readonly type: "string";
                readonly description: "Phone number that is connected to the MB WAY app and will pay";
            };
            readonly descricao: {
                readonly type: "string";
                readonly description: "Optional text that may appear on the payment request (e.g.: store name)";
            };
            readonly failOver: {
                readonly type: "string";
                readonly description: "Send a reminder to your customer that their payment has expired.";
                readonly enum: readonly ["0", "1"];
            };
            readonly email: {
                readonly type: "string";
                readonly description: "User email to receive the reminder notification (Only if failover = 1).";
            };
            readonly contacto: {
                readonly type: "string";
                readonly description: "User phone number to receive the reminder notification (Only if failover = 1).";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Success";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [true];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [0];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["OK"];
                    };
                    readonly referencia: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [8870231];
                    };
                    readonly valor: {
                        readonly type: "string";
                        readonly examples: readonly ["12.95000"];
                    };
                    readonly alias: {
                        readonly type: "string";
                        readonly examples: readonly ["351#987654321"];
                    };
                };
            }, {
                readonly title: "Invalid API Key";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Chave de API inválida."];
                    };
                };
            }, {
                readonly title: "Invalid Data";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-9];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Impossível gerar referência com os valores fornecidos."];
                    };
                    readonly alias: {
                        readonly type: "string";
                        readonly examples: readonly ["351#911111111"];
                    };
                    readonly valor: {};
                    readonly referencia: {
                        readonly type: "string";
                        readonly examples: readonly ["0"];
                    };
                };
            }, {
                readonly title: "Incorrect Phone Number";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "string";
                        readonly examples: readonly ["-9"];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Alias inexistente"];
                    };
                    readonly alias: {
                        readonly type: "string";
                        readonly examples: readonly ["351#999999999"];
                    };
                };
            }, {
                readonly title: "Missing Params";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Faltam parâmetros obrigatórios"];
                    };
                };
            }];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const MbWayMealPasses: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["chave", "valor", "alias"];
        readonly properties: {
            readonly chave: {
                readonly type: "string";
                readonly description: "API Key";
            };
            readonly valor: {
                readonly type: "number";
                readonly description: "Amount";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly id: {
                readonly type: "string";
                readonly description: "Identifier";
            };
            readonly alias: {
                readonly type: "string";
                readonly description: "Phone number that is connected to the MB WAY app and will pay";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Success";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [true];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [0];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["OK"];
                    };
                    readonly referencia: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [8870231];
                    };
                    readonly valor: {
                        readonly type: "string";
                        readonly examples: readonly ["12.95000"];
                    };
                    readonly alias: {
                        readonly type: "string";
                        readonly examples: readonly ["351#987654321"];
                    };
                };
            }, {
                readonly title: "Invalid API Key";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Chave de API inválida."];
                    };
                };
            }, {
                readonly title: "Invalid Data";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-9];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Impossível gerar referência com os valores fornecidos."];
                    };
                    readonly alias: {
                        readonly type: "string";
                        readonly examples: readonly ["351#911111111"];
                    };
                    readonly valor: {};
                    readonly referencia: {
                        readonly type: "string";
                        readonly examples: readonly ["0"];
                    };
                };
            }, {
                readonly title: "Incorrect Phone Number";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "string";
                        readonly examples: readonly ["-9"];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Alias inexistente"];
                    };
                    readonly alias: {
                        readonly type: "string";
                        readonly examples: readonly ["351#999999999"];
                    };
                };
            }, {
                readonly title: "Missing Params";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Faltam parâmetros obrigatórios"];
                    };
                };
            }];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const Multibanco: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["chave", "valor", "per_dup"];
        readonly properties: {
            readonly chave: {
                readonly type: "string";
                readonly description: "API Key";
                readonly examples: readonly ["xxxx-xxxx-xxxx-xxxx-xxxx"];
            };
            readonly valor: {
                readonly type: "number";
                readonly description: "Amount";
                readonly format: "float";
                readonly examples: readonly ["10.5"];
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly id: {
                readonly type: "string";
                readonly description: "Identifier";
                readonly examples: readonly ["Exemplo2"];
            };
            readonly data_inicio: {
                readonly type: "string";
                readonly description: "Reference starts to allow payments on this day (YYYY-MM-DD)";
                readonly format: "date";
            };
            readonly data_fim: {
                readonly type: "string";
                readonly description: "Payment deadline (YYYY-MM-DD)";
                readonly format: "date";
            };
            readonly valor_maximo: {
                readonly type: "number";
                readonly description: "Maximum amount (only for references that allow payments in an interval of amounts)";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly valor_minimo: {
                readonly type: "number";
                readonly description: "Minimum amount (only for references that allow payments in an interval of amounts)";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly per_dup: {
                readonly type: "integer";
                readonly description: "Defines if the reference allows 1 payment or more that 1 payment (1 = allows multiple payments | 0 = allows only 1 payment)";
                readonly format: "int32";
                readonly minimum: -2147483648;
                readonly maximum: 2147483647;
            };
            readonly campos_extra: {
                readonly type: "array";
                readonly description: "Use this object to assign extra fields. Note that extra fields must be first setted up on your account channel.";
                readonly items: {
                    readonly properties: {
                        readonly id: {
                            readonly type: "integer";
                            readonly description: "Number of your extra field";
                            readonly format: "int32";
                            readonly minimum: -2147483648;
                            readonly maximum: 2147483647;
                        };
                        readonly valor: {
                            readonly type: "string";
                            readonly description: "Value that should be assigned to this extra field for this reference.";
                        };
                    };
                    readonly required: readonly ["id", "valor"];
                    readonly type: "object";
                };
            };
            readonly failOver: {
                readonly type: "string";
                readonly description: "Send a reminder to your customer that their payment has expired (Only available on references with deadline).";
                readonly enum: readonly ["0", "1"];
            };
            readonly email: {
                readonly type: "string";
                readonly description: "User email to receive the reminder notification (Only if failover = 1).";
            };
            readonly contacto: {
                readonly type: "string";
                readonly description: "User phone number to receive the reminder notification (Only if failover = 1).";
            };
            readonly userID: {
                readonly type: "string";
                readonly description: "User identifier parameter. (Mandatory for some clients)";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Success";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [true];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [0];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["OK"];
                    };
                    readonly referencia: {
                        readonly type: "string";
                        readonly examples: readonly ["123456789"];
                    };
                    readonly valor: {
                        readonly type: "string";
                        readonly examples: readonly ["0.00000"];
                    };
                    readonly entidade: {
                        readonly type: "string";
                        readonly examples: readonly ["12345"];
                    };
                    readonly valor_minimo: {
                        readonly type: "string";
                        readonly examples: readonly ["5"];
                    };
                    readonly valor_maximo: {
                        readonly type: "string";
                        readonly examples: readonly ["122.5"];
                    };
                    readonly data_inicio: {
                        readonly type: "string";
                        readonly examples: readonly ["2021-10-28"];
                    };
                    readonly data_fim: {
                        readonly type: "string";
                        readonly examples: readonly ["2099-12-31"];
                    };
                };
            }, {
                readonly title: "Invalid API Key";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Chave de API inválida."];
                    };
                };
            }, {
                readonly title: "Invalid Data";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Os dados inseridos não são válidos"];
                    };
                };
            }];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const MultibancoDpg: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["chave", "valor", "data_inicio", "data_fim"];
        readonly properties: {
            readonly chave: {
                readonly type: "string";
                readonly description: "API Key";
                readonly examples: readonly ["xxxx-xxxx-xxxx-xxxx-xxxx"];
            };
            readonly valor: {
                readonly type: "number";
                readonly description: "Amount";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly id: {
                readonly type: "string";
                readonly description: "Identifier";
            };
            readonly data_inicio: {
                readonly type: "string";
                readonly description: "Reference starts to allow payments on this day (YYYY-MM-DD)";
                readonly format: "date";
            };
            readonly data_fim: {
                readonly type: "string";
                readonly description: "Payment deadline (YYYY-MM-DD)";
                readonly format: "date";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Success";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [true];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [0];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["OK"];
                    };
                    readonly referencia: {
                        readonly type: "string";
                        readonly examples: readonly ["288006318"];
                    };
                    readonly valor: {
                        readonly type: "string";
                        readonly examples: readonly ["10.50000"];
                    };
                    readonly entidade: {
                        readonly type: "string";
                        readonly examples: readonly ["83189"];
                    };
                    readonly valor_minimo: {
                        readonly type: "string";
                        readonly examples: readonly ["10.5"];
                    };
                    readonly valor_maximo: {
                        readonly type: "string";
                        readonly examples: readonly ["10.5"];
                    };
                    readonly data_inicio: {
                        readonly type: "string";
                        readonly examples: readonly ["2022-06-29"];
                    };
                    readonly data_fim: {
                        readonly type: "string";
                        readonly examples: readonly ["2022-06-30"];
                    };
                };
            }, {
                readonly title: "Invalid API Key";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Chave de API inválida."];
                    };
                };
            }, {
                readonly title: "Invalid Data";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Os dados inseridos não são válidos"];
                    };
                };
            }, {
                readonly title: "Date with wrong format";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-7];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Formato de data inv&aacute;lido. A data de in&iacute;cio deve estar no formato YYYY-MM-DD!"];
                    };
                };
            }];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const Paysafecard: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["chave", "valor"];
        readonly properties: {
            readonly chave: {
                readonly type: "string";
                readonly description: "API Key";
                readonly examples: readonly ["xxxx-xxxx-xxxx-xxxx"];
            };
            readonly valor: {
                readonly type: "number";
                readonly description: "Amount";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly id: {
                readonly type: "string";
                readonly description: "Identifier";
            };
            readonly url_retorno: {
                readonly type: "string";
                readonly description: "Used to define the url to where the customer will be redirected he/she finishes the payment.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly sucesso: {
                    readonly type: "boolean";
                    readonly default: true;
                    readonly examples: readonly [false];
                };
                readonly estado: {
                    readonly type: "integer";
                    readonly default: 0;
                    readonly examples: readonly [-10];
                };
                readonly resposta: {
                    readonly type: "string";
                    readonly examples: readonly ["Chave de API inválida."];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const Payshop: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["chave", "valor"];
        readonly properties: {
            readonly chave: {
                readonly type: "string";
                readonly description: "API Key";
                readonly examples: readonly ["xxxx-xxxx-xxxx-xxxx-xxxx"];
            };
            readonly valor: {
                readonly type: "number";
                readonly description: "Amount";
                readonly format: "float";
                readonly minimum: -3.402823669209385e+38;
                readonly maximum: 3.402823669209385e+38;
            };
            readonly id: {
                readonly type: "string";
                readonly description: "Identifier";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly oneOf: readonly [{
                readonly title: "Success";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [true];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [0];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["OK"];
                    };
                    readonly referencia: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [3210835700635];
                    };
                    readonly valor: {
                        readonly type: "string";
                        readonly examples: readonly ["12.95000"];
                    };
                };
            }, {
                readonly title: "Invalid API Key";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Chave de API inválida."];
                    };
                };
            }, {
                readonly title: "Invalid Data";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-10];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Os dados inseridos não são válidos"];
                    };
                };
            }, {
                readonly title: "Missing Params";
                readonly type: "object";
                readonly properties: {
                    readonly sucesso: {
                        readonly type: "boolean";
                        readonly default: true;
                        readonly examples: readonly [false];
                    };
                    readonly estado: {
                        readonly type: "integer";
                        readonly default: 0;
                        readonly examples: readonly [-9];
                    };
                    readonly resposta: {
                        readonly type: "string";
                        readonly examples: readonly ["Impossível gerar referência com os valores fornecidos."];
                    };
                };
            }];
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const ReferenceInformation: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["chave", "referencia"];
        readonly properties: {
            readonly chave: {
                readonly type: "string";
                readonly description: "API Key";
                readonly examples: readonly ["xxxx-xxxx-xxxx-xxxx"];
            };
            readonly referencia: {
                readonly type: "string";
                readonly description: "Reference";
            };
            readonly entidade: {
                readonly type: "string";
                readonly description: "Entity (If it exists, Not all services have an entity)";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly entidade: {
                    readonly type: "string";
                    readonly examples: readonly ["12345"];
                };
                readonly referencia: {
                    readonly type: "string";
                    readonly examples: readonly ["123456789"];
                };
                readonly identificador: {
                    readonly type: "string";
                    readonly examples: readonly ["Exemplo-em-JSON"];
                };
                readonly estado: {
                    readonly type: "string";
                    readonly examples: readonly ["pendente"];
                };
                readonly data_criacao: {
                    readonly type: "string";
                    readonly examples: readonly ["2021-10-28"];
                };
                readonly hora_criacao: {
                    readonly type: "string";
                    readonly examples: readonly ["14:37:23"];
                };
                readonly arquivada: {
                    readonly type: "boolean";
                    readonly default: true;
                    readonly examples: readonly [false];
                };
                readonly sucesso: {
                    readonly type: "boolean";
                    readonly default: true;
                    readonly examples: readonly [true];
                };
                readonly resposta: {
                    readonly type: "string";
                    readonly examples: readonly ["OK"];
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { CreditCard3Ds, MbWay, MbWayMealPasses, Multibanco, MultibancoDpg, Paysafecard, Payshop, ReferenceInformation };
