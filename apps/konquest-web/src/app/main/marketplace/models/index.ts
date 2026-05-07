import { marker } from '@jsverse/transloco-keys-manager/marker';

interface MarketplaceCard {
  image: string;
  title: string;
  description: string;
  hireLink: string;
  site: string;
  catalog: string;
}

export const MARKETPLACE_CARDS: MarketplaceCard[] = [
  {
    image: 'https://media.keepsdev.com/konquest/marketplace/vilon.png',
    title: 'Vilon Academy',
    description: marker('MARKETPLACE.DESCRIPTION.VILON_ACADEMY'),
    hireLink: null,
    site: 'https://vilon.com.br/solucoes/eac-vilon-on-line/',
    catalog: 'https://marketing.keeps.com.br/hubfs/Parceiros%20Conteúdos/Catálogo%20EAC%20Vilon.pdf',
  },
  {
    image: 'https://media.keepsdev.com/konquest/marketplace/futurize.png',
    title: 'Futurize',
    description: marker('MARKETPLACE.DESCRIPTION.FUTURIZE'),
    hireLink: null,
    site: 'https://futurizeagora.com.br/',
    catalog: 'https://marketing.keeps.com.br/hubfs/Parceiros%20Conteúdos/Catalogo%20Futurize.pdf',
  },
  {
    image: 'https://media.keepsdev.com/konquest/marketplace/alura.jpg',
    title: 'Alura',
    description: marker('MARKETPLACE.DESCRIPTION.ALURA'),
    hireLink: 'https://empresas.alura.com.br/selforder/keeps',
    site: 'https://www.alura.com.br/',
    catalog: null,
  },
];
