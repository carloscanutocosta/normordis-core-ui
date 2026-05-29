import RichTextDisplay from './RichTextDisplay';

export default {
  title: 'Display/RichTextDisplay',
  component: RichTextDisplay,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
  },
};

const SAMPLE_HTML = `
<h2>Relatório Mensal</h2>
<p>Este mês registámos um <strong>crescimento de 12%</strong> face ao período homólogo.</p>
<ul>
  <li>Receita total: <strong>€ 48.200</strong></li>
  <li>Novos clientes: <em>34</em></li>
  <li>NPS médio: 72 pontos</li>
</ul>
<blockquote>Atingimos todos os objetivos definidos para o trimestre.</blockquote>
<p>Próximos passos: <code>Q3 planning</code> agendado para 1 de Julho.</p>
`;

export const Default = { args: { value: SAMPLE_HTML } };
export const SimpleText = { args: { value: '<p>Parágrafo simples sem formatação especial.</p>' } };
export const WithCode = {
  args: {
    value: '<p>Execute o comando <code>pnpm install</code> para instalar dependências.</p>',
  },
};
export const Empty = { args: { value: '' }, name: 'Vazio' };
