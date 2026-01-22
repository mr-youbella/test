export interface ProductsType
{
	id: number;
	title: string;
	price: number;
	old_price?: number | undefined;
	image: string;
	gategory: string;
	is_new_product: boolean;
}

export interface EmailType
{
	email: string;
}
