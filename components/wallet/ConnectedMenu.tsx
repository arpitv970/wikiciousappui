import { Menu, Transition } from '@headlessui/react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'next-i18next'
import { Fragment, useCallback, useState } from 'react'
import mangoStore from '@store/mangoStore'
import { notify } from '../../utils/notifications'
import ProfileImage from '../shared/ProfileImage'
import { abbreviateAddress } from '../../utils/formatting'
import NftProfilePicModal from '../modals/NftProfilePicModal'

const ConnectedMenu = () => {
  const { t } = useTranslation('common')
  const [showProfileImageModal, setShowProfileImageModal] = useState(false)
  const set = mangoStore((s) => s.set)
  const { publicKey, disconnect, wallet } = useWallet()

  const handleDisconnect = useCallback(() => {
    set((state) => {
      state.mangoAccount.current = undefined
      state.connected = false
    })
    disconnect()
    wallet?.adapter.disconnect()
    notify({
      type: 'info',
      title: t('wallet-disconnected'),
    })
  }, [set, t, disconnect])

  return (
    <>
      <Menu>
        {({ open }) => (
          <div className="relative">
            <Menu.Button
              className={`flex h-12 w-12 items-center rounded-full hover:bg-th-bkg-2 focus:outline-none`}
            >
              <ProfileImage imageSize="48" placeholderSize="28" />
            </Menu.Button>
            <Transition
              appear={true}
              show={open}
              as={Fragment}
              enter="transition ease-in duration-200"
              enterFrom="opacity-0 scale-75"
              enterTo="opacity-100 scale-100"
              leave="transition ease-out duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Menu.Items className="absolute right-0 top-[53px] z-20 mt-1 w-48 space-y-1.5 rounded-md rounded-t-none border border-t-0 border-th-bkg-3 bg-th-bkg-1 px-4 py-2.5">
                {/* <Menu.Item>
                    <button
                      className="flex w-full flex-row items-center rounded-none py-0.5 font-normal hover:cursor-pointer hover:text-th-primary focus:outline-none"
                      onClick={() => router.push('/profile')}
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      <div className="pl-2 text-left">
                        {t('profile:profile')}
                      </div>
                    </button>
                  </Menu.Item> */}
                {/* <Menu.Item>
                    <button
                      className="flex w-full flex-row items-center rounded-none py-0.5 font-normal hover:cursor-pointer hover:text-th-primary focus:outline-none"
                      onClick={() => setShowAccountsModal(true)}
                    >
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <div className="pl-2 text-left">{t('accounts')}</div>
                    </button>
                  </Menu.Item> */}
                {/* <Menu.Item>
                  <button
                    className="flex w-full flex-row items-center rounded-none py-0.5 font-normal hover:cursor-pointer hover:text-th-primary focus:outline-none"
                    onClick={() => setShowProfileImageModal(true)}
                  >
                    <ProfileIcon className="h-4 w-4" />
                    <div className="pl-2 text-left">
                      {t('edit-profile-image')}
                    </div>
                  </button>
                </Menu.Item> */}
                <Menu.Item>
                  <button
                    className="flex w-full flex-row items-center rounded-none py-0.5 font-normal hover:cursor-pointer focus:outline-none md:hover:text-th-primary"
                    onClick={handleDisconnect}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <div className="pl-2 text-left">
                      <div className="pb-0.5">{t('disconnect')}</div>
                      {publicKey ? (
                        <div className="text-xs text-th-fgd-4">
                          {abbreviateAddress(publicKey)}
                        </div>
                      ) : null}
                    </div>
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </div>
        )}
      </Menu>
      {showProfileImageModal ? (
        <NftProfilePicModal
          isOpen={showProfileImageModal}
          onClose={() => setShowProfileImageModal(false)}
        />
      ) : null}
    </>
  )
}

export default ConnectedMenu
