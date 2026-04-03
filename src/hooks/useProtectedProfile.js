import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProtectedUser } from './useProtectedUser'
import { getUserProfile } from '@/utils/profileService'

export function useProtectedProfile() {
  const router = useRouter()
  const { user, loading: userLoading } = useProtectedUser()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchProfile = async () => {
      if (userLoading) return
      
      if (!user) {
        router.push('/login')
        return
      }

      try {
        const profileData = await getUserProfile()
        if (!profileData && !window.location.pathname.includes('/onboarding')) {
          router.push('/onboarding')
          return
        }
        
        // Augment profile with auth metadata (e.g. full_name)
        const augmentedProfile = {
          ...profileData,
          full_name: user?.user_metadata?.full_name || 'User'
        }
        
        setProfile(augmentedProfile)
      } catch (error) {
        console.error('Error fetching profile in hook:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, userLoading, router])


  return { user, profile, loading, setProfile }
}
