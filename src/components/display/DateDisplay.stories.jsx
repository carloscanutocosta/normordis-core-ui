import DateDisplay from './DateDisplay';

export default {
  title: 'Display/DateDisplay',
  component: DateDisplay,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    dateFormat: { control: 'text' },
    showRelative: { control: 'boolean' },
  },
};

export const Default = { args: { value: '2025-03-15' } };
export const LongFormat = { args: { value: '2025-03-15', dateFormat: "d 'de' MMMM 'de' yyyy" } };
export const WithTime = { args: { value: '2025-03-15T14:30:00', dateFormat: 'dd/MM/yyyy HH:mm' } };
export const Relative = {
  args: { value: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), showRelative: true },
};
export const Empty = { args: { value: null }, name: 'Vazio (null)' };

export const AllFormats = {
  name: 'Formatos comuns',
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-32">Curto</span>
        <DateDisplay value="2025-06-20" dateFormat="dd/MM/yyyy" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-32">Longo</span>
        <DateDisplay value="2025-06-20" dateFormat="d 'de' MMMM 'de' yyyy" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-32">Com hora</span>
        <DateDisplay value="2025-06-20T09:15:00" dateFormat="dd/MM/yyyy HH:mm" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-32">Relativo</span>
        <DateDisplay
          value={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()}
          showRelative
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground w-32">Vazio</span>
        <DateDisplay value={null} />
      </div>
    </div>
  ),
};
