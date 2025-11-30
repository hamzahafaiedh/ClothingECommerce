-- Add stock column to products table
-- This allows products without variants to track their own stock

ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;

-- Add a comment to explain the column
COMMENT ON COLUMN products.stock IS 'Stock quantity for products without variants. For products with variants, stock is tracked at the variant level.';

-- Update existing products to have a default stock of 0
UPDATE products SET stock = 0 WHERE stock IS NULL;
