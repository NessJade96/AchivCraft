"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseClient = exports.createClient = void 0;
const ssr_1 = require("@supabase/ssr");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
// @ts-expect-error get deployment working
const createClient = (context) => {
	// @ts-expect-error get deployment working
	return (0, ssr_1.createServerClient)(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get: (key) => {
				var _a;
				const cookies = context.req.cookies;
				const cookie =
					(_a = cookies[key]) !== null && _a !== void 0 ? _a : "";
				return decodeURIComponent(cookie);
			},
			set: (key, value, options) => {
				if (!context.res) return;
				context.res.cookie(
					key,
					encodeURIComponent(value),
					Object.assign(Object.assign({}, options), {
						sameSite: "Lax",
						httpOnly: true,
					})
				);
			},
			remove: (key, options) => {
				if (!context.res) return;
				context.res.cookie(
					key,
					"",
					Object.assign(Object.assign({}, options), {
						httpOnly: true,
					})
				);
			},
		},
	});
};
exports.createClient = createClient;
exports.supabaseClient = "";
//# sourceMappingURL=databaseClient.map
