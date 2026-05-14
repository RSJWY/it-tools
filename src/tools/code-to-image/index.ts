import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.code-to-image.title'),
  path: '/code-to-image',
  description: translate('tools.code-to-image.description'),
  keywords: ['code', 'image', 'png', 'clipboard', 'screenshot', 'syntax', 'highlight'],
  component: () => import('./code-to-image.vue'),
  icon: Code,
  createdAt: new Date('2026-05-14'),
});
