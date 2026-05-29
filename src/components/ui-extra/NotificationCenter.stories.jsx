import NotificationCenter from './NotificationCenter';

export default {
  title: 'UI Extra/NotificationCenter',
  component: NotificationCenter,
  tags: ['autodocs'],
};

export const Default = {
  name: 'Default (clique no sino)',
  render: () => (
    <div className="flex justify-center p-8">
      <NotificationCenter />
    </div>
  ),
};
