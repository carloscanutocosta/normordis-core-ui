import AvatarGroup from './AvatarGroup';

export default {
  title: 'UI Extra/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    max: { control: { type: 'range', min: 1, max: 8, step: 1 } },
  },
};

const USERS = [
  { id: 1, name: 'Ana Costa' },
  { id: 2, name: 'Bruno Silva' },
  { id: 3, name: 'Carla Neves' },
  { id: 4, name: 'David Pinto' },
  { id: 5, name: 'Eva Martins' },
  { id: 6, name: 'Filipe Ramos' },
];

export const Default = { args: { users: USERS.slice(0, 4) } };
export const WithOverflow = { args: { users: USERS, max: 4 } };
export const Small = { args: { users: USERS.slice(0, 3), size: 'sm' } };
export const Large = { args: { users: USERS.slice(0, 3), size: 'lg' } };
export const Single = { args: { users: USERS.slice(0, 1) } };

export const AllSizes = {
  name: 'Todos os tamanhos',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground w-6">sm</span>
        <AvatarGroup users={USERS.slice(0, 4)} size="sm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground w-6">md</span>
        <AvatarGroup users={USERS.slice(0, 4)} size="md" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground w-6">lg</span>
        <AvatarGroup users={USERS.slice(0, 4)} size="lg" />
      </div>
    </div>
  ),
};
