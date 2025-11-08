import { Container } from '@/components/ui-v3/container';
import { PageHeader } from '@/components/ui-v3/page-header';
import ChangePassword from './change-password';
import NotifySettings from './notify-settings';
import ThirdPartyAccounts from './third-party-accounts';

export default function ProfileV3() {
  return (
    <div className='bg-background min-h-screen py-8'>
      <Container>
        <div className='space-y-8'>
          <PageHeader title='个人设置' description='管理你的账户信息和偏好设置' />

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='space-y-6'>
              <ThirdPartyAccounts />
              <ChangePassword />
            </div>
            <div>
              <NotifySettings />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
