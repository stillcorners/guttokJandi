'use client'

import Link from 'next/link'
import { PATH } from '#app/routes'
import { Settings } from 'lucide-react'
import CardTitle from '#components/_common/CardTitle'
import { Button } from '#components/_common/Button'
import { useState, useEffect } from 'react'
import { useAuthStore } from '#stores/auth/useAuthStore'
import useTheme from '#contexts/ThemeProvider/hook'
import { usePatchAlarmClient } from '#apis/notiClient'
import { useLogoutClient } from '#apis/authClient'
import { useRouter } from 'next/navigation'
import { toast } from '#hooks/useToast'
import { Switch } from '#components/_common/Switch'
import { userInfo } from '#types/user'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '#components/_common/AlertDialog'

interface ClientMypageProps {
  initialData: userInfo
}

export default function ClientMypage({ initialData }: ClientMypageProps) {
  const { user, setUser, logout } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const logoutMutation = useLogoutClient()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const { mutate: toggleAlarm, isPending: isTogglingAlarm } =
    usePatchAlarmClient()

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    setUser(initialData)
  }, [initialData, setUser])

  const afterDelete = () => {
    logout()
    router.push(PATH.main)
  }

  // useEffect(() => {
  //   if (!isLoggedIn || isProfileError) {
  //     router.push(PATH.login)
  //   }
  // }, [isLoggedIn, isProfileError, router])

  if (!hydrated) return null

  return (
    <CardTitle>
      <CardTitle.Heading>마이페이지</CardTitle.Heading>
      <CardTitle.Divider />

      <div className="w-full p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">프로필 정보</p>
          <div>
            <Link
              href={PATH.mypageEdit}
              aria-label="마이페이지 수정 페이지로 이동"
            >
              <button>
                <Settings
                  className="w-[2rem] h-[2rem] text-gray-500"
                  aria-label="수정 아이콘"
                />
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">닉네임</p>
          <div>{user?.nickName}</div>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">이메일</p>
          <div>{user?.email}</div>
        </div>
      </div>
      <hr />
      <div className="w-full p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">알림 설정</p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">이메일 결제 리마인드</p>
          <div>
            <Switch
              aria-label="이메일 알림 수신 여부 설정 토글"
              checked={user?.alarm}
              onCheckedChange={() => toggleAlarm()}
              disabled={isTogglingAlarm}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="w-full p-5 ">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">시스템 설정</p>
        </div>
        <div className="flex justify-between mb-8">
          <p className="text-gray-600">다크모드</p>
          <Switch
            aria-label="다크모드 설정 토글"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => {
              const newTheme = checked ? 'dark' : 'light'
              setTheme(newTheme)

              toast({
                description: checked
                  ? '다크 모드로 전환되었습니다.'
                  : '라이트 모드로 전환되었습니다.',
              })
            }}
          />
        </div>

        <div className="flex justify-end mt-3 mb-9">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="text-white">로그아웃</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>로그아웃 하시겠습니까?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                현재 사용 중인 계정에서 로그아웃 됩니다.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button type="submit" onClick={handleLogout}>
                    로그아웃
                  </button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-500 ml-4 hover:bg-red-600">
                탈퇴하기
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>정말 탈퇴하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  탈퇴하면 모든 정보가 삭제되며 복구할 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button>탈퇴</button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </CardTitle>
  )
}
