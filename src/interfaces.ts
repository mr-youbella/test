export interface ProductsType
{
	id?: number;
	title: string;
	price: number;
	old_price: number;
	image: File;
	gategory: string;
	about: string;
	description: string;
	attributes: string;
	values_attributes: string;
	is_new_product: boolean;
}

export interface UsersType
{
	id: number;
	username: string;
	email: string;
	password: string;
}

export interface EmailType
{
	email: string;
}
