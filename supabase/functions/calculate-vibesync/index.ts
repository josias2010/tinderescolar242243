// Edge Function: Calculate VibeSync Score
// Deploy with: supabase functions deploy calculate-vibesync

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

serve(async (req) => {
  try {
    const { user1Id, user2Id } = await req.json()

    // Get both users' data
    const [
      { data: user1 },
      { data: user2 },
      { data: user1Interests },
      { data: user2Interests },
      { data: user1Answers },
      { data: user2Answers },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user1Id).single(),
      supabase.from('profiles').select('*').eq('id', user2Id).single(),
      supabase.from('user_interests').select('interest_id').eq('user_id', user1Id),
      supabase.from('user_interests').select('interest_id').eq('user_id', user2Id),
      supabase.from('vibesync_answers').select('*').eq('user_id', user1Id),
      supabase.from('vibesync_answers').select('*').eq('user_id', user2Id),
    ])

    if (!user1 || !user2) {
      throw new Error('User not found')
    }

    // Calculate interests score (40% of total)
    const user1InterestIds = new Set(user1Interests?.map(i => i.interest_id) || [])
    const user2InterestIds = new Set(user2Interests?.map(i => i.interest_id) || [])
    const commonInterests = [...user1InterestIds].filter(id => user2InterestIds.has(id))
    const totalUniqueInterests = new Set([...user1InterestIds, ...user2InterestIds]).size
    const interestsScore = totalUniqueInterests > 0 
      ? Math.round((commonInterests.length / totalUniqueInterests) * 100)
      : 50

    // Calculate values/lifestyle score (30% of total)
    const answers1 = new Map(user1Answers?.map(a => [a.question_id, a.answer_value]) || [])
    const answers2 = new Map(user2Answers?.map(a => [a.question_id, a.answer_value]) || [])
    
    let valuesMatch = 0
    let totalQuestions = 0
    
    for (const [questionId, answer1] of answers1) {
      const answer2 = answers2.get(questionId)
      if (answer2 !== undefined) {
        totalQuestions++
        const diff = Math.abs(answer1 - answer2)
        if (diff === 0) valuesMatch += 100
        else if (diff === 1) valuesMatch += 75
        else if (diff === 2) valuesMatch += 50
        else valuesMatch += 25
      }
    }
    
    const valuesScore = totalQuestions > 0 ? Math.round(valuesMatch / totalQuestions) : 50

    // Calculate relationship intention score (20% of total)
    const relationshipScore = user1.relationship_type === user2.relationship_type ? 100 : 50

    // Calculate lifestyle score (10% of total)
    const lifestyleScore = user1.lifestyle === user2.lifestyle ? 100 : 
                          (user1.lifestyle && user2.lifestyle ? 60 : 50)

    // Calculate overall score
    const overallScore = Math.round(
      interestsScore * 0.40 +
      valuesScore * 0.30 +
      relationshipScore * 0.20 +
      lifestyleScore * 0.10
    )

    // Generate match reasons
    const matchReasons: string[] = []
    
    if (commonInterests.length >= 3) {
      matchReasons.push(`Comparten ${commonInterests.length} intereses en común`)
    }
    if (valuesScore >= 80) {
      matchReasons.push('Tienen valores y visión de vida similares')
    }
    if (relationshipScore === 100) {
      matchReasons.push('Ambos buscan el mismo tipo de relación')
    }
    if (lifestyleScore >= 80) {
      matchReasons.push('Estilos de vida compatibles')
    }
    if (matchReasons.length === 0) {
      matchReasons.push('Potencial de conexión interesante')
    }

    // Calculate sub-scores
    const communicationScore = Math.round((valuesScore + lifestyleScore) / 2)
    const goalsScore = relationshipScore
    const socialRhythmScore = lifestyleScore

    // Upsert VibeSync score
    const { data, error } = await supabase
      .from('vibesync_scores')
      .upsert({
        user1_id: user1Id,
        user2_id: user2Id,
        overall_score: overallScore,
        values_score: valuesScore,
        lifestyle_score: lifestyleScore,
        interests_score: interestsScore,
        communication_score: communicationScore,
        goals_score: goalsScore,
        social_rhythm_score: socialRhythmScore,
        relationship_intention_score: relationshipScore,
        match_reasons: matchReasons,
        calculated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({
        success: true,
        score: data,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
