
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// @ts-expect-error get deployment working
export const createClient = (context) => {
	// @ts-expect-error get deployment working

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get: (key) => {
				const cookies = context.req.cookies;
				const cookie = cookies[key] ?? "";
				return decodeURIComponent(cookie);
			},
			set: (key, value, options) => {
				if (!context.res) return;
				context.res.cookie(key, encodeURIComponent(value), {
					...options,
					sameSite: "Lax",
					httpOnly: true,
				});
			},
			remove: (key, options) => {
				if (!context.res) return;
				context.res.cookie(key, "", { ...options, httpOnly: true });
			},
		},
	});
};
export const supabaseClient = ""


