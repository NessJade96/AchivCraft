const {createClient} = require('@supabase/supabase-js')

const supabaseUrl = 'https://orxjphplghtiznnhxddv.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
console.log("🚀 ~ supabase:", supabase)

async function testUser(){
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'vkellyy@gmail.com',
        password: 'V_HHicBASx5_P2M',
      })
    
      const { data: { user } } = await supabase.auth.getUser()
      console.log("🚀 ~ testUser ~ data:", data)
      return user
}

testUser().then((data) => {
    console.log("🚀 ~ user ~ data:", data)
    return data
} )

