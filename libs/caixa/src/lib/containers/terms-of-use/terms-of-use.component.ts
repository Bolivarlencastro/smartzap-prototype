import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cx-terms-of-use',
  imports: [],
  template: `
    <main class="p-8 lg:p-16 max-w-prose leading-6 mx-auto text-justify">
      <h1 class="color-primary font-medium text-3xl mb-10">Termos de uso</h1>
      <p class="mb-10">
        Olá, seguem algumas informações importantes sobre o curso, que você precisa ler e aceitar antes de continuar.
      </p>
      <ul class="list-disc mb-10 ml-8 leading-8">
        <li>
          <p>
            O “Curso” é fornecido de maneira gratuita para maiores de 18 anos, que possuam aplicativo WhatsApp e recebam
            o link de convite e estão habilitados para receber o “Curso”. Pode haver restrições, verifique.
          </p>
        </li>
        <li>
          <p>
            O “Curso” é realizado pela Keeps Desenvolvimento de Sistemas LTDA em parceria com a CAIXA Vida e
            Previdência. As duas instituições coletam e tratam dados pessoais dos alunos e tomam decisões sobre esse
            tratamento.
          </p>
        </li>
        <li>
          <p>
            O “Curso” acontecerá pelo envio de links e conteúdos por WhatsApp. Por meio dele, os alunos terão acesso aos
            vídeos e atividades.
          </p>
        </li>
        <li>
          <p>
            Para acessar o “Curso”, o participante deverá adicionar na sua agenda do celular o número do telefone da
            escola de negócios CVP. Com isso, manifesta ciência em relação ao envio de mensagens de áudio.
          </p>
        </li>
        <li>
          <p>
            Ao adicionar o número da escola de negócios, o aluno compartilha com a Keepsseu próprio número de celular e
            seu nome. O armazenamento do número da “Escola de Negócios” no celular pelo aluno, dá a concordância com o
            recebimento de mensagens e esse compartilhamento de dados é essencial para a participação no “Curso”, já que
            os materiais serão disponibilizados pelo WhatsApp. Caso o aluno não queira receber essas mensagens ou
            compartilhar seus dados, não poderá acessar o “Curso”.
          </p>
        </li>
        <li>
          <p>
            Durante a realização do “Curso”, serão oferecidas atividades, nas quais poderá haver a coleta de outros
            dados pessoais dos alunos, conforme determinado pela CAIXA Vida e Previdência. A CAIXA Vida e Previdência
            poderá ter acesso aos dados dos alunos, inclusive às respostas das atividades, para verificação de
            aproveitamento e estatísticas.
          </p>
        </li>
        <li>
          <p>
            Os dados pessoais dos alunos serão protegidos por medidas de segurança, técnicas e administrativas e o
            tratamento desses dados segue as normas da Lei Geral de Proteção de Dados Pessoais - LGPD.
          </p>
        </li>
        <li>
          <p>
            Os dados pessoais dos alunos só serão usados pela Keeps para finalidades diretamente relacionadas ao
            “Curso”: recebimento e envio de conteúdo e atividades, contato com tutores, emissão de certificado,
            avaliações e estatísticas de aproveitamento e envio de relatórios às entidades que promovem os “Cursos”.
            Poderá haver o uso de depoimentos dos alunos para demonstração a potenciais clientes.
          </p>
        </li>
        <li>
          <p>
            Os dados pessoais dos alunos serão mantidos pela Keeps por 5 anos após a disponibilização dos certificados.
          </p>
        </li>
        <li>
          <p>
            Os alunos do “Curso”, como titulares de dados, têm os direitos previstos pelo artigo 18 da LGPD, inclusive
            de revogação do consentimento. Pedidos e comunicações a respeito desses direitos e de proteção de dados
            deverão ser enviados para o e-mail
            <a class="color-primary underline" href="mailto:contato@keeps.com.br">contato&#64;keeps.com.br</a>.
          </p>
        </li>
        <li>
          <p>O “Curso” tem o direito de excluir o participante que tenha comportamento inadequado.</p>
        </li>
        <li>
          <p>
            O participante pode sair do curso, a qualquer momento, devendo informar sua saída através do WhatsApp. Seus
            dados serão excluídos em até 30 dias após seu desligamento do “Curso”.
          </p>
        </li>
        <li>
          <p>
            O participante será responsável por todas as informações e mensagens enviadas, incluindo textos, áudios e
            vídeos.
          </p>
        </li>
        <li>
          <p>
            O participante não tem o direito de divulgar, compartilhar ou publicar o conteúdo do curso em nenhum tipo de
            mídia, sob pena de violação de direitos autorais e de imagem.
          </p>
        </li>
      </ul>
      <p>
        O “Curso” e todo seu conteúdo são de propriedade exclusiva Caixa Vida e Previdência. Todos os direitos
        reservados. Para qualquer comentário, sugestão ou reclamação envie um e-mail para
        <a class="color-primary underline" href="mailto:contato@keeps.com.br">contato&#64;keeps.com.br</a>.
      </p>
    </main>
  `,
  styles: `
    li {
      margin: 16px 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsOfUseComponent {}
