import { z } from 'zod';

// schema for signing users in
export const signInFormSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters')
});

// schema for signing up users
export const signUpFormSchema = z
	.object({
		name: z.string().min(3, 'Name must be at least 3 characters'),
		email: z.string().email('Invalid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z
			.string()
			.min(6, 'Confirm password must be at least 6 characters')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const updateProfileSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	email: z.string().min(3, 'Email must be at least 3 characters'),
	image: z.string().optional()
});

// schema to update user
export const updateUserSchema = updateProfileSchema.extend({
	id: z.string().min(1, 'Id is required'),
	role: z.string().min(1, 'Role is required')
});

export const userSchema = z.object({
	name: z.string(),
	email: z.string().optional(),
	image: z.string().optional(),
	role: z.string().optional()
});

export const getUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	image: z.string(),
	role: z.string(),
	logs: z.array(z.any()),
	userNotes: z.array(z.any())
});

export const updateContentSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	content: z.string().min(1, 'Content is required'),
	image: z.string().optional()
});

export const uploadedImageSchema = z.object({
	id: z.string().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
	src: z.string().min(1, 'src is required'),
	alt: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	type: z.string().min(1, 'type is required')
});

export const trackingSchema = z.object({
	type: z.string().min(1, 'type is required'),
	value: z.string().min(1, 'value is required'),
	ip: z.string().min(1, 'IP is required'),
	country: z.string().min(1, 'country required'),
	countryCode: z.string().min(1, 'countryCode required'),
	region: z.string().min(1, 'countryRegion required'),
	regionName: z.string().min(1, 'regionName required'),
	city: z.string().min(1, 'city required'),
	zip: z.string().min(1, 'zip required'),
	lat: z.string().min(1, 'lat required'),
	lon: z.string().min(1, 'lon required'),
	timezone: z.string().min(1, 'timezone required'),
	isp: z.string().min(1, 'isp required'),
	org: z.string().min(1, 'org required'),
	as: z.string().min(1, 'as required'),
	numVisits: z.number().optional()
});

export const getTrackingSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	type: z.string(),
	value: z.string(),
	ip: z.string(),
	country: z.string(),
	countryCode: z.string(),
	region: z.string(),
	regionName: z.string(),
	city: z.string(),
	zip: z.string(),
	lat: z.string(),
	lon: z.string(),
	timezone: z.string(),
	isp: z.string(),
	org: z.string(),
	as: z.string(),
	numVisits: z.number()
});

export const wordSchema = z.object({
	name: z.string().min(1, 'name is required')
});

export const getWordSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	definitions: z.array(z.any())
});

export const rawWordSchema = z.object({
	name: z.string().min(1, 'name is required')
});

export const getRawWordSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	definitions: z.array(z.any()).optional()
});

export const definitionSchema = z.object({
	type: z.string().min(1, 'type is required'),
	description: z.string().min(1, 'description is required'),
	wordId: z.string().min(1, 'wordId is required'),
	id: z.string().optional()
});

export const getDefinitionSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	description: z.string(),
	wordId: z.string()
});

export const userScoreSchema = z.object({
	score: z.number().refine((val) => val !== null, {
		message: 'score can be 0 or greater.'
	}),
	userId: z.string().min(1, 'userId is required')
});

export const getUserScoreSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	score: z.number(),
	userId: z.string()
});

export const userBalanceSchema = z.object({
	balance: z.number().refine((val) => val !== null, {
		message: 'balance can be 0 or greater.'
	}),
	userId: z.string().min(1, 'userId is required')
});

export const getUserBalanceSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	balance: z.number(),
	userId: z.string(),
	user: z.any()
});

export const userLogSchema = z.object({
	rewards: z.number().refine((val) => val !== null, {
		message: 'balance can be 0 or greater.'
	}),
	userId: z.string().min(1, 'userId is required')
});

export const getUserLogSchema = z.object({
	id: z.string(),
	type: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	rewards: z.number(),
	userId: z.string(),
	user: z.any()
});
