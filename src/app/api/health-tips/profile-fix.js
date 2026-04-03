// Temporary profile creation helper for health-tips
export const ensureUserProfile = async (supabase, userId) => {
  // Check existence with service client (bypasses RLS)
  let { data: profile, error: getError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (getError) return { profile: null, error: getError };
  if (profile) return { profile };

  // Insert minimal profile with service client (bypasses RLS)
  const minimalProfile = {
    id: userId,
    age: null,
    gender: null,
    existing_conditions: {},
    location: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let { data: newProfile, error: createError } = await supabase
    .from('user_profiles')
    .insert(minimalProfile)
    .select()
    .single();

  return { profile: newProfile || null, error: createError };
};

