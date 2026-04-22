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
        
        // Handle emergency contacts migration
        if (augmentedProfile.emergency_contacts && !Array.isArray(augmentedProfile.emergency_contacts)) {
          augmentedProfile.emergency_contacts = [];
        }
        
        // Migrate from single contact to multiple contacts if needed
        if (!augmentedProfile.emergency_contacts?.length && augmentedProfile.emergency_contact_name) {
          augmentedProfile.emergency_contacts = [{
            name: augmentedProfile.emergency_contact_name,
            phone: augmentedProfile.emergency_contact_phone || ''
          }];
        }
        
        setProfile(augmentedProfile)
      } catch (error) {
        // Error fetching profile - will be handled by component
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, userLoading])


  return { user, profile, loading, setProfile }
}
