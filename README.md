# Smartzap Admin — Protótipo

Protótipo interativo do **Smartzap Admin** desenvolvido para validação de fluxos e UX/UI. Todos os dados são mockados — nenhuma chamada real de API é feita.

## Funcionalidades do protótipo

- Gestão de cursos (listagem, criação, edição)
- Matrículas de usuários em cursos
- Tabela de usuários com filtros por tags e status de sincronização
- Dialog de saldo de mensagens
- Configurações de matrículas

## Executar localmente

```sh
npm install
npm run start:smartzap-admin-prototype
```

Acesse `http://localhost:4300` após o servidor iniciar.

## Deploy (GitHub Pages)

O deploy é feito manualmente via GitHub Actions:

```
Actions → deploy smartzap admin prototype pages → Run workflow
```
