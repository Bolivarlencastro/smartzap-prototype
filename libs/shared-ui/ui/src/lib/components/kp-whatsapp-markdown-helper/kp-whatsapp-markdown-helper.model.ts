export interface MarkdownFormat {
  key: string;
  titleKey: string;
  descriptionKey: string;
  syntax: string;
  result?: string;
}

export const WHATSAPP_FORMATS: MarkdownFormat[] = [
  {
    key: 'ITALIC',
    titleKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.ITALIC.TITLE',
    descriptionKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.ITALIC.DESCRIPTION',
    syntax: '_texto_',
    result: '<em>texto</em>',
  },
  {
    key: 'BOLD',
    titleKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.BOLD.TITLE',
    descriptionKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.BOLD.DESCRIPTION',
    syntax: '*texto*',
    result: '<strong>texto</strong>',
  },
  {
    key: 'STRIKETHROUGH',
    titleKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.STRIKETHROUGH.TITLE',
    descriptionKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.STRIKETHROUGH.DESCRIPTION',
    syntax: '~texto~',
    result: '<s>texto</s>',
  },
  {
    key: 'MONOSPACE',
    titleKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.MONOSPACE.TITLE',
    descriptionKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.MONOSPACE.DESCRIPTION',
    syntax: '```texto```',
    result: '<code>texto</code>',
  },
  {
    key: 'BULLET_LIST',
    titleKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.BULLET_LIST.TITLE',
    descriptionKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.BULLET_LIST.DESCRIPTION',
    syntax: '* texto\n- texto',
  },
  {
    key: 'NUMBERED_LIST',
    titleKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.NUMBERED_LIST.TITLE',
    descriptionKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.NUMBERED_LIST.DESCRIPTION',
    syntax: '1. texto\n2. texto',
  },
  {
    key: 'QUOTE',
    titleKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.QUOTE.TITLE',
    descriptionKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.QUOTE.DESCRIPTION',
    syntax: '> texto',
  },
  {
    key: 'CODE',
    titleKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.CODE.TITLE',
    descriptionKey: 'UI.KP_WHATSAPP_MARKDOWN_HELPER.FORMATS.CODE.DESCRIPTION',
    syntax: '`texto`',
  },
];
