import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Corrected logic: Use the environment variable name, not the value, in Deno.env.get()
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://dotbglejjetbcbyalyat.supabase.co";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "sb_publishable_3jBvXYBdok6aTbxDf7eAlw_ygxiQwFm";
// Fallback to hardcoded key if env var is missing, based on user prompt
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "AIzaSyCvSHWgR4PEftLs-I9KGPxNpriJRcD8d_w";

const supabase = createClient(supabaseUrl, serviceRoleKey);

serve(async (req) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, error_name, error_message, browser } = await req.json();

    console.log("Received Error Log:", { user_id, error_name, error_message });

    // 1) Store error in DB
    try {
        await supabase.from("webcam_errors").insert({
            user_id,
            error_name,
            error_message,
            browser,
        });
    } catch (dbErr) {
        console.error("Failed to insert into DB (table might not exist):", dbErr);
    }

    // 2) Send real email using Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Webcam Alerts <onboarding@resend.dev>", // Default Resend testing email
        to: ["vishverma830@outlook.com"], // Using the email found in services/email.ts as a fallback/example
        subject: "🚨 Webcam Error Detected",
        html: `
          <h2>Webcam Error</h2>
          <p><b>User:</b> ${user_id || "Guest"}</p>
          <p><b>Error:</b> ${error_name}</p>
          <p><b>Message:</b> ${error_message}</p>
          <p><b>Browser:</b> ${browser}</p>
          <p><b>Time:</b> ${new Date().toISOString()}</p>
        `,
      }),
    });

    if (!emailRes.ok) {
      const text = await emailRes.text();
      console.error("Email failed:", text);
      // We don't fail the request if email fails, but we log it
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Server error", details: e.message }), { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});