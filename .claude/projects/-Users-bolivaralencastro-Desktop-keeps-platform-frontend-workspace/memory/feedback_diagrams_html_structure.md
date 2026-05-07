---
name: Verificar estrutura HTML antes de desenhar diagramas
description: Regra para evitar erros de interpretação de layout ao gerar diagramas ASCII ou documentação visual de estruturas de componentes
type: feedback
---

Antes de desenhar qualquer diagrama ASCII ou documentar a estrutura visual de um layout, **releia todos os arquivos relevantes juntos** e trace o DOM explicitamente — nunca reconstrua de memória.

**Why:** Ao documentar o shell do SmartZap (thin layout), li o template superficialmente e assumi o layout "header no topo full-width, nav abaixo" — um padrão comum em outros frameworks. O código dizia claramente que `fuse-vertical-navigation` e o wrapper `div` são **irmãos** dentro de um flex container, o que coloca o nav em altura total à esquerda e o header apenas à direita. O usuário precisou corrigir o erro.

**How to apply:** Sempre que for criar um diagrama de layout ou estrutura visual:

1. Abrir **todos** os arquivos envolvidos (template do layout, componente pai, SCSS) simultaneamente
2. Traçar a hierarquia DOM explicitamente antes de desenhar
3. Verificar se elementos são **pais, filhos ou irmãos** — nunca assumir pela aparência visual ou por padrões de outros frameworks
4. Questionar o diagrama gerado: "esse HTML produz exatamente essa estrutura?"
